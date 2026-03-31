import { db } from "@/firebase";
import {
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";

export async function getRelatedIdols(tags: string[], currentId: string) {
  if (!tags || tags.length === 0) return [];

  const resultsMap: any = {};

  // 🔥 タグ重要度（自由に調整OK）
  const weightMap: any = {
    巨乳: 2,
    美人系: 1.5,
    可愛い系: 1.5,
    コスプレ: 1.2,
  };

  for (const tag of tags) {
    const q = query(
      collection(db, "idols"),
      where("tags", "array-contains", tag)
    );

    const snapshot = await getDocs(q);

    snapshot.docs.forEach((doc) => {
      const data = doc.data();
      const id = doc.id;

      // 自分除外
      if (id === currentId) return;

      if (!resultsMap[id]) {
        resultsMap[id] = {
          id,
          ...data,
          score: 0,
        };
      }

      // 🔥 重み付きスコア
      const weight = weightMap[tag] || 1;
      resultsMap[id].score += weight;
    });
  }

  const sorted = Object.values(resultsMap)
    // 🔥 タグ数が多い人優先（精度UP）
    .sort((a: any, b: any) => {
      if (b.score !== a.score) return b.score - a.score;
      return (b.tags?.length || 0) - (a.tags?.length || 0);
    })
    .slice(0, 6);

  return sorted;
}