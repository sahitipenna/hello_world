"use client";

import { useId } from "react";

/** Original folk-art still-life — flat gouache-style shapes, a striped
 * bowl of fruit on a striped tablecloth, muted earthy palette. Style
 * direction from a reference the user shared (a striped-bowl-of-pears
 * painting); this composition and palette are original, not a copy. */
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
        <linearGradient id={`${u}wall`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#e6cbb8" />
          <stop offset="1" stopColor="#d9b9a0" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="185" height="235" rx="3" fill={`url(#${u}fr)`} />
      <rect x="4" y="4" width="177" height="227" rx="2" fill="none" stroke="#e6b865" strokeWidth="1.2" opacity=".6" />
      <rect x="15" y="15" width="155" height="205" fill="#5a3a1c" />
      <rect x="19" y="19" width="147" height="197" fill="#f3ead7" />

      {/* wall */}
      <rect x="34" y="34" width="117" height="167" fill={`url(#${u}wall)`} />

      {/* striped tablecloth */}
      <rect x="34" y="150" width="117" height="51" fill="#c1552c" />
      <g stroke="#8f3a1a" strokeWidth="5" opacity=".85">
        <line x1="34" y1="158" x2="151" y2="158" />
        <line x1="34" y1="170" x2="151" y2="170" />
        <line x1="34" y1="182" x2="151" y2="182" />
        <line x1="34" y1="194" x2="151" y2="194" />
      </g>

      {/* striped bowl */}
      <path d="M56 128 L129 128 L119 158 Q92 168 66 158 Z" fill="#f3ead7" stroke="#2b2622" strokeWidth="2" />
      <g clipPath={`url(#${u}bowlclip)`}>
        <rect x="56" y="128" width="73" height="34" fill="#6b4a63" />
        <rect x="62" y="128" width="7" height="34" fill="#f3ead7" />
        <rect x="76" y="128" width="7" height="34" fill="#f3ead7" />
        <rect x="90" y="128" width="7" height="34" fill="#f3ead7" />
        <rect x="104" y="128" width="7" height="34" fill="#f3ead7" />
        <rect x="118" y="128" width="7" height="34" fill="#f3ead7" />
      </g>
      <clipPath id={`${u}bowlclip`}>
        <path d="M56 128 L129 128 L119 158 Q92 168 66 158 Z" />
      </clipPath>
      <path d="M56 128 L129 128 L119 158 Q92 168 66 158 Z" fill="none" stroke="#2b2622" strokeWidth="2" />
      <ellipse cx="92.5" cy="128" rx="36.5" ry="7" fill="none" stroke="#2b2622" strokeWidth="2" />

      {/* citrus fruit spilling over the bowl */}
      <g stroke="#2b2622" strokeWidth="1.8" strokeLinejoin="round">
        <ellipse cx="70" cy="118" rx="15" ry="17" fill="#d9a02c" />
        <ellipse cx="92" cy="108" rx="16" ry="18" fill="#c1552c" />
        <ellipse cx="114" cy="119" rx="14" ry="16" fill="#d9a02c" />
        <ellipse cx="82" cy="126" rx="13" ry="14" fill="#9a6d12" />
      </g>
      <path d="M92 90 q2 -8 8 -10" stroke="#5a6b4b" strokeWidth="2.4" fill="none" strokeLinecap="round" />
      <path d="M96 82 q10 -4 14 4 q-8 6 -14 -4Z" fill="#6d7f5c" stroke="#2b2622" strokeWidth="1.2" />
      <path d="M63 106 q10 -4 8 8" stroke="#fff" strokeWidth="1.6" fill="none" opacity=".5" strokeLinecap="round" />
      <path d="M85 98 q10 -5 9 7" stroke="#fff" strokeWidth="1.6" fill="none" opacity=".45" strokeLinecap="round" />

      <rect x="34" y="34" width="117" height="167" fill="none" stroke="#2b2622" strokeOpacity=".25" />
    </svg>
  );
}
