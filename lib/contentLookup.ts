import { prisma } from "./db";

export const BOOKMARKABLE_TYPES = ["news", "artwork", "literary", "travel", "book", "wonder", "word"] as const;
export type BookmarkableType = (typeof BOOKMARKABLE_TYPES)[number];

export function isBookmarkableType(v: unknown): v is BookmarkableType {
  return typeof v === "string" && (BOOKMARKABLE_TYPES as readonly string[]).includes(v);
}

/** Looks up a single content row's `category` — the same types
 * Bookmark.contentType covers. Shared by the two places a visitor's
 * behavior (not just their onboarding picks) feeds back into
 * personalization: saving something (app/api/bookmarks) and viewing a
 * single-item section's resolved content (app/api/track's "content_view").
 * See lib/interests.ts's getUserWeights for how CategoryEngagement, which
 * this feeds, turns into actual weight. */
export async function resolveContentCategory(contentType: string, contentId: string): Promise<string | null> {
  if (!isBookmarkableType(contentType)) return null;
  switch (contentType) {
    case "news":
      return (await prisma.newsItem.findUnique({ where: { id: contentId }, select: { category: true } }))?.category ?? null;
    case "artwork":
      return (await prisma.artwork.findUnique({ where: { id: contentId }, select: { category: true } }))?.category ?? null;
    case "literary":
      return (await prisma.literaryItem.findUnique({ where: { id: contentId }, select: { category: true } }))?.category ?? null;
    case "travel":
      return (await prisma.travelItem.findUnique({ where: { id: contentId }, select: { category: true } }))?.category ?? null;
    case "book":
      return (await prisma.book.findUnique({ where: { id: contentId }, select: { category: true } }))?.category ?? null;
    case "wonder":
      return (await prisma.wonder.findUnique({ where: { id: contentId }, select: { category: true } }))?.category ?? null;
    case "word":
      return (await prisma.wordOfDay.findUnique({ where: { id: contentId }, select: { category: true } }))?.category ?? null;
  }
}

/** Bumps the same adaptive signal DO-task check-offs already feed (see
 * CategoryEngagement in schema.prisma) — a save or a view counts the same
 * +1 a DO-check does; getUserWeights' per-category cap already keeps any
 * single signal source from dominating, so there's no need for a separate
 * weighting scheme per source. Silently a no-op for a category-less
 * lookup (a deleted or malformed content row). */
export async function bumpCategoryEngagement(userId: string, category: string | null) {
  if (!category) return;
  await prisma.categoryEngagement
    .upsert({
      where: { userId_category: { userId, category } },
      update: { score: { increment: 1 } },
      create: { userId, category, score: 1 },
    })
    .catch(() => {});
}
