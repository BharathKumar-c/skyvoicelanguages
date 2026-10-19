import type { MetadataRoute } from "next";

import { getSettings } from "@/lib/settings/store";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const base = (await getSettings()).company.domain;
  return {
    rules: {
      allow: "/",
      disallow: ["/api/", "/admin", "/thank-you"],
      userAgent: "*",
    },
    sitemap: `${base}/sitemap.xml`,
  };
}
