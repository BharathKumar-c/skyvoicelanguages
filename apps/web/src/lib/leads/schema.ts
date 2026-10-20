import { z } from "zod";

import { enValidation, type ValidationMessages } from "@/i18n/messages/en-validation";

/** The assessment form schema, with error messages in the given language. */
export function assessmentLeadSchemaFor(v: ValidationMessages) {
  return z.object({
    name: z.string().trim().min(2, v.nameRequired).max(80, v.nameTooLong),
    phone: z
      .string()
      .trim()
      .min(8, v.whatsappRequired)
      .max(20, v.whatsappInvalid)
      .regex(/^\+?[0-9\s()-]+$/, v.phoneDigits),
    city: z.string().trim().min(2, v.cityRequired).max(80, v.cityTooLong),
    ieltsType: z.enum(["academic", "general", "not-sure"], { message: v.ieltsType }),
    targetBand: z.enum(["6.0", "6.5", "7.0", "7.5", "8.0+"], { message: v.targetBand }),
    // Honeypot. Accepted here so a filled value reaches the API route, which
    // drops it silently; rejecting it would block the form with no visible error.
    website: z.string().max(200).optional(),
    sourcePage: z.string().max(180).optional(),
    utmSource: z.string().max(120).optional(),
    utmMedium: z.string().max(120).optional(),
    utmCampaign: z.string().max(120).optional(),
  });
}

/** English messages; the API route validates with this (the rules are the same in every language). */
export const assessmentLeadSchema = assessmentLeadSchemaFor(enValidation);

export type AssessmentLead = z.infer<typeof assessmentLeadSchema>;
