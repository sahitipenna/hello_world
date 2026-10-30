import { useId } from "react";
import Svg, { Circle, Defs, Ellipse, Path, RadialGradient, Rect, Stop } from "react-native-svg";

export default function MugIllustration() {
  const u = useId();
  return (
    <Svg viewBox="0 0 115 115" width="100%" height="100%">
      <Defs>
        <RadialGradient id={`${u}mug`} cx=".35" cy=".3" r=".75">
          <Stop offset="0" stopColor="#7fa5b1" />
          <Stop offset=".75" stopColor="#4f7d8c" />
          <Stop offset="1" stopColor="#3a5f6b" />
        </RadialGradient>
        <RadialGradient id={`${u}cof`} cx=".45" cy=".42" r=".6">
          <Stop offset="0" stopColor="#6b4226" />
          <Stop offset=".7" stopColor="#4a2c18" />
          <Stop offset="1" stopColor="#8a5a33" />
        </RadialGradient>
      </Defs>
      <Rect x="80" y="42" width="30" height="30" rx="13" fill="none" stroke="#436d7a" strokeWidth="9" />
      <Circle cx="54" cy="57" r="44" fill={`url(#${u}mug)`} />
      <Circle cx="54" cy="57" r="37" fill="#f4ecdc" />
      <Circle cx="54" cy="57" r="33" fill={`url(#${u}cof)`} />
      <Ellipse cx="44" cy="46" rx="11" ry="6" fill="#fff" opacity=".18" transform="rotate(-30 44 46)" />
      <Path d="M30 34 A33 33 0 0 1 60 26" stroke="#fff" strokeWidth="2" fill="none" opacity=".5" />
    </Svg>
  );
}
