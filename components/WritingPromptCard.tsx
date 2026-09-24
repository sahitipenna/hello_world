"use client";

import { WritingPrompt } from "@/lib/types";
import { useEditableSection } from "@/lib/useEditableSection";
import EditPencil from "./EditPencil";

export default function WritingPromptCard({ dateISO, writing }: { dateISO: string; writing: WritingPrompt }) {
  const { editing, values, setValue, toggle, saving } = useEditableSection(dateISO, "writing", {
    prompt: writing.prompt,
  });

  return (
    <div>
      <div className="flex justify-end -mt-1 mb-1">
        <EditPencil editing={editing} onClick={toggle} label="Write Something" disabled={saving} />
      </div>
      <span className="inline-block text-[11px] uppercase tracking-wide font-semibold text-mustard border border-mustard/40 rounded-full px-2 py-0.5 mb-3">
        {writing.kind === "poem" ? "Poem prompt" : "Story prompt"}
      </span>
      {editing ? (
        <div className="space-y-2">
          <p className="text-xs font-semibold text-terracotta">Editing this prompt — check to save.</p>
          <textarea
            value={values.prompt}
            onChange={(e) => setValue("prompt", e.target.value)}
            rows={3}
            className="w-full rounded-md border border-dashed border-ink/30 bg-paper px-2 py-1.5 text-[15px] outline-none focus:border-terracotta resize-none"
          />
        </div>
      ) : (
        <p
          className="font-serif text-lg leading-relaxed"
          style={{ fontFamily: "var(--font-fraunces), serif" }}
        >
          {values.prompt}
        </p>
      )}
      <p className="mt-4 text-xs text-ink/40">Ten minutes, no pressure to finish it.</p>
    </div>
  );
}
