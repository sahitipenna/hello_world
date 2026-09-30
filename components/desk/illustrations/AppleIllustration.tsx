"use client";

import { useId } from "react";

export default function AppleIllustration() {
  const u = useId();
  return (
    <svg
      viewBox="0 0 90 95"
      width="100%"
      height="100%"
      style={{ overflow: "visible", filter: "drop-shadow(4px 7px 5px rgba(20,10,4,.38))" }}
    >
      <defs>
        <radialGradient id={`${u}ap`} cx=".35" cy=".3" r=".75">
          <stop offset="0" stopColor="#e0704a" />
          <stop offset=".6" stopColor="#c1552c" />
          <stop offset="1" stopColor="#8f3a1a" />
        </radialGradient>
        <clipPath id={`${u}apc`}>
          <circle cx="44" cy="52" r="38" />
        </clipPath>
        <mask id={`${u}bite`}>
          <rect x="-10" y="-10" width="110" height="115" fill="#fff" />
          <circle cx="84" cy="44" r="16" fill="#000" />
          <circle cx="80" cy="64" r="13" fill="#000" />
        </mask>
      </defs>
      <g mask={`url(#${u}bite)`}>
        <circle cx="44" cy="52" r="38" fill={`url(#${u}ap)`} />
        <g clipPath={`url(#${u}apc)`}>
          <circle cx="84" cy="44" r="21" fill="#f3e3b8" />
          <circle cx="80" cy="64" r="18" fill="#f3e3b8" />
          <circle cx="84" cy="44" r="18.5" fill="#faf0d2" />
          <circle cx="80" cy="64" r="15.5" fill="#faf0d2" />
        </g>
      </g>
      <ellipse cx="63" cy="51" rx="1.8" ry="3" fill="#3b2a1e" transform="rotate(20 63 51)" />
      <ellipse cx="62" cy="59" rx="1.8" ry="3" fill="#3b2a1e" transform="rotate(-15 62 59)" />
      <ellipse cx="30" cy="36" rx="9" ry="5" fill="#fff" opacity=".22" transform="rotate(-35 30 36)" />
      <path d="M44 18 Q44 10 48 4" stroke="#5a3a26" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M47 9 Q58 0 66 6 Q58 14 47 9Z" fill="#6d7f5c" />
      <path d="M48 9 L63 6" stroke="#56694a" strokeWidth=".8" />
    </svg>
  );
}
