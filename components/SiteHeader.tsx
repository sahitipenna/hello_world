"use client";

import Link from "next/link";
import { Plan } from "@/lib/types";

export default function SiteHeader({
  plan,
  onOpenCustomize,
  onOpenUpgrade,
  onOpenInterests,
}: {
  plan: Plan;
  onOpenCustomize: () => void;
  onOpenUpgrade: () => void;
  onOpenInterests: () => void;
}) {
  return (
    <header className="max-w-3xl mx-auto px-4 sm:px-6 pt-8 pb-4 flex items-center justify-between">
      <Link href="/" className="flex items-center gap-2">
        <svg viewBox="0 0 32 32" className="w-8 h-8 text-terracotta" fill="none">
          <circle cx="16" cy="16" r="13" stroke="currentColor" strokeWidth="1.6" />
          <path d="M16 8v8l5 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span
          className="font-serif text-2xl"
          style={{ fontFamily: "var(--font-caveat), cursive" }}
        >
          Daybook
        </span>
      </Link>
      <div className="flex items-center gap-2 sm:gap-3">
        <button
          onClick={onOpenInterests}
          className="text-sm font-medium text-ink/70 hover:text-ink px-2 py-1.5 rounded-md hover:bg-ink/5 transition-colors hidden sm:inline-block"
        >
          Interests
        </button>
        <button
          onClick={onOpenCustomize}
          className="text-sm font-medium text-ink/70 hover:text-ink px-2 py-1.5 rounded-md hover:bg-ink/5 transition-colors hidden sm:inline-block"
        >
          Customize
        </button>
        {plan === "free" ? (
          <button
            onClick={onOpenUpgrade}
            className="text-sm font-semibold bg-mustard text-ink rounded-full px-4 py-1.5 hover:brightness-95 transition"
          >
            Go Premium
          </button>
        ) : (
          <span className="text-xs font-semibold uppercase tracking-wide text-mustard border border-mustard/50 rounded-full px-3 py-1">
            Premium
          </span>
        )}
        <button
          onClick={onOpenInterests}
          aria-label="Your interests"
          className="sm:hidden w-8 h-8 rounded-full border border-ink/15 flex items-center justify-center"
        >
          {"❤"}
        </button>
        <button
          onClick={onOpenCustomize}
          aria-label="Customize sections"
          className="sm:hidden w-8 h-8 rounded-full border border-ink/15 flex items-center justify-center"
        >
          {"⚙"}
        </button>
      </div>
    </header>
  );
}
