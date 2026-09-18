export default function ComicBreak({ label, url, dateISO }: { label: string; url: string; dateISO: string }) {
  return (
    <div className="text-center py-4">
      <div className="mx-auto w-16 h-16 rounded-full bg-paper2 border-2 border-dashed border-ink/20 flex items-center justify-center mb-3">
        <svg viewBox="0 0 24 24" className="w-8 h-8 text-terracotta" fill="none">
          <path
            d="M4 6h16v10H9l-4 3v-3H4z"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <circle cx="9" cy="11" r="1" fill="currentColor" />
          <circle cx="13" cy="11" r="1" fill="currentColor" />
          <circle cx="17" cy="11" r="1" fill="currentColor" />
        </svg>
      </div>
      <p className="text-sm text-ink/70 mb-3">
        Today&apos;s <span className="font-medium">{label}</span> strip, straight from the official archive.
      </p>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block text-sm font-semibold bg-terracotta text-paper rounded-full px-5 py-2 hover:bg-rust transition-colors"
      >
        Read on GoComics
      </a>
      <p className="mt-3 text-[11px] text-ink/35">
        {"©"} its respective owner. We link to the official archive rather than reproducing it.
      </p>
    </div>
  );
}
