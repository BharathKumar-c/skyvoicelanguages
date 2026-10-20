import type { MetadataRoute } from "next";

import { siteConfig } from "@/config/site";
import { getSettings } from "@/lib/settings/store";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = (await getSettings()).company.domain;
  const lastModified = new Date("2026-10-13T00:00:00+05:30");

  const pagesModified = new Date("2026-10-20T00:00:00+05:30");
  const page = (path: string, priority: number): MetadataRoute.Sitemap[number] => ({
    changeFrequency: "monthly",
    lastModified: pagesModified,
    priority,
    url: `${base}${path}`,
  });

  return [
    {
      changeFrequency: "monthly",
      lastModified,
      priority: 1,
      url: `${base}${siteConfig.campaignPath}`,
    },
    page("/ielts-pte-coaching-chennai", 0.9),
    page("/enquire-now", 0.7),
    page("/our-expertise", 0.6),
    page("/why-choose-us", 0.6),
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
      lastModified: pagesModified,
      priority: 0.2,
      url: `${base}/disclaimer`,
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
