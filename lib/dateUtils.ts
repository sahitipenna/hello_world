export function dayOfYear(date: Date): number {
  const start = Date.UTC(date.getUTCFullYear(), 0, 1);
  const now = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
  return Math.floor((now - start) / 86400000) + 1;
}

export function toISODate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function parseISODate(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}

/** ISO-8601 week key like "2026-W39" — stable Monday-to-Sunday, for weekly (not daily) content. */
export function getISOWeekKey(date: Date): string {
  const d = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  const dayNum = d.getUTCDay() || 7; // Monday=1 ... Sunday=7
  d.setUTCDate(d.getUTCDate() + 4 - dayNum); // move to the Thursday of this week
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNum = Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  return `${d.getUTCFullYear()}-W${String(weekNum).padStart(2, "0")}`;
}

/** Deterministic 32-bit hash of a string (FNV-1a). */
export function hashString(str: string): number {
  let hash = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

/** Mulberry32 seeded PRNG -> returns a function producing floats in [0, 1). */
export function seededRandom(seed: number): () => number {
  let a = seed;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Pick a deterministic index into a bank of given length for a date + salt (section name). */
export function pickIndex(iso: string, salt: string, length: number): number {
  if (length <= 0) return 0;
  const seed = hashString(`${iso}:${salt}`);
  const rand = seededRandom(seed);
  return Math.floor(rand() * length);
}

/** Pick `count` distinct deterministic indices into a bank of given length. */
export function pickIndices(iso: string, salt: string, length: number, count: number): number[] {
  const seed = hashString(`${iso}:${salt}`);
  const rand = seededRandom(seed);
  const pool = Array.from({ length }, (_, i) => i);
  const picked: number[] = [];
  const n = Math.min(count, length);
  for (let i = 0; i < n; i++) {
    const idx = Math.floor(rand() * pool.length);
    picked.push(pool[idx]);
    pool.splice(idx, 1);
  }
  return picked;
}
