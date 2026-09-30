"use client";

import { useId } from "react";

export default function ArtIllustration() {
  const u = useId();
  return (
    <svg viewBox="0 0 185 235" width="100%" height="100%" preserveAspectRatio="none" style={{ display: "block", overflow: "visible" }}>
      <defs>
        <linearGradient id={`${u}fr`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#c8913f" />
          <stop offset=".45" stopColor="#9a6a2c" />
          <stop offset="1" stopColor="#6e4520" />
        </linearGradient>
        <linearGradient id={`${u}sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#9dbcc4" />
          <stop offset=".6" stopColor="#e6d6b3" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="185" height="235" rx="3" fill={`url(#${u}fr)`} />
      <rect x="4" y="4" width="177" height="227" rx="2" fill="none" stroke="#e6b865" strokeWidth="1.2" opacity=".6" />
      <rect x="15" y="15" width="155" height="205" fill="#5a3a1c" />
      <rect x="19" y="19" width="147" height="197" fill="#f3ead7" />
      <rect x="34" y="34" width="117" height="167" fill={`url(#${u}sky)`} />
      <circle cx="116" cy="78" r="15" fill="#d9a02c" />
      <circle cx="116" cy="78" r="22" fill="#d9a02c" opacity=".2" />
      <path d="M34 140 Q60 110 88 128 T151 118 V201 H34Z" fill="#6d7f5c" />
      <path d="M34 160 Q76 138 116 156 T151 150 V201 H34Z" fill="#56694a" />
      <path d="M34 178 Q84 162 151 176 V201 H34Z" fill="#c1552c" />
      <path d="M34 190 Q90 178 151 188 V201 H34Z" fill="#a8441f" />
      <path d="M60 150 q6 -10 4 -22 M66 146 q4 -8 10 -14" stroke="#3f4d35" strokeWidth="2" fill="none" />
      <path d="M40 60 q14 -6 26 0 M48 70 q10 -4 20 0" stroke="#fff" strokeWidth="2" fill="none" opacity=".6" />
      <rect x="34" y="34" width="117" height="167" fill="none" stroke="#2b2622" strokeOpacity=".25" />
    </svg>
  );
}
