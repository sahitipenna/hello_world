"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import SectionsAdmin from "./SectionsAdmin";
import PricingAdmin from "./PricingAdmin";
import ContentAdmin from "./ContentAdmin";

const CONTENT_TYPES = [
  { slug: "news", label: "News items — KNOW" },
  { slug: "artwork", label: "Artwork — LOOK" },
  { slug: "literary", label: "Literary excerpts — READ" },
  { slug: "travel", label: "Travel pieces — WANDER" },
  { slug: "book", label: "Books — READ NEXT" },
  { slug: "wonder", label: "Wonder facts — WONDER" },
  { slug: "task", label: "Little things to do — DO" },
  { slug: "crossword-theme", label: "Crossword themes — PLAY" },
];

type Tab = "sections" | "pricing" | "content";

export default function AdminDashboard() {
  const [tab, setTab] = useState<Tab>("sections");
  const [contentType, setContentType] = useState(CONTENT_TYPES[0].slug);
  const router = useRouter();

  async function signOut() {
    await fetch("/api/admin/login", { method: "DELETE" });
    router.refresh();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <nav className="flex gap-2">
          {(["sections", "pricing", "content"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`text-sm font-medium rounded-full px-4 py-1.5 border transition-colors capitalize ${
                tab === t ? "bg-ink text-paper border-ink" : "bg-white text-ink/70 border-ink/15 hover:border-ink/30"
              }`}
            >
              {t}
            </button>
          ))}
        </nav>
        <button onClick={signOut} className="text-xs text-ink/50 underline decoration-dotted underline-offset-4">
          Sign out
        </button>
      </div>

      {tab === "sections" && <SectionsAdmin />}
      {tab === "pricing" && <PricingAdmin />}
      {tab === "content" && (
        <div>
          <div className="flex flex-wrap gap-2 mb-5">
            {CONTENT_TYPES.map((ct) => (
              <button
                key={ct.slug}
                onClick={() => setContentType(ct.slug)}
                className={`text-xs font-medium rounded-full px-3 py-1.5 border transition-colors ${
                  contentType === ct.slug
                    ? "bg-terracotta text-paper border-terracotta"
                    : "bg-white text-ink/70 border-ink/15 hover:border-ink/30"
                }`}
              >
                {ct.label}
              </button>
            ))}
          </div>
          <ContentAdmin key={contentType} typeSlug={contentType} />
        </div>
      )}
    </div>
  );
}
