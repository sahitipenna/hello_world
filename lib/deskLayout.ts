import { ComponentType } from "react";
import NewsIllustration from "@/components/desk/illustrations/NewsIllustration";
import CrosswordIllustration from "@/components/desk/illustrations/CrosswordIllustration";
import ArtIllustration from "@/components/desk/illustrations/ArtIllustration";
import PoemIllustration from "@/components/desk/illustrations/PoemIllustration";
import TravelIllustration from "@/components/desk/illustrations/TravelIllustration";
import BookIllustration from "@/components/desk/illustrations/BookIllustration";
import FactIllustration from "@/components/desk/illustrations/FactIllustration";
import TodoIllustration from "@/components/desk/illustrations/TodoIllustration";
import MugIllustration from "@/components/desk/illustrations/MugIllustration";
import PlantIllustration from "@/components/desk/illustrations/PlantIllustration";
import HeadphonesIllustration from "@/components/desk/illustrations/HeadphonesIllustration";
import AppleIllustration from "@/components/desk/illustrations/AppleIllustration";

/** [x, y, w, h, rotateDeg, z] in layout units — see design_handoff_daily_desk/README.md §Layout. */
export type LayoutBox = [x: number, y: number, w: number, h: number, rotateDeg: number, z: number];

/** Per-key illustration. `png` is filled in once the designer has real
 * Procreate art (public/desk/<key>.png); until then every key falls back
 * to its vector `svg`. */
export const DESK_ART: Record<string, { svg: ComponentType; png?: string }> = {
  know: { svg: NewsIllustration },
  play: { svg: CrosswordIllustration },
  look: { svg: ArtIllustration },
  read: { svg: PoemIllustration },
  wander: { svg: TravelIllustration },
  readnext: { svg: BookIllustration },
  wonder: { svg: FactIllustration },
  do: { svg: TodoIllustration },
};

/** Kicker/accent colour for each section's panel header — fixed per key,
 * matching the prototype's SECTIONS table (not a hash-derived accent). */
export const SECTION_ACCENT: Record<string, string> = {
  know: "#a8441f",
  play: "#4f7d8c",
  look: "#6b4a63",
  read: "#c1552c",
  wander: "#5a6b4b",
  readnext: "#9a6d12",
  wonder: "#a8441f",
  do: "#5a6b4b",
};

export const DESK_LAYOUT_DESKTOP: { W: number; H: number; items: Record<string, LayoutBox> } = {
  W: 1000,
  H: 620,
  items: {
    know: [60, 50, 220, 270, -5, 3],
    readnext: [305, 28, 150, 215, 8, 4],
    look: [712, 38, 185, 235, 3, 3],
    read: [385, 225, 300, 200, -2, 2],
    play: [115, 360, 160, 210, 6, 3],
    wonder: [305, 455, 150, 130, -8, 4],
    do: [525, 440, 140, 165, 4, 3],
    wander: [712, 330, 220, 150, -7, 3],
  },
};

export const DESK_LAYOUT_MOBILE: { W: number; H: number; items: Record<string, LayoutBox> } = {
  W: 390,
  H: 1390,
  items: {
    know: [16, 24, 190, 235, -5, 3],
    look: [222, 44, 150, 188, 4, 3],
    read: [36, 300, 310, 205, -3, 3],
    play: [28, 560, 160, 210, 5, 3],
    readnext: [214, 550, 150, 215, -6, 3],
    wander: [40, 820, 250, 170, -6, 3],
    wonder: [28, 1045, 150, 130, -7, 3],
    do: [214, 1030, 150, 175, 4, 3],
  },
};

export const DECOR_ART: Record<string, ComponentType> = {
  mug: MugIllustration,
  plant: PlantIllustration,
  headphones: HeadphonesIllustration,
  apple: AppleIllustration,
};

export const DECOR_LAYOUT_DESKTOP: Record<string, LayoutBox> = {
  mug: [560, 55, 115, 115, 0, 1],
  plant: [905, -50, 170, 170, 12, 1],
  headphones: [830, 500, 150, 130, -16, 1],
  apple: [18, 470, 90, 95, -10, 1],
};

export const DECOR_LAYOUT_MOBILE: Record<string, LayoutBox> = {
  mug: [310, 800, 110, 110, 0, 1],
  headphones: [-20, 1235, 150, 130, 15, 1],
  plant: [270, 1255, 140, 140, 20, 1],
  apple: [168, 1225, 90, 95, 12, 1],
};

/** "On the side" objects — decor that's also clickable but isn't a real
 * section: can't be hidden/locked, doesn't count toward "n of 8", and
 * isn't in the Arrange card. Content source is static for now — see
 * README §"On the side" objects ("TBD ... confirm with the designer"). */
export interface SideObject {
  id: string;
  label: string;
  accent: string;
  title: string;
  sub: string;
  body: string;
  note: string;
}

export const SIDE_OBJECTS: SideObject[] = [
  {
    id: "mug",
    label: "A tea break",
    accent: "#4f7d8c",
    title: "Put the kettle on",
    sub: "Three minutes, nothing to do",
    body: "Let it steep while you do nothing in particular. Look out of the window. The desk will keep.",
    note: "Milk after, always.",
  },
  {
    id: "plant",
    label: "Something growing",
    accent: "#5a6b4b",
    title: "Rosehips are ripening",
    sub: "What's in season this week",
    body: "After the wild roses finish, their hips turn scarlet along the hedgerows. Birds eat them all winter long, and the hips are full of vitamin C.",
    note: "Look for them on your walk home.",
  },
  {
    id: "headphones",
    label: "Something to listen to",
    accent: "#6b4a63",
    title: "Clair de Lune",
    sub: "Claude Debussy · 1905 · about five minutes",
    body: "Written for piano, named after a Verlaine poem about moonlight. It works best with the volume low and your eyes closed.",
    note: "Play it twice.",
  },
  {
    id: "apple",
    label: "A little bite",
    accent: "#a8441f",
    title: "“An apple is an excellent thing — until you have tried a peach.”",
    sub: "George du Maurier",
    body: "A small thought to chew on: the good things you already have, and the better ones you have not met yet.",
    note: "Finish the apple anyway.",
  },
];

export function percentBox(b: LayoutBox, W: number, H: number) {
  return {
    left: (b[0] / W) * 100 + "%",
    top: (b[1] / H) * 100 + "%",
    width: (b[2] / W) * 100 + "%",
    height: (b[3] / H) * 100 + "%",
    rotate: b[4],
    z: b[5],
  };
}
