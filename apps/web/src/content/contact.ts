/**
 * Contact page types and fixed lists.
 *
 * NOTE: contact details, branches, social links, and Contact-page FAQs are now
 * edited in Website Settings (/admin/settings) and read from
 * src/lib/settings; the values below are kept only as type references and are
 * not rendered. `enquiryTypes` is still used by the enquiry form and its API.
 *
 * Sky Voice has not yet supplied approved contact details, branches, or social
 * profiles (see WEBSITE_DEVELOPMENT_REQUIREMENTS.md, "Content that must be
 * supplied"). Every field below is typed and empty; the page shows each item
 * as soon as it is filled and an honest "being confirmed" note until then.
 * Never add a number, address, or profile that Sky Voice has not approved.
 */

export type ContactDetails = {
  centreName: string;
  /** Registered or main office address, one line per array item. */
  address: string[] | null;
  /** Display format, e.g. "+91 98765 43210". */
  phones: string[];
  /** International format with country code, e.g. "+919876543210". */
  whatsapp: string | null;
  email: string | null;
  /** e.g. ["Mon–Fri · 9:00–19:00", "Sat · 10:00–16:00"]. */
  hours: string[] | null;
  /** e.g. "Sunday and public holidays". */
  weeklyHoliday: string | null;
};

export const contactDetails: ContactDetails = {
  centreName: "Sky Voice Languages",
  address: null,
  phones: [],
  whatsapp: null,
  email: null,
  hours: null,
  weeklyHoliday: null,
};

export type Branch = {
  id: string;
  name: string;
  address: string[];
  phone: string | null;
  hours: string | null;
  /**
   * Text Google Maps should search for (usually the full address). Used for the
   * embedded map and the Get directions link; no API key is required.
   */
  mapQuery: string;
};

/**
 * Example entry:
 * { id: "main", name: "Main office", address: ["Street", "City 600001"],
 *   phone: "+91 98765 43210", hours: "Mon–Sat · 9:00–19:00",
 *   mapQuery: "Sky Voice Languages, Street, City 600001" }
 */
export const branches: Branch[] = [];

export type SocialPlatform =
  | "facebook"
  | "instagram"
  | "youtube"
  | "linkedin"
  | "whatsapp"
  | "google";

/** Official profiles only, e.g. { platform: "instagram", url: "https://instagram.com/…" }. */
export const socialLinks: { platform: SocialPlatform; url: string }[] = [];

export const enquiryTypes = [
  { value: "assessment", label: "Free assessment" },
  { value: "courses", label: "IELTS courses and formats" },
  { value: "pte", label: "PTE coaching" },
  { value: "fees", label: "Fees and payment" },
  { value: "schedule", label: "Class timings" },
  { value: "other", label: "Something else" },
] as const;

/** Answers here only restate facts already published on the campaign page. */
export const contactFaqs = [
  {
    question: "Is Sky Voice coaching online or in person?",
    answer:
      "Coaching is fully online for both IELTS Academic and General Training, in 1-on-1 sessions or focused groups of 3–5.",
  },
  {
    question: "How do I book the free assessment?",
    answer:
      "Use the assessment form on the IELTS coaching page. The team follows up to arrange a time, and you leave with your current level, weak modules, and a written roadmap.",
  },
  {
    question: "Can I ask about fees before booking anything?",
    answer:
      "Yes. Current fees for both formats are listed on the coaching page, and the free assessment ends with a format recommendation before you pay.",
  },
  {
    question: "What should I write in the enquiry form?",
    answer:
      "Tell us your test type, target band, and exam date if you have one. The more specific the question, the more useful the reply.",
  },
] as const;
