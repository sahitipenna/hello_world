import { hashString, seededRandom } from "./dateUtils";

/**
 * Weighted deterministic pick: same (dateISO, salt, weights) always yields
 * the same index, but items whose category matches a user's chosen
 * interests are more likely to come up. With no weights set, every
 * category defaults to weight 1 — identical to a plain uniform pick.
 */
export function pickWeightedIndex(
  categories: string[],
  dateISO: string,
  salt: string,
  weights: Record<string, number>
): number {
  if (categories.length === 0) return 0;
  const w = categories.map((c) => Math.max(weights[c] ?? 1, 0.0001));
  const total = w.reduce((a, b) => a + b, 0);
  const rand = seededRandom(hashString(`${dateISO}:${salt}`));
  let r = rand() * total;
  for (let i = 0; i < w.length; i++) {
    r -= w[i];
    if (r <= 0) return i;
  }
  return w.length - 1;
}

/** Weighted sampling without replacement, for picking several distinct indices. */
export function pickWeightedIndices(
  categories: string[],
  dateISO: string,
  salt: string,
  weights: Record<string, number>,
  count: number
): number[] {
  const pool = categories.map((c, i) => ({ i, w: Math.max(weights[c] ?? 1, 0.0001) }));
  const rand = seededRandom(hashString(`${dateISO}:${salt}`));
  const picked: number[] = [];
  const n = Math.min(count, pool.length);
  for (let k = 0; k < n; k++) {
    const total = pool.reduce((a, b) => a + b.w, 0);
    let r = rand() * total;
    let idx = pool.length - 1;
    for (let j = 0; j < pool.length; j++) {
      r -= pool[j].w;
      if (r <= 0) {
        idx = j;
        break;
      }
    }
    picked.push(pool[idx].i);
    pool.splice(idx, 1);
  }
  return picked;
}
