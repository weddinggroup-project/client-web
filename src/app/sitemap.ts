import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["id", "en"].map((locale) => ({
      url: `${siteConfig.url}/${locale}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
      alternates: {
        languages: {
          id: `${siteConfig.url}/id`,
          en: `${siteConfig.url}/en`,
        },
      },
    }));
}
