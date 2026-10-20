import { z } from "zod";

import { enquiryTypes } from "@/content/contact";
import { enValidation, type ValidationMessages } from "@/i18n/messages/en-validation";

const enquiryTypeValues = enquiryTypes.map((type) => type.value) as [
  (typeof enquiryTypes)[number]["value"],
  ...(typeof enquiryTypes)[number]["value"][],
];

/** The Contact-page enquiry schema, with error messages in the given language. */
export function contactEnquirySchemaFor(v: ValidationMessages) {
  return z.object({
    name: z.string().trim().min(2, v.nameRequired).max(80, v.nameTooLong),
    email: z.string().trim().max(120, v.emailTooLong).email(v.emailInvalid),
    phone: z
      .string()
      .trim()
      .min(8, v.mobileRequired)
      .max(20, v.mobileInvalid)
      .regex(/^\+?[0-9\s()-]+$/, v.phoneDigits),
    enquiryType: z.enum(enquiryTypeValues, { message: v.enquiryType }),
    branch: z.string().trim().max(80).optional(),
    message: z.string().trim().min(10, v.messageTooShort).max(1000, v.messageTooLong),
    // Honeypot. Accepted here so a filled value reaches the API route, which
    // drops it silently; rejecting it would block the form with no visible error.
    website: z.string().max(200).optional(),
  });
}

/** English messages; the API route validates with this (the rules are the same in every language). */
export const contactEnquirySchema = contactEnquirySchemaFor(enValidation);

export type ContactEnquiry = z.infer<typeof contactEnquirySchema>;
