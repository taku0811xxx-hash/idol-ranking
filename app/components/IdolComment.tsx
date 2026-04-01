"use client";

import { useEffect, useState } from "react";
import { db, auth } from "@/firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  where,
  orderBy,
  getDocs,
} from "firebase/firestore";

export default function IdolComment({ idolId }: { idolId: string }) {
  const [comments, setComments] = useState<any[]>([]);
  const [text, setText] = useState("");

  // 🔥 NGワード
  const NG_WORDS = ["死ね", "きもい", "ブス", "殺す"];

  const containsNG = (text: string) => {
    return NG_WORDS.some((word) => text.includes(word));
  };

  const fetchComments = async () => {
    const q = query(
      collection(db, "idol_comments"),
      where("idolId", "==", idolId),
      orderBy("createdAt", "desc")
    );

    const snap = await getDocs(q);
    setComments(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
  };

  useEffect(() => {
    fetchComments();
  }, [idolId]);

  const submit = async () => {
    const user = auth.currentUser;
    if (!user) {
      alert("ログインしてください");
      return;
    }

    const trimmed = text.trim();

    // 🔥 空チェック
    if (!trimmed) return;

    // 🔥 NGワードチェック
    if (containsNG(trimmed)) {
      alert("不適切な表現が含まれています");
      return;
    }

    // 🔥 文字数制限
    if (trimmed.length > 100) {
      alert("100文字以内で入力してください");
      return;
    }

    // 🔥 連投防止（5秒）
    const last = localStorage.getItem("lastCommentTime");
    if (last && Date.now() - Number(last) < 5000) {
      alert("連続投稿は少し待ってください");
      return;
    }

    localStorage.setItem("lastCommentTime", Date.now().toString());

    // 投稿
    await addDoc(collection(db, "idol_comments"), {
      idolId,
      userId: user.uid,
      text: trimmed,
      createdAt: serverTimestamp(),
    });

    setText("");
    fetchComments();
  };

  return (
    <div className="mt-10">
      {/* 入力 */}
      <div className="flex gap-2 mb-4 items-center">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="border px-4 py-2 rounded-full w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
          placeholder="コメントを書く..."
        />
        <button
          onClick={submit}
          className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-full shadow"
        >
          投稿
        </button>
      </div>

      {/* コメント一覧 */}
      <div className="space-y-3">
        {comments.length === 0 && (
          <div className="text-gray-400 text-sm">
            まだコメントがありません
          </div>
        )}

        {comments.map((c) => (
          <div
            key={c.id}
            className="flex items-start gap-3 bg-white border rounded-xl p-3 shadow-sm hover:shadow-md transition"
          >
            {/* アイコン */}
            <div className="w-8 h-8 rounded-full bg-pink-200 flex items-center justify-center text-xs font-bold text-white">
              U
            </div>

            {/* 本文 */}
            <div className="flex-1">
              <div className="text-sm text-gray-800 leading-relaxed">
                {c.text}
              </div>

              {/* 時間 */}
              <div className="text-xs text-gray-400 mt-1">
                {c.createdAt?.seconds
                  ? new Date(c.createdAt.seconds * 1000).toLocaleString()
                  : "今"}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}