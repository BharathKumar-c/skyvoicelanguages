import { NextResponse } from "next/server";

import { contactEnquirySchema } from "@/lib/enquiries/schema";
import { clientKey, createRateLimiter } from "@/lib/rate-limit";

const isRateLimited = createRateLimiter({ limit: 5, windowMs: 10 * 60 * 1000 });

/**
 * Contact-page enquiries. Delivered to CONTACT_ENQUIRY_WEBHOOK_URL, or to the
 * assessment lead webhook when no dedicated one is configured, tagged with
 * `type: "contact-enquiry"`. Mirrors /api/leads: validation, honeypot, rate
 * limit, development preview mode, and no silent success in production.
 */
export async function POST(request: Request) {
  if (isRateLimited(clientKey(request))) {
    return NextResponse.json(
      { message: "Too many attempts. Please wait a few minutes and try again." },
      { status: 429 },
    );
  }

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid request." }, { status: 400 });
  }

  const parsed = contactEnquirySchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      { message: "Please review the highlighted form details." },
      { status: 400 },
    );
  }

  const { website, ...enquiry } = parsed.data;
  if (website) {
    return NextResponse.json({ message: "Enquiry received.", mode: "live" });
  }

  const webhookUrl =
    process.env.CONTACT_ENQUIRY_WEBHOOK_URL || process.env.ASSESSMENT_LEAD_WEBHOOK_URL;
  const webhookToken =
    process.env.CONTACT_ENQUIRY_WEBHOOK_TOKEN || process.env.ASSESSMENT_LEAD_WEBHOOK_TOKEN;

  if (!webhookUrl) {
    if (process.env.NODE_ENV === "development") {
      return NextResponse.json({
        message:
          "Preview validated successfully. Connect the enquiry webhook before production launch.",
        mode: "preview",
      });
    }

    return NextResponse.json(
      { message: "The enquiry form is temporarily unavailable. Please try again later." },
      { status: 503 },
    );
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    const response = await fetch(webhookUrl, {
      body: JSON.stringify({
        type: "contact-enquiry",
        ...enquiry,
        submittedAt: new Date().toISOString(),
      }),
      headers: {
        "Content-Type": "application/json",
        ...(webhookToken ? { Authorization: `Bearer ${webhookToken}` } : {}),
      },
      method: "POST",
      signal: controller.signal,
    });

    if (!response.ok) throw new Error("Enquiry provider rejected the request.");

    return NextResponse.json({ message: "Enquiry received.", mode: "live" });
  } catch {
    return NextResponse.json(
      { message: "We could not send your enquiry. Please try again shortly." },
      { status: 502 },
    );
  } finally {
    clearTimeout(timeout);
  }
}
