import { useId } from "react";
import Svg, { Circle, Defs, G, LinearGradient, Path, Rect, Stop, Text as SvgText } from "react-native-svg";
import { fonts } from "../theme";

export default function TravelIllustration() {
  const u = useId();
  return (
    <Svg viewBox="0 0 220 150" width="100%" height="100%" preserveAspectRatio="none">
      <Defs>
        <LinearGradient id={`${u}ts`} x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#8fb3bf" />
          <Stop offset="1" stopColor="#f0dcb4" />
        </LinearGradient>
      </Defs>
      <Rect x="0" y="0" width="220" height="150" rx="3" fill="#f8f1e2" />
      <Rect x="10" y="10" width="104" height="130" fill={`url(#${u}ts)`} />
      <Path d="M10 92 L30 80 L30 70 L48 62 L48 52 L66 46 L66 58 L84 50 L84 64 L100 58 L114 66 V140 H10Z" fill="#d7b98a" />
      <Path d="M10 112 L26 100 L44 104 L44 94 L62 86 L80 92 L80 82 L98 78 L114 86 V140 H10Z" fill="#c79d62" />
      <Path d="M10 128 L34 118 L58 124 L76 114 L114 120 V140 H10Z" fill="#a97d45" />
      <G fill="#5a3a26">
        <Rect x="36" y="72" width="4" height="6" />
        <Rect x="54" y="60" width="4" height="6" />
        <Rect x="72" y="56" width="4" height="6" />
        <Rect x="90" y="66" width="4" height="6" />
        <Rect x="30" y="106" width="4" height="6" />
        <Rect x="66" y="96" width="4" height="6" />
        <Rect x="100" y="90" width="4" height="6" />
        <Rect x="48" y="124" width="4" height="6" />
      </G>
      <Rect x="121" y="14" width="1" height="122" fill="#c9bca3" />
      <Rect x="178" y="12" width="32" height="38" fill="#fffaf0" stroke="#4f7d8c" strokeWidth="1.4" strokeDasharray="2 2" />
      <Rect x="182" y="16" width="24" height="30" fill="#4f7d8c" />
      <Circle cx="194" cy="28" r="5" fill="#d9a02c" />
      <Path d="M182 40 Q194 34 206 40 V46 H182Z" fill="#6d7f5c" />
      <Circle cx="168" cy="36" r="15" fill="none" stroke="#2b2622" strokeOpacity=".45" strokeWidth="1.2" />
      <Path
        d="M150 30 q6 -3 12 0 t12 0 t12 0 t12 0 M150 38 q6 -3 12 0 t12 0 t12 0 t12 0"
        stroke="#2b2622"
        strokeOpacity=".45"
        strokeWidth="1.1"
        fill="none"
      />
      <SvgText x="130" y="72" fontFamily={fonts.hand} fontSize="15" fill="#4f7d8c">
        Dear you —
      </SvgText>
      <Path d="M130 84 q8 -4 16 0 t16 0 t16 0 t16 0 t12 0" stroke="#4f7d8c" strokeWidth="1.3" fill="none" />
      <Rect x="132" y="104" width="76" height="1" fill="#b5a88f" />
      <Rect x="132" y="118" width="76" height="1" fill="#b5a88f" />
      <Rect x="132" y="132" width="76" height="1" fill="#b5a88f" />
    </Svg>
  );
}
