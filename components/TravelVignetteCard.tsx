import { TravelVignette } from "@/lib/types";

export default function TravelVignetteCard({ vignette }: { vignette: TravelVignette }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-sky font-semibold mb-1">{vignette.place}</p>
      <h3 className="font-serif text-lg mb-2" style={{ fontFamily: "var(--font-fraunces), serif" }}>
        {vignette.title}
      </h3>
      <p className="text-[15px] leading-relaxed text-ink/85">{vignette.body}</p>
      <p className="mt-3 text-xs text-ink/40">An original vignette, written for Daybook</p>
    </div>
  );
}
