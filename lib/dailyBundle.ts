import type { Section } from "@prisma/client";
import { prisma } from "./db";
import { dayOfYear, parseISODate, getISOWeekKey, hashString } from "./dateUtils";
import { resolveOneForDate, resolveManyForDate } from "./contentPicker";
import { generateBestCrossword } from "./crosswordGen";
import { EditionContent, NewsItemT } from "./types";

export interface ResolvedSection {
  meta: Section;
  content: EditionContent;
}

export interface ResolvedEdition {
  dateISO: string;
  dayOfYear: number;
  weekKey: string;
  sections: ResolvedSection[];
}

/**
 * Builds one day's edition by reading the enabled `Section` rows (order,
 * pricing, config — see ARCHITECTURE.md §2) and, for each one, resolving its
 * content from that section's database pool via the hybrid selection model
 * in lib/contentPicker.ts. `weights` is a map of interest-tag slug -> weight;
 * an empty map behaves like a uniform pick, so a first-time visitor with no
 * chosen interests still gets a fully valid, varied edition.
 */
export async function buildEdition(
  dateISO: string,
  weights: Record<string, number> = {}
): Promise<ResolvedEdition> {
  const date = parseISODate(dateISO);
  const doy = dayOfYear(date);
  const weekKey = getISOWeekKey(date);

  const sections = await prisma.section.findMany({ where: { enabled: true }, orderBy: { order: "asc" } });
  const resolved = await Promise.all(
    sections.map(async (meta) => ({ meta, content: await resolveContent(meta.key, dateISO, weights) }))
  );

  return { dateISO, dayOfYear: doy, weekKey, sections: resolved };
}

async function resolveContent(
  key: string,
  dateISO: string,
  weights: Record<string, number>
): Promise<EditionContent> {
  switch (key) {
    case "know": {
      const pool = await prisma.newsItem.findMany();
      const items = resolveManyForDate(pool, dateISO, "know", 5, weights);
      return { kind: "know", items: items.map(toNewsItemT), totalCount: items.length };
    }
    case "play": {
      const themes = await prisma.crosswordTheme.findMany();
      const schedulable = themes.map((t) => ({ ...t, scheduledDate: null as string | null }));
      const theme = resolveOneForDate(schedulable, dateISO, "play", weights);
      if (!theme) return null;
      const words = theme.words as unknown as { word: string; clue: string }[];
      const puzzle = generateBestCrossword(
        `${theme.id}-${dateISO}`,
        theme.title,
        words,
        hashString(`${dateISO}:crossword`)
      );
      return { kind: "play", puzzle };
    }
    case "look": {
      const pool = await prisma.artwork.findMany();
      const artwork = resolveOneForDate(pool, dateISO, "look", weights);
      if (!artwork) return null;
      return {
        kind: "look",
        query: artwork.metQuery || artwork.title,
        analysis: artwork.description,
        custom: artwork.image
          ? {
              image: artwork.image,
              title: artwork.title,
              artist: artwork.artist,
              year: artwork.year,
              medium: artwork.medium,
              museum: artwork.museum,
              sourceUrl: artwork.sourceUrl,
            }
          : null,
      };
    }
    case "read": {
      const pool = await prisma.literaryItem.findMany();
      const item = resolveOneForDate(pool, dateISO, "read", weights);
      if (!item) return null;
      return {
        kind: "read",
        poem: {
          title: item.work,
          poet: item.author,
          lines: item.excerpt.split("\n"),
          category: item.category,
          context: item.context || undefined,
          sourceUrl: item.sourceUrl || undefined,
        },
      };
    }
    case "wander": {
      const pool = await prisma.travelItem.findMany();
      const item = resolveOneForDate(pool, dateISO, "wander", weights);
      if (!item) return null;
      return {
        kind: "wander",
        travel: { title: item.title, place: item.location, body: item.text, category: item.category },
      };
    }
    case "readnext": {
      const pool = await prisma.book.findMany();
      const book = resolveOneForDate(pool, dateISO, "readnext", weights);
      if (!book) return null;
      return {
        kind: "readnext",
        book: { title: book.title, author: book.author, reason: book.whyRead, category: book.category },
      };
    }
    case "wonder": {
      const pool = await prisma.wonder.findMany();
      const wonder = resolveOneForDate(pool, dateISO, "wonder", weights);
      if (!wonder) return null;
      return {
        kind: "wonder",
        wonder: {
          id: wonder.id,
          title: wonder.title,
          body: wonder.body,
          category: wonder.category,
          source: wonder.source,
        },
      };
    }
    case "do": {
      const pool = await prisma.dailyTask.findMany();
      const schedulable = pool.map((t) => ({ ...t, scheduledDate: null as string | null }));
      const tasks = resolveManyForDate(schedulable, dateISO, "do", 5, weights);
      return { kind: "do", tasks: tasks.map((t) => t.title), totalCount: tasks.length };
    }
    default:
      // A section key the app doesn't have a content resolver for yet (an
      // admin re-enabling an older section like "quiz" or "comic"). The
      // card renders nothing rather than crashing; wiring it up for real is
      // a follow-up, not a data problem.
      return null;
  }
}

function toNewsItemT(n: {
  id: string;
  title: string;
  summary: string;
  source: string;
  sourceUrl: string | null;
  category: string;
  readingTimeMin: number;
}): NewsItemT {
  return {
    id: n.id,
    title: n.title,
    summary: n.summary,
    source: n.source,
    sourceUrl: n.sourceUrl,
    category: n.category,
    readingTimeMin: n.readingTimeMin,
  };
}
