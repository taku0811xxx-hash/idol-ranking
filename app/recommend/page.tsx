"use client";

import { useEffect, useState } from "react";
import { db } from "@/firebase";
import { collection, getDocs, limit, query, where } from "firebase/firestore";
import Link from "next/link";
import { motion } from "framer-motion";
import { Star, Sparkles, Heart } from "lucide-react";

export default function RecommendPage() {
  const [newIdols, setNewIdols] = useState<any[]>([]);
  const [featuredIdols, setFeaturedIdols] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommend = async () => {
      try {
        const idolSnap = await getDocs(collection(db, "idols"));
        const allIdols = idolSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // 1. 新人アイドル（例：最新の5件）
        setNewIdols(allIdols.slice(-6).reverse());

        // 2. フィーチャー（例：ランダムまたは特定の条件でピックアップ）
        // ここでは一旦シャッフルして上位4件を表示
        const shuffled = [...allIdols].sort(() => 0.5 - Math.random());
        setFeaturedIdols(shuffled.slice(0, 4));

      } catch (error) {
        console.error("Error fetching recommend:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRecommend();
  }, []);

  if (loading) {
    return <div className="py-20 text-center font-bold text-slate-400">Loading Recommendations...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto py-10 px-4 space-y-16">
      {/* ヒーローセクション */}
      <section className="text-center">
        <h1 className="text-5xl font-black italic tracking-tighter text-slate-900 mb-4">
          EDITOR'S <span className="text-pink-500">PICK</span>
        </h1>
        <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">今、注目すべき注目のアイドルたち</p>
      </section>

      {/* 注目のアイドル（大きく表示） */}
      <section>
        <div className="flex items-center gap-2 mb-6">
          <Sparkles className="text-yellow-400 fill-yellow-400" size={24} />
          <h2 className="text-2xl font-black text-slate-800 italic uppercase">Featured</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredIdols.map((idol) => (
            <RecommendCard key={idol.id} idol={idol} variant="featured" />
          ))}
        </div>
      </section>

      {/* 新人アイドル（リスト表示） */}
      <section>
        <div className="flex items-center gap-2 mb-6">
          <Star className="text-pink-500 fill-pink-500" size={24} />
          <h2 className="text-2xl font-black text-slate-800 italic uppercase">New Faces</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {newIdols.map((idol) => (
            <RecommendCard key={idol.id} idol={idol} variant="new" />
          ))}
        </div>
      </section>
    </div>
  );
}

// おすすめ専用カードコンポーネント
function RecommendCard({ idol, variant }: { idol: any, variant: 'featured' | 'new' }) {
  const isFeatured = variant === 'featured';
  const displayImage = idol.image || idol.imageURL || "https://placehold.jp/24/cccccc/ffffff/200x300.png?text=No%20Image";

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="group relative"
    >
      <Link href={`/idol/${idol.id}`}>
        <div className={`relative overflow-hidden rounded-3xl bg-slate-200 shadow-lg ${isFeatured ? "aspect-[3/4]" : "aspect-[2/3]"}`}>
          <img
            src={displayImage}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            alt={idol.name}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />
          
          <div className="absolute bottom-0 left-0 p-4 w-full">
            <p className={`font-black text-white italic truncate ${isFeatured ? "text-xl" : "text-sm"}`}>
              {idol.name}
            </p>
            {isFeatured && (
              <div className="flex items-center gap-1 mt-1">
                <Heart size={12} className="text-pink-500 fill-pink-500" />
                <span className="text-[10px] text-pink-200 font-bold uppercase tracking-tighter">Highly Recommended</span>
              </div>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}