import { siteUrl } from "@/lib/settings/format";
import type { SiteSettings } from "@/lib/settings/schema";

/**
 * The organisation node shared by every page. A postal address (which makes it
 * eligible as a local business) is added only when Website Settings holds a
 * real branch or office address — never a guessed or virtual one.
 */
export function organizationLd(settings: SiteSettings) {
  const { company, contact } = settings;
  const branch = contact.branches[0];
  const lines = branch?.address.length ? branch.address : contact.address;
  return {
    "@type": lines.length ? ["EducationalOrganization", "LocalBusiness"] : "EducationalOrganization",
    "@id": siteUrl(settings, "/#organization"),
    name: company.name,
    url: company.domain,
    logo: siteUrl(settings, "/brand/skyvoice-icon.svg"),
    description: company.description,
    ...(company.tagline ? { slogan: company.tagline } : {}),
    ...(lines.length ? { address: { "@type": "PostalAddress", streetAddress: lines.join(", "), addressCountry: "IN" } } : {}),
    ...(branch?.phone || contact.phones[0] ? { telephone: branch?.phone || contact.phones[0] } : {}),
    ...(company.socialLinks.length ? { sameAs: company.socialLinks.map((link) => link.url) } : {}),
  };
}

export function faqLd(faqs: readonly { question: string; answer: string }[]) {
  return {
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
}
