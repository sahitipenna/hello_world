import { LayoutBox } from "./deskLayout";

export interface StickerDef {
  id: string;
  text: string;
  color: string;
  // Fixed position in the same [x,y,w,h,rotateDeg,z] units as the rest of
  // DESK_LAYOUT_DESKTOP (see lib/deskLayout.ts) — tucked into the desk's
  // margins (slightly off the nominal 1000x620 canvas, same overflow the
  // plant decoration already uses) so a chosen sticker never collides with
  // a real section or side object.
  box: LayoutBox;
}

/** Purely decorative — chosen from "Arrange your desk", persisted on
 * User.stickers (a JSON array of ids, same pattern as hiddenSections),
 * rendered with no click behavior at all (see components/desk/DeskSticker).
 */
export const STICKERS: StickerDef[] = [
  { id: "you-can-do-it", text: "You can do it", color: "#a8441f", box: [16, -22, 50, 50, -8, 6] },
  { id: "artist-for-life", text: "Artist for life", color: "#6b4a63", box: [268, -18, 50, 50, 6, 6] },
  { id: "dream-big", text: "Dream big", color: "#9a6d12", box: [500, -22, 50, 50, -5, 6] },
  { id: "keep-going", text: "Keep going", color: "#4f7d8c", box: [758, -16, 50, 50, 7, 6] },
  { id: "be-kind", text: "Be kind to yourself", color: "#5a6b4b", box: [136, 588, 50, 50, -6, 6] },
  { id: "stay-curious", text: "Stay curious", color: "#2d4a63", box: [458, 592, 50, 50, 5, 6] },
  { id: "good-things-take-time", text: "Good things take time", color: "#c1552c", box: [818, 586, 50, 50, -4, 6] },
];
