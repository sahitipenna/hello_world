import Link from "next/link";

const FREE_FEATURES = [
  "Five editable hobby prompts a day",
  "Your own standing to-do list",
  "A 15-question daily quiz",
  "A short poem",
  "One book recommendation",
  "Interests-based personalization",
];
const PREMIUM_FEATURES = [
  "Everything in Free",
  "Mini crossword (easy to medium)",
  "Daily comic break",
  "Art spotlight from museum archives",
  "A short travel vignette",
  "Reorder & hide sections",
  "Full archive of past days",
];

export default function Pricing() {
  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="text-sm text-sky underline decoration-dotted underline-offset-4">
          {"←"} Back to today
        </Link>
        <h1 className="font-serif text-3xl sm:text-4xl mt-4 mb-2" style={{ fontFamily: "var(--font-fraunces), serif" }}>
          A small daily ritual, for less than a coffee
        </h1>
        <p className="text-ink/60 mb-10 max-w-lg">
          Daybook is free to start. Premium unlocks the full page &mdash; puzzle, comic, art, and postcard &mdash;
          every single day of the year.
        </p>

        <div className="grid sm:grid-cols-2 gap-6">
          <div className="paper-card rounded-2xl shadow-card p-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-sage mb-2">Free</p>
            <p className="font-serif text-3xl mb-4" style={{ fontFamily: "var(--font-fraunces), serif" }}>
              $0
            </p>
            <ul className="space-y-2 text-sm text-ink/80 mb-6">
              {FREE_FEATURES.map((f) => (
                <li key={f} className="flex gap-2">
                  <span className="text-sage">{"✓"}</span> {f}
                </li>
              ))}
            </ul>
            <Link
              href="/"
              className="block text-center text-sm font-semibold border border-ink/20 rounded-full px-4 py-2 hover:bg-ink/5 transition-colors"
            >
              Start free
            </Link>
          </div>

          <div className="paper-card rounded-2xl shadow-card p-6 border-2 border-mustard/60 relative">
            <span className="absolute -top-3 left-6 text-[11px] font-semibold uppercase tracking-wide bg-mustard text-ink rounded-full px-3 py-0.5">
              Most curious
            </span>
            <p className="text-xs font-semibold uppercase tracking-wide text-terracotta mb-2">Premium</p>
            <p className="font-serif text-3xl mb-4" style={{ fontFamily: "var(--font-fraunces), serif" }}>
              $4 <span className="text-base text-ink/50 font-sans">/ month</span>
            </p>
            <ul className="space-y-2 text-sm text-ink/80 mb-6">
              {PREMIUM_FEATURES.map((f) => (
                <li key={f} className="flex gap-2">
                  <span className="text-terracotta">{"✓"}</span> {f}
                </li>
              ))}
            </ul>
            <Link
              href="/"
              className="block text-center text-sm font-semibold bg-terracotta text-paper rounded-full px-4 py-2 hover:bg-rust transition-colors"
            >
              Try it from today&apos;s page
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
