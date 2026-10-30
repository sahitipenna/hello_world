// A hand-kept subset of the web app's lib/types.ts — only what the MVP
// screens render. Keep in sync by hand if the API shapes change.

export interface SectionMeta {
  key: string;
  eyebrow: string;
  title: string;
  tagline: string;
  premium: boolean;
  minTimeMinutes: number;
}

export interface NewsItemT {
  id: string;
  title: string;
  summary: string;
  source: string;
  sourceUrl: string | null;
  category: string;
  readingTimeMin: number;
}

export interface WonderT {
  id: string;
  title: string;
  body: string;
  category: string;
  source: string;
}

export interface WordOfDayT {
  id: string;
  word: string;
  pronunciation: string;
  partOfSpeech: string;
  definition: string;
  example: string;
  category: string;
}

export interface Poem {
  id?: string;
  title: string;
  poet: string;
  year?: string;
  lines: string[];
  category: string;
  context?: string;
  sourceUrl?: string;
  source?: string;
}

export interface TravelVignette {
  id?: string;
  title: string;
  place: string;
  body: string;
  category: string;
}

export interface BookRec {
  id?: string;
  title: string;
  author: string;
  reason: string;
  category: string;
}

export interface KnowContent {
  kind: "know";
  items: NewsItemT[];
  totalCount: number;
}
export interface LookContent {
  kind: "look";
  query: string;
  analysis: string;
  artworkId: string;
  custom: {
    image: string;
    title: string;
    artist: string;
    year: string;
    medium: string;
    museum: string;
    sourceUrl: string | null;
  } | null;
}
export interface ReadContent {
  kind: "read";
  poem: Poem;
}
export interface WanderContent {
  kind: "wander";
  travel: TravelVignette;
}
export interface ReadNextContent {
  kind: "readnext";
  book: BookRec;
}
export interface WonderContent {
  kind: "wonder";
  wonder: WonderT;
}
export interface DoContent {
  kind: "do";
  tasks: { title: string; category: string }[];
  totalCount: number;
}
export interface QuizContent {
  kind: "quiz";
}
export interface PlayContent {
  kind: "play";
}
export interface WordContent {
  kind: "word";
  word: WordOfDayT;
}

export type EditionContent =
  | KnowContent
  | LookContent
  | ReadContent
  | WanderContent
  | ReadNextContent
  | WonderContent
  | DoContent
  | QuizContent
  | PlayContent
  | WordContent
  | null;

export interface EditionSection extends SectionMeta {
  locked: boolean;
  content: EditionContent;
}

export interface DailyEditionResponse {
  dateISO: string;
  dayOfYear: number;
  weekKey: string;
  plan: "free" | "premium";
  timeBudgetMinutes: number | null;
  sections: EditionSection[];
  todoChecks: Record<number, boolean>;
  archiveLocked?: boolean;
}

export type QuizDifficulty = "easy" | "medium" | "hard";

export interface QuizGenreInfo {
  slug: string;
  label: string;
  emoji: string;
  unlocked: QuizDifficulty[];
  available: Record<QuizDifficulty, boolean>;
}

export interface QuizQ {
  index: number;
  question: string;
  answer: string;
  genre: string;
  difficulty: QuizDifficulty;
}
