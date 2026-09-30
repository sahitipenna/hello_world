"use client";

import { useId } from "react";

export default function CrosswordIllustration() {
  const u = useId();
  return (
    <svg viewBox="0 0 160 210" width="100%" height="100%" preserveAspectRatio="none" style={{ display: "block", overflow: "visible" }}>
      <defs>
        <pattern id={`${u}cw`} width="20" height="20" patternUnits="userSpaceOnUse">
          <rect width="20" height="20" fill="none" stroke="#2b2622" strokeWidth=".9" />
        </pattern>
        <pattern id={`${u}cl`} width="10" height="8" patternUnits="userSpaceOnUse">
          <rect width="10" height="1.6" fill="#b7c7cc" />
        </pattern>
        <pattern id={`${u}sp`} width="13" height="18" patternUnits="userSpaceOnUse">
          <rect x="4" y="1" width="4.5" height="15" rx="2.2" fill="#8c8378" />
          <rect x="5" y="2" width="1.4" height="12" rx=".7" fill="#d8d2c8" />
        </pattern>
      </defs>
      <rect x="9" y="17" width="148" height="190" rx="3" fill="#c9b48e" />
      <rect x="5" y="13" width="148" height="190" rx="3" fill="#fffaf0" />
      <rect x="14" y="4" width="130" height="18" fill={`url(#${u}sp)`} />
      <text x="30" y="44" fontFamily="Hanken Grotesk, sans-serif" fontSize="8.5" fontWeight="600" letterSpacing="1.5" fill="#4f7d8c">
        THE MINI · No. 214
      </text>
      <rect x="30" y="52" width="100" height="100" fill="#fffaf0" />
      <rect x="30" y="52" width="100" height="100" fill={`url(#${u}cw)`} stroke="#2b2622" strokeWidth="1.8" />
      <text x="36" y="68" fontFamily="La Belle Aurore, cursive" fontSize="15" fill="#4f7d8c">
        H
      </text>
      <text x="56" y="68" fontFamily="La Belle Aurore, cursive" fontSize="15" fill="#4f7d8c">
        E
      </text>
      <text x="36" y="88" fontFamily="La Belle Aurore, cursive" fontSize="15" fill="#4f7d8c">
        E
      </text>
      <rect x="30" y="160" width="100" height="36" fill={`url(#${u}cl)`} />
      <g transform="rotate(-34 96 150)">
        <rect x="40" y="146" width="96" height="8" fill="#d9a02c" />
        <rect x="40" y="149" width="96" height="2" fill="#b98415" />
        <path d="M136 146 L152 150 L136 154Z" fill="#e8c9a0" />
        <path d="M147 148.7 L152 150 L147 151.3Z" fill="#2b2622" />
        <rect x="30" y="146" width="10" height="8" fill="#9a958d" />
        <rect x="22" y="146" width="9" height="8" rx="2" fill="#d98a6a" />
      </g>
    </svg>
  );
}
