import { useId } from "react";
import Svg, { Defs, G, LinearGradient, Path, Pattern, Rect, Stop, Text as SvgText } from "react-native-svg";
import { fonts } from "../theme";

const CHAR_WIDTH_FACTOR = 0.54;
const LINE_HEIGHT_FACTOR = 1.2;
const TITLE_SIZES = [12, 11, 10, 9, 8, 7];

function wrapWords(words: string[], fontSize: number, maxWidth: number): string[] {
  const maxChars = Math.max(1, Math.floor(maxWidth / (fontSize * CHAR_WIDTH_FACTOR)));
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (next.length > maxChars && current) {
      lines.push(current);
      current = word;
    } else {
      current = next;
    }
  }
  if (current) lines.push(current);
  return lines;
}

function truncateLine(line: string, fontSize: number, maxWidth: number): string {
  const maxChars = Math.max(1, Math.floor(maxWidth / (fontSize * CHAR_WIDTH_FACTOR)));
  if (line.length <= maxChars) return line;
  return line.slice(0, Math.max(1, maxChars - 1)).replace(/\s+\S*$/, "") + "…";
}

/** Fit `text` into as few lines as possible within maxWidth/maxHeight,
 * shrinking the font size before wrapping to more lines, and only
 * truncating the last line if it still doesn't fit at the smallest size. */
function fitTitle(text: string, maxWidth: number, maxHeight: number) {
  const words = text.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return { fontSize: TITLE_SIZES[0], lineHeight: TITLE_SIZES[0] * LINE_HEIGHT_FACTOR, lines: [] as string[] };

  for (const fontSize of TITLE_SIZES) {
    const lineHeight = fontSize * LINE_HEIGHT_FACTOR;
    const linesAllowed = Math.max(1, Math.floor(maxHeight / lineHeight));
    const lines = wrapWords(words, fontSize, maxWidth);
    if (lines.length <= linesAllowed) {
      return { fontSize, lineHeight, lines };
    }
  }

  const fontSize = TITLE_SIZES[TITLE_SIZES.length - 1];
  const lineHeight = fontSize * LINE_HEIGHT_FACTOR;
  const linesAllowed = Math.max(1, Math.floor(maxHeight / lineHeight));
  const lines = wrapWords(words, fontSize, maxWidth).slice(0, linesAllowed);
  if (lines.length) lines[lines.length - 1] = truncateLine(lines[lines.length - 1], fontSize, maxWidth);
  return { fontSize, lineHeight, lines };
}

export default function BookIllustration({ title = "Today's pick" }: { title?: string }) {
  const u = useId();
  const { fontSize, lineHeight, lines } = fitTitle(title, 66, 38);
  const cx = 82;
  const cy = 75;
  const startY = cy - ((lines.length - 1) * lineHeight) / 2 + fontSize * 0.36;

  return (
    <Svg viewBox="0 0 150 215" width="100%" height="100%" preserveAspectRatio="none">
      <Defs>
        <LinearGradient id={`${u}bk`} x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#e6b247" />
          <Stop offset=".6" stopColor="#d9a02c" />
          <Stop offset="1" stopColor="#b8841a" />
        </LinearGradient>
        <Pattern id={`${u}pe`} width="2.5" height="10" patternUnits="userSpaceOnUse">
          <Rect width="1" height="10" fill="#d6c9ae" />
        </Pattern>
      </Defs>
      <Rect x="10" y="7" width="137" height="205" rx="2" fill="#efe6d2" />
      <Rect x="136" y="8" width="10" height="203" fill={`url(#${u}pe)`} />
      <Rect x="3" y="2" width="136" height="206" rx="3" fill={`url(#${u}bk)`} />
      <Rect x="3" y="2" width="18" height="206" rx="2" fill="#a8761a" />
      <G stroke="#8a5f12" strokeWidth="1.2">
        <Path d="M6 24 H20" />
        <Path d="M6 28 H20" />
        <Path d="M6 182 H20" />
        <Path d="M6 186 H20" />
      </G>
      <Rect x="21" y="2" width="3" height="206" fill="#fff" opacity=".18" />
      <Rect x="40" y="48" width="84" height="54" fill="#faf3e6" stroke="#9a6d12" strokeWidth="1" />
      <Rect x="44" y="52" width="76" height="46" fill="none" stroke="#9a6d12" strokeWidth=".6" />
      {lines.map((line, i) => (
        <SvgText key={i} x={cx} y={startY + i * lineHeight} textAnchor="middle" fontFamily={fonts.serifItalic} fontSize={fontSize} fill="#2b2622">
          {line}
        </SvgText>
      ))}
      <Path d="M68 150 q8 -14 20 -6 q6 -8 10 0 q-2 8 -10 10 q-10 4 -20 -4Z" fill="#9a6d12" opacity=".55" />
      <Path d="M137 4 L139 4 L139 12Z M5 206 L5 200 L12 208Z" fill="#f3d58a" opacity=".6" />
    </Svg>
  );
}
