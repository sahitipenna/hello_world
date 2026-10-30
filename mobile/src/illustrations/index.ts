import { ComponentType } from "react";
import NewsIllustration from "./NewsIllustration";
import CrosswordIllustration from "./CrosswordIllustration";
import ArtIllustration from "./ArtIllustration";
import PoemIllustration from "./PoemIllustration";
import TravelIllustration from "./TravelIllustration";
import BookIllustration from "./BookIllustration";
import FactIllustration from "./FactIllustration";
import TodoIllustration from "./TodoIllustration";
import QuizIllustration from "./QuizIllustration";
import PenIllustration from "./PenIllustration";
import MugIllustration from "./MugIllustration";
import PlantIllustration from "./PlantIllustration";
import HeadphonesIllustration from "./HeadphonesIllustration";
import AppleIllustration from "./AppleIllustration";

// Ported by hand from lib/deskLayout.ts's DESK_ART / MOBILE_ASPECT on web
// — keep these two in sync if a section's illustration or aspect ratio
// changes there.
export const SECTION_ILLUSTRATION: Record<string, ComponentType<Record<string, unknown>>> = {
  know: NewsIllustration,
  play: CrosswordIllustration,
  look: ArtIllustration,
  read: PoemIllustration,
  wander: TravelIllustration,
  readnext: BookIllustration,
  wonder: FactIllustration,
  do: TodoIllustration,
  quiz: QuizIllustration,
  word: PenIllustration,
};

// The four "on the side" desk objects — decor that's also tappable, but
// isn't a real section: small, real-life-proportioned, not a content
// card. See lib/deskLayout.ts's DECOR_ART / DECOR_ASPECT on web.
export const DECOR_ILLUSTRATION: Record<string, ComponentType> = {
  mug: MugIllustration,
  plant: PlantIllustration,
  headphones: HeadphonesIllustration,
  apple: AppleIllustration,
};

export const DECOR_ASPECT: Record<string, number> = {
  mug: 1,
  plant: 1,
  headphones: 150 / 130,
  apple: 90 / 95,
};

export const SECTION_ASPECT: Record<string, number> = {
  know: 220 / 270,
  play: 160 / 210,
  look: 185 / 235,
  read: 300 / 200,
  wander: 220 / 150,
  readnext: 150 / 215,
  wonder: 150 / 130,
  do: 140 / 165,
  quiz: 150 / 130,
  word: 95 / 190,
};
