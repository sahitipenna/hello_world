"use client";

import { useState } from "react";

interface Tag {
  id: string;
  slug: string;
  label: string;
  emoji: string;
}

export default function OnboardingModal({
  open,
  tags,
  initialSelected,
  onClose,
  onSave,
}: {
  open: boolean;
  tags: Tag[];
  initialSelected: string[];
  onClose: () => void;
  onSave: (slugs: string[]) => Promise<void>;
}) {
  const [selected, setSelected] = useState<Set<string>>(new Set(initialSelected));
  const [saving, setSaving] = useState(false);

  if (!open) return null;

  function toggle(slug: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
  }

  async function save() {
    setSaving(true);
    try {
      await onSave(Array.from(selected));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-ink/40" onClick={onClose} />
      <div className="relative bg-paper rounded-2xl shadow-2xl max-w-md w-full p-6 sm:p-7 animate-fade-in">
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-3 right-3 text-2xl leading-none text-ink/40 hover:text-ink"
        >
          ×
        </button>
        <p className="text-xs font-semibold uppercase tracking-wide text-mustard mb-2">Make it yours</p>
        <h2 className="font-serif text-2xl mb-2" style={{ fontFamily: "var(--font-fraunces), serif" }}>
          What draws your attention?
        </h2>
        <p className="text-sm text-ink/60 mb-5">
          Pick a few — we'll lean your poem, book, postcard, and puzzle toward them. Change this anytime.
        </p>
        <div className="flex flex-wrap gap-2 mb-6">
          {tags.map((tag) => {
            const active = selected.has(tag.slug);
            return (
              <button
                key={tag.slug}
                onClick={() => toggle(tag.slug)}
                className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium border transition-colors ${
                  active
                    ? "bg-terracotta text-paper border-terracotta"
                    : "bg-white/60 text-ink/70 border-ink/15 hover:border-ink/30"
                }`}
              >
                <span>{tag.emoji}</span>
                {tag.label}
              </button>
            );
          })}
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={save}
            disabled={saving}
            className="flex-1 text-sm font-semibold bg-ink text-paper rounded-full px-4 py-2.5 hover:bg-ink/85 transition-colors disabled:opacity-50"
          >
            {selected.size === 0 ? "Skip for now" : "Save interests"}
          </button>
        </div>
      </div>
    </div>
  );
}
