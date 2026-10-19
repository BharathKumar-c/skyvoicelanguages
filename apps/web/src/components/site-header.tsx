import { brandLogos } from "@/lib/settings/format";
import { getSettings } from "@/lib/settings/store";

import { SiteHeaderClient } from "./site-header-client";

/** Reads the logo and header button from Website Settings. */
export async function SiteHeader() {
  const settings = await getSettings();
  return (
    <SiteHeaderClient
      ctaHref={settings.content.headerCtaHref}
      ctaLabel={settings.content.headerCtaLabel}
      logoSrc={brandLogos(settings).default}
    />
  );
}
