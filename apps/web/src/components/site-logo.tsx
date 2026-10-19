import { brandLogos } from "@/lib/settings/format";
import { getSettings } from "@/lib/settings/store";

import { BrandLogo } from "./brand-logo";

/** BrandLogo using the logo configured in Website Settings (server components only). */
export async function SiteLogo({ variant = "default", className }: { variant?: "default" | "white"; className?: string }) {
  const settings = await getSettings();
  const logos = brandLogos(settings);
  return <BrandLogo className={className} src={variant === "white" ? logos.white : logos.default} variant={variant} />;
}
