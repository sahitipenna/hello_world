import Link from "next/link";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function Pricing() {
  const plans = await prisma.pricingPlan.findMany({ orderBy: { order: "asc" } });
  const free = plans.find((p) => p.key === "free");
  const premium = plans.find((p) => p.key === "premium");

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
          Go Dilly is free to start. Premium unlocks the full edition &mdash; every section, every day of the
          year.
        </p>

        <div className="grid sm:grid-cols-2 gap-6">
          {free && (
            <div className="paper-card rounded-2xl shadow-card p-6">
              <p className="text-xs font-semibold uppercase tracking-wide text-sage mb-2">{free.name}</p>
              <p className="font-serif text-3xl mb-4" style={{ fontFamily: "var(--font-fraunces), serif" }}>
                $0
              </p>
              <ul className="space-y-2 text-sm text-ink/80 mb-6">
                {(free.features as string[]).map((f) => (
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
          )}

          {premium && (
            <div className="paper-card rounded-2xl shadow-card p-6 border-2 border-mustard/60 relative">
              <span className="absolute -top-3 left-6 text-[11px] font-semibold uppercase tracking-wide bg-mustard text-ink rounded-full px-3 py-0.5">
                Most curious
              </span>
              <p className="text-xs font-semibold uppercase tracking-wide text-terracotta mb-2">{premium.name}</p>
              <p className="font-serif text-3xl mb-4" style={{ fontFamily: "var(--font-fraunces), serif" }}>
                ${premium.priceUSD} <span className="text-base text-ink/50 font-sans">/ {premium.interval}</span>
              </p>
              <p className="text-xs text-ink/45 -mt-3 mb-1">or ₹{premium.priceINR} / {premium.interval}</p>
              <p className="text-xs text-terracotta font-medium mb-4">Introductory price</p>
              <ul className="space-y-2 text-sm text-ink/80 mb-6">
                {(premium.features as string[]).map((f) => (
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
          )}
        </div>
      </div>
    </div>
  );
}
