import { hashString } from "./dateUtils";

const ACCENT_PALETTE = ["terracotta", "sage", "mustard", "plum", "sky"];

/** Deterministic accent color per section key (client-safe, no DB import),
 * so a section added via /admin still gets a consistent, distinct stripe
 * color without a code change. */
export function accentForKey(key: string): string {
  return ACCENT_PALETTE[hashString(key) % ACCENT_PALETTE.length];
}
