"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useEditableSection } from "@/lib/useEditableSection";
import EditPencil from "./EditPencil";

interface ArtData {
  title: string;
  artist: string;
  date: string;
  medium: string;
  image: string;
  sourceUrl: string;
  credit: string;
}

export default function ArtSpotlight({
  query,
  analysis,
  dateISO,
}: {
  query: string;
  analysis: string;
  dateISO: string;
}) {
  const [art, setArt] = useState<ArtData | null>(null);
  const [failed, setFailed] = useState(false);
  const { editing, values, setValue, toggle, saving } = useEditableSection(dateISO, "art", {
    title: art?.title ?? "",
    artist: art?.artist ?? "",
    credit: art?.credit ?? "",
    analysis,
  });

  useEffect(() => {
    let cancelled = false;
    setArt(null);
    setFailed(false);
    fetch(`/api/art?q=${encodeURIComponent(query)}&seed=${dateISO}&date=${dateISO}`)
      .then((r) => {
        if (!r.ok) throw new Error("bad response");
        return r.json();
      })
      .then((d) => {
        if (!cancelled) setArt(d);
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });
    return () => {
      cancelled = true;
    };
  }, [query, dateISO]);

  if (failed) {
    return (
      <p className="text-sm text-ink/50">
        Couldn&apos;t reach the museum&apos;s archive right now &mdash; today&apos;s spotlight was &ldquo;{query}&rdquo;. Try again shortly.
      </p>
    );
  }

  if (!art) {
    return <div className="h-40 rounded-lg bg-paper2 animate-pulse" />;
  }

  async function handleToggle() {
    const wasEditing = editing;
    const draft = values;
    await toggle();
    if (wasEditing) {
      setArt((prev) => (prev ? { ...prev, title: draft.title, artist: draft.artist, credit: draft.credit } : prev));
    }
  }

  return (
    <div>
      <div className="flex justify-end mb-1">
        <EditPencil editing={editing} onClick={handleToggle} label="Art Spotlight" disabled={saving} />
      </div>
      <div className="rounded-lg overflow-hidden bg-paper2 border border-ink/10">
        <Image
          src={art.image}
          alt={art.title}
          width={600}
          height={450}
          className="w-full h-auto object-contain max-h-72"
          unoptimized
        />
      </div>
      {editing ? (
        <div className="space-y-2 mt-3">
          <p className="text-xs font-semibold text-terracotta">Editing this caption — check to save.</p>
          <input
            type="text"
            value={values.title}
            onChange={(e) => setValue("title", e.target.value)}
            placeholder="Title"
            className="w-full rounded-md border border-dashed border-ink/30 bg-paper px-2 py-1.5 text-[15px] outline-none focus:border-terracotta"
          />
          <input
            type="text"
            value={values.artist}
            onChange={(e) => setValue("artist", e.target.value)}
            placeholder="Artist"
            className="w-full rounded-md border border-dashed border-ink/30 bg-paper px-2 py-1 text-sm outline-none focus:border-terracotta"
          />
          <input
            type="text"
            value={values.credit}
            onChange={(e) => setValue("credit", e.target.value)}
            placeholder="Credit line"
            className="w-full rounded-md border border-dashed border-ink/30 bg-paper px-2 py-1 text-xs outline-none focus:border-terracotta"
          />
          <textarea
            value={values.analysis}
            onChange={(e) => setValue("analysis", e.target.value)}
            rows={4}
            placeholder="What the piece is doing, at a deeper level"
            className="w-full rounded-md border border-dashed border-ink/30 bg-paper px-2 py-1.5 text-sm leading-relaxed outline-none focus:border-terracotta resize-none"
          />
        </div>
      ) : (
        <>
          <h3 className="font-serif text-lg mt-3" style={{ fontFamily: "var(--font-fraunces), serif" }}>
            {art.title}
          </h3>
          <p className="text-sm text-ink/60">
            {art.artist}
            {art.date ? `, ${art.date}` : ""}
          </p>
          {art.medium && <p className="text-xs text-ink/45 mt-0.5">{art.medium}</p>}
          <p className="mt-3 text-[15px] leading-relaxed text-ink/85">{values.analysis}</p>
          <p className="mt-3 text-xs text-ink/40">{art.credit}</p>
          <a
            href={art.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-1 text-sm text-sky underline decoration-dotted underline-offset-4"
          >
            View at the Met
          </a>
        </>
      )}
    </div>
  );
}
