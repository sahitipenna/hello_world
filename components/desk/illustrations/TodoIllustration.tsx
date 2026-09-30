"use client";

import { useId } from "react";

export default function TodoIllustration() {
  const u = useId();
  return (
    <svg viewBox="0 0 140 165" width="100%" height="100%" preserveAspectRatio="none" style={{ display: "block", overflow: "visible" }}>
      <defs>
        <pattern id={`${u}tl`} width="10" height="20" patternUnits="userSpaceOnUse">
          <rect y="19" width="10" height="1" fill="#9dbac2" />
        </pattern>
      </defs>
      <rect x="4" y="6" width="134" height="157" rx="2" fill="#e8d7a8" />
      <rect x="2" y="4" width="134" height="157" rx="2" fill="#fbf1d2" />
      <rect x="2" y="42" width="134" height="116" fill={`url(#${u}tl)`} />
      <rect x="22" y="22" width="1.2" height="139" fill="#c1552c" opacity=".55" />
      <rect x="2" y="4" width="134" height="15" rx="2" fill="#c1552c" />
      <rect x="2" y="16" width="134" height="3" fill="#a8441f" />
      <text x="30" y="38" fontFamily="La Belle Aurore, cursive" fontSize="16" fontWeight="700" fill="#2b2622">
        today —
      </text>
      <g fill="none" stroke="#2b2622" strokeWidth="1.2">
        <rect x="30" y="48" width="9" height="9" />
        <rect x="30" y="68" width="9" height="9" />
        <rect x="30" y="88" width="9" height="9" />
        <rect x="30" y="108" width="9" height="9" />
        <rect x="30" y="128" width="9" height="9" />
      </g>
      <path d="M31 52 L34 56 L41 45" stroke="#c1552c" strokeWidth="2" fill="none" />
      <g fill="none" stroke="#4a423b" strokeWidth="1.3">
        <path d="M46 53 q6 -4 12 0 t12 0 t12 0 t12 0 t10 0" />
        <path d="M46 73 q6 -4 12 0 t12 0 t12 0 t10 0" />
        <path d="M46 93 q6 -4 12 0 t12 0 t12 0 t12 0 t12 0" />
        <path d="M46 113 q6 -4 12 0 t12 0 t12 0" />
        <path d="M46 133 q6 -4 12 0 t12 0 t12 0 t12 0" />
      </g>
      <path d="M44 52 L112 52" stroke="#c1552c" strokeWidth="1.2" opacity=".7" />
    </svg>
  );
}
