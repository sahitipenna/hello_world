import { WordOfDayT } from "@/lib/types";

export default function WordOfDayCard({ word }: { word: WordOfDayT }) {
  return (
    <div>
      <h3 className="font-serif text-2xl mb-1" style={{ fontFamily: "var(--font-serif), serif" }}>
        {word.word}
      </h3>
      <p className="text-xs text-ink/50 mb-3">
        {word.pronunciation && <span className="italic">{word.pronunciation} </span>}
        {word.partOfSpeech && <span>&middot; {word.partOfSpeech}</span>}
      </p>
      <p className="text-[15px] leading-relaxed text-ink/85 mb-3">{word.definition}</p>
      {word.example && <p className="text-sm italic text-ink/60">&ldquo;{word.example}&rdquo;</p>}
    </div>
  );
}
