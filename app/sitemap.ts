import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://idol-ranking-sage.vercel.app",
      lastModified: new Date(),
    },
  ];
}