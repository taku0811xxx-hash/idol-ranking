"use client";

export default function Footer({ scrollTo, rankingRef, recommendRef, voteRef, postRef }: any) {
  return (
    <footer className="w-full bg-gray-900 text-white mt-16">
      <div className="max-w-5xl mx-auto px-6 py-20">

        {/* メニュー */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 text-sm text-center md:text-left">

          {/* ① サイト */}
          <div>
            <div className="font-bold mb-4 text-white">サイト</div>
            <div className="space-y-3 text-gray-400">
              <div onClick={() => scrollTo(rankingRef)} className="cursor-pointer hover:text-white transition">
                ランキング
              </div>
              <div onClick={() => scrollTo(recommendRef)} className="cursor-pointer hover:text-white transition">
                おすすめ
              </div>
            </div>
          </div>

          {/* ② 機能 */}
          <div>
            <div className="font-bold mb-4 text-white">機能</div>
            <div className="space-y-3 text-gray-400">
              <div onClick={() => scrollTo(voteRef)} className="cursor-pointer hover:text-white transition">
                投票
              </div>
              <div onClick={() => scrollTo(postRef)} className="cursor-pointer hover:text-white transition">
                投稿
              </div>
            </div>
          </div>

          {/* ③ アカウント */}
          <div>
            <div className="font-bold mb-4 text-white">アカウント</div>
            <div className="space-y-3 text-gray-400">
              <a href="/login" className="block hover:text-white transition">
                ログイン
              </a>
              <a href="/register" className="block hover:text-white transition">
                会員登録
              </a>
            </div>
          </div>

          {/* ④ その他 */}
          <div>
            <div className="font-bold mb-4 text-white">その他</div>
            <div className="space-y-3 text-gray-400">
              <a href="/privacy" className="block hover:text-white transition">
                プライバシーポリシー
              </a>
              <a href="/contact" className="block hover:text-white transition">
                お問い合わせ
              </a>
              <a href="/about" className="block hover:text-white transition">
                運営者情報
              </a>
            </div>
          </div>

        </div>

        {/* 区切り線 */}
        <div className="border-t border-gray-700 my-10"></div>

        {/* コピー */}
        <div className="text-center text-xs text-gray-400 tracking-wide">
          © 2026 Gravure Rank
        </div>

      </div>
    </footer>
  );
}