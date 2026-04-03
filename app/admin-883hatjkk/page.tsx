"use client";

import { useEffect, useState } from "react";
import { 
  collection, getDocs, deleteDoc, doc, setDoc, serverTimestamp 
} from "firebase/firestore";
import { db, uploadImage } from "../../firebase";
import { 
  ShieldCheck, Image as ImageIcon, Trash2, Sparkles, 
  Edit3, Clock, Search, History, ImageIcon as ImageIconLucide
} from "lucide-react";

const TAG_OPTIONS = [
  "清楚","童顔","巨乳","セクシー","ギャル","ナチュラル","お姉さん","ロリ系",
  "スレンダー","くびれ","美脚","高身長","低身長","グラマラス",
  "クール","可愛い系","大人系","癒し系","透明感","コスプレ"
];

export default function AdminPage() {
  const [idols, setIdols] = useState<any[]>([]);
  const [pending, setPending] = useState<any[]>([]);
  const [isAuth, setIsAuth] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [customTag, setCustomTag] = useState(""); // 🌟自由入力用

  const [form, setForm] = useState({
    name: "", image: "", category: "", bio: "", career: "",
    age: "", height: "", cup: "", size: "", birthplace: "",
    genre: "", catch: "", tags: "",
  });

  const fetchData = async () => {
    try {
      const pSnap = await getDocs(collection(db, "pending_idols"));
      setPending(pSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      const iSnap = await getDocs(collection(db, "idols"));
      setIdols(iSnap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (e) { console.error(e); }
  };

  useEffect(() => {
    const password = prompt("管理者パスワード");
    if (password === "naog2ih214do122ijoihga11") { setIsAuth(true); fetchData(); }
  }, []);

  const autoFill = async () => {
    if (!form.name) return alert("名前を入力してください");
    setAiLoading(true);
    try {
      const res = await fetch("/api/ai", { method: "POST", body: JSON.stringify({ name: form.name }) });
      const data = await res.json();
      setForm(prev => ({ ...prev, ...data }));
    } catch { alert("AI取得失敗"); } finally { setAiLoading(false); }
  };

  const saveIdol = async () => {
    if (!form.name) return alert("名前は必須です");
    let imageUrl = form.image;
    if (file) imageUrl = await uploadImage(file);
    const data = {
      ...form,
      image: imageUrl,
      // 保存時にカンマ区切りを配列に変換
      tags: form.tags ? form.tags.split(",").map(t=>t.trim()).filter(t => t !== "") : [],
      updatedAt: serverTimestamp(),
    };
    await setDoc(doc(db, "idols", form.name.trim()), data, { merge: true });
    alert("反映完了🔥");
    resetForm(); fetchData();
  };

  const approve = async (item: any) => {
    const finalName = (form.name || item.name).trim();
    let imageUrl = form.image || item.imageUrl;
    if (file) imageUrl = await uploadImage(file);
    await setDoc(doc(db, "idols", finalName), {
      ...form,
      name: finalName,
      image: imageUrl,
      tags: form.tags ? form.tags.split(",").map(t=>t.trim()).filter(t => t !== "") : [],
    }, { merge: true });
    await deleteDoc(doc(db, "pending_idols", item.id));
    alert("承認しました🔥");
    resetForm(); fetchData();
  };

  const resetForm = () => {
    setForm({ name: "", image: "", category: "", bio: "", career: "", age: "", height: "", cup: "", size: "", birthplace: "", genre: "", catch: "", tags: "" });
    setFile(null); setEditingId(null); setCustomTag("");
  };

  // 🌟自由入力タグを追加する関数
  const addCustomTag = () => {
    if (!customTag.trim()) return;
    const current = form.tags ? form.tags.split(",").map(t=>t.trim()).filter(t=>t!=="") : [];
    if (!current.includes(customTag.trim())) {
      const newTags = [...current, customTag.trim()];
      setForm({ ...form, tags: newTags.join(",") });
    }
    setCustomTag("");
  };

  const toggleTag = (tag: string) => {
    const current = form.tags ? form.tags.split(",").map(t=>t.trim()).filter(t=>t!=="") : [];
    const newTags = current.includes(tag) ? current.filter(t=>t!==tag) : [...current, tag];
    setForm({ ...form, tags: newTags.join(",") });
  };

  if (!isAuth) return <div className="p-20 text-center font-black text-slate-300">AUTH REQUIRED</div>;

  return (
    <div className="h-screen bg-slate-50 flex flex-col overflow-hidden font-sans">
      <header className="bg-slate-900 text-white p-4 px-8 flex justify-between items-center z-10 shadow-xl">
        <div className="flex items-center gap-3">
          <ShieldCheck className="text-pink-500" />
          <h1 className="font-black italic uppercase text-xl tracking-tighter text-white">Proto Admin</h1>
        </div>
        <button onClick={fetchData} className="text-slate-400 hover:text-white transition-colors"><History size={20}/></button>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Left: Pending */}
        <aside className="w-80 bg-white border-r overflow-y-auto p-4 space-y-4">
          <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><Clock size={14}/> Pending ({pending.length})</h2>
          {pending.map(item => (
            <div key={item.id} className="bg-slate-50 border border-slate-100 p-3 rounded-2xl">
              <img src={item.imageUrl} className="w-full aspect-square object-cover rounded-xl mb-2 shadow-sm" />
              <div className="font-black text-xs truncate mb-2 text-slate-900">{item.name}</div>
              <div className="flex gap-1">
                <button onClick={() => setForm({ ...form, name: item.name, image: item.imageUrl })} className="flex-1 bg-white border border-slate-200 text-[10px] font-bold py-2 rounded-lg hover:bg-slate-100 text-slate-900">EDIT</button>
                <button onClick={() => approve(item)} className="flex-1 bg-green-500 text-white text-[10px] font-bold py-2 rounded-lg hover:bg-green-600">APP</button>
                <button onClick={() => deleteDoc(doc(db,"pending_idols",item.id)).then(fetchData)} className="p-2 text-red-400 hover:bg-red-50 rounded-lg"><Trash2 size={14}/></button>
              </div>
            </div>
          ))}
        </aside>

        {/* Center: Form */}
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-8 space-y-6">
              <div className="flex gap-8">
                <div className="w-40 aspect-[3/4] bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200 relative overflow-hidden flex items-center justify-center group">
                  {(file || form.image) ? <img src={file ? URL.createObjectURL(file) : form.image} className="w-full h-full object-cover" /> : <ImageIcon className="text-slate-200" size={32} />}
                  <input type="file" onChange={e => setFile(e.target.files?.[0] || null)} className="absolute inset-0 opacity-0 cursor-pointer" />
                </div>
                <div className="flex-1 space-y-4">
                  <input value={form.name} onChange={e=>setForm({...form, name: e.target.value})} className="w-full bg-slate-50 border-none rounded-2xl p-4 font-black text-lg uppercase italic focus:ring-2 focus:ring-pink-500 text-slate-900" placeholder="NAME" />
                  <button onClick={autoFill} disabled={aiLoading} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-xs flex items-center justify-center gap-2 hover:bg-pink-500 transition-all shadow-lg shadow-slate-900/20">
                    {aiLoading ? "AI ANALYZING..." : <><Sparkles size={16} /> AI SEO Auto Fill</>}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                {["age", "height", "cup", "category", "birthplace", "genre", "size"].map(k => (
                  <div key={k}>
                    <label className="text-[9px] font-black uppercase text-slate-400 ml-1">{k}</label>
                    <input value={(form as any)[k]} onChange={e=>setForm({...form, [k]: e.target.value})} className="w-full bg-slate-50 border-none rounded-xl p-3 text-sm font-bold focus:ring-2 focus:ring-pink-500 text-slate-900" />
                  </div>
                ))}
              </div>

              <div>
                <label className="text-[9px] font-black uppercase text-slate-400 ml-1">Catchphrase</label>
                <input value={form.catch} onChange={e=>setForm({...form, catch: e.target.value})} className="w-full bg-slate-50 border-none rounded-xl p-3 text-sm font-bold text-slate-900" placeholder="印象的なキャッチコピー" />
              </div>

              <div>
                <label className="text-[9px] font-black uppercase text-slate-400 ml-1">SEO Career (Long Form)</label>
                <textarea value={form.career} onChange={e=>setForm({...form, career: e.target.value})} className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-medium text-slate-900 leading-relaxed min-h-[180px] focus:ring-2 focus:ring-pink-500" placeholder="経歴が300文字程度で入力されます。" />
              </div>

              {/* 🌟 タグ管理エリア */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <label className="text-[9px] font-black uppercase text-slate-400 ml-1 flex items-center gap-2">
                  <Sparkles size={12} className="text-pink-500" /> Tags Management
                </label>
                
                <div className="flex gap-2">
                  <input 
                    value={customTag}
                    onChange={e => setCustomTag(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addCustomTag())}
                    placeholder="新しいタグを入力してEnter"
                    className="flex-1 bg-slate-50 border-none rounded-xl p-3 text-sm font-bold focus:ring-2 focus:ring-pink-500 text-slate-900"
                  />
                  <button onClick={addCustomTag} className="bg-slate-900 text-white px-6 rounded-xl font-black text-[10px] uppercase hover:bg-pink-500 transition-all">Add</button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {TAG_OPTIONS.map(tag => (
                    <button 
                      key={tag} 
                      onClick={() => toggleTag(tag)} 
                      className={`px-3 py-1.5 rounded-full text-[10px] font-black transition-all ${form.tags?.split(",").map(t=>t.trim()).includes(tag) ? "bg-pink-500 text-white shadow-md shadow-pink-500/20" : "bg-slate-100 text-slate-400 hover:bg-slate-200"}`}
                    >
                      #{tag}
                    </button>
                  ))}
                </div>
                
                {/* 🌟 現在のタグ（文字列）のプレビュー：スプレッドシートへのコピペ用 */}
                <div className="p-3 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                   <p className="text-[8px] font-black text-slate-400 uppercase mb-1">Raw Tags (For Spreadsheet)</p>
                   <p className="text-[10px] font-mono text-slate-600 truncate">{form.tags || "no tags"}</p>
                </div>
              </div>

              <button onClick={saveIdol} className="w-full py-6 bg-slate-900 text-white rounded-[2rem] font-black uppercase italic tracking-widest hover:bg-pink-500 transition-all shadow-xl">
                {editingId ? "Update Database" : "Add to Database"}
              </button>
            </div>
          </div>
        </main>

        {/* Right: Master List */}
        <aside className="w-80 bg-white border-l flex flex-col">
          <div className="p-4 border-b border-slate-100">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
              <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Search Database..." className="w-full bg-slate-50 border-none rounded-xl py-2 pl-9 text-xs font-bold text-slate-900" />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {idols.filter(i => (i.name || "").toLowerCase().includes(searchTerm.toLowerCase())).map(idol => (
              <div key={idol.id} className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-xl group transition-colors">
                <div className="flex items-center gap-3">
                  <img src={idol.image} className="w-8 h-8 rounded-lg object-cover shadow-sm" />
                  <div className="text-[11px] font-black uppercase italic truncate w-32 text-slate-900">{idol.name}</div>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => { 
                    setEditingId(idol.id); 
                    setForm({ ...idol, tags: Array.isArray(idol.tags) ? idol.tags.join(",") : (idol.tags || "") }); 
                  }} className="p-1 text-slate-400 hover:text-slate-900"><Edit3 size={14}/></button>
                  <button onClick={() => { if(confirm("本当に削除しますか？")) deleteDoc(doc(db,"idols",idol.id)).then(fetchData); }} className="p-1 text-slate-400 hover:text-red-500"><Trash2 size={14}/></button>
                </div>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}