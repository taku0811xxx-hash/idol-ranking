import admin from "firebase-admin";
import fs from "fs";

// 🔑 サービスアカウントキー読み込み
const serviceAccount = JSON.parse(
  fs.readFileSync("./serviceAccountKey.json", "utf8")
);

// 🔥 初期化
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

// JSON読み込み
const data = JSON.parse(fs.readFileSync("./data.json", "utf8"));

const importData = async () => {
  for (const item of data) {
    await db.collection("idols").doc(item.id).set({
      ...item,
      votes: 0,
      createdAt: new Date(),
    });

    console.log(`追加 or 更新: ${item.name}`);
  }

  console.log("🔥 完了！！！");
};

importData();