import { z } from "zod";

import { enValidation, type ValidationMessages } from "@/i18n/messages/en-validation";

export const examOptions = [
  { value: "ielts-academic", label: "IELTS Academic" },
  { value: "ielts-general", label: "IELTS General Training" },
  { value: "pte-academic", label: "PTE Academic" },
  { value: "pte-core", label: "PTE Core" },
  { value: "not-sure", label: "Not sure yet" },
] as const;

export const formatOptions = [
  { value: "not-sure", label: "Not sure yet" },
  { value: "group", label: "Small group (3–5)" },
  { value: "one-to-one", label: "1-on-1" },
] as const;

const values = <T extends readonly { value: string }[]>(options: T) =>
  options.map((option) => option.value) as [T[number]["value"], ...T[number]["value"][]];

/** Enquire Now form (IELTS and PTE), with error messages in the given language. */
export function enquireSchemaFor(v: ValidationMessages) {
  return z.object({
    name: z.string().trim().min(2, v.nameRequired).max(80, v.nameTooLong),
    phone: z
      .string()
      .trim()
      .min(8, v.whatsappRequired)
      .max(20, v.whatsappInvalid)
      .regex(/^\+?[0-9\s()-]+$/, v.phoneDigits),
    email: z
      .string()
      .trim()
      .max(120, v.emailTooLong)
      .refine((value) => value === "" || z.email().safeParse(value).success, v.emailInvalid)
      .optional(),
    city: z.string().trim().min(2, v.cityRequired).max(80, v.cityTooLong),
    exam: z.enum(values(examOptions), { message: v.exam }),
    format: z.enum(values(formatOptions)).optional(),
    target: z.string().trim().max(20, v.targetTooLong).optional(),
    message: z.string().trim().max(1000, v.messageTooLong).optional(),
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
export const enquireSchema = enquireSchemaFor(enValidation);

export type Enquiry = z.infer<typeof enquireSchema>;
export type EnquiryInput = z.input<typeof enquireSchema>;

export const labelFor = (options: readonly { value: string; label: string }[], value?: string) =>
  options.find((option) => option.value === value)?.label ?? value ?? "";
