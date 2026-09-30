"use client";

import { useId } from "react";

export default function PoemIllustration() {
  const u = useId();
  return (
    <svg viewBox="0 0 300 200" width="100%" height="100%" preserveAspectRatio="none" style={{ display: "block", overflow: "visible" }}>
      <defs>
        <linearGradient id={`${u}pl`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#f7efdf" />
          <stop offset=".82" stopColor="#f3e9d6" />
          <stop offset="1" stopColor="#cdbd9f" />
        </linearGradient>
        <linearGradient id={`${u}pr`} x1="1" y1="0" x2="0" y2="0">
          <stop offset="0" stopColor="#fbf5e8" />
          <stop offset=".82" stopColor="#f5ecda" />
          <stop offset="1" stopColor="#cdbd9f" />
        </linearGradient>
        <pattern id={`${u}pt`} width="10" height="11" patternUnits="userSpaceOnUse">
          <rect width="10" height="2" fill="#9a8f80" />
        </pattern>
      </defs>
      <rect x="4" y="8" width="292" height="186" rx="4" fill="#6b4a63" />
      <path d="M150 190 Q82 178 12 186 L14 12 Q82 4 150 16Z" fill="#e2d6bf" />
      <path d="M150 190 Q218 178 288 186 L286 12 Q218 4 150 16Z" fill="#e2d6bf" />
      <path d="M150 186 Q82 174 16 182 L18 8 Q82 0 150 12Z" fill={`url(#${u}pl)`} />
      <path d="M150 186 Q218 174 284 182 L282 8 Q218 0 150 12Z" fill={`url(#${u}pr)`} />
      <text x="40" y="40" fontFamily="Spectral, serif" fontStyle="italic" fontSize="12" fill="#2b2622">
        Small Hours
      </text>
      <rect x="40" y="54" width="84" height="2" fill="#9a8f80" />
      <rect x="40" y="65" width="92" height="2" fill="#9a8f80" />
      <rect x="40" y="76" width="78" height="2" fill="#9a8f80" />
      <rect x="40" y="96" width="88" height="2" fill="#9a8f80" />
      <rect x="40" y="107" width="46" height="2" fill="#9a8f80" />
      <rect x="40" y="127" width="70" height="2" fill="#9a8f80" />
      <rect x="40" y="138" width="86" height="2" fill="#9a8f80" />
      <rect x="174" y="40" width="90" height="121" fill={`url(#${u}pt)`} />
      <text x="219" y="176" textAnchor="middle" fontFamily="Spectral, serif" fontSize="8" fill="#9a8f80">
        — 43 —
      </text>
      <path d="M156 150 L156 212 L161 205 L166 212 L166 150Z" fill="#c1552c" />
    </svg>
  );
}
