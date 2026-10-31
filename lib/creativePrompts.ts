import { dayOfYear, parseISODate } from "./dateUtils";

/** The opening gesture, not a closing one — shown before the desk itself,
 * on the same daily-once popup that already asks about interests (see
 * app/page.tsx's two-step OnboardingModal flow). "To be productive, you
 * have to be a little unproductive first" is the whole thesis; these are
 * intentionally small, two-minute, text-only prompts — no sketch canvas
 * yet, that's real engineering a v1 doesn't need to test whether the
 * habit forms at all. Rotates deterministically by day of year so every
 * visitor sees the same one on a given day. */
export const CREATIVE_PROMPTS: string[] = [
  "One sentence — what caught your attention today?",
  "Finish this: Today, I want to notice…",
  "One sentence — what's something you're curious about right now?",
  "One sentence — what's something you're looking forward to today?",
  "Describe one small thing near you, right now, in a single sentence.",
];

export function creativePromptForDate(dateISO: string): string {
  const idx = dayOfYear(parseISODate(dateISO)) % CREATIVE_PROMPTS.length;
  return CREATIVE_PROMPTS[idx];
}
