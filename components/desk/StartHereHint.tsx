"use client";

import { LayoutBox, percentBox } from "@/lib/deskLayout";

/** Points a new visitor at the first item on the desk — shown only until
 * they open their first section (see app/page.tsx's `showStartHint`). */
export default function StartHereHint({
  box,
  stage,
  mobile,
}: {
  box: LayoutBox;
  stage: { W: number; H: number };
  mobile: boolean;
}) {
  const pct = percentBox(box, stage.W, stage.H);
  return (
    <div
      className="dd-start-hint"
      style={{
        position: "absolute",
        left: pct.left,
        bottom: 0,
        zIndex: 25,
        pointerEvents: "none",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
      }}
    >
      <span
        style={{
          fontFamily: "var(--font-hand), cursive",
          fontWeight: 600,
          fontSize: mobile ? 20 : 24,
          color: "#d9a02c",
          transform: "rotate(-4deg)",
          whiteSpace: "nowrap",
          textShadow: "0 1px 2px rgba(20,10,4,.35)",
        }}
      >
        Start here
      </span>
      <svg width={mobile ? 46 : 54} height={mobile ? 38 : 46} viewBox="0 0 54 46" style={{ marginTop: 2, marginLeft: 4 }}>
        <path d="M6 4 C 10 24, 28 34, 46 36" stroke="#d9a02c" strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M37 29 L48 37 L37 43" stroke="#d9a02c" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}
