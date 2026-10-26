import { LayoutBox, percentBox } from "@/lib/deskLayout";
import StickerIllustration from "./illustrations/StickerIllustration";

/** Purely decorative — unlike DeskObject/DeskDecorObject, a sticker has no
 * content to open, so no button, hover state, or label: just a positioned
 * drawing, chosen on/off from "Arrange your desk" (see lib/stickers.ts). */
export default function DeskSticker({ box, stage, text, color }: { box: LayoutBox; stage: { W: number; H: number }; text: string; color: string }) {
  const pct = percentBox(box, stage.W, stage.H);
  return (
    <div
      style={{
        position: "absolute",
        left: pct.left,
        top: pct.top,
        width: pct.width,
        height: pct.height,
        transform: `rotate(${pct.rotate}deg)`,
        zIndex: pct.z,
        pointerEvents: "none",
        filter: "drop-shadow(2px 4px 4px rgba(20,10,4,.3))",
      }}
    >
      <StickerIllustration text={text} color={color} />
    </div>
  );
}
