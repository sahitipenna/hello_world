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
import QuizIllustration from "@/components/desk/illustrations/QuizIllustration";

/** [x, y, w, h, rotateDeg, z] in layout units — see design_handoff_daily_desk/README.md §Layout. */
export type LayoutBox = [x: number, y: number, w: number, h: number, rotateDeg: number, z: number];

/** Per-key illustration. `png` is filled in once the designer has real
 * Procreate art (public/desk/<key>.png); until then every key falls back
 * to its vector `svg`. */
export const DESK_ART: Record<string, { svg: ComponentType<Record<string, unknown>>; png?: string }> = {
  know: { svg: NewsIllustration },
  play: { svg: CrosswordIllustration },
  look: { svg: ArtIllustration },
  read: { svg: PoemIllustration },
  wander: { svg: TravelIllustration },
  readnext: { svg: BookIllustration },
  wonder: { svg: FactIllustration },
  do: { svg: TodoIllustration },
  quiz: { svg: QuizIllustration },
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
  quiz: "#6b4a9e",
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
    quiz: [735, 485, 150, 130, 5, 4],
  },
};

// Mobile used to be a hand-placed fixed collage like the desktop one, in a
// nominal 390x1390 design space. That broke once content could vary: a
// visitor's time-budget choice hides some sections, but the rest stayed at
// their original fixed Y, leaving a gap where the hidden one used to be
// (never compacting upward) — and with every label shown at once on mobile
// (not just on hover, like desktop), the tight original spacing let long
// labels bleed into neighboring items. mobileFlowLayout() below replaces the
// fixed table with a single-column stack generated from whichever keys are
// actually visible, so there's never a gap and every item gets full-width
// breathing room for its label. Desktop keeps the original fixed collage
// (DESK_LAYOUT_DESKTOP / DECOR_LAYOUT_DESKTOP below) — it isn't subject to
// the same hiding behavior and has room to spare.
const MOBILE_FLOW_W = 390;

// Width as a fraction of MOBILE_FLOW_W — echoes which items read as
// "feature" cards vs. smaller ones in the original hand-tuned layout.
const MOBILE_WIDTH_FRACTION: Record<string, number> = {
  know: 0.74,
  look: 0.62,
  read: 0.92,
  play: 0.66,
  readnext: 0.62,
  wander: 0.86,
  wonder: 0.6,
  do: 0.6,
  quiz: 0.66,
};

// w/h of each item's native illustration (matches its DESK_LAYOUT_DESKTOP
// box), so scaling it down to a mobile card width doesn't stretch the art.
const MOBILE_ASPECT: Record<string, number> = {
  know: 220 / 270,
  look: 185 / 235,
  read: 300 / 200,
  play: 160 / 210,
  readnext: 150 / 215,
  wander: 220 / 150,
  wonder: 150 / 130,
  do: 140 / 165,
  quiz: 150 / 130,
};

const DECOR_ASPECT: Record<string, number> = {
  mug: 1,
  plant: 1,
  headphones: 150 / 130,
  apple: 90 / 95,
};

const FLOW_ROTATIONS = [-3, 2.5, -2, 3, -3.5, 2, -2.5, 3.5];

/** Generates a single-column mobile layout from whichever section keys are
 * actually visible, followed by the side-object decor stacked the same way
 * (decor isn't time-budget-filtered, but still needs to compact upward if
 * the sections above it are fewer). Returns the same `{W,H,items}` shape as
 * DESK_LAYOUT_DESKTOP so DeskScene's existing percentBox/stageH scaling
 * needs no change beyond calling this instead of a fixed table. */
export function mobileFlowLayout(
  sectionKeys: string[],
  decorKeys: string[]
): { W: number; H: number; items: Record<string, LayoutBox>; decorItems: Record<string, LayoutBox> } {
  const items: Record<string, LayoutBox> = {};
  const decorItems: Record<string, LayoutBox> = {};
  let y = 18;
  let i = 0;

  for (const key of sectionKeys) {
    const widthFrac = MOBILE_WIDTH_FRACTION[key] ?? 0.66;
    const aspect = MOBILE_ASPECT[key] ?? 1;
    const w = Math.round(MOBILE_FLOW_W * widthFrac);
    const h = Math.round(w / aspect);
    const x = Math.round((MOBILE_FLOW_W - w) / 2);
    items[key] = [x, y, w, h, FLOW_ROTATIONS[i % FLOW_ROTATIONS.length], 3];
    y += h + 64;
    i++;
  }

  if (decorKeys.length > 0) {
    y += 10;
    for (const key of decorKeys) {
      const aspect = DECOR_ASPECT[key] ?? 1;
      const w = Math.round(MOBILE_FLOW_W * 0.42);
      const h = Math.round(w / aspect);
      const x = Math.round((MOBILE_FLOW_W - w) / 2);
      decorItems[key] = [x, y, w, h, FLOW_ROTATIONS[i % FLOW_ROTATIONS.length], 1];
      y += h + 64;
      i++;
    }
  }

  return { W: MOBILE_FLOW_W, H: y + 10, items, decorItems };
}

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

/** "On the side" objects — decor that's also clickable but isn't a real
 * section: can't be hidden/locked, doesn't count toward "n of 8", and
 * isn't in the Arrange card. Each rotates through a content pool
 * (SideObjectItem rows, admin-editable at /admin) by date, resolved
 * server-side in lib/sideObjects.ts — this file only needs the shape and
 * the fixed per-object label/accent, which aren't editorial content. */
export interface SideObject {
  id: string;
  label: string;
  accent: string;
  title: string;
  sub: string;
  body: string;
  note: string;
  url?: string;
  linkLabel?: string;
}

export const SIDE_OBJECT_META: Record<string, { label: string; accent: string }> = {
  mug: { label: "A tea break", accent: "#4f7d8c" },
  plant: { label: "Something growing", accent: "#5a6b4b" },
  headphones: { label: "Something to listen to", accent: "#6b4a63" },
  apple: { label: "A little bite", accent: "#a8441f" },
};

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
