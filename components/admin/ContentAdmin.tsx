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

  function load() {
    setLoading(true);
    fetch(`/api/admin/content/${typeSlug}`)
      .then((r) => r.json())
      .then((d) => {
        setFields(d.fields ?? []);
        setRows(d.rows ?? []);
      })
      .finally(() => setLoading(false));
  }

  useEffect(load, [typeSlug]);

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

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm text-ink/60">{rows.length} items</p>
        {!adding && (
          <button
            onClick={() => setAdding(true)}
            className="text-xs font-semibold rounded-full px-3 py-1.5 bg-terracotta text-paper"
          >
            + Add new
          </button>
        )}
      </div>

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
