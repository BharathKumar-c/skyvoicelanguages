import type { MetadataRoute } from "next";

import { siteConfig } from "@/config/site";
import { getSettings } from "@/lib/settings/store";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = (await getSettings()).company.domain;
  const lastModified = new Date("2026-10-13T00:00:00+05:30");

  return [
    {
      changeFrequency: "monthly",
      lastModified,
      priority: 1,
      url: `${base}${siteConfig.campaignPath}`,
    },
    {
      changeFrequency: "monthly",
      lastModified: new Date("2026-10-16T00:00:00+05:30"),
      priority: 0.6,
      url: `${base}/about`,
    },
    {
      changeFrequency: "monthly",
      lastModified: new Date("2026-10-16T00:00:00+05:30"),
      priority: 0.6,
      url: `${base}/contact`,
    },
    {
      changeFrequency: "yearly",
      lastModified,
      priority: 0.2,
      url: `${base}/privacy`,
    },
    {
      changeFrequency: "yearly",
      lastModified,
      priority: 0.2,
      url: `${base}/terms`,
    },
  ];
}
