import { MetadataRoute } from "next";
import data from "@/data.json";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://idol-ranking-sage.vercel.app";

  const idols = data;

  // タグ集める
  const tagSet = new Set<string>();
  idols.forEach((idol: any) => {
    if (idol.tags) {
      idol.tags.split(",").forEach((tag: string) => {
        tagSet.add(tag.trim());
      });
    }
  });

  const tags = Array.from(tagSet);

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
    },

    // アイドルページ
    ...idols.map((idol: any) => ({
      url: `${baseUrl}/idol/${idol.id}`,
      lastModified: new Date(),
    })),

    // タグページ
    ...tags.map((tag) => ({
      url: `${baseUrl}/tag/${encodeURIComponent(tag)}`,
      lastModified: new Date(),
    })),
  ];
}