import { z } from "zod";

export const assessmentLeadSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Enter your full name.")
    .max(80, "Keep your name under 80 characters."),
  phone: z
    .string()
    .trim()
    .min(8, "Enter a WhatsApp number with country code.")
    .max(20, "Enter a valid WhatsApp number.")
    .regex(/^\+?[0-9\s()-]+$/, "Use digits and an optional country code."),
  city: z
    .string()
    .trim()
    .min(2, "Enter your city.")
    .max(80, "Keep the city under 80 characters."),
  ieltsType: z.enum(["academic", "general", "not-sure"], {
    message: "Choose an IELTS type.",
  }),
  targetBand: z.enum(["6.0", "6.5", "7.0", "7.5", "8.0+"], {
    message: "Choose your target band.",
  }),
  // Honeypot. Accepted here so a filled value reaches the API route, which
  // drops it silently; rejecting it would block the form with no visible error.
  website: z.string().max(200).optional(),
  sourcePage: z.string().max(180).optional(),
  utmSource: z.string().max(120).optional(),
  utmMedium: z.string().max(120).optional(),
  utmCampaign: z.string().max(120).optional(),
});

export type AssessmentLead = z.infer<typeof assessmentLeadSchema>;
