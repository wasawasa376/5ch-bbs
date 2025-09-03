// 超シンプルな in-memory 制限（ローカル用）
// 同一 UA + エンドポイントごとに間隔を空ける
const lastHit = new Map<string, number>();

export function rateLimit(key: string, ms: number) {
  const now = Date.now();
  const last = lastHit.get(key) || 0;
  const diff = now - last;
  if (diff < ms) {
    return { ok: false, retryAfterMs: ms - diff };
  }
  lastHit.set(key, now);
  return { ok: true };
}
