"use client";

import { ComponentType, useState } from "react";
import { LayoutBox, percentBox } from "@/lib/deskLayout";

export default function DeskDecorObject({
  box,
  stage,
  label,
  visited,
  mobile,
  Illustration,
  onOpen,
}: {
  box: LayoutBox;
  stage: { W: number; H: number };
  label: string;
  visited: boolean;
  mobile: boolean;
  Illustration: ComponentType;
  onOpen: () => void;
}) {
  const [hover, setHover] = useState(false);
  const pct = percentBox(box, stage.W, stage.H);
  const up = hover;

  return (
    <div
      style={{
        position: "absolute",
        left: pct.left,
        top: pct.top,
        width: pct.width,
        height: pct.height,
        transform: `rotate(${pct.rotate}deg)`,
        zIndex: up ? 20 : pct.z,
      }}
    >
      <button
        onClick={onOpen}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onFocus={() => setHover(true)}
        onBlur={() => setHover(false)}
        aria-label={label}
        className="dd-reduce-motion"
        style={{
          position: "relative",
          display: "block",
          width: "100%",
          height: "100%",
          padding: 0,
          border: 0,
          background: "transparent",
          cursor: "pointer",
          outline: "none",
          transform: up ? "translate(-2px,-8px) rotate(-3deg) scale(1.05)" : "none",
          filter: up ? "drop-shadow(8px 14px 8px rgba(20,10,4,.25))" : "none",
          transition: "transform .32s cubic-bezier(.2,.8,.2,1), filter .32s cubic-bezier(.2,.8,.2,1)",
        }}
      >
        <Illustration />
      </button>
      <div
        style={{
          position: "absolute",
          top: "calc(100% + 6px)",
          left: 0,
          width: "100%",
          display: "flex",
          justifyContent: "center",
          transform: `rotate(-2deg) translateY(${up ? 0 : -4}px)`,
          pointerEvents: "none",
          opacity: up ? 1 : 0,
          transition: "opacity .2s, transform .25s",
        }}
      >
        <span
          style={{
            display: "inline-block",
            maxWidth: "100%",
            background: "#faf3e6",
            padding: "1px 10px 2px",
            borderRadius: 2,
            whiteSpace: mobile ? "normal" : "nowrap",
            textAlign: "center",
            fontFamily: "var(--font-hand), cursive",
            fontSize: mobile ? 17 : 19,
            color: "#2b2622",
            boxShadow: "1px 2px 4px rgba(20,10,4,.3)",
            outline: up ? "2px solid #d9a02c" : "none",
            outlineOffset: 2,
          }}
        >
          {label}
          {visited ? "  ✓" : ""}
        </span>
      </div>
    </div>
  );
}
