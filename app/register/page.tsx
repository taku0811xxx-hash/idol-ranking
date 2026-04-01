"use client";

import { useState, useRef } from "react";
import { auth, db } from "../../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { Trophy, Star, Home, ImagePlus } from "lucide-react";
import Link from "next/link";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const rankingRef = useRef<HTMLDivElement>(null);
  const recommendRef = useRef<HTMLDivElement>(null);
  const voteRef = useRef<HTMLDivElement>(null);
  const postRef = useRef<HTMLDivElement>(null);

  const scrollTo = (ref: any) => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  };

  const register = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

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
    <>
        {/* 🔥 重要：これでズレ完全防止 */}
        <div className="md:ml-56 flex flex-col min-h-screen">

          {/* メイン */}
          <main className="flex-1 flex items-center justify-center pt-10 pb-20 px-4">

            <div className="bg-white p-8 rounded-2xl shadow w-full max-w-sm space-y-4">

              <h1 className="text-xl font-bold text-center">
                新規会員登録
              </h1>

              <input
                type="email"
                placeholder="メール"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border p-2 w-full rounded"
              />

              <input
                type="text"
                placeholder="名前"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border p-2 w-full rounded"
              />

              <input
                type="password"
                placeholder="パスワード"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border p-2 w-full rounded"
              />

              <button
                onClick={register}
                className="bg-pink-500 text-white py-2 rounded w-full"
              >
                登録
              </button>

              <button
                onClick={() => router.push("/login")}
                className="text-sm text-blue-500 w-full"
              >
                ログインはこちら
              </button>

            </div>

          </main>

        </div>
    </>
  );
}