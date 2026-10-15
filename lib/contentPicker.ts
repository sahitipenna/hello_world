import { pickWeightedIndexNoRepeat, pickWeightedIndices } from "./personalize";

interface Schedulable {
  scheduledDate: string | null;
  category?: string;
}

// How many preceding days' picks a pool should try to avoid repeating —
// capped at 6 (a trailing week) and, inside pickWeightedIndexNoRepeat,
// clamped again so a pool never excludes itself down to zero candidates.
// A big pool (books, crossword themes, ...) is in no real danger of
// repeating within a week regardless; this mainly matters for the
// smallest pools (the "on the side" objects, 8-9 items each), where a
// plain random pick repeats within 6 days close to even odds.
const MAX_AVOID_DAYS = 6;

/**
 * The hybrid selection model (see ARCHITECTURE.md §2): a row scheduled for
 * this exact date wins outright (real editorial control); otherwise pick
 * deterministically from the unscheduled pool, weighted by interest
 * category — and steered away from whatever the same pool would have
 * picked on each of the last few days, so every date still resolves to
 * something without an editor having hand-curated it, and a small pool
 * doesn't noticeably repeat itself within a week.
 */
export function resolveOneForDate<T extends Schedulable>(
  items: T[],
  dateISO: string,
  salt: string,
  weights: Record<string, number> = {}
): T | null {
  const scheduled = items.find((i) => i.scheduledDate === dateISO);
  if (scheduled) return scheduled;

  const pool = items.filter((i) => !i.scheduledDate);
  if (pool.length === 0) return null;

  const categories = pool.map((i) => i.category ?? "");
  const idx = pickWeightedIndexNoRepeat(categories, dateISO, salt, weights, MAX_AVOID_DAYS);
  return pool[idx];
}

/** Same idea, but returns `count` distinct items (e.g. KNOW's five stories). */
export function resolveManyForDate<T extends Schedulable>(
  items: T[],
  dateISO: string,
  salt: string,
  count: number,
  weights: Record<string, number> = {}
): T[] {
  const scheduled = items.filter((i) => i.scheduledDate === dateISO).slice(0, count);
  if (scheduled.length >= count) return scheduled;

  const pool = items.filter((i) => !i.scheduledDate);
  const needed = count - scheduled.length;
  if (pool.length === 0 || needed <= 0) return scheduled;

  const categories = pool.map((i) => i.category ?? "");
  const indices = pickWeightedIndices(categories, dateISO, salt, weights, needed);
  return [...scheduled, ...indices.map((i) => pool[i])];
}
