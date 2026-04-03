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
import { ChevronRight, Hash, LayoutGrid, Users, ArrowUpRight } from "lucide-react";

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
    title: `${decodedTag}系アイドルランキング | 【2026年最新】人気ランキング・プロフィールまとめ`,
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
    ...(doc.data() as any),
  }));

  const recommendedTags = ["可愛い系", "清楚", "セクシー", "巨乳", "美脚", "スレンダー"];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            itemListElement: idols.map((idol: any, index: number) => ({
              "@type": "ListItem",
              position: index + 1,
              name: idol.name,
              url: `https://your-domain.com/idol/${idol.id}`
            })),
          }),
        }}
      />

      <div className="pt-24 pb-32 min-h-screen bg-[#F8FAFC]">
        <div className="max-w-6xl mx-auto px-6">

          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-10">
            <Link href="/" className="hover:text-pink-500 transition-colors">TOP</Link>
            <ChevronRight size={12} />
            <span className="text-slate-900 italic">TAG: {decodedTag.toUpperCase()}</span>
          </nav>

          {/* Page Header */}
          <div className="mb-16 space-y-6">
            <div className="flex items-center gap-4">
              <div className="bg-slate-900 text-pink-500 p-3 rounded-2xl shadow-lg rotate-3">
                <Hash size={32} strokeWidth={3} />
              </div>
              <h1 className="text-6xl font-black italic uppercase tracking-tighter text-slate-900 leading-none">
                {decodedTag}<span className="text-pink-500 not-italic text-2xl ml-2">ARCHIVE</span>
              </h1>
            </div>
            
            <div className="max-w-3xl">
              <p className="text-slate-500 text-lg font-medium leading-relaxed">
                <span className="text-slate-900 font-bold">{decodedTag}</span> 属性を持つキャストを独自の注目度スコアに基づきリストアップしました。
                ビジュアル、キャリア、そしてユーザーからの支持を兼ね備えた人気アイドルをチェック。
              </p>
            </div>

            {/* Related Tags Pill */}
            <div className="flex flex-wrap gap-2 pt-4">
              {recommendedTags.map((t) => (
                <Link
                  key={t}
                  href={`/tag/${encodeURIComponent(t)}`}
                  className={`px-4 py-2 rounded-full text-[10px] font-black tracking-widest transition-all border 
                    ${t === decodedTag 
                      ? "bg-pink-500 border-pink-500 text-white shadow-lg shadow-pink-500/20" 
                      : "bg-white border-slate-200 text-slate-400 hover:border-slate-900 hover:text-slate-900"}`}
                >
                  #{t.toUpperCase()}
                </Link>
              ))}
            </div>
          </div>

          {/* Stats Bar */}
          <div className="flex items-center justify-between mb-8 border-b border-slate-200 pb-4">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 text-[11px] font-black uppercase text-slate-400 tracking-widest">
                <LayoutGrid size={14} /> View: Grid
              </div>
              <div className="flex items-center gap-2 text-[11px] font-black uppercase text-slate-400 tracking-widest">
                <Users size={14} /> Total: {idols.length} results
              </div>
            </div>
          </div>

          {/* Grid Content */}
          {idols.length === 0 ? (
            <div className="py-20 text-center">
              <p className="text-slate-300 font-black italic text-4xl uppercase tracking-tighter">No Data Found</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {idols.map((idol: any) => (
                <Link key={idol.id} href={`/idol/${idol.id}`} className="group">
                  <div className="relative bg-white rounded-[2rem] p-3 shadow-sm border border-slate-100 group-hover:shadow-2xl group-hover:-translate-y-2 transition-all duration-500 overflow-hidden">
                    {/* Image Container */}
                    <div className="relative rounded-[1.6rem] overflow-hidden aspect-[3/4]">
                      <img
                        src={idol.image}
                        alt={idol.name}
                        className="w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                        <span className="text-white text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-1">
                          View Profile <ArrowUpRight size={14} />
                        </span>
                      </div>
                    </div>

                    {/* Info */}
                    <div className="mt-4 px-2 pb-2">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[9px] font-black uppercase text-pink-500 tracking-widest">Featured Cast</span>
                        <span className="text-[9px] font-bold text-slate-300">#{idol.cup || "—"} Cup</span>
                      </div>
                      <h3 className="text-xl font-black italic uppercase tracking-tighter text-slate-900 group-hover:text-pink-500 transition-colors">
                        {idol.name}
                      </h3>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}