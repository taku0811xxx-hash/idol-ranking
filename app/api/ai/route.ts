import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req: NextRequest) {
  try {
    const { name } = await req.json();
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `
          あなたは芸能専門のSEOライターです。日本のグラビアアイドルについて、検索エンジンに評価される詳細なプロフィールを作成してください。

          【執筆ルール】
          1. 実在する人物の情報のみを扱い、不明な点は空文字にしてください。
          2. 「career（経歴）」はSEOを意識し、デビューのきっかけ、代表作、近年の活躍を含め、300文字程度の自然な長文で記述してください。
          3. 「catch（キャッチコピー）」は、その人物の魅力を一言で表す印象的なフレーズにしてください。
          4. JSON形式のみで回答し、余計な解説は一切含めないでください。
          `,
        },
        {
          role: "user",
          content: `人物名: ${name} (グラビアアイドル)
          
          以下のキーを持つJSONを出力してください：
          {
            "category": "タレント区分（例：グラビアアイドル、タレント）",
            "bio": "SNS向けの短い紹介（20文字程度）",
            "age": "数値のみ",
            "height": "数値のみ",
            "cup": "アルファベット1文字",
            "career": "【重要】SEOに強い詳細な経歴（300文字以上）",
            "size": "B/W/Hの数値",
            "birthplace": "都道府県",
            "genre": "活動ジャンル（例：雑誌、イメージビデオ、SNS）",
            "catch": "魅力的なキャッチコピー"
          }`,
        },
      ],
      response_format: { type: "json_object" },
      temperature: 0.3, // 少しだけ表現の幅を持たせつつ、嘘を防ぐ設定
    });

    return NextResponse.json(JSON.parse(response.choices[0].message.content || "{}"));
  } catch (e) {
    console.error("🔥 AI ERROR:", e);
    return NextResponse.json({ error: "AI失敗" }, { status: 500 });
  }
}