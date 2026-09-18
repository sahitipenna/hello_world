export type SectionId =
  | "bites"
  | "crossword"
  | "comic"
  | "poem"
  | "art"
  | "travel"
  | "book"
  | "todos";

export interface SectionMeta {
  id: SectionId;
  title: string;
  tagline: string;
  premium: boolean;
}

export interface HistoryBite {
  year: string;
  text: string;
}

export interface TriviaBite {
  question: string;
  answer: string;
}

export interface Poem {
  title: string;
  poet: string;
  year?: string;
  lines: string[];
}

export interface TravelVignette {
  title: string;
  place: string;
  body: string;
}

export interface BookRec {
  title: string;
  author: string;
  reason: string;
}

export interface CrosswordEntry {
  number: number;
  clue: string;
  answer: string;
  row: number;
  col: number;
  dir: "across" | "down";
}

export interface CrosswordPuzzle {
  id: string;
  title: string;
  rows: number;
  cols: number;
  entries: CrosswordEntry[];
}

export interface DailyBundle {
  dateISO: string;
  dayOfYear: number;
  bites: {
    history: HistoryBite[];
    trivia: TriviaBite;
  };
  comic: {
    label: string;
    url: string;
  };
  poem: Poem;
  travel: TravelVignette;
  book: BookRec;
  todos: string[];
  crossword: CrosswordPuzzle;
  artQuery: string;
}
