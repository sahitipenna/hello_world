"use client";

import { useEffect, useState } from "react";

interface MetaRow {
  pool: string;
  label: string;
  description: string;
}

const POOL_NAME: Record<string, string> = {
  mug: "Mug",
  plant: "Plant",
  headphones: "Headphones",
  apple: "Apple",
};

/** The 4 "on the side" desk objects aren't real Section rows (see
 * lib/deskLayout.ts's doc comment — they can't be hidden/locked, don't
 * count toward "n of 8", aren't in the Arrange card), so they don't belong
 * mixed into SectionsAdmin's own list. Shown as a second, simpler block
 * further down the same Sections tab instead — same idea (title +
 * description, no deploy needed) with no reorder/enable/premium controls,
 * since those genuinely don't apply here. */
export default function SideObjectMetaAdmin() {
  const [rows, setRows] = useState<MetaRow[]>([]);
  const [drafts, setDrafts] = useState<Record<string, Partial<MetaRow>>>({});
  const [savingPool, setSavingPool] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  function load() {
    setLoading(true);
    fetch("/api/admin/side-object-meta")
      .then((r) => r.json())
      .then((d) => setRows(d.meta ?? []))
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  function draftValue<K extends keyof MetaRow>(row: MetaRow, key: K): MetaRow[K] {
    const d = drafts[row.pool];
    return d && key in d ? (d[key] as MetaRow[K]) : row[key];
  }

  function setDraft(pool: string, patch: Partial<MetaRow>) {
    setDrafts((d) => ({ ...d, [pool]: { ...d[pool], ...patch } }));
  }

  async function saveRow(row: MetaRow) {
    const patch = drafts[row.pool];
    if (!patch) return;
    setSavingPool(row.pool);
    try {
      await fetch(`/api/admin/side-object-meta/${row.pool}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      setDrafts((d) => {
        const next = { ...d };
        delete next[row.pool];
        return next;
      });
      load();
    } finally {
      setSavingPool(null);
    }
  }

  if (loading) return <p className="text-sm text-ink/50">Loading…</p>;

  return (
    <div className="space-y-3">
      {rows.map((row) => {
        const dirty = !!drafts[row.pool];
        return (
          <div key={row.pool} className="paper-card rounded-xl p-4 border border-ink/10">
            <div className="flex items-start gap-3 flex-wrap">
              <div className="flex-1 min-w-[240px] grid sm:grid-cols-2 gap-2">
                <label className="text-xs text-ink/50">
                  Object
                  <input
                    value={POOL_NAME[row.pool] ?? row.pool}
                    disabled
                    className="w-full rounded border border-ink/10 bg-ink/5 px-2 py-1 text-sm mt-0.5"
                  />
                </label>
                <label className="text-xs text-ink/50">
                  Title (the label shown under its icon on the desk)
                  <input
                    value={draftValue(row, "label")}
                    onChange={(e) => setDraft(row.pool, { label: e.target.value })}
                    className="w-full rounded border border-ink/15 bg-white px-2 py-1 text-sm mt-0.5"
                  />
                </label>
                <label className="text-xs text-ink/50 sm:col-span-2">
                  Description (shown when its panel opens)
                  <input
                    value={draftValue(row, "description")}
                    onChange={(e) => setDraft(row.pool, { description: e.target.value })}
                    className="w-full rounded border border-ink/15 bg-white px-2 py-1 text-sm mt-0.5"
                  />
                </label>
              </div>
              <div className="flex flex-col gap-2 shrink-0">
                <button
                  onClick={() => saveRow(row)}
                  disabled={!dirty || savingPool === row.pool}
                  className="text-xs font-semibold rounded-full px-3 py-1 bg-ink text-paper disabled:opacity-30"
                >
                  {savingPool === row.pool ? "Saving…" : "Save"}
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
