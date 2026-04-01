import { db } from "@/firebase";
import { doc, getDoc } from "firebase/firestore";
import Link from "next/link";
import { generateAppeal } from "@/lib/generateAppeal";
import ProposalForm from "@/app/components/ProposalForm";
import { getRelatedIdols } from "@/lib/getRelatedIdols";
import IdolComment from "@/app/components/IdolComment";
import { generateSEOText } from "@/lib/generateSEOText";

// ==============================
// SEO（metadata）
// ==============================
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const decodedId = decodeURIComponent(id);

  const docRef = doc(db, "idols", decodedId);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    return {
      title: "アイドルが見つかりません",
    };
  }

  const idol = docSnap.data();
  return {
    title: `${idol.name}｜プロフィール・年齢・身長・人気ランキング`,
    description: `${idol.name}のプロフィールや魅力、年齢や身長などの情報、人気ランキングや画像をまとめて紹介しています。`,
    openGraph: {
    title: `${idol.name}｜アイドルランキング`,
    description: `${idol.name}の魅力やプロフィールをチェック`,
    images: [idol.image],
  },
  };
}

// ==============================
// ページ本体
// ==============================
export default async function IdolDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const decodedId = decodeURIComponent(id);

  const docRef = doc(db, "idols", decodedId);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    return <div className="text-center mt-20">データがありません</div>;
  }

    const idol = docSnap.data();
        const related = await getRelatedIdols(
    Array.isArray(idol.tags) ? idol.tags : [],
    decodedId
    );


  return (
    <>
      {/* ヘッダー */}
      <div className="w-full bg-white shadow fixed top-0 left-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between">
          <Link href="/" className="text-2xl font-bold text-pink-500">
            Idol Ranking
          </Link>
        </div>
      </div>

      <div className="pt-20 min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
        <div className="max-w-5xl mx-auto p-6">

          <div className="bg-white rounded-2xl shadow-xl p-8">

            {/* 上：画像＋基本情報 */}
            <div className="flex flex-col md:flex-row gap-8">

              {/* 画像 */}
              <div className="w-full md:w-1/3">
                <img
                  src={idol.image}
                  alt={idol.name}
                  className="rounded-xl w-full object-cover"
                />
              </div>

              {/* 基本情報 */}
              <div className="flex-1">
                <h1 className="text-3xl font-bold mb-4">
                  {idol.name}
                </h1>

                <div className="space-y-2 text-gray-700">
                  <div>年齢：{idol.age || "-"}</div>
                  <div>身長：{idol.height || "-"} cm</div>
                  <div>カップ：{idol.cup || "-"}</div>
                  <div>カテゴリー：{idol.category || "-"}</div>
                </div>

                {/* タグ */}
                <div className="mt-4 flex flex-wrap gap-2 relative z-10">
                  {idol.tags?.map((tag: string) => (
                    <Link
                    href={`/tag/${encodeURIComponent(tag)}`}
                    key={tag}
                    className="bg-pink-100 text-pink-600 px-2 py-1 text-xs rounded-full cursor-pointer hover:bg-pink-200 relative z-10"
                    >
                    #{tag}
                    </Link>
                    ))}
                </div>

                {/* 投票ボタン（仮） */}
                <button className="mt-6 bg-pink-500 hover:bg-pink-600 text-white px-6 py-2 rounded-full">
                  この人に投票
                </button>
              </div>
            </div>

            {/* プロフィール */}
            <div className="mt-10">
              <h2 className="text-xl font-bold mb-2 border-b pb-2">
                プロフィール
              </h2>

              <p className="text-gray-700 leading-relaxed mt-3">
                {idol.bio
                  ? `${idol.bio}`
                  : `人気グラビアアイドルとして活躍`}
              </p>
            </div>

            {/* 経歴 */}
            {idol.career && (
              <div className="mt-10">
                <h2 className="text-xl font-bold mb-2 border-b pb-2">
                  経歴
                </h2>

                <p className="text-gray-700 leading-relaxed mt-3">
                  {idol.career}
                </p>
              </div>
            )}

            {/* 魅力（SEO用） */}
                <div className="mt-10">
                <h2 className="text-xl font-bold mb-2 border-b pb-2">
                    魅力・特徴
                </h2>

                <p className="text-gray-700 leading-relaxed mt-3">
                    {idol.appeal || generateAppeal(idol)}
                </p>
                <ProposalForm idolId={decodedId} />
                </div>

                <IdolComment idolId={decodedId} />

                {/* SEOテキスト */}
                <div className="mt-10">
                  <h2 className="text-xl font-bold mb-2 border-b pb-2">
                    {idol.name}について
                  </h2>

                  <p className="text-gray-700 leading-relaxed mt-3 whitespace-pre-line">
                    {generateSEOText(idol)}
                  </p>
                </div>

            {/* 関連（今後実装） */}
            <div className="mt-10">
              <h2 className="text-xl font-bold mb-4 border-b pb-2">
                {idol.name}に関連するアイドル
              </h2>
              <p className="text-sm text-gray-600 mb-4">
              {idol.name}と同じジャンルや特徴を持つ人気アイドルを紹介します。
            </p>

              <div className="text-gray-500 text-sm">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {related.map((item:any) => (
                    <Link key={item.id} href={`/idol/${item.id}`}>
                    <div className="cursor-pointer">
                        <img
                            src={item.image}
                            alt={`${item.name}の画像`}
                            className="rounded-lg w-full h-64 object-cover object-top"
                            />
                        <div className="text-sm mt-1 text-center">
                        {item.name}
                        </div>
                    </div>
                    </Link>
                ))}
                </div>
             </div>
            </div>

          </div>
        </div>

        {/* フッター */}
        <footer className="bg-gray-900 text-white mt-16">
          <div className="max-w-5xl mx-auto px-6 py-16 text-center">
            <div className="mb-4 font-bold text-lg">
              Idol Ranking
            </div>
            <div className="text-sm text-gray-400">
              © 2026 Gravure Rank
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}