import { DailyBundle } from "./types";
import { dayOfYear, parseISODate, pickIndex, pickIndices } from "./dateUtils";
import { ART_QUERIES, BOOKS, HISTORY_BITES, POEMS, TODO_POOL, TRAVEL_VIGNETTES, TRIVIA_BITES } from "./contentBank";
import { pickCrosswordTheme } from "./crosswordBanks";
import { generateBestCrossword } from "./crosswordGen";
import { hashString } from "./dateUtils";

function comicArchiveUrl(dateISO: string): string {
  const [y, m, d] = dateISO.split("-");
  // Deep-links to the official GoComics archive for that calendar date.
  // We never host or scrape the strip itself.
  return `https://www.gocomics.com/calvinandhobbes/${y}/${m}/${d}`;
}

export function buildDailyBundle(dateISO: string): DailyBundle {
  const date = parseISODate(dateISO);
  const doy = dayOfYear(date);

  const historyIdx = pickIndices(dateISO, "history", HISTORY_BITES.length, 3).sort((a, b) => a - b);
  const triviaIdx = pickIndex(dateISO, "trivia", TRIVIA_BITES.length);
  const poemIdx = pickIndex(dateISO, "poem", POEMS.length);
  const travelIdx = pickIndex(dateISO, "travel", TRAVEL_VIGNETTES.length);
  const bookIdx = pickIndex(dateISO, "book", BOOKS.length);
  const artIdx = pickIndex(dateISO, "art", ART_QUERIES.length);
  const todoIdx = pickIndices(dateISO, "todos", TODO_POOL.length, 5);

  const theme = pickCrosswordTheme(doy);
  const crossword = generateBestCrossword(
    `${theme.id}-${dateISO}`,
    theme.title,
    theme.words,
    hashString(`${dateISO}:crossword`)
  );

  return {
    dateISO,
    dayOfYear: doy,
    bites: {
      history: historyIdx.map((i) => HISTORY_BITES[i]),
      trivia: TRIVIA_BITES[triviaIdx],
    },
    comic: {
      label: "Calvin and Hobbes",
      url: comicArchiveUrl(dateISO),
    },
    poem: POEMS[poemIdx],
    travel: TRAVEL_VIGNETTES[travelIdx],
    book: BOOKS[bookIdx],
    todos: todoIdx.map((i) => TODO_POOL[i]),
    crossword,
    artQuery: ART_QUERIES[artIdx],
  };
}
