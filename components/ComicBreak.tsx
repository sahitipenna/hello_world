"use client";

import { ComicInsight } from "@/lib/types";
import { useEditableSection } from "@/lib/useEditableSection";
import EditPencil from "./EditPencil";

export default function ComicBreak({
  dateISO,
  label,
  url,
  insight,
}: {
  dateISO: string;
  label: string;
  url: string;
  insight: ComicInsight;
}) {
  const { editing, values, setValue, toggle, saving } = useEditableSection(dateISO, "comic", {
    theme: insight.theme,
    tidbit: insight.tidbit,
  });

  return (
    <div>
      <div className="flex justify-end -mt-1 mb-1">
        <EditPencil editing={editing} onClick={toggle} label="Comic Break" disabled={saving} />
      </div>

      {editing ? (
        <div className="space-y-2">
          <p className="text-xs font-semibold text-terracotta">Editing this section — check to save.</p>
          <input
            type="text"
            value={values.theme}
            onChange={(e) => setValue("theme", e.target.value)}
            placeholder="Theme"
            className="w-full rounded-md border border-dashed border-ink/30 bg-paper px-2 py-1.5 text-[15px] font-medium outline-none focus:border-terracotta"
          />
          <textarea
            value={values.tidbit}
            onChange={(e) => setValue("tidbit", e.target.value)}
            rows={4}
            className="w-full rounded-md border border-dashed border-ink/30 bg-paper px-2 py-1.5 text-sm leading-relaxed outline-none focus:border-terracotta resize-none"
          />
        </div>
      ) : (
        <>
          <h3 className="font-serif text-lg mb-2" style={{ fontFamily: "var(--font-fraunces), serif" }}>
            {values.theme}
          </h3>
          <p className="text-[15px] leading-relaxed text-ink/85">{values.tidbit}</p>

          {insight.connections.length > 0 && (
            <div className="mt-4 pt-3 border-t border-ink/10">
              <p className="text-xs font-semibold text-plum mb-1.5">Worth thinking about alongside</p>
              <ul className="space-y-1.5">
                {insight.connections.map((c, i) => (
                  <li key={i} className="text-sm text-ink/75">
                    <span className="font-medium text-ink/90">{c.work}</span>
                    {" — "}
                    {c.note}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-4 pt-3 border-t border-ink/10 flex items-center justify-between gap-2">
            <p className="text-xs text-ink/40">
              Today&apos;s <span className="font-medium text-ink/55">{label}</span> strip
            </p>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-sky underline decoration-dotted underline-offset-4 whitespace-nowrap"
            >
              Read it on GoComics {"→"}
            </a>
          </div>
          <p className="mt-2 text-[11px] text-ink/35">
            {"©"} its respective owner &mdash; we link to the official archive rather than reproducing it.
          </p>
        </>
      )}
    </div>
  );
}
