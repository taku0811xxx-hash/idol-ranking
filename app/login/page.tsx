"use client";

import { useState, useRef } from "react";
import { auth } from "../../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import { Trophy, Star, Home, ImagePlus } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const rankingRef = useRef<HTMLDivElement>(null);
  const recommendRef = useRef<HTMLDivElement>(null);
  const voteRef = useRef<HTMLDivElement>(null);
  const postRef = useRef<HTMLDivElement>(null);

  const login = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/");
    } catch (e: any) {
      alert(e.message);
    }
  };

  return (
    <>
        {/* 🔥 これが重要（ズレ防止） */}
        <div className="md:ml-56 flex flex-col min-h-screen">

          {/* メイン */}
          <main className="flex-1 flex items-center justify-center pt-10 pb-20 px-4">

            <div className="bg-white p-8 rounded-2xl shadow w-full max-w-sm space-y-4">

              <h1 className="text-xl font-bold text-center">
                ログイン
              </h1>

              <input
                type="email"
                placeholder="メール"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                onClick={login}
                className="bg-pink-500 text-white py-2 rounded w-full"
              >
                ログイン
              </button>

              <button
                onClick={() => router.push("/register")}
                className="text-sm text-blue-500 w-full"
              >
                新規登録はこちら
              </button>

            </div>

          </main>
        </div>
    </>
  );
}