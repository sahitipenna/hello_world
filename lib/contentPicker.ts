import { pickWeightedIndex, pickWeightedIndices } from "./personalize";

interface Schedulable {
  scheduledDate: string | null;
  category?: string;
}

/**
 * The hybrid selection model (see ARCHITECTURE.md §2): a row scheduled for
 * this exact date wins outright (real editorial control); otherwise pick
 * deterministically from the unscheduled pool, weighted by interest
 * category, so every date still resolves to something without an editor
 * having hand-curated it.
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
  const idx = pickWeightedIndex(categories, dateISO, salt, weights);
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
