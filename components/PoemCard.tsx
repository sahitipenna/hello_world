"use client";

import { Poem } from "@/lib/types";
import { useEditableSection } from "@/lib/useEditableSection";
import EditPencil from "./EditPencil";

export default function PoemCard({ dateISO, poem }: { dateISO: string; poem: Poem }) {
  const { editing, values, setValue, toggle, saving } = useEditableSection(dateISO, "poem", {
    lines: poem.lines.join("\n"),
    title: poem.title,
    poet: poem.poet,
  });

  return (
    <div>
      <div className="flex justify-end -mt-1 mb-1">
        <EditPencil editing={editing} onClick={toggle} label="A Few Lines" disabled={saving} />
      </div>
      {editing ? (
        <div className="space-y-2">
          <p className="text-xs font-semibold text-terracotta">Editing this poem — check to save.</p>
          <textarea
            value={values.lines}
            onChange={(e) => setValue("lines", e.target.value)}
            rows={4}
            className="w-full rounded-md border border-dashed border-ink/30 bg-paper px-2 py-1.5 text-[15px] italic outline-none focus:border-terracotta resize-none"
            style={{ fontFamily: "var(--font-fraunces), serif" }}
          />
          <div className="flex gap-2">
            <input
              type="text"
              value={values.title}
              onChange={(e) => setValue("title", e.target.value)}
              placeholder="Title"
              className="flex-1 min-w-0 rounded-md border border-dashed border-ink/30 bg-paper px-2 py-1 text-sm outline-none focus:border-terracotta"
            />
            <input
              type="text"
              value={values.poet}
              onChange={(e) => setValue("poet", e.target.value)}
              placeholder="Poet"
              className="flex-1 min-w-0 rounded-md border border-dashed border-ink/30 bg-paper px-2 py-1 text-sm outline-none focus:border-terracotta"
            />
          </div>
        </div>
      ) : (
        <>
          <p
            className="font-serif text-lg sm:text-xl italic leading-relaxed whitespace-pre-line"
            style={{ fontFamily: "var(--font-fraunces), serif" }}
          >
            {values.lines}
          </p>
          <p className="mt-4 text-sm text-ink/60">
            <span className="font-medium text-ink/80">{values.title}</span>
            {" — "}
            {values.poet}
            {poem.year ? `, ${poem.year}` : ""}
          </p>
          <p className="mt-1 text-xs text-ink/40">Public domain</p>
        </>
      )}
    </div>
  );
}
