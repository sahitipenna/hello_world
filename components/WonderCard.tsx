import { WonderT } from "@/lib/types";

export default function WonderCard({ wonder }: { wonder: WonderT }) {
  return (
    <div>
      <h3 className="font-serif text-lg mb-2" style={{ fontFamily: "var(--font-fraunces), serif" }}>
        {wonder.title}
      </h3>
      <p className="text-[15px] leading-relaxed text-ink/85">{wonder.body}</p>
      {wonder.source && <p className="mt-3 text-xs text-ink/40">{wonder.source}</p>}
    </div>
  );
}
