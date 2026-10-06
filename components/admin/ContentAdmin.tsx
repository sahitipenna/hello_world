"use client";

import { useEffect, useState } from "react";

interface FieldDef {
  key: string;
  label: string;
  kind: "text" | "textarea" | "number" | "date" | "json";
  required?: boolean;
}

type Row = Record<string, unknown> & { id: string };

function toFieldString(value: unknown, kind: FieldDef["kind"]): string {
  if (value === null || value === undefined) return "";
  if (kind === "json") return JSON.stringify(value, null, 2);
  return String(value);
}

function FieldInput({
  field,
  value,
  onChange,
}: {
  field: FieldDef;
  value: string;
  onChange: (v: string) => void;
}) {
  if (field.kind === "textarea" || field.kind === "json") {
    return (
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={field.kind === "json" ? 4 : 3}
        className={`w-full rounded border border-ink/15 bg-white px-2 py-1.5 text-sm mt-0.5 resize-none ${
          field.kind === "json" ? "font-mono text-xs" : ""
        }`}
      />
    );
  }
  return (
    <input
      type={field.kind === "number" ? "number" : field.kind === "date" ? "text" : "text"}
      placeholder={field.kind === "date" ? "YYYY-MM-DD, optional" : undefined}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded border border-ink/15 bg-white px-2 py-1 text-sm mt-0.5"
    />
  );
}

function RowForm({
  fields,
  initial,
  onCancel,
  onSubmit,
  submitLabel,
}: {
  fields: FieldDef[];
  initial: Record<string, string>;
  onCancel: () => void;
  onSubmit: (values: Record<string, string>) => Promise<void>;
  submitLabel: string;
}) {
  const [values, setValues] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    setSaving(true);
    setError(null);
    try {
      await onSubmit(values);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="grid sm:grid-cols-2 gap-2">
      {fields.map((f) => (
        <label
          key={f.key}
          className={`text-xs text-ink/50 ${f.kind === "textarea" || f.kind === "json" ? "sm:col-span-2" : ""}`}
        >
          {f.label}
          {f.required && <span className="text-terracotta"> *</span>}
          <FieldInput field={f} value={values[f.key] ?? ""} onChange={(v) => setValues((s) => ({ ...s, [f.key]: v }))} />
        </label>
      ))}
      {error && <p className="text-xs text-terracotta sm:col-span-2">{error}</p>}
      <div className="sm:col-span-2 flex gap-2 mt-1">
        <button
          onClick={submit}
          disabled={saving}
          className="text-xs font-semibold rounded-full px-3 py-1.5 bg-ink text-paper disabled:opacity-50"
        >
          {saving ? "Saving…" : submitLabel}
        </button>
        <button onClick={onCancel} className="text-xs font-medium rounded-full px-3 py-1.5 border border-ink/15">
          Cancel
        </button>
      </div>
    </div>
  );
}

export default function ContentAdmin({ typeSlug }: { typeSlug: string }) {
  const [fields, setFields] = useState<FieldDef[]>([]);
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [hasStarterContent, setHasStarterContent] = useState(false);
  const [importingStarter, setImportingStarter] = useState(false);
  const [warming, setWarming] = useState(false);
  const [warmProgress, setWarmProgress] = useState<{ done: number; total: number } | null>(null);
  const [warmDiagnostics, setWarmDiagnostics] = useState<{ title: string; diagnostic: string }[]>([]);

  function load() {
    setLoading(true);
    fetch(`/api/admin/content/${typeSlug}`)
      .then((r) => r.json())
      .then((d) => {
        setFields(d.fields ?? []);
        setRows(d.rows ?? []);
        setHasStarterContent(Boolean(d.hasStarterContent));
      })
      .finally(() => setLoading(false));
  }

  useEffect(load, [typeSlug]);

  async function importStarterContent() {
    setImportingStarter(true);
    try {
      await fetch(`/api/admin/content/${typeSlug}/starter`, { method: "POST" });
      load();
    } finally {
      setImportingStarter(false);
    }
  }

  // Artwork-only: resolves every row that has no cached image yet against
  // the Met, one at a time, so a real visitor almost always finds the image
  // already sitting in the DB instead of being the one who triggers (and
  // waits on, and risks a flaky result from) a live lookup. See
  // app/api/admin/artwork/[id]/resolve/route.ts for the actual fetch.
  async function warmImageCache() {
    const uncached = rows.filter((r) => !r.image);
    if (uncached.length === 0) return;
    setWarming(true);
    setWarmProgress({ done: 0, total: uncached.length });
    setWarmDiagnostics([]);
    let done = 0;
    const failures: { title: string; diagnostic: string }[] = [];
    for (const row of uncached) {
      const r = await fetch(`/api/admin/artwork/${row.id}/resolve`, { method: "POST" })
        .then((res) => res.json())
        .catch((e) => ({ resolved: false, diagnostic: e instanceof Error ? e.message : "request failed" }));
      if (!r.resolved) {
        failures.push({ title: String(row.title ?? row.id), diagnostic: r.diagnostic ?? "unknown error" });
      }
      done += 1;
      setWarmProgress({ done, total: uncached.length });
      // The real pacing — against the Met's documented 80 req/s ceiling —
      // happens per-request inside lib/metArt.ts, shared by every call a
      // single resolve makes (1 search + up to 6 object lookups). That
      // only holds within one serverless invocation though, and each
      // artwork here is its own POST (possibly its own cold start, with
      // no memory of the last one's pacing) — this small gap is just
      // extra margin for that.
      await new Promise((resolve) => setTimeout(resolve, 150));
    }
    setWarmDiagnostics(failures);
    setWarming(false);
    load();
  }

  function blankValues(): Record<string, string> {
    const v: Record<string, string> = {};
    fields.forEach((f) => (v[f.key] = ""));
    return v;
  }

  function rowValues(row: Row): Record<string, string> {
    const v: Record<string, string> = {};
    fields.forEach((f) => (v[f.key] = toFieldString(row[f.key], f.kind)));
    return v;
  }

  async function createRow(values: Record<string, string>) {
    const res = await fetch(`/api/admin/content/${typeSlug}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    if (!res.ok) {
      const d = await res.json().catch(() => ({}));
      throw new Error(d.error || "Couldn't create this item.");
    }
    setAdding(false);
    load();
  }

  async function updateRow(id: string, values: Record<string, string>) {
    const res = await fetch(`/api/admin/content/${typeSlug}/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    if (!res.ok) {
      const d = await res.json().catch(() => ({}));
      throw new Error(d.error || "Couldn't save this item.");
    }
    setEditingId(null);
    load();
  }

  async function deleteRow(id: string) {
    if (!confirm("Delete this item? This can't be undone.")) return;
    await fetch(`/api/admin/content/${typeSlug}/${id}`, { method: "DELETE" });
    load();
  }

  if (loading) return <p className="text-sm text-ink/50">Loading…</p>;

  const titleField = fields.find((f) => f.key === "title" || f.key === "work") ?? fields[0];
  const uncachedCount = typeSlug === "artwork" ? rows.filter((r) => !r.image).length : 0;

  return (
    <div className="space-y-3">
      {typeSlug === "artwork" && (
        <p className="text-xs text-ink/50">
          {uncachedCount === 0
            ? "Every artwork has a cached image — visitors never wait on a live Met lookup."
            : `${uncachedCount} of ${rows.length} have no cached image yet — those visitors are the ones who could see "couldn't reach the museum's archive" if the Met is briefly slow.`}
        </p>
      )}
      <div className="flex items-center justify-between">
        <p className="text-sm text-ink/60">{rows.length} items</p>
        <div className="flex gap-2">
          {typeSlug === "artwork" && uncachedCount > 0 && (
            <button
              onClick={warmImageCache}
              disabled={warming}
              title="Resolves every artwork with no cached image against the Met right now, so visitors read from the DB instead of triggering a live lookup themselves."
              className="text-xs font-semibold rounded-full px-3 py-1.5 border border-terracotta/40 text-terracotta hover:bg-terracotta/10 disabled:opacity-50"
            >
              {warming && warmProgress ? `Resolving ${warmProgress.done}/${warmProgress.total}…` : "Warm image cache"}
            </button>
          )}
          {hasStarterContent && (
            <button
              onClick={importStarterContent}
              disabled={importingStarter}
              title="Imports the ready-made content for this one — safe to click again later, it just re-syncs the same starter rows."
              className="text-xs font-semibold rounded-full px-3 py-1.5 border border-terracotta/40 text-terracotta hover:bg-terracotta/10 disabled:opacity-50"
            >
              {importingStarter ? "Adding…" : "Use starter content"}
            </button>
          )}
        </div>
      </div>

      {warmDiagnostics.length > 0 && (
        <div className="rounded-lg border border-terracotta/30 bg-terracotta/5 p-3 space-y-1">
          <p className="text-xs font-semibold text-terracotta">
            {warmDiagnostics.length} still unresolved — here's what actually happened for each:
          </p>
          {warmDiagnostics.map((d, i) => (
            <p key={i} className="text-xs text-ink/60 font-mono">
              <span className="text-ink/80">{d.title}:</span> {d.diagnostic}
            </p>
          ))}
        </div>
      )}

      {!adding && (
        <div className="flex justify-end">
          <button
            onClick={() => setAdding(true)}
            className="text-xs font-semibold rounded-full px-3 py-1.5 bg-terracotta text-paper"
          >
            + Add new
          </button>
        </div>
      )}

      {adding && (
        <div className="paper-card rounded-xl p-4 border border-dashed border-terracotta/50">
          <RowForm fields={fields} initial={blankValues()} onCancel={() => setAdding(false)} onSubmit={createRow} submitLabel="Create" />
        </div>
      )}

      {rows.map((row) => (
        <div key={row.id} className="paper-card rounded-xl p-4 border border-ink/10">
          {editingId === row.id ? (
            <RowForm
              fields={fields}
              initial={rowValues(row)}
              onCancel={() => setEditingId(null)}
              onSubmit={(v) => updateRow(row.id, v)}
              submitLabel="Save"
            />
          ) : (
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">{titleField ? String(row[titleField.key] ?? "") : row.id}</p>
                {row.scheduledDate ? (
                  <p className="text-xs text-ink/40 mt-0.5">Scheduled: {String(row.scheduledDate)}</p>
                ) : (
                  <p className="text-xs text-ink/40 mt-0.5">Rotates in the unscheduled pool</p>
                )}
              </div>
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => setEditingId(row.id)}
                  className="text-xs font-medium rounded-full px-3 py-1 border border-ink/15 hover:bg-ink/5"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteRow(row.id)}
                  className="text-xs font-medium rounded-full px-3 py-1 border border-terracotta/40 text-terracotta hover:bg-terracotta/10"
                >
                  Delete
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
