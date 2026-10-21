"use client";

interface Viewer {
  email: string;
  name: string | null;
  image: string | null;
}

export interface ShelfItem {
  contentType: string;
  contentId: string;
  title: string;
  subtitle: string;
  sourceUrl: string | null;
  createdAt: string;
}

const TYPE_LABEL: Record<string, string> = {
  news: "Know",
  artwork: "Look",
  literary: "Read",
  travel: "Wander",
  book: "Read next",
  wonder: "Wonder",
};

/** My Dilly Shelf — the record of a visitor's curiosity. Every "Save" tap
 * across the desk lands here. Deliberately a flat recency-ordered list, not
 * folders/tags — the product loop plan's point is the accumulating count
 * ("you've discovered N things"), not a filing system. */
export default function ShelfModal({
  open,
  items,
  onClose,
  onRemove,
  viewer,
  googleConfigured,
}: {
  open: boolean;
  items: ShelfItem[];
  onClose: () => void;
  onRemove: (contentType: string, contentId: string) => void;
  /** Where "log in to see your shelf" is offered when there's no header
   * sign-in link anymore — not a gate, items saved to this browser still
   * show below, but a signed-out visitor otherwise has no entry point into
   * signing in until they happen to save something. */
  viewer: Viewer | null;
  googleConfigured: boolean;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-ink/40" onClick={onClose} />
      <div className="relative bg-paper rounded-2xl shadow-2xl max-w-lg w-full p-6 sm:p-7 animate-fade-in max-h-[85vh] flex flex-col">
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-3 right-3 text-2xl leading-none text-ink/40 hover:text-ink"
        >
          ×
        </button>
        <p className="text-xs font-semibold uppercase tracking-wide text-mustard mb-2">Your shelf</p>
        <h2 className="font-serif text-2xl mb-1" style={{ fontFamily: "var(--font-serif), serif" }}>
          {items.length === 0 ? "Nothing saved yet" : `You've discovered ${items.length} ${items.length === 1 ? "thing" : "things"}`}
        </h2>
        <p className="text-sm text-ink/60 mb-4">
          {items.length === 0
            ? "Tap ☆ Save on anything that catches your attention — it'll turn up here."
            : "Everything you've saved, newest first."}
        </p>
        {!viewer && googleConfigured && (
          <div className="flex items-center justify-between gap-3 rounded-xl border border-ink/10 bg-mustard/5 px-4 py-3 mb-4">
            <p className="text-xs text-ink/70">
              Sign in to enter your space — the same shelf, wherever you open Go Dilly.
            </p>
            <a
              href="/api/auth/google"
              className="shrink-0 text-xs font-semibold bg-terracotta text-paper rounded-full px-3.5 py-2 hover:bg-rust transition-colors whitespace-nowrap"
            >
              Sign in
            </a>
          </div>
        )}
        <div className="flex-1 overflow-y-auto -mx-1 px-1">
          {items.map((item) => (
            <div
              key={`${item.contentType}:${item.contentId}`}
              className="flex items-start justify-between gap-3 border-b border-ink/10 last:border-0 py-3"
            >
              <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-ink/40">
                  {TYPE_LABEL[item.contentType] ?? item.contentType}
                </p>
                <p className="text-[15px] font-medium leading-snug mt-0.5">{item.title}</p>
                {item.subtitle && <p className="text-sm text-ink/60 mt-0.5">{item.subtitle}</p>}
                {item.sourceUrl && (
                  <a
                    href={item.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-1 text-xs text-sky underline decoration-dotted underline-offset-4"
                  >
                    Open source
                  </a>
                )}
              </div>
              <button
                onClick={() => onRemove(item.contentType, item.contentId)}
                aria-label="Remove from shelf"
                title="Remove from shelf"
                className="shrink-0 text-ink/30 hover:text-terracotta text-lg leading-none mt-0.5"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
