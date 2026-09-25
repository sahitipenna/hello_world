"use client";

import { useEffect, useState } from "react";

interface BonusArticle {
  title: string;
  source: string;
  url: string;
  teaser: string;
}

export default function ComeBackTomorrow({ dateISO }: { dateISO: string }) {
  const [article, setArticle] = useState<BonusArticle | null | undefined>(undefined);

  useEffect(() => {
    let cancelled = false;
    setArticle(undefined);
    fetch(`/api/bonus-article?date=${dateISO}`)
      .then((r) => r.json())
      .then((d) => {
        if (!cancelled) setArticle(d.article ?? null);
      })
      .catch(() => {
        if (!cancelled) setArticle(null);
      });
    return () => {
      cancelled = true;
    };
  }, [dateISO]);

  return (
    <div className="text-center py-16 px-4">
      <p className="font-serif text-2xl sm:text-3xl mb-3" style={{ fontFamily: "var(--font-fraunces), serif" }}>
        Hang on till tomorrow&hellip;
      </p>
      <p className="text-ink/60 max-w-sm mx-auto mb-8">
        Today&apos;s edition hasn&apos;t happened yet, so tomorrow&apos;s certainly hasn&apos;t either. Come back
        when it's actually that day.
      </p>
      {article && (
        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block max-w-sm mx-auto paper-card rounded-2xl shadow-card p-5 text-left hover:shadow-lg transition-shadow"
        >
          <p className="text-xs uppercase tracking-wide text-terracotta font-semibold mb-2">In the meantime</p>
          <h3 className="font-serif text-lg mb-1" style={{ fontFamily: "var(--font-fraunces), serif" }}>
            {article.title}
          </h3>
          <p className="text-sm text-ink/70 leading-relaxed mb-2">{article.teaser}</p>
          <p className="text-xs text-ink/40">{article.source}</p>
        </a>
      )}
    </div>
  );
}
