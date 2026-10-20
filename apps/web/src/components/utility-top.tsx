import Link from "next/link";

import { LanguageSwitcher } from "./language-switcher";
import { SiteLogo } from "./site-logo";

/**
 * Logo and language switcher for pages without the full site header (legal
 * pages, thank-you, 404), so the language can be changed everywhere.
 */
export function UtilityTop({ homeLabel, linked = true }: { homeLabel: string; linked?: boolean }) {
  return (
    <div className="utility-top">
      {linked ? (
        <Link aria-label={homeLabel} href="/">
          <SiteLogo />
        </Link>
      ) : (
        <SiteLogo />
      )}
      <LanguageSwitcher />
    </div>
  );
}
