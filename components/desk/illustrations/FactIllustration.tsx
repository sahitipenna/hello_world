"use client";

import { useId } from "react";

export default function FactIllustration() {
  const u = useId();
  return (
    <svg viewBox="0 0 150 130" width="100%" height="100%" preserveAspectRatio="none" style={{ display: "block", overflow: "visible" }}>
      <defs>
        <radialGradient id={`${u}br`} cx=".35" cy=".3" r=".8">
          <stop offset="0" stopColor="#f0d27a" />
          <stop offset=".55" stopColor="#b8861f" />
          <stop offset="1" stopColor="#77520f" />
        </radialGradient>
        <radialGradient id={`${u}ln`} cx=".4" cy=".35" r=".7">
          <stop offset="0" stopColor="#e8f1f2" stopOpacity=".55" />
          <stop offset="1" stopColor="#9fc0c8" stopOpacity=".3" />
        </radialGradient>
      </defs>
      <circle cx="56" cy="70" r="46" fill={`url(#${u}br)`} />
      <circle cx="56" cy="70" r="38" fill="#f5ecd6" />
      <circle cx="56" cy="70" r="33" fill="none" stroke="#2b2622" strokeWidth="3" strokeDasharray="1 5.9" opacity=".7" />
      <text x="56" y="44" textAnchor="middle" fontFamily="Spectral, serif" fontSize="9" fontWeight="600" fill="#a8441f">
        N
      </text>
      <g transform="rotate(28 56 70)">
        <path d="M56 42 L61 70 L56 74 L51 70Z" fill="#a8441f" />
        <path d="M56 98 L61 70 L56 66 L51 70Z" fill="#2b2622" />
      </g>
      <circle cx="56" cy="70" r="3" fill="#b8861f" />
      <circle cx="56" cy="22" r="6" fill="none" stroke="#b8861f" strokeWidth="3" />
      <path d="M120 84 L146 122" stroke="#5a3a26" strokeWidth="11" strokeLinecap="round" />
      <path d="M116 78 L124 90" stroke="#b8861f" strokeWidth="12" />
      <circle cx="100" cy="56" r="32" fill={`url(#${u}ln)`} />
      <circle cx="100" cy="56" r="32" fill="none" stroke="#3b2a1e" strokeWidth="7" />
      <circle cx="100" cy="56" r="28" fill="none" stroke="#d9a02c" strokeWidth="1.2" />
      <path d="M80 44 A24 24 0 0 1 96 32" stroke="#fff" strokeWidth="3" fill="none" strokeLinecap="round" opacity=".75" />
    </svg>
  );
}
