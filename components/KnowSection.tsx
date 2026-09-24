"use client";

import { NewsItemT } from "@/lib/types";

export default function KnowSection({
  items,
  totalCount,
  onUnlockClick,
}: {
  items: NewsItemT[];
  totalCount: number;
  onUnlockClick: () => void;
}) {
  const hiddenCount = totalCount - items.length;

  return (
    <div>
      <ul className="space-y-4">
        {items.map((item) => (
          <li key={item.id} className="border-b border-ink/10 last:border-0 pb-4 last:pb-0">
            <p className="text-[15px] font-medium leading-snug">{item.title}</p>
            <p className="mt-1 text-sm text-ink/75 leading-relaxed">{item.summary}</p>
            <p className="mt-1.5 text-xs text-ink/40">
              {item.source}
              {item.sourceUrl && (
                <>
                  {" — "}
                  <a
                    href={item.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline decoration-dotted underline-offset-4"
                  >
                    read more
                  </a>
                </>
              )}
              {" · "}
              {item.readingTimeMin} min
            </p>
          </li>
        ))}
      </ul>
      {hiddenCount > 0 && (
        <button
          onClick={onUnlockClick}
          className="mt-4 w-full text-sm font-medium text-ink/60 border border-dashed border-ink/25 rounded-lg px-3 py-2.5 hover:border-terracotta hover:text-terracotta transition-colors"
        >
          +{hiddenCount} more {hiddenCount === 1 ? "story" : "stories"} with Premium
        </button>
      )}
    </div>
  );
}
