// app/tag/[tag]/page.tsx

export const dynamic = "force-dynamic";

import Link from "next/link";
import { db } from "@/firebase";
import {
  collection,
  query,
  where,
  getDocs
} from "firebase/firestore";

// ==============================
// SEO
// ==============================
export async function generateMetadata({
  params,
}: {
  params: Promise<{ tag: string }>;
}) {
  const { tag } = await params;
  const decodedTag = decodeURIComponent(tag);

  return {
    title: `${decodedTag}系アイドルランキング | 人気ランキング・プロフィールまとめ`,
    description: `${decodedTag}系の人気グラビアアイドルを一覧で紹介。プロフィールや画像、ランキング情報もまとめてチェックできます。`,
  };
}

// ==============================
// ページ本体
// ==============================
export default async function TagPage({
  params,
}: {
  params: Promise<{ tag: string }>;
}) {
  const { tag } = await params;
  const decodedTag = decodeURIComponent(tag);

  const q = query(
    collection(db, "idols"),
    where("tags", "array-contains", decodedTag)
  );

  const snapshot = await getDocs(q);

  const idols = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  

  return (
    <>
      {/* ================= ヘッダー ================= */}
      <div className="w-full bg-white shadow fixed top-0 left-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between">
          <Link href="/" className="text-2xl font-bold text-pink-500">
            Idol Ranking
          </Link>
        </div>
      </div>

      {/* ================= メイン ================= */}
      <div className="pt-20 min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
        <div className="max-w-5xl mx-auto p-6">

          {/* タイトル */}
          <h1 className="text-3xl font-bold mb-2 text-gray-800">
            {decodedTag}のアイドル一覧
          </h1>

          <p className="text-gray-600 mb-6">
            {decodedTag}系の特徴を持つ人気アイドルを一覧で紹介しています。
            プロフィールや画像、ユーザー評価をもとにランキング形式で掲載しています。
          </p>

          {/* 件数 */}
          <p className="mb-4 text-sm text-gray-600">
            {idols.length}件
          </p>

          {/* 空状態 */}
          {idols.length === 0 && (
            <p className="text-gray-500">
              該当するアイドルがいません
            </p>
          )}

          {/* グリッド */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {idols.map((idol:any) => (
              <div
                key={idol.id}
                className="bg-white rounded-xl shadow hover:shadow-lg transition p-3 flex flex-col"
              >
                <a href={`/idol/${idol.id}`}>
                  <img
                    src={idol.image}
                    alt={idol.name}
                    className="rounded-lg w-full h-64 object-cover object-top"
                  />
                  <p className="mt-3 text-center font-semibold text-gray-800">
                    {idol.name}
                  </p>
                </a>
              </div>
            ))}
          </div>

        </div>
      </div>
    </>
  );
}