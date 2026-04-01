"use client";

import { useEffect, useState, useRef } from "react";
import { Trophy, Star, Home, ImagePlus } from "lucide-react";
import { db, uploadImage, auth } from "../firebase";
import LikeButton from "@/app/components/LikeButton";
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
import { query, where,orderBy } from "firebase/firestore";
import { motion } from "framer-motion";

export default function HomePage() {
  const [idols, setIdols] = useState<any[]>([]);
  const [posts, setPosts] = useState<any[]>([]);
  const [ranking, setRanking] = useState<any[]>([]);
  const [recommend, setRecommend] = useState<any[]>([]);
  const [selectedIdol, setSelectedIdol] = useState<any | null>(null);
  const [triggerMap, setTriggerMap] = useState<{ [key: string]: number }>({});
 const [showTags, setShowTags] = useState(false);

//   人気タグ
const [popularTags, setPopularTags] = useState<any[]>([]);

const fetchPopularTags = async () => {
  const snapshot = await getDocs(collection(db, "idols"));

  const tagCount: { [key: string]: number } = {};

  snapshot.forEach((doc) => {
    const tags = doc.data().tags || [];

    tags.forEach((tag: string) => {
      tagCount[tag] = (tagCount[tag] || 0) + 1;
    });
  });

  const list = Object.entries(tagCount).map(([name, count]) => ({
    name,
    count,
  }));

  list.sort((a, b) => b.count - a.count);

  setPopularTags(list);
};

useEffect(() => {
  fetchPopularTags();
}, []);

  const logout = async () => {
  await signOut(auth);
  alert("ログアウトしました");
    };

    const [success, setSuccess] = useState(false);

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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
    setLoading(false); // ← 追加
  });
  return () => unsubscribe();
}, []);

  const fetchIdols = async () => {
    const snapshot = await getDocs(collection(db, "idols"));
    const list: any[] = [];
    snapshot.forEach((doc) => list.push({ id: doc.id, ...doc.data() }));
    setIdols(list);
  };

    const fetchPosts = async () => {
    const pendingSnap = await getDocs(
        query(collection(db, "pending_idols"), orderBy("createdAt", "desc"))
    );

    let approved: any[] = [];

        try {
        const approvedSnap = await getDocs(
            query(collection(db, "posts"), orderBy("createdAt", "desc"))
        );

        approved = approvedSnap.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
            isPending: false,
        }));
        } catch (e) {
        approved = [];
        }

    const pending = pendingSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        isPending: true,
    }));

    const merged = [...pending, ...approved].sort(
        (a: any, b: any) =>
            (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)
        );

    setPosts(merged);
    };

    const sliderRef = useRef<HTMLDivElement | null>(null);
    const innerRef = useRef<HTMLDivElement | null>(null);
    const handleUserRef = useRef<() => void>(() => {});
    const posRef = useRef(0);

    useEffect(() => {
        if (!sliderRef.current || !innerRef.current || posts.length === 0) return;

        const container = sliderRef.current;
        const inner = innerRef.current;

        let animationId: number;
        let pos = container.scrollLeft;
        let isPaused = false;
        let isUserInteracting = false;

        const scroll = () => {
            if (!isPaused && !isUserInteracting) {
                posRef.current += 0.5;
                    container.scrollLeft = posRef.current;

                    if (!isUserInteracting && posRef.current >= inner.scrollWidth / 2) {
                    posRef.current = 0;
                    }
            }

            animationId = requestAnimationFrame(scroll);
            };
            handleUserRef.current = () => {
            isUserInteracting = true;

            setTimeout(() => {
                isUserInteracting = false;
            }, 2000);
            };

        const handleMouseEnter = () => (isPaused = true);
        const handleMouseLeave = () => (isPaused = false);

        container.addEventListener("mouseenter", handleMouseEnter);
        container.addEventListener("mouseleave", handleMouseLeave);

        scroll();

        return () => {
            cancelAnimationFrame(animationId);
            container.removeEventListener("mouseenter", handleMouseEnter);
            container.removeEventListener("mouseleave", handleMouseLeave);
        };
        }, [posts.length]);

    useEffect(() => {
          fetchPosts();
        }, []);

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
      return { 
        ...r, 
        id: idol?.id,   
        image: idol?.image };
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

  try {
    const imageUrl = await uploadImage(file);

    await addDoc(collection(db, "pending_idols"), {
      name,
      imageUrl,
      type:"update",
      createdAt: serverTimestamp(),
    });

    // 成功表示
    setSuccess(true);

    setTimeout(() => {
      setSuccess(false);
    }, 3000);

    // フォームリセット
    setName("");
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";

  } catch (e) {
    alert("投稿に失敗しました");
  }
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

if (loading) return null;

  return (
    <>
      {/* ヘッダー */}
      <div className="w-full h-16 bg-white shadow-sm fixed top-0 left-0 z-50">
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
      <div className="h-16"></div>

        {/* サイドバー */}
       <aside className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-56 bg-white border-r p-4 z-10 overflow-y-auto">
            <div className="font-bold text-lg mb-6">MENU</div>

            <div className="space-y-4 text-sm">

                <Link href="/" className="flex gap-2 hover:text-pink-500 transition">
                <Trophy size={16}/> ランキング
                </Link>

                <Link href="/" className="flex gap-2 hover:text-pink-500 transition">
                <Star size={16}/> おすすめ
                </Link>

                <Link href="/" className="flex gap-2 hover:text-pink-500 transition">
                <Home size={16}/> 投票
                </Link>

                <Link href="/" className="flex gap-2 hover:text-pink-500 transition">
                <ImagePlus size={16}/> 投稿
                </Link>

                {/* タグメニュー */}
                <div className="mt-6">
                <button
                    onClick={() => setShowTags(!showTags)}
                    className="font-bold text-sm mb-2 flex items-center gap-2 hover:text-pink-500 transition"
                >
                    タグ {showTags ? "▲" : "▼"}
                </button>

                {showTags && (
                    <div className="space-y-2 mt-2">
                    {popularTags.map((tag) => (
                        <Link
                        key={tag.name}
                        href={`/tag/${encodeURIComponent(tag.name)}`}
                        className="block text-xs bg-pink-100 text-pink-600 px-2 py-1 rounded hover:bg-pink-200 transition"
                        >
                        #{tag.name}
                        </Link>
                    ))}
                    </div>
                )}
                </div>

                {/* 👇 ここ追加 */}
                <Link href="/register" className="flex gap-2 hover:text-pink-500 transition">
                会員登録
                </Link>

                <Link href="/login" className="flex gap-2 hover:text-pink-500 transition">
                ログイン
                </Link>

                <Link href="/privacy" className="flex gap-2 hover:text-pink-500 transition">
                プライバシーポリシー
                </Link>

                <Link href="/contact" className="flex gap-2 hover:text-pink-500 transition">
                お問い合わせ
                </Link>

                <Link href="/about" className="flex gap-2 hover:text-pink-500 transition">
                運営者情報
                </Link>
            </div>
            </aside>

        {/* ⭐ レイアウト修正 */}
        <main className="flex-1 md:ml-56 mt-0 flex flex-col">

          {/* コンテンツ */}
          <div className="flex-grow">

            {/* タイトル */}
            <div className="p-4 md:p-10 text-center mb-5">

              <div className="w-full max-w-xl mx-auto px-6 py-6 md:px-10 md:py-8 rounded-2xl
                bg-gradient-to-br from-pink-50 via-white to-purple-50
                border border-pink-200 shadow-md mb-5">

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

              {/* 🔍 検索バー */}
                <div className="flex justify-center mb-6">
                <input
                    type="text"
                    placeholder="アイドルを検索..."
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    className="border px-4 py-3 rounded-full w-full max-w-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
                />
                </div>

                <div className="p-6">
                 <div className="flex flex-col md:flex-row gap-6">

                {/* 🏆ランキング */}
                <div className="flex-[2] bg-white rounded-2xl shadow-md p-6">
                <h2 className="font-bold text-xl mb-6 border-b pb-2 text-center">
                    🏆ランキング
                </h2>

                <div className="flex justify-center gap-6">
                    {ranking.slice(0, 3).map((idol, i) => (
                    <Link
                        key={i}
                        href={`/idol/${idol.id}`}
                        className="text-center hover:scale-105 transition"
                    >
                        <img
                        src={idol.image}
                        className={`rounded-xl object-cover aspect-[2/3]
                        ${i === 0 ? "w-32 md:w-40" : "w-24 md:w-32"}`}
                        />
                        <div className="mt-2 font-bold text-sm">{idol.name}</div>
                    </Link>
                    ))}
                </div>
                </div>

                {/* 🔥人気タグ */}
                <div className="flex-[1] bg-white rounded-2xl shadow-md p-6">
                <h2 className="font-bold text-xl mb-6 border-b pb-2 text-center">
                    🔥人気タグ
                </h2>

                <div className="flex flex-wrap gap-3 justify-center">
                    {popularTags.slice(0, 8).map((tag) => (
                    <Link
                        key={tag.name}
                        href={`/tag/${encodeURIComponent(tag.name)}`}
                        className="px-3 py-1 bg-pink-100 text-pink-600 rounded-full text-sm hover:bg-pink-200 transition"
                    >
                        #{tag.name}
                    </Link>
                    ))}
                </div>
                </div>

            </div>
        </div>
        </div>

            {/* 🔽ここから差し替え */}
                <div className="p-6">
                <div className="flex flex-col md:flex-row gap-6 items-stretch">

                    {/* 🔍タグ検索 */}
                    <div className="flex-[2] bg-white rounded-2xl shadow-md p-6">
                    <h2 className="font-bold text-xl mb-6 border-b pb-2 text-center">
                        🔍 タグ検索
                    </h2>

                    <div className="flex flex-wrap gap-2 justify-center">
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
                            className={`px-3 py-1 rounded-full text-sm ${
                            selectedTag === tag
                                ? "bg-pink-500 text-white"
                                : "bg-gray-200"
                            }`}
                        >
                            {tag}
                        </button>
                        ))}
                    </div>

                    {selectedTag && tagRanking.length > 0 && (
                        <div className="mt-6 grid grid-cols-4 md:grid-cols-6 gap-3">
                        {tagRanking.slice(0, 6).map((idol, i) => (
                            <Link key={idol.id} href={`/idol/${idol.id}`}>
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className="text-center hover:scale-105 transition"
                            >
                                <img
                                src={idol.image}
                                className="rounded-xl w-full aspect-[2/3] object-cover"
                                />
                                <div className="mt-1 text-xs font-bold">
                                {idol.name}
                                </div>
                            </motion.div>
                            </Link>
                        ))}
                        </div>
                    )}
                    </div>

                    {/* ⭐おすすめ */}
                    <div className="flex-[1] bg-white rounded-2xl shadow-md p-6">
                    <h2 className="font-bold text-xl mb-6 border-b pb-2 text-center">
                        ⭐あなたへのおすすめ
                    </h2>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {recommend.slice(0, 6).map((idol) => (
                        <Link key={idol.id} href={`/idol/${idol.id}`}>
                        <div className="hover:scale-105 transition text-center">

                            <img
                            src={idol.image}
                            className="rounded-xl w-full aspect-[2/3] object-cover"
                            />

                            <div className="mt-1 text-xs font-bold">
                            {idol.name}
                            </div>

                            {/* 🔥タグ一覧（追加） */}
                            <div className="mt-1 flex flex-col items-center gap-1">
                            {idol.tags?.slice(0, 3).map((tag: string) => (
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
                    </div>

                </div>
                </div>
                {/* 🔼ここまで */}


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

                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6">
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
                <div className="max-w-xl mx-auto bg-white rounded-3xl shadow-xl p-8 border border-pink-100">

                    {/* タイトル */}
                    <div className="text-center mb-6">
                    <div className="text-3xl mb-2">📸</div>
                    <h2 className="font-bold text-2xl mb-2">
                        写真を投稿する
                    </h2>
                    <p className="text-sm text-gray-500">
                        あなたの推しの魅力をシェアしよう
                    </p>
                    </div>

                    {/* 入力 */}
                    <div className="space-y-4">

                    {/* 名前 */}
                    <input
                        placeholder="アイドルの名前"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-400"
                    />

                    {/* ファイル */}
                    <label className="block w-full border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer hover:border-pink-400 transition">
                        <input
                        type="file"
                        ref={fileInputRef}
                        onChange={(e) => setFile(e.target.files?.[0] || null)}
                        className="hidden"
                        />
                        <div className="text-gray-500">
                        クリックして画像を選択
                        </div>
                    </label>

                    {/* プレビュー */}
                    {file && (
                        <div className="mt-2">
                        <img
                            src={URL.createObjectURL(file)}
                            className="w-full rounded-xl object-cover max-h-64"
                        />
                        </div>
                    )}

                    {/* ボタン */}
                    <button
                        onClick={submitIdol}
                        className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-3 rounded-xl font-bold text-lg hover:opacity-90 transition cursor-pointer"
                    >
                        投稿する
                    </button>

                    {success && (
                <div className="fixed bottom-6 right-6 bg-gradient-to-r from-green-400 to-emerald-500 text-white px-6 py-3 rounded-xl shadow-lg">
                    投稿できました！🎉
                </div>
                )}

                    </div>
                </div>
                </section>

                {/* 投稿スライド */}
                <section className="p-6">
                <div className="bg-white rounded-2xl shadow-md p-4">
                    <h2 className="font-bold text-xl mb-4 text-center">
                    🆕 投稿一覧
                    </h2>

                    <div className="relative">

                        {/* ← 左ボタン */}
                        <button
                            onClick={() => {
                            if (!sliderRef.current) return;

                            const cardWidth = 180 + 16; // カード幅 + gap

                            handleUserRef.current();

                            posRef.current += cardWidth;
                            sliderRef.current.scrollLeft = posRef.current;
                            }}
                            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white/80 backdrop-blur px-3 py-2 rounded-full shadow hover:bg-white"
                        >
                            ◀
                        </button>

                        {/* → 右ボタン */}
                        <button
                            onClick={() => {
                            if (!sliderRef.current) return;

                            const cardWidth = 180 + 16; // カード幅 + gap

                            handleUserRef.current();

                            posRef.current += cardWidth;
                            sliderRef.current.scrollLeft = posRef.current;
                            }}
                            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white/80 backdrop-blur px-3 py-2 rounded-full shadow hover:bg-white"
                        >
                            ▶
                        </button>

                        {/* スライド */}
                        <div ref={sliderRef} className="overflow-x-auto">
                            <div ref={innerRef} className="flex gap-4 w-max">
                            {[...posts, ...posts].map((post, i) => (
                                <div
                            key={post.id + i}
                            className="group w-[180px] shrink-0 bg-gray-50 rounded-xl shadow relative overflow-hidden cursor-pointer transition duration-300 hover:-translate-y-2 hover:shadow-2xl"
                            >
                            {post.imageUrl ? (
                                <img
                                src={post.imageUrl}
                                className="w-full h-48 object-cover transition duration-300 group-hover:scale-110"
                                />
                            ) : (
                                <div className="w-full h-48 bg-gray-200 animate-pulse" />
                            )}

                            {post.isPending && (
                                <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                                NEW
                                </span>
                            )}

                            <div className="p-2 text-sm text-center">
                                <span>{post.name}</span>
                                <LikeButton postId={post.id} />
                            </div>
                            </div>
                            ))}
                            </div>
                            </div>
                        </div>

                        </div>
                </section>

          </div>

          {/* フッター（メニューあり＋高さしっかり） */}
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
                        <a href="/privacy" className="block hover:text-white transition">プライバシーポリシー</a>
                        <a href="/contact" className="block hover:text-white transition">お問い合わせ</a>
                        <a href="/about" className="block hover:text-white transition">運営者情報</a>
                        </div>
                    </div>

                    </div>

                    {/* ↓↓↓ ここからは外！！！ */}

                    {/* 区切り線 */}
                    <div className="border-t border-gray-700 my-10"></div>

                    {/* コピー */}
                    <div className="text-center text-xs text-gray-400 tracking-wide">
                    © 2026 Gravure Rank
                    </div>

                </div>
                </footer>
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
        </main>
    </>
  );
}