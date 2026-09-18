export type SectionId =
  | "todos"
  | "todolist"
  | "quiz"
  | "crossword"
  | "comic"
  | "poem"
  | "art"
  | "travel"
  | "book";

export interface SectionMeta {
  id: SectionId;
  title: string;
  tagline: string;
  premium: boolean;
}

export type Plan = "free" | "premium";

export interface Poem {
  title: string;
  poet: string;
  year?: string;
  lines: string[];
  category: string;
}

export interface TravelVignette {
  title: string;
  place: string;
  body: string;
  category: string;
}

export interface BookRec {
  title: string;
  author: string;
  reason: string;
  category: string;
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

/** What GET /api/daily actually returns: the bundle plus per-user state. */
export interface DailyBundleResponse extends DailyBundle {
  plan: Plan;
  todoChecks: Record<number, boolean>;
}

export interface QuizQuestion {
  index: number;
  question: string;
  answer: string;
  category: string;
}

export interface InterestTag {
  id: string;
  slug: string;
  label: string;
  emoji: string;
}

export interface UserPreferences {
  plan: Plan;
  sectionOrder: SectionId[];
  hiddenSections: SectionId[];
  interests: { slug: string; weight: number }[];
}
