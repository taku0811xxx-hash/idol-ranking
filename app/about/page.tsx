"use client";

import { useRef } from "react";
import { Trophy, Star, Home, ImagePlus } from "lucide-react";
import Link from "next/link";

export default function AboutPage() {

  const rankingRef = useRef<HTMLDivElement>(null);
  const recommendRef = useRef<HTMLDivElement>(null);
  const voteRef = useRef<HTMLDivElement>(null);
  const postRef = useRef<HTMLDivElement>(null);

  const scrollTo = (ref: any) => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
        {/* 🔥 ここが重要 */}
        <div className="md:ml-56 flex flex-col min-h-screen">

          {/* メイン */}
          <main className="flex-1 pt-10 pb-20 px-4">

            <div className="max-w-3xl mx-auto bg-white p-10 rounded-2xl shadow">

              <h1 className="text-2xl font-bold mb-8 text-center">
                運営者情報
              </h1>

              <div className="space-y-6 text-sm text-gray-700">

                <div>
                  <strong>サイト名：</strong>Gravure Rank
                </div>

                <div>
                  <strong>運営者：</strong>Proto
                </div>

                <div>
                  <strong>連絡先：</strong>
                  <Link href="/contact" className="text-blue-500 underline ml-2">
                    お問い合わせページ
                  </Link>
                </div>

                <div className="pt-6 border-t">
                  当サイトは、アイドルの人気ランキング・投票サービスを提供しています。
                </div>

              </div>

            </div>

          </main>

        </div>
    </>
  );
}