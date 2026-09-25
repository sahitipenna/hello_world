"use client";

import { useEffect, useState } from "react";

interface SectionRow {
  id: string;
  key: string;
  eyebrow: string;
  title: string;
  tagline: string;
  order: number;
  premium: boolean;
  enabled: boolean;
  minTimeMinutes: number;
  freeCount: number | null;
}

export default function SectionsAdmin() {
  const [sections, setSections] = useState<SectionRow[]>([]);
  const [drafts, setDrafts] = useState<Record<string, Partial<SectionRow>>>({});
  const [savingId, setSavingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  function load() {
    setLoading(true);
    fetch("/api/admin/sections")
      .then((r) => r.json())
      .then((d) => setSections(d.sections ?? []))
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  function draftValue<K extends keyof SectionRow>(row: SectionRow, key: K): SectionRow[K] {
    const d = drafts[row.id];
    return (d && key in d ? (d[key] as SectionRow[K]) : row[key]);
  }

  function setDraft(id: string, patch: Partial<SectionRow>) {
    setDrafts((d) => ({ ...d, [id]: { ...d[id], ...patch } }));
  }

  async function saveRow(row: SectionRow) {
    const patch = drafts[row.id];
    if (!patch) return;
    setSavingId(row.id);
    try {
      await fetch(`/api/admin/sections/${row.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      setDrafts((d) => {
        const next = { ...d };
        delete next[row.id];
        return next;
      });
      load();
    } finally {
      setSavingId(null);
    }
  }

  async function toggle(row: SectionRow, field: "premium" | "enabled") {
    await fetch(`/api/admin/sections/${row.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ [field]: !row[field] }),
    });
    load();
  }

  async function move(index: number, dir: -1 | 1) {
    const newIndex = index + dir;
    if (newIndex < 0 || newIndex >= sections.length) return;
    const next = [...sections];
    [next[index], next[newIndex]] = [next[newIndex], next[index]];
    setSections(next);
    await fetch("/api/admin/sections", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ keys: next.map((s) => s.key) }),
    });
    load();
  }

  if (loading) return <p className="text-sm text-ink/50">Loading sections…</p>;

  return (
    <div className="space-y-3">
      <p className="text-sm text-ink/60 mb-2">
        This drives the daily edition directly — reorder, rename, toggle premium/enabled, or change how many free
        users see, with no deploy.
      </p>
      {sections.map((row, i) => {
        const dirty = !!drafts[row.id];
        return (
          <div key={row.id} className="paper-card rounded-xl p-4 border border-ink/10">
            <div className="flex items-start gap-3 flex-wrap">
              <div className="flex flex-col shrink-0">
                <button
                  disabled={i === 0}
                  onClick={() => move(i, -1)}
                  className="text-ink/50 hover:text-ink disabled:opacity-20 text-xs leading-none px-1"
                >
                  {"▲"}
                </button>
                <button
                  disabled={i === sections.length - 1}
                  onClick={() => move(i, 1)}
                  className="text-ink/50 hover:text-ink disabled:opacity-20 text-xs leading-none px-1"
                >
                  {"▼"}
                </button>
              </div>

              <div className="flex-1 min-w-[240px] grid sm:grid-cols-2 gap-2">
                <label className="text-xs text-ink/50">
                  Key
                  <input value={row.key} disabled className="w-full rounded border border-ink/10 bg-ink/5 px-2 py-1 text-sm mt-0.5" />
                </label>
                <label className="text-xs text-ink/50">
                  Eyebrow
                  <input
                    value={draftValue(row, "eyebrow")}
                    onChange={(e) => setDraft(row.id, { eyebrow: e.target.value })}
                    className="w-full rounded border border-ink/15 bg-white px-2 py-1 text-sm mt-0.5"
                  />
                </label>
                <label className="text-xs text-ink/50 sm:col-span-2">
                  Title
                  <input
                    value={draftValue(row, "title")}
                    onChange={(e) => setDraft(row.id, { title: e.target.value })}
                    className="w-full rounded border border-ink/15 bg-white px-2 py-1 text-sm mt-0.5"
                  />
                </label>
                <label className="text-xs text-ink/50 sm:col-span-2">
                  Tagline
                  <input
                    value={draftValue(row, "tagline")}
                    onChange={(e) => setDraft(row.id, { tagline: e.target.value })}
                    className="w-full rounded border border-ink/15 bg-white px-2 py-1 text-sm mt-0.5"
                  />
                </label>
                <label className="text-xs text-ink/50">
                  Min time (minutes)
                  <input
                    type="number"
                    value={draftValue(row, "minTimeMinutes")}
                    onChange={(e) => setDraft(row.id, { minTimeMinutes: Number(e.target.value) })}
                    className="w-full rounded border border-ink/15 bg-white px-2 py-1 text-sm mt-0.5"
                  />
                </label>
                <label className="text-xs text-ink/50">
                  Free-plan item cap (blank = all)
                  <input
                    type="number"
                    value={draftValue(row, "freeCount") ?? ""}
                    onChange={(e) => setDraft(row.id, { freeCount: e.target.value === "" ? null : Number(e.target.value) })}
                    className="w-full rounded border border-ink/15 bg-white px-2 py-1 text-sm mt-0.5"
                  />
                </label>
              </div>

              <div className="flex flex-col gap-2 shrink-0">
                <button
                  onClick={() => toggle(row, "enabled")}
                  className={`text-xs font-medium rounded-full px-3 py-1 border ${
                    row.enabled ? "bg-sage/20 border-sage text-sage" : "bg-ink/5 border-ink/15 text-ink/50"
                  }`}
                >
                  {row.enabled ? "Enabled" : "Disabled"}
                </button>
                <button
                  onClick={() => toggle(row, "premium")}
                  className={`text-xs font-medium rounded-full px-3 py-1 border ${
                    row.premium ? "bg-mustard/20 border-mustard text-ink" : "bg-ink/5 border-ink/15 text-ink/50"
                  }`}
                >
                  {row.premium ? "Premium" : "Free"}
                </button>
                <button
                  onClick={() => saveRow(row)}
                  disabled={!dirty || savingId === row.id}
                  className="text-xs font-semibold rounded-full px-3 py-1 bg-ink text-paper disabled:opacity-30"
                >
                  {savingId === row.id ? "Saving…" : "Save"}
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
