import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req: NextRequest) {
  try {
    const { name } = await req.json();

    console.log("名前:", name);
    console.log("API KEY:", process.env.OPENAI_API_KEY);

    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const response = await client.chat.completions.create({
  model: "gpt-4.1-mini",
  messages: [
    {
      role: "system",
      content: `
      あなたは有能な記者です。

      以下の人物について情報をまとめてください。

      名前: ${name} グラビアアイドル

      実在する人物として扱い、情報は徹底的に調べ、事実を記載してください
      情報は出てくるまで調べてください

JSONのみで返してください：

{
  "category": "",
  "bio": "20文字で詳しく",
  "age": "",
  "height": "",
  "cup": ""
}
`,
    },
  ],
});

    const text = response.choices[0].message.content || "{}";

    console.log("AI返答:", text);

    const cleaned = text.replace(/```json|```/g, "");

    return NextResponse.json(JSON.parse(cleaned));

  } catch (e) {
    console.error("🔥 AI ERROR:", e);
    return NextResponse.json({ error: "AI失敗" }, { status: 500 });
  }
}