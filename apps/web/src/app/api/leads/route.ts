import { NextResponse } from "next/server";

import { getMessages } from "@/i18n/server";
import { deliverSubmission } from "@/lib/delivery/deliver";
import { assessmentLeadSchema } from "@/lib/leads/schema";
import { clientKey, createRateLimiter } from "@/lib/rate-limit";
import { getSettings } from "@/lib/settings/store";

const isRateLimited = createRateLimiter({ limit: 5, windowMs: 10 * 60 * 1000 });

const ieltsTypeLabels = {
  academic: "Academic",
  general: "General Training",
  "not-sure": "Not sure yet",
} as const;

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

  const parsed = assessmentLeadSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json({ message: t.reviewForm }, { status: 400 });
  }

  const { website, ...lead } = parsed.data;
  if (website) {
    return NextResponse.json({ message: "Request accepted.", mode: "live" });
  }

  const submittedAt = new Date().toISOString();
  const settings = await getSettings();
  const result = await deliverSubmission({
    notifyTo: settings.integrations.email.notifyTo,
    kind: "Free assessment request",
    subjectDetail: `${lead.name} (${lead.city})`,
    fields: [
      ["Name", lead.name],
      ["WhatsApp", lead.phone],
      ["City", lead.city],
      ["IELTS type", ieltsTypeLabels[lead.ieltsType]],
      ["Target band", lead.targetBand],
      ["Page", lead.sourcePage],
      ["UTM source", lead.utmSource],
      ["UTM medium", lead.utmMedium],
      ["UTM campaign", lead.utmCampaign],
      ["Submitted", submittedAt],
    ],
    webhook: {
      payload: { ...lead, submittedAt },
      token: process.env.ASSESSMENT_LEAD_WEBHOOK_TOKEN,
      url: process.env.ASSESSMENT_LEAD_WEBHOOK_URL,
    },
  });

  if (result === "unconfigured") {
    if (process.env.NODE_ENV === "development") {
      return NextResponse.json({ message: t.leadPreview, mode: "preview" });
    }

    return NextResponse.json({ message: t.leadUnavailable }, { status: 503 });
  }

  if (result === "failed") {
    return NextResponse.json({ message: t.leadFailed }, { status: 502 });
  }

  return NextResponse.json({ message: "Assessment request received.", mode: "live" });
}
