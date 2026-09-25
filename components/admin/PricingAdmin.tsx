"use client";

import { useEffect, useState } from "react";

interface PlanRow {
  id: string;
  key: string;
  name: string;
  priceINR: number;
  priceUSD: number;
  interval: string;
  features: string[];
}

export default function PricingAdmin() {
  const [plans, setPlans] = useState<PlanRow[]>([]);
  const [drafts, setDrafts] = useState<Record<string, Partial<PlanRow> & { featuresText?: string }>>({});
  const [savingId, setSavingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  function load() {
    setLoading(true);
    fetch("/api/admin/pricing")
      .then((r) => r.json())
      .then((d) => setPlans(d.plans ?? []))
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  function draft(row: PlanRow) {
    return drafts[row.id] ?? {};
  }

  function setDraft(id: string, patch: Partial<PlanRow> & { featuresText?: string }) {
    setDrafts((d) => ({ ...d, [id]: { ...d[id], ...patch } }));
  }

  async function save(row: PlanRow) {
    const d = drafts[row.id];
    if (!d) return;
    setSavingId(row.id);
    try {
      const body: Record<string, unknown> = {};
      if (d.name !== undefined) body.name = d.name;
      if (d.priceINR !== undefined) body.priceINR = d.priceINR;
      if (d.priceUSD !== undefined) body.priceUSD = d.priceUSD;
      if (d.interval !== undefined) body.interval = d.interval;
      if (d.featuresText !== undefined) {
        body.features = d.featuresText.split("\n").map((f) => f.trim()).filter(Boolean);
      }
      await fetch(`/api/admin/pricing/${row.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      setDrafts((prev) => {
        const next = { ...prev };
        delete next[row.id];
        return next;
      });
      load();
    } finally {
      setSavingId(null);
    }
  }

  if (loading) return <p className="text-sm text-ink/50">Loading plans…</p>;

  return (
    <div className="space-y-4">
      <p className="text-sm text-ink/60 mb-2">This feeds /pricing directly — no copy lives in code.</p>
      {plans.map((row) => {
        const d = draft(row);
        const dirty = Object.keys(d).length > 0;
        return (
          <div key={row.id} className="paper-card rounded-xl p-4 border border-ink/10">
            <p className="text-xs text-ink/40 mb-2 uppercase tracking-wide">{row.key}</p>
            <div className="grid sm:grid-cols-3 gap-2 mb-2">
              <label className="text-xs text-ink/50">
                Name
                <input
                  value={d.name ?? row.name}
                  onChange={(e) => setDraft(row.id, { name: e.target.value })}
                  className="w-full rounded border border-ink/15 bg-white px-2 py-1 text-sm mt-0.5"
                />
              </label>
              <label className="text-xs text-ink/50">
                Price (INR / mo)
                <input
                  type="number"
                  value={d.priceINR ?? row.priceINR}
                  onChange={(e) => setDraft(row.id, { priceINR: Number(e.target.value) })}
                  className="w-full rounded border border-ink/15 bg-white px-2 py-1 text-sm mt-0.5"
                />
              </label>
              <label className="text-xs text-ink/50">
                Price (USD / mo)
                <input
                  type="number"
                  value={d.priceUSD ?? row.priceUSD}
                  onChange={(e) => setDraft(row.id, { priceUSD: Number(e.target.value) })}
                  className="w-full rounded border border-ink/15 bg-white px-2 py-1 text-sm mt-0.5"
                />
              </label>
            </div>
            <label className="text-xs text-ink/50 block mb-2">
              Features (one per line)
              <textarea
                rows={5}
                value={d.featuresText ?? row.features.join("\n")}
                onChange={(e) => setDraft(row.id, { featuresText: e.target.value })}
                className="w-full rounded border border-ink/15 bg-white px-2 py-1.5 text-sm mt-0.5 resize-none"
              />
            </label>
            <button
              onClick={() => save(row)}
              disabled={!dirty || savingId === row.id}
              className="text-xs font-semibold rounded-full px-3 py-1 bg-ink text-paper disabled:opacity-30"
            >
              {savingId === row.id ? "Saving…" : "Save"}
            </button>
          </div>
        );
      })}
    </div>
  );
}
