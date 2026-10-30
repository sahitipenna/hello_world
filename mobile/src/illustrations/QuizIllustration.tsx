import { useId } from "react";
import Svg, { Circle, Defs, G, LinearGradient, Path, Rect, Stop, Text as SvgText } from "react-native-svg";
import { fonts } from "../theme";

export default function QuizIllustration() {
  const u = useId();
  return (
    <Svg viewBox="0 0 150 130" width="100%" height="100%" preserveAspectRatio="none">
      <Defs>
        <LinearGradient id={`${u}qc`} x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#8f63b8" />
          <Stop offset="1" stopColor="#6b4a63" />
        </LinearGradient>
      </Defs>
      <G transform="rotate(-6 75 70)">
        <Rect x="18" y="38" width="96" height="66" rx="4" fill="#2b2622" opacity=".18" />
      </G>
      <G transform="rotate(4 75 70)">
        <Rect x="22" y="34" width="96" height="66" rx="4" fill="#e8d7a8" />
      </G>
      <Rect x="20" y="28" width="96" height="66" rx="4" fill={`url(#${u}qc)`} />
      <Rect x="20" y="28" width="96" height="66" rx="4" fill="none" stroke="#3b2a3a" strokeWidth="2" />
      <SvgText x="68" y="76" textAnchor="middle" fontFamily={fonts.serifSemiBold} fontSize="40" fill="#f5ecd6">
        ?
      </SvgText>
      <Circle cx="112" cy="40" r="10" fill="#d9a02c" stroke="#2b2622" strokeWidth="1.5" />
      <Path d="M108 40 L111 43 L117 36" stroke="#2b2622" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}
