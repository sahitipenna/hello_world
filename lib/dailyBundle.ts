import { DailyBundle } from "./types";
import { dayOfYear, parseISODate, pickIndex, pickIndices, hashString, getISOWeekKey } from "./dateUtils";
import {
  ART_SPOTLIGHT,
  BOOKS,
  COMIC_INSIGHTS,
  POEMS,
  TODO_POOL,
  TRAVEL_VIGNETTES,
  WRITING_PROMPTS,
} from "./contentBank";
import { CROSSWORD_THEMES } from "./crosswordBanks";
import { generateBestCrossword } from "./crosswordGen";
import { pickWeightedIndex } from "./personalize";

function comicArchiveUrl(dateISO: string): string {
  const [y, m, d] = dateISO.split("-");
  // Deep-links to the official GoComics archive for that calendar date.
  // We never host or scrape the strip itself.
  return `https://www.gocomics.com/calvinandhobbes/${y}/${m}/${d}`;
}

/**
 * Builds one day's content. `weights` is a map of interest-tag slug ->
 * weight (higher = more likely); an empty map behaves like a uniform pick,
 * so every day of the year still gets a valid bundle for a first-time
 * visitor who hasn't chosen any interests yet.
 */
export function buildDailyBundle(dateISO: string, weights: Record<string, number> = {}): DailyBundle {
  const date = parseISODate(dateISO);
  const doy = dayOfYear(date);
  const weekKey = getISOWeekKey(date);

  const poemIdx = pickWeightedIndex(POEMS.map((p) => p.category), dateISO, "poem", weights);
  const travelIdx = pickWeightedIndex(TRAVEL_VIGNETTES.map((v) => v.category), dateISO, "travel", weights);
  const bookIdx = pickWeightedIndex(BOOKS.map((b) => b.category), dateISO, "book", weights);
  const artIdx = pickWeightedIndex(ART_SPOTLIGHT.map((a) => a.category), dateISO, "art", weights);
  const comicIdx = pickWeightedIndex(COMIC_INSIGHTS.map((c) => c.category), dateISO, "comic", weights);
  const writingIdx = pickIndex(dateISO, "writing", WRITING_PROMPTS.length);
  // Picked per ISO week (not per day) so "This Week" stays the same all week.
  const todoIdx = pickIndices(weekKey, "todos", TODO_POOL.length, 5);

  const themeIdx = pickWeightedIndex(CROSSWORD_THEMES.map((t) => t.category), dateISO, "crossword", weights);
  const theme = CROSSWORD_THEMES[themeIdx];
  const crossword = generateBestCrossword(
    `${theme.id}-${dateISO}`,
    theme.title,
    theme.words,
    hashString(`${dateISO}:crossword`)
  );

  const art = ART_SPOTLIGHT[artIdx];

  return {
    dateISO,
    dayOfYear: doy,
    weekKey,
    comic: {
      label: "Calvin and Hobbes",
      url: comicArchiveUrl(dateISO),
      insight: COMIC_INSIGHTS[comicIdx],
    },
    poem: POEMS[poemIdx],
    writing: WRITING_PROMPTS[writingIdx],
    travel: TRAVEL_VIGNETTES[travelIdx],
    book: BOOKS[bookIdx],
    todos: todoIdx.map((i) => TODO_POOL[i]),
    crossword,
    artQuery: art.query,
    artAnalysis: art.analysis,
  };
}
