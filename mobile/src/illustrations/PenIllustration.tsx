import { useId } from "react";
import Svg, { Circle, Defs, G, LinearGradient, Path, Rect, Stop } from "react-native-svg";

export default function PenIllustration() {
  const u = useId();
  return (
    <Svg viewBox="0 0 95 190" width="100%" height="100%" preserveAspectRatio="none">
      <Defs>
        <LinearGradient id={`${u}body`} x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#3a5a78" />
          <Stop offset=".55" stopColor="#2d4a63" />
          <Stop offset="1" stopColor="#1f3650" />
        </LinearGradient>
      </Defs>
      <G transform="rotate(22 47 95)">
        <Rect x="40" y="18" width="14" height="128" rx="7" fill={`url(#${u}body)`} />
        <Rect x="41.6" y="22" width="2.4" height="118" rx="1.2" fill="#6b8bab" opacity=".55" />
        <Rect x="38.5" y="4" width="18" height="20" rx="4" fill="#1f3650" />
        <Rect x="46" y="4" width="2.4" height="48" fill="#d9a02c" opacity=".9" />
        <Path d="M40 146 L54 146 L47 178Z" fill="#d9a02c" />
        <Path d="M44.5 150 L47 176 L49.5 150Z" fill="#1f3650" />
        <Circle cx="47" cy="172" r="1.6" fill="#1f3650" />
      </G>
      <Path d="M18 150 q18 14 38 4" stroke="#2d4a63" strokeWidth="2" fill="none" strokeLinecap="round" opacity=".45" />
    </Svg>
  );
}
