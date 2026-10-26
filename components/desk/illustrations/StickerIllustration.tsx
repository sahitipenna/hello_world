import { useId } from "react";

/** One parameterized badge-sticker shape — a rough hand-cut circle with a
 * thin white edge (like a real vinyl sticker peeled onto the desk),
 * colored and labeled per lib/stickers.ts's STICKERS defs. Text is split
 * on whichever space falls closest to the middle so two short lines fit
 * the round shape without the caller having to hand-wrap each phrase. */
export default function StickerIllustration({ text, color }: { text: string; color: string }) {
  const id = useId();
  const words = text.split(" ");
  let line1 = text;
  let line2 = "";
  if (words.length > 1) {
    let bestSplit = 1;
    let bestDelta = Infinity;
    for (let i = 1; i < words.length; i++) {
      const a = words.slice(0, i).join(" ").length;
      const b = words.slice(i).join(" ").length;
      const delta = Math.abs(a - b);
      if (delta < bestDelta) {
        bestDelta = delta;
        bestSplit = i;
      }
    }
    line1 = words.slice(0, bestSplit).join(" ");
    line2 = words.slice(bestSplit).join(" ");
  }

  return (
    <svg viewBox="0 0 100 100" width="100%" height="100%">
      <defs>
        <radialGradient id={`${id}-shade`} cx="35%" cy="30%" r="75%">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="50" cy="52" r="45" fill="#faf3e6" opacity="0.9" />
      <circle cx="50" cy="50" r="44" fill={color} />
      <circle cx="50" cy="50" r="44" fill={`url(#${id}-shade)`} />
      <circle cx="50" cy="50" r="44" fill="none" stroke="#faf3e6" strokeWidth="2.5" opacity="0.85" />
      {line2 ? (
        <>
          <text x="50" y="46" textAnchor="middle" fontFamily="var(--font-hand), cursive" fontSize="13.5" fill="#faf3e6" fontWeight="700">
            {line1}
          </text>
          <text x="50" y="61" textAnchor="middle" fontFamily="var(--font-hand), cursive" fontSize="13.5" fill="#faf3e6" fontWeight="700">
            {line2}
          </text>
        </>
      ) : (
        <text x="50" y="55" textAnchor="middle" fontFamily="var(--font-hand), cursive" fontSize="14.5" fill="#faf3e6" fontWeight="700">
          {line1}
        </text>
      )}
    </svg>
  );
}
