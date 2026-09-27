import { prisma } from "./db";

export const INTEREST_WEIGHT_SELECTED = 3;

// Caps how much checking off DO tasks can nudge selection — bounded so
// behavior can meaningfully tilt an edition over time without ever
// swamping a visitor's own chosen interests. 0.5/check, capped at +3
// (reached at 6 check-offs in one category) — roughly the same size as
// INTEREST_WEIGHT_SELECTED itself.
const ENGAGEMENT_WEIGHT_PER_SCORE = 0.5;
const ENGAGEMENT_WEIGHT_CAP = 3;

/**
 * Weights every content picker uses to favor a visitor's interests (see
 * lib/personalize.ts). Two blended sources, both additive on top of the
 * uniform default of 1: interests chosen at onboarding (fixed weight), and
 * an adaptive signal from actually checking off DO tasks (grows with use,
 * capped) — so the edition can drift toward what a visitor demonstrably
 * engages with, not just what they said they liked once at signup.
 */
export async function getUserWeights(userId: string): Promise<Record<string, number>> {
  const [interestRows, engagementRows] = await Promise.all([
    prisma.userInterest.findMany({ where: { userId }, include: { tag: true } }),
    prisma.categoryEngagement.findMany({ where: { userId } }),
  ]);

  const weights: Record<string, number> = {};
  interestRows.forEach((r) => {
    weights[r.tag.slug] = r.weight;
  });
  engagementRows.forEach((e) => {
    const boost = Math.min(e.score * ENGAGEMENT_WEIGHT_PER_SCORE, ENGAGEMENT_WEIGHT_CAP);
    weights[e.category] = (weights[e.category] ?? 1) + boost;
  });
  return weights;
}
