"use client";

import { TravelVignette } from "@/lib/types";
import { useEditableSection } from "@/lib/useEditableSection";
import EditPencil from "./EditPencil";

export default function TravelVignetteCard({ dateISO, vignette }: { dateISO: string; vignette: TravelVignette }) {
  const { editing, values, setValue, toggle, saving } = useEditableSection(dateISO, "travel", {
    place: vignette.place,
    title: vignette.title,
    body: vignette.body,
  });

  return (
    <div>
      <div className="flex justify-end -mt-1 mb-1">
        <EditPencil editing={editing} onClick={toggle} label="A Postcard" disabled={saving} />
      </div>
      {editing ? (
        <div className="space-y-2">
          <p className="text-xs font-semibold text-terracotta">Editing this section — check to save.</p>
          <input
            type="text"
            value={values.place}
            onChange={(e) => setValue("place", e.target.value)}
            placeholder="Place"
            className="w-full rounded-md border border-dashed border-ink/30 bg-paper px-2 py-1 text-xs uppercase tracking-wide outline-none focus:border-terracotta"
          />
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
          <p className="text-xs uppercase tracking-wide text-sky font-semibold mb-1">{values.place}</p>
          <h3 className="font-serif text-lg mb-2" style={{ fontFamily: "var(--font-fraunces), serif" }}>
            {values.title}
          </h3>
          <p className="text-[15px] leading-relaxed text-ink/85">{values.body}</p>
          <p className="mt-3 text-xs text-ink/40">An original vignette, written for Daybook</p>
        </>
      )}
    </div>
  );
}
