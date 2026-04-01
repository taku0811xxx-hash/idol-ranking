"use client";

import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  setDoc,
} from "firebase/firestore";

import {getDoc} from "firebase/firestore"

import { db, uploadImage } from "../../firebase";
import { increment } from "firebase/firestore";

const TAG_OPTIONS = [
  "清楚","童顔","巨乳","セクシー","ギャル","ナチュラル","お姉さん","ロリ系",
  "スレンダー","くびれ","美脚","高身長","低身長","グラマラス",
  "クール","可愛い系","大人系","癒し系","透明感",
  "コスプレ","アイドル系","女優系","インフルエンサー"
];

export default function AdminPage() {
  const [idols, setIdols] = useState<any[]>([]);
  const [pending, setPending] = useState<any[]>([]);
  const [isAuth, setIsAuth] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [proposals, setProposals] = useState<any[]>([]);
  const [comments, setComments] = useState<any[]>([]);

const [form, setForm] = useState({
    name: "",
    image: "",
    category: "",
    bio: "",
    career: "",       // ←追加
    age: "",
    height: "",
    cup: "",
    size: "",         // ←追加
    birthplace: "",   // ←追加
    genre: "",        // ←追加
    catch: "",        // ←追加
    tags: "",
  });

  const fetchProposals = async () => {
  const snapshot = await getDocs(collection(db, "proposals"));
  const list: any[] = [];

  snapshot.forEach((docItem) => {
    list.push({ id: docItem.id, ...docItem.data() });
  });

  setProposals(list);
};

  useEffect(() => {
    const password = prompt("パスワード入力");
    if (password === "naog2ih214do122ijoihga11") setIsAuth(true);
  }, []);

  const fetchIdols = async () => {
    const snapshot = await getDocs(collection(db, "idols"));
    const list: any[] = [];
    snapshot.forEach((docItem) => {
      list.push({ id: docItem.id, ...docItem.data() });
    });
    setIdols(list);
  };

  const fetchPending = async () => {
    const snapshot = await getDocs(collection(db, "pending_idols"));
    const list: any[] = [];
    snapshot.forEach((docItem) => {
      list.push({ id: docItem.id, ...docItem.data() });
    });
    setPending(list);
  };

  useEffect(() => {
  if (isAuth) {
    fetchIdols();
    fetchPending();
    fetchProposals(); // ←追加
    fetchComments();
  }
}, [isAuth]);

  const toggleTag = (tag: string) => {
    const current = form.tags ? form.tags.split(",").map(t=>t.trim()) : [];
    const newTags = current.includes(tag)
      ? current.filter(t=>t!==tag)
      : [...current, tag];
    setForm({ ...form, tags: newTags.join(",") });
  };

  const isSelected = (tag: string) => {
    if (!form.tags) return false;
    return form.tags.split(",").map(t=>t.trim()).includes(tag);
  };

  const autoFill = async () => {
    if (!form.name) return alert("名前を入力してね");
    setAiLoading(true);
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        body: JSON.stringify({ name: form.name }),
      });
      const data = await res.json();
      setForm(prev => ({
        ...prev,
        category: data.category || "",
        bio: data.bio || "",
        age: data.age || "",
        height: data.height || "",
        cup: data.cup || "",
      }));
    } catch {
      alert("AI取得失敗");
    } finally {
      setAiLoading(false);
    }
  };

  const saveIdol = async () => {
    if (!form.name) return alert("名前は必須");

    let imageUrl = form.image;
    if (file) imageUrl = await uploadImage(file);

    const data = {
      ...form,
      image: imageUrl,
      tags: form.tags ? form.tags.split(",").map(t=>t.trim()) : [],
      age: form.age ? Number(form.age) : null,
      height: form.height ? Number(form.height) : null,
    };

    await setDoc(doc(db, "idols", form.name.trim()), data, { merge: true });

    alert(editingId ? "更新した🔥" : "追加した🔥");
    resetForm();
    fetchIdols();
  };

  const resetForm = () => {
    setForm({
      name: "",
      image: "",
      category: "",
      bio: "",
      career: "",       // ←追加
      age: "",
      height: "",
      cup: "",
      size: "",         // ←追加
      birthplace: "",   // ←追加
      genre: "",        // ←追加
      catch: "",        // ←追加
      tags: "",
    });
    setFile(null);
    setEditingId(null);
  };

  const loadIdol = (idol:any) => {
    setEditingId(idol.id);
    setForm({
      name: idol.name || "",
      image: idol.image || "",
      category: idol.category || "",
      bio: idol.bio || "",
      age: idol.age?.toString() || "",
      height: idol.height?.toString() || "",
      cup: idol.cup || "",
      tags: Array.isArray(idol.tags) ? idol.tags.join(",") : idol.tags || "",
      career: idol.career || "",
      size: idol.size || "",
      birthplace: idol.birthplace || "",
      genre: idol.genre || "",
      catch: idol.catch || "",
    });
  };

const loadPending = (item:any) => {
  setEditingId(null);
  setForm({
    name: item.name || "",
    image: item.imageUrl || "",
    category: "",
    bio: "",
    age: "",
    height: "",
    cup: "",
    tags: "",
    career: "",
    size: "",
    birthplace: "",
    genre: "",
    catch: "",
  });
};
  const normalize = (name: string) => {
  return name.trim().toLowerCase();
};
  const approve = async (item:any) => {
    let imageUrl = form.image || item.imageUrl;
    if (file) imageUrl = await uploadImage(file);

    const name = normalize(form.name || item.name);
    const idolRef = doc(db, "idols", name);

    const existing = await getDoc(idolRef);

    if (existing.exists()) {
      // 🔥 既存 → 画像更新
      await setDoc(
        idolRef,
        {
          image: imageUrl,
        },
        { merge: true }
      );

      alert("画像を更新した🔥");
    } else {
      // 🔥 新規
      await setDoc(idolRef, {
        ...form,
        name,
        image: imageUrl,
        tags: form.tags ? form.tags.split(",").map(t=>t.trim()) : [],
      });

      alert("追加した🔥");
    }

    await deleteDoc(doc(db,"pending_idols",item.id));

    resetForm();
    fetchIdols();
    fetchPending();
  };
  const reject = async (id:string) => {
    await deleteDoc(doc(db,"pending_idols",id));
    fetchPending();
  };

  const deleteIdol = async (id:string) => {
    if (!confirm("削除する？")) return;
    await deleteDoc(doc(db,"idols",id));
    fetchIdols();
  };

      const approveProposal = async (item: any) => {
      const idolRef = doc(db, "idols", item.idolId);

      // 🔥 appeal更新
      await setDoc(
        idolRef,
        {
          appeal: item.content,
        },
        { merge: true }
      );

      // 🔥 ステータス変更
      await setDoc(
        doc(db, "proposals", item.id),
        { status: "approved" },
        { merge: true }
      );

      alert("提案を反映した🔥");
      fetchProposals();
    };

    const rejectProposal = async (id: string) => {
      await deleteDoc(doc(db, "proposals", id));
      fetchProposals();
    };

    const fetchComments = async () => {
      const snapshot = await getDocs(collection(db, "idol_comments"));
      const list: any[] = [];

      snapshot.forEach((docItem) => {
        list.push({ id: docItem.id, ...docItem.data() });
      });

      setComments(list);
    };
    const deleteComment = async (id: string) => {
    if (!confirm("このコメント削除する？")) return;

    await deleteDoc(doc(db, "idol_comments", id));
    fetchComments();
  };

  if (!isAuth) return <div className="p-6">認証中...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">管理画面</h1>

      <div className="flex gap-6">

        {/* 左 */}
        <div className="w-1/2">

          {editingId && (
            <div className="text-blue-500 mb-2">✏️ 編集中</div>
          )}

          <h2 className="font-bold mt-6 mb-2">承認待ち</h2>

          <div className="space-y-2 mb-6">
            {pending.map(item=>(  
              <div key={item.id} className="border p-3 rounded-xl">
                <img src={item.imageUrl} className="w-32 h-32 object-cover mb-2 rounded" />
                <div>{item.name}</div>
                <div className="text-xs text-gray-400">
                {item.type === "update" ? "画像改善投稿" : "新規投稿"}
              </div>

                <div className="flex gap-2 mt-2">
                  <button onClick={()=>loadPending(item)} className="text-blue-500 cursor-pointer hover:opacity-70">編集</button>
                  <button onClick={()=>approve(item)} className="text-green-500 cursor-pointer hover:opacity-70">承認</button>
                  <button onClick={()=>reject(item.id)} className="text-red-500 cursor-pointer hover:opacity-70">却下</button>
                </div>
              </div>
            ))}
          </div>

          {/* フォーム */}
          <div className="space-y-2 mb-6 bg-white p-4 rounded-xl shadow">

            <input className="w-full border p-2 rounded"
              placeholder="名前"
              value={form.name}
              onChange={(e)=>setForm({...form,name:e.target.value})}
            />

            <button
              onClick={autoFill}
              className="w-full bg-purple-500 text-white py-2 rounded cursor-pointer hover:opacity-80"
            >
              {aiLoading ? "AI取得中..." : "🤖 AIで自動入力"}
            </button>

            <input className="w-full border p-2 rounded"
              placeholder="画像URL"
              value={form.image}
              onChange={(e)=>setForm({...form,image:e.target.value})}
            />

            <input type="file"
              onChange={(e)=>setFile(e.target.files?.[0]||null)}
            />

            {(file || form.image) && (
              <img
                src={file ? URL.createObjectURL(file) : form.image}
                className="w-40 h-40 object-cover rounded"
              />
            )}

            <input className="w-full border p-2 rounded"
              placeholder="カテゴリ"
              value={form.category}
              onChange={(e)=>setForm({...form,category:e.target.value})}
            />

            <textarea className="w-full border p-2 rounded"
              placeholder="プロフィール"
              value={form.bio}
              onChange={(e)=>setForm({...form,bio:e.target.value})}
            />

            <input className="w-full border p-2 rounded"
              placeholder="年齢"
              value={form.age}
              onChange={(e)=>setForm({...form,age:e.target.value})}
            />

            <input className="w-full border p-2 rounded"
              placeholder="身長"
              value={form.height}
              onChange={(e)=>setForm({...form,height:e.target.value})}
            />

            <input className="w-full border p-2 rounded"
              placeholder="カップ"
              value={form.cup}
              onChange={(e)=>setForm({...form,cup:e.target.value})}
            />

            <textarea
              className="w-full border p-2 rounded"
              placeholder="経歴"
              value={form.career}
              onChange={(e)=>setForm({...form,career:e.target.value})}
            />

            <input
              className="w-full border p-2 rounded"
              placeholder="サイズ（B/W/H）"
              value={form.size}
              onChange={(e)=>setForm({...form,size:e.target.value})}
            />

            <input
              className="w-full border p-2 rounded"
              placeholder="出身地"
              value={form.birthplace}
              onChange={(e)=>setForm({...form,birthplace:e.target.value})}
            />

            <input
              className="w-full border p-2 rounded"
              placeholder="ジャンル"
              value={form.genre}
              onChange={(e)=>setForm({...form,genre:e.target.value})}
            />

            <input
              className="w-full border p-2 rounded"
              placeholder="キャッチコピー"
              value={form.catch}
              onChange={(e)=>setForm({...form,catch:e.target.value})}
            />

            {/* タグ */}
            <div className="flex flex-wrap gap-2">
              {TAG_OPTIONS.map(tag=>(
                <button
                  key={tag}
                  onClick={()=>toggleTag(tag)}
                  className={`cursor-pointer px-3 py-1 rounded-full transition ${
                    isSelected(tag)
                      ? "bg-pink-500 text-white"
                      : "bg-gray-200 hover:bg-gray-300"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>

            <button
              onClick={saveIdol}
              className="w-full bg-blue-500 text-white py-2 rounded cursor-pointer hover:opacity-80"
            >
              {editingId ? "更新する" : "追加する"}
            </button>

            <button
              onClick={resetForm}
              className="w-full bg-gray-300 py-2 rounded cursor-pointer hover:opacity-80"
            >
              キャンセル
            </button>

          </div>

          <h2 className="font-bold mt-6 mb-2">提案（改善案）</h2>

      <div className="space-y-2 mb-6">
        {proposals.map((item) => (
          <div key={item.id} className="border p-3 rounded-xl">
            <div className="text-sm text-gray-500 mb-1">
              対象：{item.idolId}
            </div>

            <div className="text-sm mb-2">
              {item.content}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => approveProposal(item)}
                className="text-green-500 cursor-pointer hover:opacity-70"
              >
                承認
              </button>

              <button
                onClick={() => rejectProposal(item.id)}
                className="text-red-500 cursor-pointer hover:opacity-70"
              >
                却下
              </button>
            </div>
          </div>
        ))}
      </div>
      <h2 className="font-bold mt-6 mb-2">コメント管理</h2>

      <div className="space-y-2 mb-6">
        {comments.map((item) => (
          <div key={item.id} className="border p-3 rounded-xl">
            <div className="text-xs text-gray-400 mb-1">
              {item.idolId}
            </div>

            <div className="text-sm mb-2">
              {item.text}
            </div>

            <button
              onClick={() => deleteComment(item.id)}
              className="text-red-500 cursor-pointer hover:opacity-70"
            >
              削除
            </button>
          </div>
        ))}
      </div>
    </div>

        

        {/* 右 */}
        <div className="w-1/2 h-[80vh] overflow-y-auto">
          <h2 className="font-bold mb-2">登録済み</h2>

          {idols.map(idol=>(
            <div key={idol.id} className="border p-2 mb-2 rounded flex justify-between items-center hover:bg-gray-50">
              <div className="flex items-center gap-2">
                {idol.image && (
                  <img src={idol.image} className="w-10 h-10 object-cover rounded" />
                )}
                {idol.name}
              </div>

              <div>
                <button onClick={()=>loadIdol(idol)} className="ml-2 text-blue-500 cursor-pointer hover:opacity-70">編集</button>
                <button onClick={()=>deleteIdol(idol.id)} className="ml-2 text-red-500 cursor-pointer hover:opacity-70">削除</button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}