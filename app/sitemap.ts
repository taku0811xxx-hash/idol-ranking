export const dynamic = "force-static";

import { MetadataRoute } from "next";
import data from "@/data.json";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://idol-ranking-sage.vercel.app";

  const tagSet = new Set<string>();

  data.forEach((idol: any) => {
    if (idol.tags) {
      // 👇 配列対応
      if (Array.isArray(idol.tags)) {
        idol.tags.forEach((tag: string) => {
          if (tag) tagSet.add(tag);
        });
      } else {
        idol.tags.split(",").forEach((tag: string) => {
          if (tag && tag.trim()) tagSet.add(tag.trim());
        });
      }
    }
  });

  const tags = Array.from(tagSet);

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
    },

    ...data
      .filter((idol: any) => idol.id)
      .map((idol: any) => ({
        url: `${baseUrl}/idol/${idol.id}`,
        lastModified: new Date(),
      })),

    ...tags.map((tag) => ({
      url: `${baseUrl}/tag/${encodeURIComponent(tag)}`,
      lastModified: new Date(),
    })),
  ];
}