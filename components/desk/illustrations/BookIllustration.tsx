"use client";

import { useId } from "react";

export default function BookIllustration() {
  const u = useId();
  return (
    <svg viewBox="0 0 150 215" width="100%" height="100%" preserveAspectRatio="none" style={{ display: "block", overflow: "visible" }}>
      <defs>
        <linearGradient id={`${u}bk`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#e6b247" />
          <stop offset=".6" stopColor="#d9a02c" />
          <stop offset="1" stopColor="#b8841a" />
        </linearGradient>
        <pattern id={`${u}pe`} width="2.5" height="10" patternUnits="userSpaceOnUse">
          <rect width="1" height="10" fill="#d6c9ae" />
        </pattern>
      </defs>
      <rect x="10" y="7" width="137" height="205" rx="2" fill="#efe6d2" />
      <rect x="136" y="8" width="10" height="203" fill={`url(#${u}pe)`} />
      <rect x="3" y="2" width="136" height="206" rx="3" fill={`url(#${u}bk)`} />
      <rect x="3" y="2" width="18" height="206" rx="2" fill="#a8761a" />
      <g stroke="#8a5f12" strokeWidth="1.2">
        <path d="M6 24 H20" />
        <path d="M6 28 H20" />
        <path d="M6 182 H20" />
        <path d="M6 186 H20" />
      </g>
      <rect x="21" y="2" width="3" height="206" fill="#fff" opacity=".18" />
      <rect x="40" y="48" width="84" height="54" fill="#faf3e6" stroke="#9a6d12" strokeWidth="1" />
      <rect x="44" y="52" width="76" height="46" fill="none" stroke="#9a6d12" strokeWidth=".6" />
      <text x="82" y="72" textAnchor="middle" fontFamily="Spectral, serif" fontStyle="italic" fontSize="12" fill="#2b2622">
        The Hare
      </text>
      <text x="82" y="86" textAnchor="middle" fontFamily="Spectral, serif" fontSize="7.5" fill="#2b2622">
        with Amber Eyes
      </text>
      <path d="M68 150 q8 -14 20 -6 q6 -8 10 0 q-2 8 -10 10 q-10 4 -20 -4Z" fill="#9a6d12" opacity=".55" />
      <path d="M137 4 L139 4 L139 12Z M5 206 L5 200 L12 208Z" fill="#f3d58a" opacity=".6" />
    </svg>
  );
}
