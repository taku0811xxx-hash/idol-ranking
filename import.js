import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import fs from "fs";

// 🔥 自分のfirebase.jsと同じ内容にする
const firebaseConfig = {
  apiKey: "AIzaSyB6Xb8CPVNhzhHGFOqjLzI_l0BE3-rVcP0",
  authDomain: "gravure-vote.firebaseapp.com",
  projectId: "gravure-vote",
  storageBucket: "gravure-vote.firebasestorage.app",
  messagingSenderId: "248443491334",
  appId: "1:248443491334:web:57260a6f60d85ba7879f87",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// JSON読み込み
const data = JSON.parse(fs.readFileSync("./data.json", "utf8"));

const importData = async () => {
  for (const item of data) {
    const docRef = doc(db, "idols", item.id);

    await setDoc(docRef, {
      ...item,
      votes: 0,
      createdAt: new Date()
    });

    console.log(`追加 or 更新: ${item.name}`);
  }

  console.log("🔥 完了！！！");
};

importData();