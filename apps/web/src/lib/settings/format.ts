import { features } from "@/config/site";

import type { SiteSettings } from "./schema";

/** "17499" → "₹17,499"; empty → null (show "fee on request"). */
export function formatFee(value: string) {
  if (!value) return null;
  return `₹${Number(value).toLocaleString("en-IN")}`;
}

/** Digits and leading + only, for tel: links. */
export const telDigits = (value: string) => value.replace(/[^\d+]/g, "");

export function whatsappHref(settings: SiteSettings) {
  if (settings.integrations.whatsapp.provider === "none" || !settings.contact.whatsapp) return null;
  return `https://wa.me/${telDigits(settings.contact.whatsapp).replace("+", "")}`;
}

/** The student-portal link to show, or "" while the feature is switched off (see `features`). */
export const studentPortalUrl = (settings: SiteSettings) => (features.studentLogin ? settings.company.portalUrl : "");

/** Absolute URL on the configured domain. */
export const siteUrl = (settings: SiteSettings, pathname = "") => `${settings.company.domain}${pathname}`;

export const defaultLogo = "/assets/generated/brand/skyvoice-horizontal-cropped.svg";
export const defaultLogoWhite = "/assets/generated/brand/skyvoice-horizontal-white-transparent.svg";

export function brandLogos(settings: SiteSettings) {
  return {
    default: settings.company.logoUrl || defaultLogo,
    // Never fall back to the standard logo here: it is invisible on the navy footer.
    white: settings.company.logoWhiteUrl || defaultLogoWhite,
  };
}
