"use client";

import { useState } from "react";
import { auth, db } from "../../firebase"; // ← db追加
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore"; // ← 追加
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const register = async () => {
    try {
      // ① ユーザー作成
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      const user = userCredential.user;

      // ② Firestoreに保存 ← ★ここが今回の追加
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        name: name,
        createdAt: serverTimestamp(),
      });

      alert("登録成功！");
      router.push("/");
    } catch (e: any) {
      alert(e.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <h1 className="text-xl font-bold">新規会員登録</h1>

      <input
        type="email"
        placeholder="メール"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border p-2 w-64"
      />

      <input
        type="text"
        placeholder="名前"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border p-2 w-64"
      />

      <input
        type="password"
        placeholder="パスワード"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border p-2 w-64"
      />

      <button
        onClick={register}
        className="bg-pink-500 text-white px-4 py-2 rounded"
      >
        登録
      </button>

      <button
        onClick={() => router.push("/login")}
        className="text-sm text-blue-500"
      >
        ログインはこちら
      </button>
    </div>
  );
}