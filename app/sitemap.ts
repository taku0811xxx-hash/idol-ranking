export const dynamic = "force-dynamic";

import { MetadataRoute } from "next";
import { db } from "@/firebase";
import { collection, getDocs } from "firebase/firestore";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://idol-ranking-sage.vercel.app";

  const snapshot = await getDocs(collection(db, "idols"));

  const idols = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  // タグ集める
  const tagSet = new Set<string>();

  idols.forEach((idol: any) => {
    if (idol.tags) {
      idol.tags.split(",").forEach((tag: string) => {
        if (tag && tag.trim()) {
          tagSet.add(tag.trim());
        }
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
    ...idols.map((idol) => ({
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