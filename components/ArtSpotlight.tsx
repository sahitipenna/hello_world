"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { LookContent } from "@/lib/types";

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
  custom,
  dateISO,
}: {
  query: string;
  analysis: string;
  custom: LookContent["custom"];
  dateISO: string;
}) {
  const [art, setArt] = useState<ArtData | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (custom) return; // an editor's own image — nothing to fetch
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
  }, [query, dateISO, custom]);

  const resolved: ArtData | null = custom
    ? {
        title: custom.title,
        artist: custom.artist,
        date: custom.year,
        medium: custom.medium,
        image: custom.image,
        sourceUrl: custom.sourceUrl ?? "",
        credit: custom.museum,
      }
    : art;

  if (!custom && failed) {
    return (
      <p className="text-sm text-ink/50">
        Couldn&apos;t reach the museum&apos;s archive right now &mdash; today&apos;s spotlight was &ldquo;{query}&rdquo;. Try again shortly.
      </p>
    );
  }

  if (!resolved) {
    return <div className="h-40 rounded-lg bg-paper2 animate-pulse" />;
  }

  return (
    <div>
      <div className="rounded-lg overflow-hidden bg-paper2 border border-ink/10">
        <Image
          src={resolved.image}
          alt={resolved.title}
          width={600}
          height={450}
          className="w-full h-auto object-contain max-h-72"
          unoptimized
        />
      </div>
      <h3 className="font-serif text-lg mt-3" style={{ fontFamily: "var(--font-fraunces), serif" }}>
        {resolved.title}
      </h3>
      <p className="text-sm text-ink/60">
        {resolved.artist}
        {resolved.date ? `, ${resolved.date}` : ""}
      </p>
      {resolved.medium && <p className="text-xs text-ink/45 mt-0.5">{resolved.medium}</p>}
      <p className="mt-3 text-[15px] leading-relaxed text-ink/85">{analysis}</p>
      {resolved.credit && <p className="mt-3 text-xs text-ink/40">{resolved.credit}</p>}
      {resolved.sourceUrl && (
        <a
          href={resolved.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-1 text-sm text-sky underline decoration-dotted underline-offset-4"
        >
          {custom ? "View source" : "View at the Met"}
        </a>
      )}
    </div>
  );
}
