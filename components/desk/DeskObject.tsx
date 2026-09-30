"use client";

import { ComponentType, useState } from "react";
import LockSeal from "./illustrations/LockSeal";
import { LayoutBox, percentBox } from "@/lib/deskLayout";

export default function DeskObject({
  box,
  stage,
  label,
  ariaLabel,
  locked,
  visited,
  labelsAlways,
  mobile,
  Illustration,
  png,
  onOpen,
}: {
  box: LayoutBox;
  stage: { W: number; H: number };
  label: string;
  ariaLabel: string;
  locked: boolean;
  visited: boolean;
  labelsAlways: boolean;
  mobile: boolean;
  Illustration: ComponentType;
  png?: string;
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
        aria-label={ariaLabel}
        className="dd-reduce-motion"
        style={{
          position: "relative",
          display: "block",
          width: "100%",
          height: "100%",
          padding: 0,
          border: 0,
          cursor: "pointer",
          background: "transparent",
          transform: up ? "translate(-3px,-10px) rotate(-1.2deg) scale(1.035)" : "none",
          filter: up
            ? "drop-shadow(14px 24px 14px rgba(20,10,4,.3)) drop-shadow(3px 6px 4px rgba(20,10,4,.2))"
            : "drop-shadow(5px 8px 6px rgba(20,10,4,.38)) drop-shadow(1px 2px 1.5px rgba(20,10,4,.3))",
          transition: "transform .32s cubic-bezier(.2,.8,.2,1), filter .32s cubic-bezier(.2,.8,.2,1)",
          outline: "none",
        }}
      >
        {png ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={png} alt="" style={{ width: "100%", height: "100%", objectFit: "fill", display: "block" }} />
        ) : (
          <Illustration />
        )}
        {locked && (
          <span style={{ position: "absolute", top: -12, right: -12, transform: "rotate(-12deg)" }}>
            <LockSeal size={36} />
          </span>
        )}
      </button>
      <div
        style={{
          position: "absolute",
          top: "calc(100% + 8px)",
          left: "50%",
          transform: `translateX(-50%) rotate(-2deg) translateY(${labelsAlways || up ? 0 : -4}px)`,
          background: "#faf3e6",
          padding: "1px 10px 2px",
          borderRadius: 2,
          whiteSpace: "nowrap",
          pointerEvents: "none",
          fontFamily: "var(--font-hand), cursive",
          fontWeight: 600,
          fontSize: mobile ? 17 : 19,
          color: "#2b2622",
          boxShadow: "1px 2px 4px rgba(20,10,4,.3)",
          opacity: labelsAlways || up ? 1 : 0,
          transition: "opacity .2s, transform .25s",
          outline: up && !mobile ? "2px solid #d9a02c" : "none",
          outlineOffset: 2,
        }}
      >
        {label}
        {visited ? "  ✓" : ""}
      </div>
    </div>
  );
}
