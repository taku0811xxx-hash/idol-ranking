export function generateSEOText(idol: any) {
  const mainText =
    idol.appeal ||
    idol.bio ||
    `${idol.name}は人気の${idol.category || "アイドル"}です。`;

  return `
${idol.name}について

${mainText}

${idol.name}の身長は${idol.height || "不明"}cm、年齢は${idol.age || "非公開"}とされています。
${idol.birthplace ? `出身は${idol.birthplace}です。` : ""}

現在、多くのユーザーから支持されており、ランキングでも注目されています。
`;
}