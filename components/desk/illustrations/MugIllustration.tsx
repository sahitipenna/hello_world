"use client";

import { useId } from "react";

export default function MugIllustration() {
  const u = useId();
  return (
    <svg
      viewBox="0 0 115 115"
      width="100%"
      height="100%"
      style={{ overflow: "visible", filter: "drop-shadow(5px 8px 6px rgba(20,10,4,.38))" }}
    >
      <defs>
        <radialGradient id={`${u}mug`} cx=".35" cy=".3" r=".75">
          <stop offset="0" stopColor="#7fa5b1" />
          <stop offset=".75" stopColor="#4f7d8c" />
          <stop offset="1" stopColor="#3a5f6b" />
        </radialGradient>
        <radialGradient id={`${u}cof`} cx=".45" cy=".42" r=".6">
          <stop offset="0" stopColor="#6b4226" />
          <stop offset=".7" stopColor="#4a2c18" />
          <stop offset="1" stopColor="#8a5a33" />
        </radialGradient>
      </defs>
      <rect x="80" y="42" width="30" height="30" rx="13" fill="none" stroke="#436d7a" strokeWidth="9" />
      <circle cx="54" cy="57" r="44" fill={`url(#${u}mug)`} />
      <circle cx="54" cy="57" r="37" fill="#f4ecdc" />
      <circle cx="54" cy="57" r="33" fill={`url(#${u}cof)`} />
      <ellipse cx="44" cy="46" rx="11" ry="6" fill="#fff" opacity=".18" transform="rotate(-30 44 46)" />
      <path d="M30 34 A33 33 0 0 1 60 26" stroke="#fff" strokeWidth="2" fill="none" opacity=".5" />
    </svg>
  );
}
