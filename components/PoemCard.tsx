"use client";

import { Poem } from "@/lib/types";

export default function PoemCard({ poem }: { poem: Poem }) {
  return (
    <div>
      <p
        className="font-serif text-lg sm:text-xl italic leading-relaxed whitespace-pre-line"
        style={{ fontFamily: "var(--font-fraunces), serif" }}
      >
        {poem.lines.join("\n")}
      </p>
      <p className="mt-4 text-sm text-ink/60">
        <span className="font-medium text-ink/80">{poem.title}</span>
        {" — "}
        {poem.poet}
        {poem.year ? `, ${poem.year}` : ""}
      </p>
      {poem.context && <p className="mt-1 text-xs text-ink/45">{poem.context}</p>}
      {poem.sourceUrl && (
        <a
          href={poem.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-2 text-sm text-sky underline decoration-dotted underline-offset-4"
        >
          Read the full work
        </a>
      )}
    </div>
  );
}
