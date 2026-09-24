export type SectionId =
  | "todos"
  | "todolist"
  | "quiz"
  | "crossword"
  | "comic"
  | "poem"
  | "writing"
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

export interface WritingPrompt {
  kind: "poem" | "story";
  prompt: string;
}

export interface ComicInsight {
  theme: string;
  tidbit: string;
  connections: { work: string; note: string }[];
  category: string;
}

export interface ArtSpotlightEntry {
  query: string;
  analysis: string;
  category: string;
}

export interface DailyBundle {
  dateISO: string;
  dayOfYear: number;
  weekKey: string;
  comic: {
    label: string;
    url: string;
    insight: ComicInsight;
  };
  poem: Poem;
  writing: WritingPrompt;
  travel: TravelVignette;
  book: BookRec;
  todos: string[];
  crossword: CrosswordPuzzle;
  artQuery: string;
  artAnalysis: string;
}

/** What GET /api/daily actually returns: the bundle plus per-user state. */
export interface DailyBundleResponse extends DailyBundle {
  plan: Plan;
  todoChecks: Record<number, boolean>;
}

export type QuizDifficulty = "easy" | "medium" | "hard";

export interface QuizQuestion {
  index: number;
  question: string;
  answer: string;
  genre: string;
  difficulty: QuizDifficulty;
}

export interface QuizGenre {
  slug: string;
  label: string;
  emoji: string;
}

export interface QuizProgressState {
  genre: string;
  unlocked: QuizDifficulty[];
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
