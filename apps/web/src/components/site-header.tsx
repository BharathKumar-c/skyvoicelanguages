import { brandLogos, studentPortalUrl } from "@/lib/settings/format";
import { getSettings } from "@/lib/settings/store";

import { SiteHeaderClient } from "./site-header-client";

/** Reads the logo, header button, and portal link from Website Settings. */
export async function SiteHeader() {
  const settings = await getSettings();
  return (
    <SiteHeaderClient
      ctaHref={settings.content.headerCtaHref}
      ctaLabel={settings.content.headerCtaLabel}
      logoSrc={brandLogos(settings).default}
      portalUrl={studentPortalUrl(settings)}
    />
  );
}
