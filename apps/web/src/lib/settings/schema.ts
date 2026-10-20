import { z } from "zod";

/**
 * Website Settings: every piece of business information and editable copy the
 * public site reads, validated on save and on load. Secrets (SMTP password,
 * API tokens) are deliberately NOT part of this document — they live only in
 * server environment variables (see .env.example).
 *
 * Conventions: an empty string or empty list means "not supplied yet"; the site
 * then hides that item or shows its honest "being confirmed" note.
 */

const text = (max: number) => z.string().trim().max(max, `Keep this under ${max} characters.`);
const required = (max: number, label: string) => text(max).min(1, `${label} is required.`);

/** Site-relative path ("/brand/logo.svg") or an https URL; empty = not set. */
const mediaUrl = text(500).refine(
  (value) => value === "" || /^\/(?!\/)[^\s]*$/.test(value) || /^https:\/\/[^\s]+$/.test(value),
  "Use a site path starting with / or a full https:// URL.",
);

const httpsUrl = text(500).refine(
  (value) => value === "" || /^https:\/\/[^\s]+\.[^\s]+$/.test(value),
  "Use a full https:// link.",
);

const phone = text(24).refine(
  (value) => value === "" || /^\+?[0-9\s()-]{7,24}$/.test(value),
  "Use digits with an optional + country code, e.g. +91 98765 43210.",
);

const email = text(120).refine(
  (value) => value === "" || z.email().safeParse(value).success,
  "Enter a valid email address.",
);

/** Whole rupees as digits ("17499"); empty = "fee on request". */
const fee = text(9).refine(
  (value) => value === "" || /^\d{1,8}$/.test(value),
  "Enter the fee in whole rupees using digits only, e.g. 17499.",
);

const lines = (maxItems: number, maxLength: number) =>
  z.array(text(maxLength)).max(maxItems, `Use at most ${maxItems} lines.`)
    .transform((items) => items.filter(Boolean));

const id = z
  .string()
  .trim()
  .min(1, "An id is required.")
  .max(60)
  .regex(/^[a-z0-9-]+$/, "Use lowercase letters, digits, and hyphens only.");

export const socialPlatforms = [
  "facebook",
  "instagram",
  "youtube",
  "linkedin",
  "whatsapp",
  "google",
] as const;

export const companySchema = z.object({
  name: required(80, "Company name"),
  websiteName: required(80, "Website name"),
  domain: required(200, "Domain").refine(
    (value) => /^https:\/\/[a-z0-9.-]+\.[a-z]{2,}$/i.test(value),
    "Use the full origin, e.g. https://skyvoicelanguages.com (no trailing slash).",
  ),
  logoUrl: mediaUrl,
  logoWhiteUrl: mediaUrl,
  faviconUrl: mediaUrl,
  description: required(300, "Business description"),
  serviceArea: text(120),
  /** Brand tagline; empty = the Home hero and footer use the description instead. */
  tagline: text(160),
  /** Practice-portal sign-in page; empty = "Student login" links stay hidden. */
  portalUrl: httpsUrl,
  address: lines(6, 120),
  socialLinks: z
    .array(z.object({ platform: z.enum(socialPlatforms), url: httpsUrl.refine(Boolean, "Add the profile link.") }))
    .max(socialPlatforms.length),
});

export const branchSchema = z.object({
  id,
  name: required(80, "Branch name"),
  address: lines(6, 120).refine((items) => items.length > 0, "Add at least one address line."),
  phone,
  hours: text(120),
  mapQuery: required(200, "Map search text"),
});

export const contactSchema = z.object({
  phones: z.array(phone).max(4).transform((items) => items.filter(Boolean)),
  whatsapp: phone,
  email,
  address: lines(6, 120),
  hours: lines(7, 80),
  weeklyHoliday: text(120),
  pageTitle: required(120, "Contact page heading"),
  pageIntro: required(400, "Contact page introduction"),
  branches: z.array(branchSchema).max(20),
});

export const planSchema = z.object({
  name: required(60, "Package name"),
  size: required(60, "Group size"),
  description: text(200),
  schedule: text(160),
  duration: text(80),
  academicFee: fee,
  generalFee: fee,
  featured: z.boolean(),
});

export const ptePlanSchema = z.object({
  name: required(60, "Package name"),
  size: required(60, "Group size"),
  description: text(200),
  schedule: text(160),
  duration: text(80),
  fee: fee,
  featured: z.boolean(),
});

/** PTE coaching. Empty plans = the site says PTE packages are being confirmed. */
export const pteSchema = z.object({
  offersAcademic: z.boolean(),
  offersCore: z.boolean(),
  summary: text(400),
  plans: z.array(ptePlanSchema).max(6),
  feeNote: text(240),
});

export const coursesSchema = z.object({
  plans: z.array(planSchema).min(1, "Keep at least one package.").max(6),
  pte: pteSchema,
  feeNote: text(240),
  installmentInfo: text(300),
  assessmentDuration: text(40),
  assessmentDescription: required(300, "Assessment description"),
  portalPracticeSets: text(20),
  portalAccessDuration: text(80),
});

export const trainerSchema = z.object({
  id,
  name: required(80, "Trainer name"),
  designation: required(80, "Designation"),
  photoUrl: mediaUrl,
  qualifications: lines(8, 80),
  expertise: lines(8, 60),
  experienceYears: text(3).refine((value) => value === "" || /^\d{1,2}$/.test(value), "Use whole years, e.g. 8."),
  achievements: lines(6, 120),
  bio: text(800),
  videoUrl: mediaUrl,
  published: z.boolean(),
});

export const statSchema = z.object({
  value: required(20, "Value"),
  label: required(60, "Label"),
  verified: z.boolean(),
});

export const testimonialSchema = z
  .object({
    name: required(80, "Student name"),
    from: text(10),
    to: text(10),
    module: text(40),
    quote: required(600, "Quote"),
    /** e.g. "MSc Nursing applicant · Chennai". Added later, so optional in saved files. */
    detail: text(120).default(""),
    /** e.g. "Offer from a UK university". */
    outcome: text(120).default(""),
    /** The student's own answers, shown as a short conversation on the story card. */
    journey: z
      .array(z.object({ question: required(160, "Question"), answer: required(400, "Answer") }))
      .max(6)
      .default([]),
    photoUrl: mediaUrl,
    consent: z.boolean(),
    published: z.boolean(),
  })
  .refine((item) => !item.published || item.consent, {
    message: "Record the student's written consent before publishing.",
    path: ["published"],
  });

export const awardSchema = z
  .object({
    title: required(120, "Award"),
    issuer: required(120, "Awarded by"),
    year: text(4).refine((value) => value === "" || /^\d{4}$/.test(value), "Use a four-digit year."),
    /** Internal: where the proof is kept. Never shown on the site. */
    evidenceNote: text(200),
    verified: z.boolean(),
    published: z.boolean(),
  })
  .refine((item) => !item.published || item.verified, {
    message: "Verify the award against its certificate before publishing.",
    path: ["published"],
  });

export const resultsSchema = z.object({
  stats: z.array(statSchema).max(8),
  testimonials: z.array(testimonialSchema).max(30),
  awards: z.array(awardSchema).max(12),
  /** Countries students have joined from; shown only when verified. */
  countries: z.object({
    list: lines(100, 60),
    verified: z.boolean(),
    /** Internal: the records the list comes from. Never shown on the site. */
    source: text(200),
  }),
});

const faqSchema = z.object({
  question: required(200, "Question"),
  answer: required(1200, "Answer"),
});

/** Internal path ("/contact", "#faq", "/free-ielts-assessment#fees") or https URL. */
const href = required(300, "Link").refine(
  (value) => /^(\/(?!\/)|#)[^\s]*$/.test(value) || /^https:\/\/[^\s]+$/.test(value),
  "Use a site path like /contact, a #section, or a full https:// link.",
);

export const contentSchema = z.object({
  hero: z.object({
    eyebrow: required(60, "Eyebrow"),
    titleLine1: required(80, "Headline"),
    titleLine2: text(80),
    titleUnderline: text(40),
    lede: required(300, "Description"),
    primaryCtaLabel: required(40, "Primary button label"),
    secondaryCtaLabel: required(40, "Secondary button label"),
    secondaryCtaHref: href,
    reassurance: text(120),
  }),
  headerCtaLabel: required(30, "Header button label"),
  headerCtaHref: href,
  about: z.object({
    title: required(120, "About heading"),
    lede: required(600, "About introduction"),
    mission: required(400, "Mission"),
    vision: required(400, "Vision"),
    goals: required(400, "Goals"),
  }),
  faqs: z.array(faqSchema).max(20),
  contactFaqs: z.array(faqSchema).max(12),
  footer: z.object({
    tagline: required(200, "Footer tagline"),
    disclaimer: required(400, "Footer disclaimer"),
    pteDisclaimer: text(300),
  }),
  serviceVideoUrl: mediaUrl,
  heroVideoUrl: mediaUrl,
});

const pointSchema = z.object({
  title: required(80, "Title"),
  body: required(300, "Text"),
});

/** Copy for the Home, Our Expertise, Why Choose Us, IELTS & PTE, and Enquire Now pages. */
export const pagesSchema = z.object({
  /** Shared blocks: "How you join" and "How you'll learn". */
  home: z.object({
    onboardingTitle: required(120, "How you join heading"),
    onboardingSteps: z.array(pointSchema).max(7),
    /** "How you'll learn" (the learning-style section); hidden while there are no points. */
    learningTitle: text(120),
    learningIntro: text(400),
    learningPoints: z.array(pointSchema).max(6),
  }),
  expertise: z.object({
    title: required(120, "Heading"),
    lede: required(400, "Introduction"),
    subjects: z.array(pointSchema).max(10),
  }),
  whyChooseUs: z.object({
    title: required(120, "Heading"),
    lede: required(400, "Introduction"),
    points: z.array(pointSchema).max(8),
  }),
  ieltsPte: z.object({
    seoTitle: required(70, "Search title"),
    seoDescription: required(170, "Search description"),
    title: required(120, "Heading"),
    lede: required(400, "Introduction"),
    comparison: z
      .array(z.object({ label: required(60, "Row"), ielts: required(160, "IELTS"), pte: required(160, "PTE") }))
      .max(10),
    faqs: z.array(faqSchema).max(15),
  }),
  enquire: z.object({
    title: required(120, "Heading"),
    lede: required(300, "Introduction"),
  }),
});

export const integrationsSchema = z.object({
  email: z.object({
    /** Where form submissions are emailed; overrides NOTIFY_EMAIL_TO. */
    notifyTo: z
      .string()
      .trim()
      .max(300)
      .refine(
        (value) =>
          value === "" ||
          value.split(",").every((address) => z.email().safeParse(address.trim()).success),
        "Enter one or more valid email addresses, separated by commas.",
      ),
  }),
  whatsapp: z.object({
    /** "link" = click-to-chat with the contact WhatsApp number; "wati" = automated replies (needs WATI_API_TOKEN). */
    provider: z.enum(["none", "link", "wati"]),
    watiEndpoint: httpsUrl,
    watiTemplateName: text(80).refine(
      (value) => value === "" || /^[a-z0-9_]+$/.test(value),
      "WATI template names use lowercase letters, digits, and underscores.",
    ),
  }),
  analytics: z.object({
    enabled: z.boolean(),
    ga4MeasurementId: text(20).refine(
      (value) => value === "" || /^G-[A-Z0-9]{4,16}$/.test(value),
      "GA4 IDs look like G-XXXXXXXXXX.",
    ),
    metaPixelId: text(20).refine(
      (value) => value === "" || /^\d{8,20}$/.test(value),
      "Meta Pixel IDs are 8–20 digits.",
    ),
  }),
});

export const settingsSchema = z.object({
  company: companySchema,
  contact: contactSchema,
  courses: coursesSchema,
  team: z.object({ trainers: z.array(trainerSchema).max(30) }),
  results: resultsSchema,
  content: contentSchema,
  pages: pagesSchema,
  integrations: integrationsSchema,
});

export type SiteSettings = z.output<typeof settingsSchema>;
export type SiteSettingsInput = z.input<typeof settingsSchema>;
export type SettingsSection = keyof SiteSettings;
export const settingsSections = Object.keys(settingsSchema.shape) as SettingsSection[];

export type StoredSettings = SiteSettings & {
  meta?: { updatedAt: string; updatedBy: string };
};
