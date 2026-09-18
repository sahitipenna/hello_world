import { SectionMeta } from "./types";

export const SECTIONS: SectionMeta[] = [
  { id: "todos", title: "Five for Today", tagline: "small prompts for a fuller day", premium: false },
  { id: "bites", title: "Curiosity Bites", tagline: "a fact and a question to chew on", premium: false },
  { id: "poem", title: "A Few Lines", tagline: "a short poem, always public domain", premium: false },
  { id: "book", title: "Shelf Recommendation", tagline: "one book worth your evening", premium: false },
  { id: "crossword", title: "Mini Crossword", tagline: "a quick puzzle, easy to medium", premium: true },
  { id: "comic", title: "Comic Break", tagline: "today's Calvin and Hobbes, from the archive", premium: true },
  { id: "art", title: "Art Spotlight", tagline: "a public-domain piece, up close", premium: true },
  { id: "travel", title: "A Postcard", tagline: "a short travel vignette", premium: true },
];

export const DEFAULT_SECTION_ORDER = SECTIONS.map((s) => s.id);

export function sectionMeta(id: string): SectionMeta | undefined {
  return SECTIONS.find((s) => s.id === id);
}
