"use client";

import { useEffect, useState } from "react";
import { auth, db } from "../../firebase";
import { onAuthStateChanged } from "firebase/auth";
import Link from "next/link";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc
} from "firebase/firestore";

export default function MyPage() {
  const [user, setUser] = useState<any>(null);
  const [userData, setUserData] = useState<any>(null);
  const [votes, setVotes] = useState<any[]>([]);
  const [idols, setIdols] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIdol, setSelectedIdol] = useState<any | null>(null);

  useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, async (u) => {
    if (u) {
      // ■ ユーザー情報
      const userRef = doc(db, "users", u.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        setUserData(userSnap.data());
      }

      setUser(u);

      // ■ votes取得 ←ここに移動
      const voteQuery = query(
        collection(db, "votes"),
        where("userId", "==", u.uid)
      );

      const voteSnap = await getDocs(voteQuery);
      setVotes(voteSnap.docs.map((doc) => doc.data()));
    }

    // ■ idolsはログイン関係ないから外でOK
    const idolSnap = await getDocs(collection(db, "idols"));
    setIdols(
        idolSnap.docs.map((doc) => ({
            id: doc.id,   // ← これ追加！！！
            ...doc.data(),
        }))
        );

    setLoading(false);
  });

  return () => unsubscribe();
}, []);
  if (loading) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-pink-50 via-white to-purple-50">

      <div className="relative">
        <div className="w-14 h-14 border-4 border-pink-200 rounded-full"></div>
        <div className="w-14 h-14 border-4 border-pink-500 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
      </div>

      <p className="mt-6 text-sm text-gray-500 tracking-wide">
        Loading...
      </p>

    </div>
  );
}

  if (!user) {
    return <p className="p-6">ログインしてください</p>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 p-6">

      <div className="max-w-4xl mx-auto space-y-6">
        <div className="max-w-4xl mx-auto mb-4">
        <Link
            href="/"
            className="text-sm text-gray-600 hover:text-pink-500 cursor-pointer"
        >
            ← トップへ戻る
        </Link>
        </div>

        {/* ■ プロフィールカード */}
        <div className="bg-white rounded-2xl shadow-md p-6 flex items-center gap-4">
          <div className="w-14 h-14 bg-pink-100 rounded-full flex items-center justify-center text-xl">
            👤
          </div>

          <div>
            <p className="font-bold text-lg">{userData?.name || user.email}</p>
            <p className="text-sm text-gray-500">マイページ</p>
          </div>
        </div>

        {/* ■ 投票履歴 */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="font-bold text-xl mb-4 border-b pb-2">
            🗳 投票履歴
          </h2>

          {votes.length === 0 ? (
            <p className="text-gray-500">まだ投票していません</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {votes.map((v, i) => {
                const idol = idols.find((i) => i.id === v.idolId);

                if (!idol) return null;

                return (
                    <div
                    key={i}
                    onClick={() => setSelectedIdol(idol)}
                    className="cursor-pointer hover:scale-105 transition"
                    >
                    <img
                    src={idol.image}
                    className="rounded-xl w-1/2 mx-auto aspect-[2/3] object-cover"
                    />

                    <div className="mt-2 text-sm font-bold text-center">
                    {idol.name}
                    </div>
                </div>
                );
            })}
            </div>
          )}
        </div>

      </div>
            {selectedIdol && (
        <div
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
            onClick={() => setSelectedIdol(null)}
        >
            <div
            className="bg-white rounded-2xl p-6 max-w-2xl w-full flex gap-6"
            onClick={(e) => e.stopPropagation()}
            >
            {/* ■ 左：画像 */}
            <div className="w-1/2">
                <img
                src={selectedIdol.image}
                className="w-full rounded-xl object-cover"
                />
            </div>

            {/* ■ 右：プロフィール */}
            <div className="w-1/2 flex flex-col justify-center">
                <h2 className="text-2xl font-bold mb-4">
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
    
  );
}