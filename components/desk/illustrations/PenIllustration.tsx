"use client";

import { useId } from "react";

export default function PenIllustration() {
  const u = useId();
  return (
    <svg viewBox="0 0 95 190" width="100%" height="100%" preserveAspectRatio="none" style={{ display: "block", overflow: "visible" }}>
      <defs>
        <linearGradient id={`${u}body`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#3a5a78" />
          <stop offset=".55" stopColor="#2d4a63" />
          <stop offset="1" stopColor="#1f3650" />
        </linearGradient>
      </defs>
      {/* a small flashcard, slightly tilted */}
      <g transform="rotate(-4 47 58)">
        <rect x="9" y="18" width="76" height="76" rx="3" fill="#e8d7a8" />
        <rect x="7" y="15" width="76" height="76" rx="3" fill="#fbf1d2" />
        <text x="45" y="62" textAnchor="middle" fontFamily="Spectral, serif" fontStyle="italic" fontSize="34" fontWeight="600" fill="#2d4a63">
          Aa
        </text>
        <path d="M20 76 H70" stroke="#c9b98a" strokeWidth="1.4" />
        <path d="M20 84 H58" stroke="#c9b98a" strokeWidth="1.4" />
      </g>
      {/* the pen, crossing the card diagonally */}
      <g transform="rotate(38 47 140)">
        <rect x="40" y="58" width="13" height="108" rx="6" fill={`url(#${u}body)`} />
        <rect x="41.5" y="60" width="2.2" height="104" rx="1" fill="#6b8bab" opacity=".55" />
        <path d="M40 166 L53 166 L46.5 190Z" fill="#d9a02c" />
        <circle cx="46.5" cy="186" r="1.6" fill="#1f3650" />
        <rect x="38.5" y="50" width="16" height="12" rx="3" fill="#1f3650" />
        <rect x="42" y="40" width="9" height="12" rx="2.5" fill="#1f3650" />
        <rect x="43.5" y="34" width="6" height="8" rx="2" fill="#2d4a63" />
      </g>
      {/* a small flourish of ink, like a just-finished underline */}
      <path d="M12 118 q14 10 30 2" stroke="#2d4a63" strokeWidth="2" fill="none" strokeLinecap="round" opacity=".55" />
    </svg>
  );
}
