import { NextResponse } from "next/server";

import { getMessages } from "@/i18n/server";
import { deliverSubmission } from "@/lib/delivery/deliver";
import { enquireSchema, examOptions, formatOptions, labelFor } from "@/lib/enquire/schema";
import { clientKey, createRateLimiter } from "@/lib/rate-limit";
import { getSettings } from "@/lib/settings/store";

const isRateLimited = createRateLimiter({ limit: 5, windowMs: 10 * 60 * 1000 });

/**
 * Enquire Now (IELTS and PTE). Same delivery rules as /api/enquiries: email
 * when SMTP is configured and/or the contact webhook, tagged
 * `type: "enquire-now"`; preview mode in development; never a silent success
 * in production.
 */
export async function POST(request: Request) {
  // Messages the visitor sees come back in their language; staff emails stay in English.
  const t = (await getMessages()).api;
  if (isRateLimited(clientKey(request))) {
    return NextResponse.json({ message: t.tooMany }, { status: 429 });
  }

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return NextResponse.json({ message: t.invalidRequest }, { status: 400 });
  }

  const parsed = enquireSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json({ message: t.reviewForm }, { status: 400 });
  }

  const { website, ...enquiry } = parsed.data;
  if (website) {
    return NextResponse.json({ message: "Enquiry received.", mode: "live" });
  }

  const submittedAt = new Date().toISOString();
  const exam = labelFor(examOptions, enquiry.exam);
  const settings = await getSettings();
  const result = await deliverSubmission({
    notifyTo: settings.integrations.email.notifyTo,
    kind: "Enquire Now",
    subjectDetail: `${exam} enquiry from ${enquiry.name} (${enquiry.city})`,
    fields: [
      ["Name", enquiry.name],
      ["WhatsApp", enquiry.phone],
      ["Email", enquiry.email],
      ["City", enquiry.city],
      ["Exam", exam],
      ["Preferred format", enquiry.format ? labelFor(formatOptions, enquiry.format) : undefined],
      ["Target score", enquiry.target],
      ["Message", enquiry.message],
      ["Page", enquiry.sourcePage],
      ["UTM source", enquiry.utmSource],
      ["UTM medium", enquiry.utmMedium],
      ["UTM campaign", enquiry.utmCampaign],
      ["Submitted", submittedAt],
    ],
    replyTo: enquiry.email || undefined,
    webhook: {
      payload: { type: "enquire-now", ...enquiry, submittedAt },
      token:
        process.env.CONTACT_ENQUIRY_WEBHOOK_TOKEN || process.env.ASSESSMENT_LEAD_WEBHOOK_TOKEN,
      url: process.env.CONTACT_ENQUIRY_WEBHOOK_URL || process.env.ASSESSMENT_LEAD_WEBHOOK_URL,
    },
  });

  if (result === "unconfigured") {
    if (process.env.NODE_ENV === "development") {
      return NextResponse.json({ message: t.enquiryPreview, mode: "preview" });
    }

    return NextResponse.json({ message: t.enquiryUnavailable }, { status: 503 });
  }

  if (result === "failed") {
    return NextResponse.json({ message: t.enquiryFailed }, { status: 502 });
  }

  return NextResponse.json({ message: "Enquiry received.", mode: "live" });
}
