import { MetadataRoute } from "next";
import { db } from "@/firebase";
import { collection, getDocs } from "firebase/firestore";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://idol-ranking-sage.vercel.app";

  // 🔥 アイドル取得
  const snapshot = await getDocs(collection(db, "idols"));

  const idols = snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      tags: data.tags ? data.tags.split(",") : [],
    };
  });

  // 🔥 タグ一覧作成（重複削除）
  const tagSet = new Set<string>();
  idols.forEach((idol) => {
    idol.tags.forEach((tag: string) => {
      tagSet.add(tag.trim());
    });
  });

  const tags = Array.from(tagSet);

  // 🔥 固定ページ
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/ranking`,
      lastModified: new Date(),
    },
  ];

  // 🔥 アイドルページ
  const idolPages = idols.map((idol) => ({
    url: `${baseUrl}/idol/${idol.id}`,
    lastModified: new Date(),
  }));

  // 🔥 タグページ
  const tagPages = tags.map((tag) => ({
    url: `${baseUrl}/tag/${encodeURIComponent(tag)}`,
    lastModified: new Date(),
  }));

  return [...staticPages, ...idolPages, ...tagPages];
}