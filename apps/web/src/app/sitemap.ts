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
      changeFrequency: "monthly",
      lastModified: new Date("2026-10-16T00:00:00+05:30"),
      priority: 0.6,
      url: `${siteConfig.url}/about`,
    },
    {
      changeFrequency: "monthly",
      lastModified: new Date("2026-10-16T00:00:00+05:30"),
      priority: 0.6,
      url: `${siteConfig.url}/contact`,
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
