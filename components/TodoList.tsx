"use client";

import { useEffect, useState } from "react";
import EditPencil from "./EditPencil";

export default function TodoList({
  dateKey,
  todos,
  checks,
  onChecksChange,
  label = "This Week",
  period = "this week",
  hiddenCount = 0,
  onUnlockClick,
}: {
  dateKey: string;
  todos: string[];
  checks: Record<number, boolean>;
  onChecksChange: (checks: Record<number, boolean>) => void;
  label?: string;
  period?: string;
  hiddenCount?: number;
  onUnlockClick?: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const [drafts, setDrafts] = useState<string[]>(todos);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setDrafts(todos);
  }, [dateKey, todos]);

  async function toggle(i: number) {
    const next = { ...checks, [i]: !checks[i] };
    onChecksChange(next);
    await fetch("/api/todos/checks", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ dateISO: dateKey, index: i, done: next[i] }),
    });
  }

  async function toggleEdit() {
    if (editing) {
      setSaving(true);
      try {
        await Promise.all(
          drafts.map((text, i) =>
            text.trim() && text.trim() !== todos[i]
              ? fetch("/api/todos/edit", {
                  method: "PATCH",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ dateISO: dateKey, index: i, text: text.trim() }),
                })
              : Promise.resolve()
          )
        );
      } finally {
        setSaving(false);
      }
    }
    setEditing((e) => !e);
  }

  const doneCount = Object.values(checks).filter(Boolean).length;

  return (
    <div>
      <div className="flex justify-end -mt-1 mb-2">
        <EditPencil editing={editing} onClick={toggleEdit} label={label} disabled={saving} />
      </div>
      {editing && <p className="text-xs font-semibold text-terracotta mb-3">Editing prompt text — check to save.</p>}
      <ul className="space-y-2.5">
        {drafts.map((t, i) => (
          <li key={i}>
            {editing ? (
              <input
                type="text"
                value={t}
                onChange={(e) => setDrafts((d) => d.map((v, idx) => (idx === i ? e.target.value : v)))}
                className="w-full rounded-md border border-dashed border-ink/30 bg-paper px-2 py-1.5 text-[15px] outline-none focus:border-terracotta"
              />
            ) : (
              <label className="flex items-start gap-3 cursor-pointer group">
                <span
                  className={`mt-0.5 shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                    checks[i] ? "bg-sage border-sage" : "border-ink/30 group-hover:border-sage"
                  }`}
                >
                  {checks[i] && (
                    <svg viewBox="0 0 12 10" className="w-2.5 h-2.5" fill="none">
                      <path d="M1 5L4.5 8.5L11 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </span>
                <input type="checkbox" className="sr-only" checked={!!checks[i]} onChange={() => toggle(i)} />
                <span className={`text-[15px] leading-snug ${checks[i] ? "line-through text-ink/40" : "text-ink/90"}`}>
                  {t}
                </span>
              </label>
            )}
          </li>
        ))}
      </ul>
      {!editing && (
        <p className="mt-4 text-xs text-ink/50">
          {doneCount} of {drafts.length} done {period}
        </p>
      )}
      {!editing && hiddenCount > 0 && (
        <button
          onClick={onUnlockClick}
          className="mt-3 w-full text-sm font-medium text-ink/60 border border-dashed border-ink/25 rounded-lg px-3 py-2.5 hover:border-terracotta hover:text-terracotta transition-colors"
        >
          +{hiddenCount} more with Premium
        </button>
      )}
    </div>
  );
}
