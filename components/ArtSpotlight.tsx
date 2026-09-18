"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface ArtData {
  title: string;
  artist: string;
  date: string;
  medium: string;
  image: string;
  sourceUrl: string;
  credit: string;
}

export default function ArtSpotlight({ query, dateISO }: { query: string; dateISO: string }) {
  const [art, setArt] = useState<ArtData | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setArt(null);
    setFailed(false);
    fetch(`/api/art?q=${encodeURIComponent(query)}&seed=${dateISO}`)
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

  return (
    <div>
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
      <h3 className="font-serif text-lg mt-3" style={{ fontFamily: "var(--font-fraunces), serif" }}>
        {art.title}
      </h3>
      <p className="text-sm text-ink/60">
        {art.artist}
        {art.date ? `, ${art.date}` : ""}
      </p>
      {art.medium && <p className="text-xs text-ink/45 mt-0.5">{art.medium}</p>}
      <p className="mt-2 text-xs text-ink/40">{art.credit}</p>
      <a
        href={art.sourceUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block mt-1 text-sm text-sky underline decoration-dotted underline-offset-4"
      >
        View at the Met
      </a>
    </div>
  );
}
