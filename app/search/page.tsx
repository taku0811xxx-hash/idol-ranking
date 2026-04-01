"use client";
export const dynamic = "force-dynamic";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { db } from "@/firebase";
import { collection, getDocs } from "firebase/firestore";
import Link from "next/link";

export default function SearchPage() {
  const params = useSearchParams();
  const q = params.get("q") || "";

  const [idols, setIdols] = useState<any[]>([]);
  const [allIdols, setAllIdols] = useState<any[]>([]);

  useEffect(() => {
    const fetch = async () => {
      const snap = await getDocs(collection(db, "idols"));
      const list: any[] = [];
      snap.forEach((doc) => list.push({ id: doc.id, ...doc.data() }));

      setAllIdols(list);

      const filtered = list.filter((i) =>
        (i.name || "").toLowerCase().includes(q.toLowerCase())
      );

      setIdols(filtered);
    };

    fetch();
  }, [q]);

  return (
    <div className="p-6 max-w-5xl mx-auto">

      {/* 🔍 タイトル */}
      <h1 className="text-2xl font-bold mb-2 text-center">
        「{q}」の検索結果
      </h1>

      <p className="text-center text-gray-500 mb-6">
        {idols.length}件見つかりました
      </p>

      {/* 🔥 人気検索 */}
      <div className="mb-6 text-center">
        <p className="text-sm text-gray-500 mb-2">
          人気検索
        </p>

        <div className="flex gap-2 justify-center flex-wrap">
          {["清楚","巨乳","可愛い系","セクシー"].map(tag => (
            <Link key={tag} href={`/search?q=${tag}`}>
              <span className="px-3 py-1 bg-pink-100 text-pink-600 rounded-full text-sm cursor-pointer">
                #{tag}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* 🔍 結果 */}
      {idols.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {idols.map((idol) => (
            <Link key={idol.id} href={`/idol/${idol.id}`}>
              <div className="text-center hover:scale-105 transition cursor-pointer">

                <img
                  src={idol.image}
                  className="rounded-xl w-full aspect-[2/3] object-cover"
                />

                <div className="mt-1 text-sm font-bold">
                  {idol.name}
                </div>

                {/* タグ */}
                <div className="mt-1 flex flex-wrap justify-center gap-1">
                  {idol.tags?.slice(0, 2).map((tag: string) => (
                    <span
                      key={tag}
                      className="text-[10px] bg-pink-100 text-pink-600 px-2 py-[2px] rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center mt-10">

          <p className="text-gray-400 mb-4">
            該当するアイドルがいません
          </p>

          {/* 👇 代替導線 */}
          <Link href="/">
            <button className="bg-pink-500 text-white px-4 py-2 rounded">
              人気ランキングを見る
            </button>
          </Link>

          {/* 👇 fallback表示 */}
          <div className="mt-10">
            <h2 className="font-bold mb-4">
              人気アイドル
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {allIdols.slice(0, 8).map((idol) => (
                <Link key={idol.id} href={`/idol/${idol.id}`}>
                  <div className="text-center">
                    <img
                      src={idol.image}
                      className="rounded-xl w-full aspect-[2/3] object-cover"
                    />
                    <div className="text-sm mt-1">
                      {idol.name}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  );
}