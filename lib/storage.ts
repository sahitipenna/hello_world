"use client";

const PLAN_KEY = "daybook:plan";
const SECTIONS_KEY = "daybook:sections";
const TODO_KEY_PREFIX = "daybook:todos:";

export type Plan = "free" | "premium";

export function getPlan(): Plan {
  if (typeof window === "undefined") return "free";
  try {
    return (localStorage.getItem(PLAN_KEY) as Plan) || "free";
  } catch {
    return "free";
  }
}

export function setPlan(plan: Plan) {
  try {
    localStorage.setItem(PLAN_KEY, plan);
  } catch {
    // ignore write failures (private browsing, storage disabled, etc.)
  }
}

export function getSectionPrefs(defaultOrder: string[]): { order: string[]; hidden: string[] } {
  if (typeof window === "undefined") return { order: defaultOrder, hidden: [] };
  try {
    const raw = localStorage.getItem(SECTIONS_KEY);
    if (!raw) return { order: defaultOrder, hidden: [] };
    const parsed = JSON.parse(raw);
    return { order: parsed.order ?? defaultOrder, hidden: parsed.hidden ?? [] };
  } catch {
    return { order: defaultOrder, hidden: [] };
  }
}

export function setSectionPrefs(prefs: { order: string[]; hidden: string[] }) {
  try {
    localStorage.setItem(SECTIONS_KEY, JSON.stringify(prefs));
  } catch {
    // ignore
  }
}

export function getTodoChecks(dateISO: string): Record<number, boolean> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(TODO_KEY_PREFIX + dateISO);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function setTodoChecks(dateISO: string, checks: Record<number, boolean>) {
  try {
    localStorage.setItem(TODO_KEY_PREFIX + dateISO, JSON.stringify(checks));
  } catch {
    // ignore
  }
}
