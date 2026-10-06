"use client";

import { useId } from "react";

export default function QuizIllustration() {
  const u = useId();
  return (
    <svg viewBox="0 0 150 130" width="100%" height="100%" preserveAspectRatio="none" style={{ display: "block", overflow: "visible" }}>
      <defs>
        <linearGradient id={`${u}qc`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8f63b8" />
          <stop offset="1" stopColor="#6b4a63" />
        </linearGradient>
      </defs>
      <g transform="rotate(-6 75 70)">
        <rect x="18" y="38" width="96" height="66" rx="4" fill="#2b2622" opacity=".18" />
      </g>
      <g transform="rotate(4 75 70)">
        <rect x="22" y="34" width="96" height="66" rx="4" fill="#e8d7a8" />
      </g>
      <rect x="20" y="28" width="96" height="66" rx="4" fill={`url(#${u}qc)`} />
      <rect x="20" y="28" width="96" height="66" rx="4" fill="none" stroke="#3b2a3a" strokeWidth="2" />
      <text
        x="68"
        y="76"
        textAnchor="middle"
        fontFamily="Spectral, serif"
        fontWeight="700"
        fontSize="40"
        fill="#f5ecd6"
      >
        ?
      </text>
      <circle cx="112" cy="40" r="10" fill="#d9a02c" stroke="#2b2622" strokeWidth="1.5" />
      <path d="M108 40 L111 43 L117 36" stroke="#2b2622" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
