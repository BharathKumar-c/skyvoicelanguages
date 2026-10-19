import { z } from "zod";

import { enquiryTypes } from "@/content/contact";

const enquiryTypeValues = enquiryTypes.map((type) => type.value) as [
  (typeof enquiryTypes)[number]["value"],
  ...(typeof enquiryTypes)[number]["value"][],
];

export const contactEnquirySchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Enter your full name.")
    .max(80, "Keep your name under 80 characters."),
  email: z.string().trim().max(120, "Keep the email under 120 characters.").email("Enter a valid email address."),
  phone: z
    .string()
    .trim()
    .min(8, "Enter a mobile number with country code.")
    .max(20, "Enter a valid mobile number.")
    .regex(/^\+?[0-9\s()-]+$/, "Use digits and an optional country code."),
  enquiryType: z.enum(enquiryTypeValues, { message: "Choose what your enquiry is about." }),
  branch: z.string().trim().max(80).optional(),
  message: z
    .string()
    .trim()
    .min(10, "Add a little more detail (at least 10 characters).")
    .max(1000, "Keep your message under 1,000 characters."),
  // Honeypot. Accepted here so a filled value reaches the API route, which
  // drops it silently; rejecting it would block the form with no visible error.
  website: z.string().max(200).optional(),
});

export type ContactEnquiry = z.infer<typeof contactEnquirySchema>;
