"use client";

import { useEffect, useState, useRef } from "react";
import { Trophy, Star, Home, ImagePlus } from "lucide-react";
import { db, uploadImage, auth } from "../firebase";
import Link from "next/link";
import {
  collection,
  addDoc,
  getDocs,
  serverTimestamp,
  doc,
    setDoc,
    getDoc,
    } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { playfair, noto } from "./fonts";
import { signOut } from "firebase/auth";
// 🔥 追加（検索用）
import { query, where } from "firebase/firestore";
import { motion } from "framer-motion";

export default function HomePage() {
  const [idols, setIdols] = useState<any[]>([]);
  const [ranking, setRanking] = useState<any[]>([]);
  const [recommend, setRecommend] = useState<any[]>([]);
  const [selectedIdol, setSelectedIdol] = useState<any | null>(null);
//   人気タグ
  const [popularTags, setPopularTags] = useState<any[]>([]);
  const fetchPopularTags = async () => {
  const snapshot = await getDocs(collection(db, "tags"));

    const list: any[] = [];
        snapshot.forEach((doc) => {
            list.push({ name: doc.id, ...doc.data() });
        });

        list.sort((a, b) => b.count - a.count);

            setPopularTags(list);
            };
    useEffect(() => {
  fetchPopularTags();
}, []);
//人気タグ

  const logout = async () => {
  await signOut(auth);
  alert("ログアウトしました");
    };

  const [user, setUser] = useState<any>(null);

  const [name, setName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // 🔥 追加（検索state）
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [keyword, setKeyword] = useState("");
  // 🔥 追加（タグランキング）
    const [tagRanking, setTagRanking] = useState<any[]>([]);

  const TAG_OPTIONS = [
    "清楚","童顔","巨乳","セクシー","ギャル","ナチュラル","お姉さん","ロリ系",
    "スレンダー","くびれ","美脚","高身長","低身長","グラマラス",
    "クール","可愛い系","大人系","癒し系","透明感",
    "コスプレ","アイドル系","女優系","インフルエンサー"
  ];

  const rankingRef = useRef<HTMLDivElement>(null);
  const recommendRef = useRef<HTMLDivElement>(null);
  const voteRef = useRef<HTMLDivElement>(null);
  const postRef = useRef<HTMLDivElement>(null);

  const scrollTo = (ref: any) => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });
    return () => unsubscribe();
  }, []);

  const fetchIdols = async () => {
    const snapshot = await getDocs(collection(db, "idols"));
    const list: any[] = [];
    snapshot.forEach((doc) => list.push({ id: doc.id, ...doc.data() }));
    setIdols(list);
  };
  // 🔥 追加（タグランキング取得）
const fetchTagRanking = async (tag: string) => {
  const snapshot = await getDocs(
    query(collection(db, "idols"), where("tags", "array-contains", tag))
  );

  const list: any[] = [];
  snapshot.forEach((doc) => list.push({ id: doc.id, ...doc.data() }));

  const voteSnap = await getDocs(collection(db, "votes"));
  const counts: any = {};

    voteSnap.forEach((doc) => {
    const d = doc.data();
    if (!d.name) return; // ← 追加
    counts[d.name] = (counts[d.name] || 0) + 1;
    });
  const ranked = list
    .map((idol) => ({
      ...idol,
      count: counts[idol.name] || 0,
    }))
    .sort((a, b) => b.count - a.count);

  setTagRanking(ranked);
};



  const vote = async (idol: any) => {
  const user = auth.currentUser;
  const today = new Date().toISOString().split("T")[0];

  // ■ ① ログインしてる場合
  if (user) {
    const voteId = `${user.uid}_${today}`;
    const voteRef = doc(db, "votes", voteId);

    const existing = await getDoc(voteRef);

    if (existing.exists()) {
      alert("今日はすでに投票済みです！");
      return;
    }

    await setDoc(voteRef, {
  userId: user.uid,
  idolId: idol.id,
  name: idol.name, // ← 追加
});

    alert("投票ありがとう！（ログイン済み）");
    return;
  }

  // ■ ② 未ログインの場合（localStorage制御）
  const voted = localStorage.getItem("voteDate");

  if (voted === today) {
    alert("今日はすでに投票済みです！");
    return;
  }

  await addDoc(collection(db, "votes"), {
  idolId: idol.id,
  name: idol.name, // ← 追加
  createdAt: serverTimestamp(),
});

  localStorage.setItem("voteDate", today);

  alert("投票ありがとう！");
    };

  const fetchRanking = async () => {
    const snapshot = await getDocs(collection(db, "votes"));
    const counts: any = {};

    snapshot.forEach((doc) => {
      const d = doc.data();
      if (!d.name) return;
      counts[d.name] = (counts[d.name] || 0) + 1;
    });

    const sorted = Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a: any, b: any) => b.count - a.count);

    const merged = sorted.map((r) => {
      const idol = idols.find((i) => i.name === r.name);
      return { ...r, image: idol?.image };
    });

    setRanking(merged);
  };

  const fetchRecommend = async () => {
    if (!user) {
      setRecommend(idols.slice(0, 5));
      return;
    }

    const snapshot = await getDocs(collection(db, "votes"));
    const userVotes: any = {};

    snapshot.forEach((doc) => {
  const d = doc.data();
  if (!d.name) return; // ← 追加
  if (d.userId === user.uid) {
    userVotes[d.name] = (userVotes[d.name] || 0) + 1;
  }
});

    const sorted = Object.entries(userVotes)
      .sort((a: any, b: any) => b[1] - a[1])
      .map(([name]) => name);

    const recommendList = sorted
      .map((name) => idols.find((i) => i.name === name))
      .filter(Boolean);

    setRecommend(
      recommendList.length > 0
        ? recommendList.slice(0, 5)
        : idols.slice(0, 5)
    );
  };

  const submitIdol = async () => {
    if (!name || !file) return;

    const imageUrl = await uploadImage(file);

    await addDoc(collection(db, "pending_idols"), {
      name,
      imageUrl,
      createdAt: serverTimestamp(),
    });

    setName("");
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };
  useEffect(() => {
  fetchIdols();
}, []);

  useEffect(() => {
    if (idols.length > 0) {
      fetchRanking();
      fetchRecommend();
    }
  }, [idols, user]);

 const filteredIdols = idols.filter((idol) =>
  (idol.name || "").toLowerCase().includes(keyword.toLowerCase())
);

  return (
    <>
      {/* ヘッダー */}
      <div className="w-full bg-white shadow-sm fixed top-0 left-0 z-50">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-4 pt-3 pb-5">

            {/* 左：タイトル */}
            <a href="/" className="text-2xl font-bold text-pink-500 cursor-pointer">
            Idol Ranking
            </a>

            {/* 右：ログイン系 */}
            <div className="flex items-center gap-4 text-sm">
            {!user && (
                <>
                <a href="/login" className="text-blue-500 cursor-pointer">ログイン</a>
                <a href="/register" className="text-blue-500 cursor-pointer">会員登録</a>
                </>
            )}

            {user && (
                <div className="flex items-center gap-3">
                <a
                    href="/mypage"
                    className="px-3 py-1 border rounded-lg hover:bg-pink-50 cursor-pointer"
                >
                    👤 マイページ
                </a>

                <button
                    onClick={logout}
                    className="bg-gray-500 text-white px-3 py-1 rounded text-sm cursor-pointer hover:bg-gray-600"
                >
                    ログアウト
                </button>
                </div>
            )}
            </div>

        </div>
        
        </div>
      <div className="h-6"></div>

      {/* ⭐ 高さ問題の根本解決 */}
      <div className="flex bg-gradient-to-br from-pink-50 via-white to-purple-50 mt-6 min-h-screen">

        {/* サイドバー */}
        <aside className="hidden md:block fixed left-0 top-15 h-screen w-56 bg-white/80 backdrop-blur border-r p-4 z-40">
          <div className="font-bold text-lg mb-6">MENU</div>

          <div className="space-y-4 text-sm">
            <div onClick={() => scrollTo(rankingRef)} className="cursor-pointer flex gap-2">
              <Trophy size={16}/> ランキング
            </div>
            <div onClick={() => scrollTo(recommendRef)} className="cursor-pointer flex gap-2">
              <Star size={16}/> おすすめ
            </div>
            <div onClick={() => scrollTo(voteRef)} className="cursor-pointer flex gap-2">
              <Home size={16}/> 投票
            </div>
            <div onClick={() => scrollTo(postRef)} className="cursor-pointer flex gap-2">
              <ImagePlus size={16}/> 投稿
            </div>
          </div>
        </aside>

        {/* ⭐ レイアウト修正 */}
        <main className="flex-1 ml-56 mt-6 flex flex-col">

          {/* コンテンツ */}
          <div className="flex-grow">

            {/* タイトル */}
            <div className="p-10 text-center mb-10">

              <div className="inline-block px-10 py-8 rounded-2xl 
                bg-gradient-to-br from-pink-50 via-white to-purple-50
                border border-pink-200 shadow-md mb-15">

                <h1
                  className={`${playfair.className} 
                  text-3xl md:text-5xl 
                  font-bold 
                  tracking-wide 
                  bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 
                  bg-clip-text text-transparent`}
                >
                  推しが見つかる
                  <br />
                  アイドルランキング
                </h1>

                <div
                  className={`${noto.className} 
                  mt-4 text-xs md:text-sm 
                  tracking-[0.4em] 
                  text-gray-500`}
                >
                  FIND YOUR FAVORITE IDOL
                </div>                
              </div>

             {popularTags.length > 0 && (
                <section className="p-6">
                    <div className="bg-white rounded-2xl shadow-md p-6">
                    <h2 className="font-bold text-xl mb-6 border-b pb-2 text-center">
                        🔥 人気タグ
                    </h2>

                    <div className="flex flex-wrap gap-3 justify-center">
                        {popularTags.slice(0, 20).map((tag, i) => (
                        <Link
                            key={i}
                            href={`/tag/${tag.name}`}
                            className="px-4 py-2 bg-pink-100 text-pink-600 rounded-full text-sm font-medium hover:bg-pink-200 transition"
                        >
                            #{tag.name}
                        </Link>
                        ))}
                    </div>
                    </div>
                </section>
                )}
              {/* 🔥 タグ検索UI追加 */}
              <h2 className="font-bold text-xl mb-10 border-b pb-2 text-center">
                    🔍 タグ検索
                </h2>
              <div className="flex flex-wrap gap-2 justify-center mt-6 ">
                {TAG_OPTIONS.map(tag => (
                  <button
                    key={tag}
                    onClick={() => {
                        if (tag === selectedTag) {
                        setSelectedTag(null);
                        setTagRanking([]);
                        } else {
                        setSelectedTag(tag);
                        fetchTagRanking(tag);
                        }
                    }}
                    className={`px-3 py-1 rounded-full text-sm cursor-pointer ${
                        selectedTag === tag ? "bg-pink-500 text-white" : "bg-gray-200"
                    }`}
                    >
                    {tag}
                    </button>
                ))}
              </div>
              {selectedTag && tagRanking.length > 0 && (
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="p-6"
                >
                    <div className="bg-white rounded-2xl shadow-md p-6">
                    <h2 className="font-bold text-xl mb-6 border-b pb-2 text-center">
                        🔥 {selectedTag} 人気ランキング
                    </h2>

                    <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                        {tagRanking.slice(0, 5).map((idol,i) => (
                        <motion.div
                            key={idol.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="text-center"
                            >
                            <img
                            src={idol.image}
                            className="rounded-xl w-full aspect-[2/3] object-cover"
                            />
                            <div className="mt-2 text-sm font-bold">
                            {idol.name}
                            </div>
                            <div className="text-xs text-gray-500">
                            {idol.count}票
                            </div>
                        </motion.div>
                        ))}
                    </div>
                    </div>
                </motion.section>
                )}

            </div>

            {!user && (
              <div className="text-center text-sm mb-2 text-gray-500">
                ログインするとおすすめ精度が上がります
                <a href="/login" className="text-blue-500 underline ml-2">
                  ログイン
                </a>
              </div>
            )}

            {user && (
              <div className="text-center text-sm mb-2 text-pink-500">
                ログイン中（おすすめ最適化中🔥）
              </div>
            )}

            {/* ランキング */}
            <section ref={rankingRef} className="p-10 flex justify-center">
              <div className="bg-white rounded-2xl shadow-md px-10 py-8 inline-block">
                <h2 className="font-bold text-xl mb-6 border-b pb-2 text-center">
                  🏆ランキング
                </h2>

                <div className="flex justify-center gap-8">
                  {ranking.slice(0, 3).map((idol, i) => (
                    <Link
                        key={i}
                        href={`/idol/${idol.id}`}
                        className="cursor-pointer text-center hover:scale-105 transition"
                    >
                        <img
                        src={idol.image}
                        className={`object-cover rounded-xl mx-auto aspect-[2/3]
                            ${i === 0 ? "w-52" : "w-40"}
                        `}
                        />

                        <div className="mt-2 font-bold">{idol.name}</div>

                        {i === 0 && (
                        <div className="text-yellow-500 font-bold text-sm">
                            👑1位
                        </div>
                        )}
                    </Link>
                    ))}
                </div>
              </div>
            </section>

            {/* おすすめ */}
            <section ref={recommendRef} className="p-6">
              <div className="bg-white rounded-2xl shadow-md p-6">
                <h2 className="font-bold text-xl mb-6 border-b pb-2 text-center">
                  ⭐おすすめ
                </h2>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {recommend.map((idol, i) => (
                    <Link
                        key={i}
                        href={`/idol/${idol.id}`}
                        className="cursor-pointer hover:scale-105 transition"
                    >
                        <img
                        src={idol.image}
                        className="rounded-xl w-full aspect-[2/3] object-cover"
                        />

                        <div className="mt-2 text-sm font-bold text-center">
                        {idol.name}
                        </div>
                    </Link>
))}
                </div>
              </div>
            </section>

            {/* 投票 */}
            <section ref={voteRef} className="p-6">
              <div className="bg-white rounded-2xl shadow-md p-6">
                <h2 className="font-bold text-xl mb-6 border-b pb-2 text-center">
                  🗳投票
                </h2>
             <div className="flex justify-center gap-2 mb-4">
                <input
                    type="text"
                    placeholder="名前で検索..."
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    className="border px-4 py-2 rounded w-full max-w-xl"
                />
                <button
                    onClick={() => setKeyword("")}
                    className="bg-gray-200 px-3 rounded"
                >
                    リセット
                </button>
                </div>

                {keyword && (
                    <div className="text-center text-sm text-gray-500 mb-2">
                        「{keyword}」の検索結果
                    </div>
                    )}

                <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                  {filteredIdols.map((idol) => (
                    <div
                      key={idol.id}
                      className="bg-gray-50 rounded-xl p-2 hover:scale-105 transition"
                    >

                        <Link href={`/idol/${idol.id}`}>
                        <div className="cursor-pointer">
                            <img
                            src={idol.image}
                            className="rounded-xl w-full aspect-[2/3] object-cover"
                            />
                        </div>
                        </Link>

                      <div className="mt-2 font-bold text-center text-sm">
                        {idol.name}
                      </div>

                      <button
                        onClick={() => vote(idol)}
                        className="w-full bg-pink-500 text-white py-1 mt-2 rounded text-sm"
                      >
                        投票
                      </button>
                    </div>
                  ))}
                </div>

                {filteredIdols.length === 0 && (
                <p className="text-center text-gray-400 mt-4">
                    該当するアイドルがいません
                </p>
                )}
              </div>
            </section>

            {/* 投稿 */}
            <section ref={postRef} className="p-6">
              <div className="bg-white rounded-2xl shadow-md p-6">
                <h2 className="font-bold text-xl mb-6 border-b pb-2 text-center">
                  📩投稿
                </h2>

                <h3 className="font-bold text-xl mb-6 border-b pb-2 text-center">
                    あなたの推しのもっといい写真があればぜひこちらから投稿ください！
                </h3>

                <input
                  placeholder="名前"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="border p-2 w-full mb-2"
                />
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="mb-2"
                />
                <button
                  onClick={submitIdol}
                  className="bg-pink-500 text-white px-4 py-2 rounded"
                >
                  投稿
                </button>
              </div>
            </section>

          </div>

          {/* フッター（メニューあり＋高さしっかり） */}
          <footer className="w-full bg-gray-900 text-white mt-16">
        <div className="max-w-5xl mx-auto px-6 py-20">

            {/* メニュー */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-y-10 gap-x-16 text-sm text-center md:text-left">

                <div>
                    <div className="font-bold mb-4 text-white">サイト</div>
                    <div className="space-y-3 text-gray-400">
                    <div onClick={() => scrollTo(rankingRef)} className="cursor-pointer hover:text-white transition">ランキング</div>
                    <div onClick={() => scrollTo(recommendRef)} className="cursor-pointer hover:text-white transition">おすすめ</div>
                    </div>
                </div>

                <div>
                    <div className="font-bold mb-4 text-white">機能</div>
                    <div className="space-y-3 text-gray-400">
                    <div onClick={() => scrollTo(voteRef)} className="cursor-pointer hover:text-white transition">投票</div>
                    <div onClick={() => scrollTo(postRef)} className="cursor-pointer hover:text-white transition">投稿</div>
                    </div>
                </div>

                <div>
                    <div className="font-bold mb-4 text-white">アカウント</div>
                    <div className="space-y-3 text-gray-400">
                    <a href="/login" className="hover:text-white transition">ログイン</a>
                    <a href="/register" className="hover:text-white transition">会員登録</a>
                    </div>
                </div>

                <div>
                    <div className="font-bold mb-4 text-white">その他</div>
                    <div className="space-y-3 text-gray-400">
                    <div className="hover:text-white transition">利用規約</div>
                    <div className="hover:text-white transition">プライバシー</div>
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

        </main>

        {/* モーダル */}
        {selectedIdol && (
            <div
                className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
                onClick={() => setSelectedIdol(null)}
            >
                <div
                className="bg-white rounded-2xl p-6 max-w-2xl w-full flex gap-6 shadow-xl"
                onClick={(e) => e.stopPropagation()}
                >
                {/* ■ 左：画像 */}
                <div className="w-1/2">
                    <img
                    src={selectedIdol.image}
                    className="w-full aspect-[2/3] object-cover rounded-xl"
                    />
                </div>

                {/* ■ 右：情報 */}
                <div className="w-1/2 flex flex-col justify-center">
                    <h2 className="text-3xl font-bold mb-4">
                    {selectedIdol.name}
                    </h2>

                    <div className="text-sm text-gray-600 space-y-2">
                    <div>年齢：{selectedIdol.age || "-"}</div>
                    <div>身長：{selectedIdol.height || "-"} cm</div>
                    <div>カップ：{selectedIdol.cup || "-"}</div>
                    </div>

                    <button
                    onClick={() => setSelectedIdol(null)}
                    className="mt-6 bg-gray-200 py-2 rounded hover:bg-gray-300"
                    >
                    閉じる
                    </button>
                </div>
                </div>
            </div>
            )}
      </div>
    </>
  );
}