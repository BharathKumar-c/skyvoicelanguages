import { NextResponse } from "next/server";

import { assessmentLeadSchema } from "@/lib/leads/schema";
import { clientKey, createRateLimiter } from "@/lib/rate-limit";

const isRateLimited = createRateLimiter({ limit: 5, windowMs: 10 * 60 * 1000 });

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

  const parsed = assessmentLeadSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      { message: "Please review the highlighted form details." },
      { status: 400 },
    );
  }

  const { website, ...lead } = parsed.data;
  if (website) {
    return NextResponse.json({ message: "Request accepted.", mode: "live" });
  }

  const webhookUrl = process.env.ASSESSMENT_LEAD_WEBHOOK_URL;
  const webhookToken = process.env.ASSESSMENT_LEAD_WEBHOOK_TOKEN;

  if (!webhookUrl) {
    if (process.env.NODE_ENV === "development") {
      return NextResponse.json({
        message:
          "Preview validated successfully. Connect the secure lead webhook before production launch.",
        mode: "preview",
      });
    }

    return NextResponse.json(
      {
        message:
          "Online booking is temporarily unavailable while lead delivery is being connected.",
      },
      { status: 503 },
    );
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    const response = await fetch(webhookUrl, {
      body: JSON.stringify({
        ...lead,
        submittedAt: new Date().toISOString(),
      }),
      headers: {
        "Content-Type": "application/json",
        ...(webhookToken ? { Authorization: `Bearer ${webhookToken}` } : {}),
      },
      method: "POST",
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error("Lead provider rejected the request.");
    }

    return NextResponse.json({ message: "Assessment request received.", mode: "live" });
  } catch {
    return NextResponse.json(
      { message: "We could not send your request. Please try again shortly." },
      { status: 502 },
    );
  } finally {
    clearTimeout(timeout);
  }
}
