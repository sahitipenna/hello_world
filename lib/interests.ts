import { prisma } from "./db";

export const INTEREST_WEIGHT_SELECTED = 3;

export async function getUserWeights(userId: string): Promise<Record<string, number>> {
  const rows = await prisma.userInterest.findMany({
    where: { userId },
    include: { tag: true },
  });
  const weights: Record<string, number> = {};
  rows.forEach((r) => {
    weights[r.tag.slug] = r.weight;
  });
  return weights;
}
