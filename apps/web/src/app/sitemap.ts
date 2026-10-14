import type { MetadataRoute } from "next";

import { siteConfig } from "@/config/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date("2026-10-13T00:00:00+05:30");

  return [
    {
      changeFrequency: "monthly",
      lastModified,
      priority: 1,
      url: `${siteConfig.url}${siteConfig.campaignPath}`,
    },
    {
      changeFrequency: "yearly",
      lastModified,
      priority: 0.2,
      url: `${siteConfig.url}/privacy`,
    },
    {
      changeFrequency: "yearly",
      lastModified,
      priority: 0.2,
      url: `${siteConfig.url}/terms`,
    },
  ];
}
