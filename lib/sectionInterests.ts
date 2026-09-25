import { prisma } from "./db";

const POOL_CATEGORY_QUERIES: Record<string, () => Promise<{ category: string }[]>> = {
  know: () => prisma.newsItem.findMany({ select: { category: true } }),
  play: () => prisma.crosswordTheme.findMany({ select: { category: true } }),
  look: () => prisma.artwork.findMany({ select: { category: true } }),
  read: () => prisma.literaryItem.findMany({ select: { category: true } }),
  wander: () => prisma.travelItem.findMany({ select: { category: true } }),
  readnext: () => prisma.book.findMany({ select: { category: true } }),
  wonder: () => prisma.wonder.findMany({ select: { category: true } }),
  do: () => prisma.dailyTask.findMany({ select: { category: true } }),
};

/** For each section key with a content pool, the distinct categories
 * present in it — the basis for deciding default section visibility once a
 * visitor has chosen interests (see computeDefaultHidden). */
export async function getSectionCategories(): Promise<Record<string, Set<string>>> {
  const entries = await Promise.all(
    Object.entries(POOL_CATEGORY_QUERIES).map(async ([key, query]) => {
      const rows = await query();
      return [key, new Set(rows.map((r) => r.category).filter(Boolean))] as const;
    })
  );
  return Object.fromEntries(entries);
}

/**
 * Default section visibility once a visitor has chosen interests: a section
 * whose pool shares zero categories with the chosen interests is hidden by
 * default (still visible any time via Customize — this only sets the
 * starting point). A section with no pool data (or an unrecognized key) is
 * never auto-hidden. If the overlap is so narrow it would hide more than
 * half the enabled sections, skip auto-hiding entirely rather than leave a
 * near-empty edition.
 */
export function computeDefaultHidden(
  sectionKeys: string[],
  categoriesByKey: Record<string, Set<string>>,
  chosenInterests: string[]
): string[] {
  if (chosenInterests.length === 0) return [];
  const interestSet = new Set(chosenInterests);
  const noMatch = sectionKeys.filter((key) => {
    const categories = categoriesByKey[key];
    if (!categories || categories.size === 0) return false;
    return ![...categories].some((c) => interestSet.has(c));
  });
  if (noMatch.length > sectionKeys.length / 2) return [];
  return noMatch;
}
