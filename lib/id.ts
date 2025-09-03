import crypto from "crypto";

// 匿名ID（スレ単位）: IP/UA はハッシュ化して扱う想定（ローカルは UA のみ）
export function makeAnonId(opts: { ua: string; threadId: number; salt?: string }) {
  const salt = opts.salt || process.env.ID_SALT || "local-salt";
  const raw = `${opts.ua}::${opts.threadId}::${salt}`;
  const hash = crypto.createHash("sha256").update(raw).digest("base64url");
  return hash.slice(0, 10); // 10桁程度
}

// トリップ: 名前欄に `name#secret` と入れたときのハッシュ表記
export function parseNameAndTrip(input?: string | null) {
  if (!input) return { name: "名無しさん", trip: null };
  if (!input.includes("#")) return { name: input || "名無しさん", trip: null };
  const [name, secret] = input.split("#");
  const trip = crypto.createHash("sha1").update(secret).digest("base64url").slice(0, 8);
  return { name: name || "名無しさん", trip: `◆${trip}` };
}
