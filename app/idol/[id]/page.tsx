import { db } from "@/firebase";
import { doc, getDoc } from "firebase/firestore";
import Link from "next/link";
import { generateAppeal } from "@/lib/generateAppeal";
import ProposalForm from "@/app/components/ProposalForm";
import { getRelatedIdols } from "@/lib/getRelatedIdols";
import IdolComment from "@/app/components/IdolComment";
import { generateSEOText } from "@/lib/generateSEOText";
import { ChevronRight, Star, ShieldCheck, Zap, Info, History, Heart } from "lucide-react";

// ==============================
// SEO（metadata）
// ==============================
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const decodedId = decodeURIComponent(id);
  const docSnap = await getDoc(doc(db, "idols", decodedId));

  if (!docSnap.exists()) return { title: "アイドルが見つかりません" };

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

export default async function IdolDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const decodedId = decodeURIComponent(id);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const docSnap = await getDoc(doc(db, "idols", decodedId));

  if (!docSnap.exists()) {
    return <div className="text-center py-40 font-black text-slate-300">DATA NOT FOUND</div>;
  }

  const idol = docSnap.data();
  const related = await getRelatedIdols(Array.isArray(idol.tags) ? idol.tags : [], decodedId);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            name: idol.name,
            image: idol.image,
            url: `${baseUrl}/idol/${decodedId}`,
            description: idol.bio || "",
            height: idol.height ? {
              "@type": "QuantitativeValue",
              "value": idol.height,
              "unitCode": "CMT"
            } : undefined,
            // サイト独自の評価があるなら、AggregateRatingを追加するのも手です
          }),
        }}
      />
      <div className="pt-24 pb-32 min-h-screen bg-[#F8FAFC]">
        <div className="max-w-6xl mx-auto px-6">

          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-8">
            <Link href="/" className="hover:text-pink-500 transition-colors">TOP</Link>
            <ChevronRight size={12} />
            <span className="text-slate-900 italic">{idol.name}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

            {/* 左：メインビジュアル & 基本スペック */}
            <div className="lg:col-span-5 space-y-8">
              <div className="relative group">
                <div className="absolute -inset-4 bg-pink-500/10 rounded-[3rem] blur-2xl group-hover:bg-pink-500/20 transition-all" />
                <img
                  src={idol.image}
                  alt={idol.name}
                  className="relative rounded-[2.5rem] w-full aspect-[3/4] object-cover shadow-2xl border-4 border-white object-top"
                />
                <div className="absolute top-6 left-6 bg-slate-900 text-white p-3 rounded-2xl shadow-xl">
                  <ShieldCheck className="text-pink-500" size={24} />
                </div>
              </div>

              {/* スペック表 */}
              <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100">
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-6 flex items-center gap-2">
                  <Info size={14} /> Basic Specs
                </h3>
                <div className="grid grid-cols-2 gap-y-6">
                  {[
                    { label: "Age", value: idol.age, unit: "" },
                    { label: "Height", value: idol.height, unit: "cm" },
                    { label: "Cup", value: idol.cup, unit: "" },
                  ].map((spec) => (
                    <div key={spec.label}>
                      <div className="text-[9px] font-black uppercase text-slate-400">{spec.label}</div>
                      <div className="text-xl font-black italic text-slate-900">
                        {spec.value || "—"}<span className="text-xs ml-1 not-italic">{spec.unit}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <button className="w-full mt-8 bg-slate-900 text-white py-5 rounded-2xl font-black uppercase italic tracking-widest shadow-xl hover:bg-pink-500 transition-all flex items-center justify-center gap-3 active:scale-95">
                  <Heart size={18} fill="currentColor" /> Vote Now
                </button>
              </div>


            </div>

            {/* 右：詳細コンテンツ */}
            <div className="lg:col-span-7 space-y-12">

              {/* 名前とタグ */}
              <div className="space-y-4">
                <h1 className="text-6xl font-black italic uppercase tracking-tighter text-slate-900 leading-none">
                  {idol.name}
                </h1>
                <div className="flex flex-wrap gap-2">
                  {idol.tags?.map((tag: string) => (
                    <Link
                      href={`/tag/${encodeURIComponent(tag)}`}
                      key={tag}
                      className="bg-white border border-slate-200 text-[10px] font-black px-4 py-2 rounded-full hover:border-pink-500 hover:text-pink-500 transition-all shadow-sm"
                    >
                      #{tag.toUpperCase()}
                    </Link>
                  ))}
                </div>
              </div>

              {/* プロフィール & 経歴 */}
              <div className="space-y-10">
                <section>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-[2px] w-8 bg-pink-500" />
                    <h2 className="text-xs font-black uppercase tracking-widest text-slate-400">Biography</h2>
                  </div>
                  <p className="text-slate-700 leading-relaxed text-lg font-medium">
                    {idol.bio || `${idol.name}は、今注目の次世代アイドルとして多方面で活躍しています。`}
                  </p>
                </section>

                {idol.career && (
                  <section className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 text-slate-50">
                      <History size={64} />
                    </div>
                    <div className="relative">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="h-[2px] w-8 bg-slate-900" />
                        <h2 className="text-xs font-black uppercase tracking-widest text-slate-900">Career History</h2>
                      </div>
                      <p className="text-slate-600 leading-relaxed whitespace-pre-line font-medium">
                        {idol.career}
                      </p>
                    </div>
                  </section>
                )}

                <section>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-[2px] w-8 bg-pink-500" />
                    <h2 className="text-xs font-black uppercase tracking-widest text-slate-400">Visual Appeal</h2>
                  </div>
                  <div className="bg-slate-900 text-white p-8 rounded-[2.5rem] shadow-2xl italic relative overflow-hidden">
                    <Zap className="absolute -bottom-4 -right-4 text-white/5" size={120} />
                    <p className="relative z-10 leading-relaxed text-lg">
                      {idol.appeal || generateAppeal(idol)}
                    </p>
                  </div>
                </section>
              </div>

              {/* 提案フォーム・コメント */}
              <div className="pt-8 border-t border-slate-200">
                <ProposalForm idolId={decodedId} />
                <div className="mt-12">
                  <IdolComment idolId={decodedId} />
                </div>
              </div>

              {/* SEO セクション */}
              <section className="pt-12 border-t border-slate-200">
                <h2 className="text-2xl font-black italic uppercase text-slate-900 mb-6">
                  About <span className="text-pink-500">{idol.name}</span>
                </h2>
                <div className="prose prose-slate max-w-none text-slate-600 leading-loose whitespace-pre-line">
                  {generateSEOText(idol)}
                </div>
              </section>

            </div>
          </div>

          {/* 関連アイドル */}
          <section className="mt-32">
            <div className="flex items-end justify-between mb-12">
              <div>
                <h2 className="text-4xl font-black italic uppercase tracking-tighter text-slate-900">
                  Related <span className="text-pink-500">Idols</span>
                </h2>
                <p className="text-slate-400 text-xs font-bold mt-2 uppercase tracking-widest">
                  同じ属性を持つ注目キャスト
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {related.map((item: any) => (
                <Link key={item.id} href={`/idol/${item.id}`} className="group">
                  <div className="relative overflow-hidden rounded-[2rem] bg-white p-2 shadow-sm border border-slate-100 group-hover:shadow-xl transition-all group-hover:-translate-y-2">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="rounded-[1.6rem] w-full aspect-[3/4] object-cover object-top"
                    />
                    <div className="p-4">
                      <div className="text-[11px] font-black uppercase text-slate-400 mb-1">Cast</div>
                      <div className="text-lg font-black italic uppercase tracking-tighter text-slate-900 group-hover:text-pink-500 transition-colors">
                        {item.name}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>

        </div>
      </div>
    </>
  );
}