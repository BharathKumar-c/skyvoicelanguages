export const siteConfig = {
  name: "Sky Voice Languages",
  shortName: "Sky Voice",
  description:
    "Personalised online IELTS coaching for Academic and General Training, beginning with a free IELTS assessment and a clear preparation roadmap.",
  url: "https://skyvoicelanguages.com",
  campaignPath: "/free-ielts-assessment",
} as const;

/**
 * Primary navigation, in page order. Section links are absolute so they work
 * from every page; on the campaign page they scroll in place. "Portal" stays in
 * the footer; "Results" returns once verified student results are published.
 */
export const navigation = [
  { label: "Method", href: `${siteConfig.campaignPath}#method` },
  { label: "Modules", href: `${siteConfig.campaignPath}#modules` },
  { label: "Fees", href: `${siteConfig.campaignPath}#fees` },
  { label: "FAQ", href: `${siteConfig.campaignPath}#faq` },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;

export const assessmentHref = `${siteConfig.campaignPath}#assessment-form`;
