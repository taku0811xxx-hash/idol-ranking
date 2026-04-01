"use client";

import { useRef } from "react";
import { Trophy, Star, Home, ImagePlus } from "lucide-react";
import Link from "next/link";

export default function PrivacyPage() {
  const rankingRef = useRef<HTMLDivElement>(null);
  const recommendRef = useRef<HTMLDivElement>(null);
  const voteRef = useRef<HTMLDivElement>(null);
  const postRef = useRef<HTMLDivElement>(null);

  const scrollTo = (ref: any) => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>

        {/* ここがポイント */}
        <div className="md:ml-56 flex flex-col min-h-screen">

          {/* メイン */}
          <main className="flex-1 pt-10 pb-20 px-4">

            <div className="max-w-3xl mx-auto bg-white p-8 md:p-12 rounded-2xl shadow">

              <h1 className="text-2xl md:text-3xl font-bold mb-8 text-center">
                プライバシーポリシー
              </h1>

              <div className="space-y-8 text-sm leading-relaxed text-gray-700">
                <section>
                  <h2 className="font-bold text-lg mb-2">■ 個人情報の利用目的</h2>
                  <p>お問い合わせ時に取得した情報は対応のために利用します。</p>
                </section>

                <section>
                  <h2 className="font-bold text-lg mb-2">■ 広告について</h2>
                  <p>Google AdSenseを利用予定です。</p>
                </section>

                <section>
                  <h2 className="font-bold text-lg mb-2">■ アクセス解析ツールについて</h2>
                  <p>Google Analyticsを利用しています。</p>
                </section>

                <section>
                  <h2 className="font-bold text-lg mb-2">■ 免責事項</h2>
                  <p>当サイトの情報による損害について責任を負いません。</p>
                </section>

                <div className="text-right text-xs text-gray-400 pt-6 border-t">
                  制定日：2026年3月30日
                </div>
              </div>

            </div>
          </main>
        </div>
    </>
  );
}