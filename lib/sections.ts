import { SectionMeta } from "./types";

export const SECTIONS: SectionMeta[] = [
  { id: "todos", title: "This Week", tagline: "five small prompts, restocked every Monday", premium: false },
  { id: "todolist", title: "My To-Do List", tagline: "add and track your own tasks", premium: false },
  { id: "quiz", title: "Daily Quiz", tagline: "pick a genre, work your way up", premium: false },
  { id: "poem", title: "A Few Lines", tagline: "a short poem to sit with", premium: false },
  { id: "writing", title: "Write Something", tagline: "a small prompt for a poem or a story", premium: false },
  { id: "book", title: "Shelf Recommendation", tagline: "one book worth your evening", premium: false },
  { id: "crossword", title: "Mini Crossword", tagline: "a quick puzzle, easy to medium", premium: true },
  { id: "comic", title: "Comic Break", tagline: "a Calvin and Hobbes theme, worth thinking about", premium: true },
  { id: "art", title: "Art Spotlight", tagline: "one piece, looked at closely", premium: true },
  { id: "travel", title: "A Postcard", tagline: "a short travel vignette", premium: true },
];

export const DEFAULT_SECTION_ORDER = SECTIONS.map((s) => s.id);

export function sectionMeta(id: string): SectionMeta | undefined {
  return SECTIONS.find((s) => s.id === id);
}
