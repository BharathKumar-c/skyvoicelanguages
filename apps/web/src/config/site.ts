export const siteConfig = {
  name: "Sky Voice Languages",
  shortName: "Sky Voice",
  description:
    "Personalised online IELTS coaching for Academic and General Training, beginning with a free IELTS assessment and a clear preparation roadmap.",
  url: "https://skyvoicelanguages.com",
  campaignPath: "/free-ielts-assessment",
} as const;

/**
 * Features held back until the client approves them. The code stays in place;
 * set a flag to true to show the feature again.
 *   studentLogin — "Student login" links (header, mobile menu, footer, and the
 *   IELTS & PTE portal button). Planned for the second enhancement phase.
 */
export const features = {
  studentLogin: false,
} as const;

/**
 * Primary navigation, in page order. "Home" is the campaign page itself ("/"
 * redirects there). The header button comes from Website Settings. Labels are
 * looked up by `key` in the interface text (i18n/messages, `client.nav`).
 */
export const navigation = [
  { key: "home", href: siteConfig.campaignPath },
  { key: "about", href: "/about" },
  { key: "expertise", href: "/our-expertise" },
  { key: "ieltsPte", href: "/ielts-pte-coaching-chennai" },
  { key: "why", href: "/why-choose-us" },
  { key: "contact", href: "/contact" },
] as const;

export const assessmentHref = `${siteConfig.campaignPath}#assessment-form`;
