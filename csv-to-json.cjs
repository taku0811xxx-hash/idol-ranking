const fs = require("fs");
const { parse } = require("csv-parse/sync");

// CSV読み込み
const csv = fs.readFileSync("data.csv", "utf-8");

// 正しく解析（←ここが全て）
const records = parse(csv, {
  columns: true,
  skip_empty_lines: true,
});

// 変換
const result = records.map((row) => {
  return {
    ...row,
    tags: row.tags
      ? row.tags.split(",").map((t) => t.trim())
      : [],
  };
});

// 保存
fs.writeFileSync("data.json", JSON.stringify(result, null, 2));

console.log("JSON変換完了");