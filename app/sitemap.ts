import { MetadataRoute } from "next";
import data from "@/data.json";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://idol-ranking-sage.vercel.app";

  const tagSet = new Set<string>();

  data.forEach((idol: any) => {
    if (idol.tags) {
      if (Array.isArray(idol.tags)) {
        idol.tags.forEach((tag: string) => {
          if (tag) tagSet.add(tag.trim());
        });
      } else if (typeof idol.tags === "string") {
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
      changeFrequency: "daily" as const, // as const を追加
      priority: 1.0,
    },
    ...data
      .filter((idol: any) => idol.id)
      .map((idol: any) => ({
        url: `${baseUrl}/idol/${idol.id}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const, // as const を追加
        priority: 0.8,
      })),
    ...tags.map((tag) => ({
      url: `${baseUrl}/tag/${encodeURIComponent(tag)}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const, // as const を追加
      priority: 0.6,
    })),
  ];
}