"use client";

import { useEffect, useState } from "react";

/**
 * Shared "pencil to edit" behavior for a section card: holds a local draft
 * per field, and on save PATCHes each field to the generic section-edit
 * API. Resets its draft whenever the underlying day's content changes
 * (new date navigated to, or a fresh save came back from the server).
 */
export function useEditableSection<T extends Record<string, string>>(
  dateISO: string,
  sectionId: string,
  initial: T
) {
  const [editing, setEditing] = useState(false);
  const [values, setValues] = useState<T>(initial);
  const [saving, setSaving] = useState(false);
  const initialKey = JSON.stringify(initial);

  useEffect(() => {
    setValues(initial);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateISO, sectionId, initialKey]);

  function setValue(field: keyof T, val: string) {
    setValues((v) => ({ ...v, [field]: val }));
  }

  async function toggle() {
    if (editing) {
      setSaving(true);
      try {
        await Promise.all(
          Object.entries(values).map(([field, value]) =>
            fetch("/api/section-edit", {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ dateISO, sectionId, field, value }),
            })
          )
        );
      } finally {
        setSaving(false);
      }
    }
    setEditing((e) => !e);
  }

  return { editing, values, setValue, toggle, saving };
}
