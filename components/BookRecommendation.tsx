"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { BookRec } from "@/lib/types";
import { useEditableSection } from "@/lib/useEditableSection";
import EditPencil from "./EditPencil";

export default function BookRecommendation({ dateISO, book }: { dateISO: string; book: BookRec }) {
  const [cover, setCover] = useState<string | null>(null);
  const [sourceUrl, setSourceUrl] = useState<string | null>(null);
  const { editing, values, setValue, toggle, saving } = useEditableSection(dateISO, "book", {
    title: book.title,
    author: book.author,
    reason: book.reason,
  });

  useEffect(() => {
    let cancelled = false;
    setCover(null);
    setSourceUrl(null);
    fetch(`/api/book?title=${encodeURIComponent(book.title)}&author=${encodeURIComponent(book.author)}`)
      .then((r) => r.json())
      .then((d) => {
        if (!cancelled) {
          setCover(d.cover);
          setSourceUrl(d.sourceUrl);
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [book.title, book.author]);

  return (
    <div>
      <div className="flex justify-end -mt-1 mb-1">
        <EditPencil editing={editing} onClick={toggle} label="Shelf Recommendation" disabled={saving} />
      </div>
      {editing ? (
        <div className="space-y-2">
          <p className="text-xs font-semibold text-terracotta">Editing this section — check to save.</p>
          <input
            type="text"
            value={values.title}
            onChange={(e) => setValue("title", e.target.value)}
            placeholder="Book title"
            className="w-full rounded-md border border-dashed border-ink/30 bg-paper px-2 py-1.5 text-[15px] outline-none focus:border-terracotta"
          />
          <input
            type="text"
            value={values.author}
            onChange={(e) => setValue("author", e.target.value)}
            placeholder="Author"
            className="w-full rounded-md border border-dashed border-ink/30 bg-paper px-2 py-1 text-sm outline-none focus:border-terracotta"
          />
          <textarea
            value={values.reason}
            onChange={(e) => setValue("reason", e.target.value)}
            rows={3}
            placeholder="Why it's worth reading"
            className="w-full rounded-md border border-dashed border-ink/30 bg-paper px-2 py-1.5 text-sm outline-none focus:border-terracotta resize-none"
          />
        </div>
      ) : (
        <div className="flex gap-4">
          <div className="shrink-0 w-16 sm:w-20 aspect-[2/3] rounded-md overflow-hidden bg-paper2 border border-ink/10 flex items-center justify-center">
            {cover ? (
              <Image src={cover} alt={`Cover of ${book.title}`} width={80} height={120} className="object-cover w-full h-full" unoptimized />
            ) : (
              <span className="text-[10px] text-ink/30 text-center px-1">no cover</span>
            )}
          </div>
          <div className="min-w-0">
            <h3 className="font-serif text-lg leading-snug" style={{ fontFamily: "var(--font-fraunces), serif" }}>
              {values.title}
            </h3>
            <p className="text-sm text-ink/60 mb-2">{values.author}</p>
            <p className="text-sm text-ink/85 leading-relaxed">{values.reason}</p>
            {sourceUrl && (
              <a
                href={sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-2 text-sm text-sky underline decoration-dotted underline-offset-4"
              >
                Look it up
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
