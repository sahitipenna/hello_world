import { hashString, seededRandom, shiftISODate, parseISODate } from "./dateUtils";

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

// The day real dated content begins (prisma/migrations/20260924130000_init)
// — the fixed starting point pickWeightedIndexNoRepeat simulates forward
// from. Using the app's own launch date instead of some arbitrary distant
// epoch keeps the simulation short (it only ever has to walk as many days
// as the app has actually been running), not years.
const SIMULATION_EPOCH = "2026-09-24";

/**
 * Same deterministic weighted pick, but excludes whatever was *actually*
 * shown on each of the preceding `avoidDays` days. Exists because a small
 * pool (the "on the side" objects are 8-16 items each) repeats within a
 * week disturbingly often under plain unweighted-by-recency random choice
 * — not a bug, just bad luck a bigger pool wouldn't surface.
 *
 * Still a pure function of (dateISO, salt, weights) — nothing is stored —
 * but getting a self-consistent answer (today's exclusion list has to be
 * what earlier days *actually* resolved to, not an approximation of it)
 * means simulating every day forward from a fixed epoch rather than
 * recursing backward from today: a backward recursion that re-derives each
 * earlier day's "actual" pick from *its own* predecessors runs into either
 * exponential blowup (confirmed by timing an early version: ~250ms for one
 * call) or, once memoized to fix that, a subtler bug — a date looked up
 * from one recursion depth doesn't necessarily match what that date
 * resolves to as its own top-level call, so repeats crept back in anyway
 * (confirmed by a test that still found violations after memoizing).
 * Walking forward instead means every day's value is only ever computed
 * once, in the same order it would actually occur, so "what was shown
 * yesterday" is unambiguous.
 */
export function pickWeightedIndexNoRepeat(
  categories: string[],
  dateISO: string,
  salt: string,
  weights: Record<string, number>,
  avoidDays: number
): number {
  if (categories.length === 0) return 0;
  const clampedAvoidDays = Math.max(0, Math.min(avoidDays, categories.length - 1));

  const totalDays = Math.round((parseISODate(dateISO).getTime() - parseISODate(SIMULATION_EPOCH).getTime()) / 86400000);
  if (totalDays < 0) {
    // A date before the epoch (shouldn't happen — nothing is dated earlier
    // than the app's own launch) — fall back to the plain picker rather
    // than simulating a negative-length history.
    return pickWeightedIndex(categories, dateISO, salt, weights);
  }

  const recent: number[] = []; // most-recent-last, capped at clampedAvoidDays
  let idx = 0;
  for (let day = 0; day <= totalDays; day++) {
    const d = shiftISODate(SIMULATION_EPOCH, day);
    const excluded = new Set(recent);
    const survivingIndices = categories.map((_, i) => i).filter((i) => !excluded.has(i));
    const w = survivingIndices.map((i) => Math.max(weights[categories[i]] ?? 1, 0.0001));
    const total = w.reduce((a, b) => a + b, 0);
    const rand = seededRandom(hashString(`${d}:${salt}:norepeat`));
    let r = rand() * total;
    idx = survivingIndices[survivingIndices.length - 1];
    for (let i = 0; i < w.length; i++) {
      r -= w[i];
      if (r <= 0) {
        idx = survivingIndices[i];
        break;
      }
    }
    recent.push(idx);
    if (recent.length > clampedAvoidDays) recent.shift();
  }
  return idx;
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
