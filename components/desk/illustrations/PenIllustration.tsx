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
      {/* a fountain pen, resting at a natural diagonal */}
      <g transform="rotate(22 47 95)">
        <rect x="40" y="18" width="14" height="128" rx="7" fill={`url(#${u}body)`} />
        <rect x="41.6" y="22" width="2.4" height="118" rx="1.2" fill="#6b8bab" opacity=".55" />
        <rect x="38.5" y="4" width="18" height="20" rx="4" fill="#1f3650" />
        <rect x="46" y="4" width="2.4" height="48" fill="#d9a02c" opacity=".9" />
        <path d="M40 146 L54 146 L47 178Z" fill="#d9a02c" />
        <path d="M44.5 150 L47 176 L49.5 150Z" fill="#1f3650" />
        <circle cx="47" cy="172" r="1.6" fill="#1f3650" />
      </g>
      {/* a small flourish of ink beneath the nib */}
      <path d="M18 150 q18 14 38 4" stroke="#2d4a63" strokeWidth="2" fill="none" strokeLinecap="round" opacity=".45" />
    </svg>
  );
}
