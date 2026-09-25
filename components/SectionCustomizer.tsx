"use client";

import { SectionMeta } from "@/lib/types";

export default function SectionCustomizer({
  open,
  onClose,
  sections,
  order,
  hidden,
  onReorder,
  onToggleHidden,
  onResetToSuggested,
  hasInterests,
}: {
  open: boolean;
  onClose: () => void;
  sections: SectionMeta[];
  order: string[];
  hidden: string[];
  onReorder: (order: string[]) => void;
  onToggleHidden: (key: string) => void;
  onResetToSuggested: () => void;
  hasInterests: boolean;
}) {
  if (!open) return null;

  function handleReset() {
    if (window.confirm("Reset which sections are shown based on your chosen interests? This replaces your current Hide/Show choices above.")) {
      onResetToSuggested();
    }
  }

  function move(key: string, dir: -1 | 1) {
    const idx = order.indexOf(key);
    const newIdx = idx + dir;
    if (newIdx < 0 || newIdx >= order.length) return;
    const next = [...order];
    [next[idx], next[newIdx]] = [next[newIdx], next[idx]];
    onReorder(next);
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-ink/30" onClick={onClose} />
      <div className="relative w-full max-w-sm h-full bg-paper shadow-2xl p-6 overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif text-xl" style={{ fontFamily: "var(--font-fraunces), serif" }}>
            Customize your page
          </h2>
          <button onClick={onClose} aria-label="Close" className="text-2xl leading-none text-ink/50 hover:text-ink">
            {"×"}
          </button>
        </div>
        <p className="text-sm text-ink/60 mb-3">
          Reorder sections or hide the ones that aren&apos;t for you today.
        </p>
        {hasInterests && (
          <button
            onClick={handleReset}
            className="text-xs font-medium text-terracotta hover:underline mb-4"
          >
            Reset to suggested, based on your interests
          </button>
        )}
        <ul className="space-y-2">
          {order.map((key, i) => {
            const meta = sections.find((s) => s.key === key);
            if (!meta) return null;
            const isHidden = hidden.includes(key);
            return (
              <li
                key={key}
                className={`flex items-center gap-2 rounded-lg border border-ink/10 p-2.5 bg-white ${
                  isHidden ? "opacity-45" : ""
                }`}
              >
                <div className="flex flex-col">
                  <button
                    disabled={i === 0}
                    onClick={() => move(key, -1)}
                    className="text-ink/50 hover:text-ink disabled:opacity-20 text-xs leading-none px-1"
                    aria-label="Move up"
                  >
                    {"▲"}
                  </button>
                  <button
                    disabled={i === order.length - 1}
                    onClick={() => move(key, 1)}
                    className="text-ink/50 hover:text-ink disabled:opacity-20 text-xs leading-none px-1"
                    aria-label="Move down"
                  >
                    {"▼"}
                  </button>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{meta.title}</p>
                  <p className="text-xs text-ink/45 truncate">{meta.tagline}</p>
                </div>
                <button
                  onClick={() => onToggleHidden(key)}
                  className="text-xs font-medium rounded-full px-2.5 py-1 border border-ink/15 hover:bg-ink/5 shrink-0"
                >
                  {isHidden ? "Show" : "Hide"}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
