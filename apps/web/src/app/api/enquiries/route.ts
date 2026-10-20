import { NextResponse } from "next/server";

import { enquiryTypes } from "@/content/contact";
import { getMessages } from "@/i18n/server";
import { deliverSubmission } from "@/lib/delivery/deliver";
import { contactEnquirySchema } from "@/lib/enquiries/schema";
import { clientKey, createRateLimiter } from "@/lib/rate-limit";
import { getSettings } from "@/lib/settings/store";

const isRateLimited = createRateLimiter({ limit: 5, windowMs: 10 * 60 * 1000 });

/**
 * Contact-page enquiries. Emailed when SMTP is configured, and/or posted to
 * CONTACT_ENQUIRY_WEBHOOK_URL (falling back to the assessment lead webhook)
 * tagged with `type: "contact-enquiry"`. Mirrors /api/leads: validation,
 * honeypot, rate limit, development preview mode, and no silent success in
 * production.
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

  const parsed = contactEnquirySchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json({ message: t.reviewForm }, { status: 400 });
  }

  const { website, ...enquiry } = parsed.data;
  if (website) {
    return NextResponse.json({ message: "Enquiry received.", mode: "live" });
  }

  const submittedAt = new Date().toISOString();
  const topic =
    enquiryTypes.find((type) => type.value === enquiry.enquiryType)?.label ?? enquiry.enquiryType;
  const settings = await getSettings();
  const result = await deliverSubmission({
    notifyTo: settings.integrations.email.notifyTo,
    kind: "Website enquiry",
    subjectDetail: `${topic} from ${enquiry.name}`,
    fields: [
      ["Name", enquiry.name],
      ["Email", enquiry.email],
      ["Mobile", enquiry.phone],
      ["Enquiry about", topic],
      ["Preferred branch", enquiry.branch],
      ["Message", enquiry.message],
      ["Submitted", submittedAt],
    ],
    replyTo: enquiry.email,
    webhook: {
      payload: { type: "contact-enquiry", ...enquiry, submittedAt },
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
