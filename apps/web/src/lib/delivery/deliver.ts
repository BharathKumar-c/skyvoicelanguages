import nodemailer from "nodemailer";

/**
 * Server-only delivery for form submissions. Two independent channels, each
 * enabled by its own environment variables (see .env.example):
 *
 * - Email (SMTP): SMTP_HOST, SMTP_USER, SMTP_PASS, plus a recipient — set in
 *   Website Settings (Integrations) or, as a fallback, NOTIFY_EMAIL_TO. Works
 *   with Gmail (smtp.gmail.com + a Google App Password) or any SMTP provider.
 * - Webhook: a URL (and optional bearer token) that receives the JSON payload,
 *   e.g. a CRM, Google Sheet automation, or Zapier/Make hook.
 *
 * A submission counts as delivered when at least one configured channel
 * accepts it; failures are logged by channel name only, never with form data.
 */

export type DeliveryResult = "delivered" | "failed" | "unconfigured";

type Field = readonly [label: string, value: string | undefined];

type DeliveryRequest = {
  /** Used in logs and the email subject, e.g. "Assessment request". */
  kind: string;
  /** Short identifying text appended to the subject, e.g. the visitor's name. */
  subjectDetail: string;
  fields: readonly Field[];
  replyTo?: string;
  /** Recipient(s) from Website Settings; NOTIFY_EMAIL_TO is the fallback. */
  notifyTo?: string;
  webhook?: { url?: string; token?: string; payload: Record<string, unknown> };
};

const TIMEOUT_MS = 8000;

function smtpConfig(notifyTo?: string) {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const to = notifyTo || process.env.NOTIFY_EMAIL_TO;
  if (!host || !user || !pass || !to) return null;

  const port = Number(process.env.SMTP_PORT) || 465;
  return {
    from: process.env.NOTIFY_EMAIL_FROM || `Sky Voice website <${user}>`,
    to,
    transport: {
      auth: { pass, user },
      connectionTimeout: TIMEOUT_MS,
      greetingTimeout: TIMEOUT_MS,
      host,
      port,
      secure: port === 465,
      socketTimeout: TIMEOUT_MS,
    },
  };
}

const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, (char) => `&#${char.charCodeAt(0)};`);

/** Header values must stay on one line. */
const oneLine = (value: string) => value.replace(/[\r\n]+/g, " ").trim();

async function sendEmail(request: DeliveryRequest, config: NonNullable<ReturnType<typeof smtpConfig>>) {
  const rows = request.fields.filter((field): field is readonly [string, string] => Boolean(field[1]));
  const text = rows.map(([label, value]) => `${label}: ${value}`).join("\n");
  const html = `<table cellpadding="6" style="border-collapse:collapse;font-family:sans-serif">${rows
    .map(
      ([label, value]) =>
        `<tr><th align="left" style="vertical-align:top">${escapeHtml(label)}</th><td style="white-space:pre-wrap">${escapeHtml(value)}</td></tr>`,
    )
    .join("")}</table>`;

  await nodemailer.createTransport(config.transport).sendMail({
    from: config.from,
    html,
    replyTo: request.replyTo,
    subject: oneLine(`${request.kind}: ${request.subjectDetail}`),
    text,
    to: config.to,
  });
}

async function sendWebhook({ url, token, payload }: { url: string; token?: string; payload: Record<string, unknown> }) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const response = await fetch(url, {
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      method: "POST",
      signal: controller.signal,
    });
    if (!response.ok) throw new Error(`Webhook responded ${response.status}`);
  } finally {
    clearTimeout(timeout);
  }
}

export async function deliverSubmission(request: DeliveryRequest): Promise<DeliveryResult> {
  const channels: { name: string; send: () => Promise<void> }[] = [];

  const smtp = smtpConfig(request.notifyTo);
  if (smtp) channels.push({ name: "email", send: () => sendEmail(request, smtp) });

  const webhookUrl = request.webhook?.url;
  if (request.webhook && webhookUrl) {
    const { token, payload } = request.webhook;
    channels.push({ name: "webhook", send: () => sendWebhook({ payload, token, url: webhookUrl }) });
  }

  if (!channels.length) return "unconfigured";

  const results = await Promise.allSettled(channels.map((channel) => channel.send()));
  results.forEach((result, index) => {
    if (result.status === "rejected") {
      const reason = result.reason instanceof Error ? result.reason.message : "unknown error";
      console.error(`[${request.kind}] ${channels[index].name} delivery failed: ${reason}`);
    }
  });

  return results.some((result) => result.status === "fulfilled") ? "delivered" : "failed";
}
