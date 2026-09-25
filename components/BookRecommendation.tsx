"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { BookRec } from "@/lib/types";

export default function BookRecommendation({ book }: { book: BookRec }) {
  const [cover, setCover] = useState<string | null>(null);
  const [sourceUrl, setSourceUrl] = useState<string | null>(null);

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
          {book.title}
        </h3>
        <p className="text-sm text-ink/60 mb-2">{book.author}</p>
        <p className="text-sm text-ink/85 leading-relaxed">{book.reason}</p>
        {sourceUrl && (
          <a
            href={sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-2 text-sm text-sky underline decoration-dotted underline-offset-4"
          >
            Find it on Goodreads
          </a>
        )}
      </div>
    </div>
  );
}
