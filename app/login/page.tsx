"use client";

import { useState } from "react";
import { auth } from "../../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const login = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/");
    } catch (e: any) {
      alert(e.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <h1 className="text-xl font-bold">ログイン</h1>

      <input
        type="email"
        placeholder="メール"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
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
        onClick={login}
        className="bg-pink-500 text-white px-4 py-2 rounded"
      >
        ログイン
      </button>

      <button
        onClick={() => router.push("/register")}
        className="text-sm text-blue-500"
      >
        新規登録はこちら
      </button>
    </div>
  );
}