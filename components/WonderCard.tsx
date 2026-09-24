"use client";

import { WonderT } from "@/lib/types";
import { useEditableSection } from "@/lib/useEditableSection";
import EditPencil from "./EditPencil";

export default function WonderCard({ dateISO, wonder }: { dateISO: string; wonder: WonderT }) {
  const { editing, values, setValue, toggle, saving } = useEditableSection(dateISO, "wonder", {
    title: wonder.title,
    body: wonder.body,
  });

  return (
    <div>
      <div className="flex justify-end -mt-1 mb-1">
        <EditPencil editing={editing} onClick={toggle} label="Wonder" disabled={saving} />
      </div>
      {editing ? (
        <div className="space-y-2">
          <p className="text-xs font-semibold text-terracotta">Editing this section — check to save.</p>
          <input
            type="text"
            value={values.title}
            onChange={(e) => setValue("title", e.target.value)}
            placeholder="Title"
            className="w-full rounded-md border border-dashed border-ink/30 bg-paper px-2 py-1.5 text-[15px] outline-none focus:border-terracotta"
          />
          <textarea
            value={values.body}
            onChange={(e) => setValue("body", e.target.value)}
            rows={5}
            className="w-full rounded-md border border-dashed border-ink/30 bg-paper px-2 py-1.5 text-sm leading-relaxed outline-none focus:border-terracotta resize-none"
          />
        </div>
      ) : (
        <>
          <h3 className="font-serif text-lg mb-2" style={{ fontFamily: "var(--font-fraunces), serif" }}>
            {values.title}
          </h3>
          <p className="text-[15px] leading-relaxed text-ink/85">{values.body}</p>
          {wonder.source && <p className="mt-3 text-xs text-ink/40">{wonder.source}</p>}
        </>
      )}
    </div>
  );
}
