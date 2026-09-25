"use client";

import { ReactNode, useState } from "react";
import { SectionMeta } from "@/lib/types";

export default function SectionCard({
  meta,
  locked,
  collapsed = false,
  onUnlockClick,
  children,
  accent = "terracotta",
}: {
  meta: SectionMeta;
  locked: boolean;
  collapsed?: boolean;
  onUnlockClick: () => void;
  children: ReactNode;
  accent?: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const showTeaser = collapsed && !locked && !expanded;

  return (
    <section className="animate-fade-in break-inside-avoid mb-6 rounded-2xl paper-card shadow-card p-5 sm:p-6 relative overflow-hidden">
      <div
        className="absolute left-0 top-0 h-full w-1.5"
        style={{ backgroundColor: accentColor(accent) }}
        aria-hidden
      />
      <header className="mb-3 flex items-start justify-between gap-3">
        <div>
          <h2 className="font-serif text-xl sm:text-2xl leading-tight" style={{ fontFamily: "var(--font-fraunces), serif" }}>
            {meta.title}
          </h2>
          <p className="text-sm text-ink/60 mt-0.5">{meta.tagline}</p>
        </div>
        {meta.premium && (
          <span className="shrink-0 text-[11px] uppercase tracking-wide font-semibold text-mustard border border-mustard/40 rounded-full px-2 py-0.5">
            Premium
          </span>
        )}
      </header>

      {locked ? (
        <div className="relative">
          <div className="pointer-events-none select-none blur-sm opacity-50">{children}</div>
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-paper/40 backdrop-blur-[1px] rounded-xl">
            <p className="text-sm text-ink/70 text-center px-4">This section is part of Go Dilly Premium.</p>
            <button
              onClick={onUnlockClick}
              className="text-sm font-semibold bg-ink text-paper rounded-full px-4 py-1.5 hover:bg-ink/85 transition-colors"
            >
              Unlock premium
            </button>
          </div>
        </div>
      ) : showTeaser ? (
        <button
          onClick={() => setExpanded(true)}
          className="w-full text-left text-sm text-ink/60 border border-dashed border-ink/20 rounded-lg px-3 py-2.5 hover:border-ink/40 hover:text-ink/80 transition-colors"
        >
          A quick one for today — tap to open it up.
        </button>
      ) : (
        children
      )}
    </section>
  );
}

function accentColor(name: string) {
  const map: Record<string, string> = {
    terracotta: "#c1552c",
    sage: "#6d7f5c",
    mustard: "#d9a02c",
    plum: "#6b4a63",
    sky: "#4f7d8c",
  };
  return map[name] || map.terracotta;
}
