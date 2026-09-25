export type Plan = "free" | "premium";

/** A section's config, as stored in the `Section` table — drives the whole
 * daily edition without any code change (see ARCHITECTURE.md §2). */
export interface SectionMeta {
  key: string;
  eyebrow: string;
  title: string;
  tagline: string;
  premium: boolean;
  minTimeMinutes: number;
}

// ---------------------------------------------------------------------------
// Content shapes. Most of these intentionally match the props the existing
// components already expect (Poem, TravelVignette, BookRec, CrosswordPuzzle)
// so that resolving content from the database — instead of a hardcoded bank —
// required no component rewrites, only a different source for the values.
// ---------------------------------------------------------------------------

export interface Poem {
  title: string;
  poet: string;
  year?: string;
  lines: string[];
  category: string;
  context?: string;
  sourceUrl?: string;
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

export interface NewsItemT {
  id: string;
  title: string;
  summary: string;
  source: string;
  sourceUrl: string | null;
  category: string;
  readingTimeMin: number;
}

/** Shape of an entry in the legacy contentBank.ts ART_SPOTLIGHT bank —
 * still used by prisma/seed.ts to seed the Artwork content pool. */
export interface ArtSpotlightEntry {
  query: string;
  analysis: string;
  category: string;
}

export interface WonderT {
  id: string;
  title: string;
  body: string;
  category: string;
  source: string;
}

// ---------------------------------------------------------------------------
// Per-section content, keyed by the section's `key`. `content` is `null` for
// a section whose key the app doesn't know how to resolve yet (an admin
// re-enabling one of the older, currently-unsupported keys like "quiz").
// ---------------------------------------------------------------------------

export interface KnowContent {
  kind: "know";
  items: NewsItemT[];
  totalCount: number;
}
export interface PlayContent {
  kind: "play";
  puzzle: CrosswordPuzzle;
}
export interface LookContent {
  kind: "look";
  query: string;
  analysis: string;
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
  tasks: string[];
  totalCount: number;
}

export type EditionContent =
  | KnowContent
  | PlayContent
  | LookContent
  | ReadContent
  | WanderContent
  | ReadNextContent
  | WonderContent
  | DoContent
  | null;

export interface EditionSection extends SectionMeta {
  locked: boolean;
  content: EditionContent;
}

export interface DailyEditionResponse {
  dateISO: string;
  dayOfYear: number;
  weekKey: string;
  plan: Plan;
  timeBudgetMinutes: number | null;
  sections: EditionSection[];
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
  sectionOrder: string[];
  hiddenSections: string[];
  timeBudgetMinutes: number | null;
  interests: { slug: string; weight: number }[];
}
