import { useId } from "react";
import Svg, { Circle, Defs, G, Path, RadialGradient, Stop, Text as SvgText } from "react-native-svg";
import { fonts } from "../theme";

export default function FactIllustration() {
  const u = useId();
  return (
    <Svg viewBox="0 0 150 130" width="100%" height="100%" preserveAspectRatio="none">
      <Defs>
        <RadialGradient id={`${u}br`} cx=".35" cy=".3" r=".8">
          <Stop offset="0" stopColor="#f0d27a" />
          <Stop offset=".55" stopColor="#b8861f" />
          <Stop offset="1" stopColor="#77520f" />
        </RadialGradient>
        <RadialGradient id={`${u}ln`} cx=".4" cy=".35" r=".7">
          <Stop offset="0" stopColor="#e8f1f2" stopOpacity=".55" />
          <Stop offset="1" stopColor="#9fc0c8" stopOpacity=".3" />
        </RadialGradient>
      </Defs>
      <Circle cx="56" cy="70" r="46" fill={`url(#${u}br)`} />
      <Circle cx="56" cy="70" r="38" fill="#f5ecd6" />
      <Circle cx="56" cy="70" r="33" fill="none" stroke="#2b2622" strokeWidth="3" strokeDasharray="1 5.9" opacity=".7" />
      <SvgText x="56" y="44" textAnchor="middle" fontFamily={fonts.serifSemiBold} fontSize="9" fill="#a8441f">
        N
      </SvgText>
      <G transform="rotate(28 56 70)">
        <Path d="M56 42 L61 70 L56 74 L51 70Z" fill="#a8441f" />
        <Path d="M56 98 L61 70 L56 66 L51 70Z" fill="#2b2622" />
      </G>
      <Circle cx="56" cy="70" r="3" fill="#b8861f" />
      <Circle cx="56" cy="22" r="6" fill="none" stroke="#b8861f" strokeWidth="3" />
      <Path d="M120 84 L146 122" stroke="#5a3a26" strokeWidth="11" strokeLinecap="round" />
      <Path d="M116 78 L124 90" stroke="#b8861f" strokeWidth="12" />
      <Circle cx="100" cy="56" r="32" fill={`url(#${u}ln)`} />
      <Circle cx="100" cy="56" r="32" fill="none" stroke="#3b2a1e" strokeWidth="7" />
      <Circle cx="100" cy="56" r="28" fill="none" stroke="#d9a02c" strokeWidth="1.2" />
      <Path d="M80 44 A24 24 0 0 1 96 32" stroke="#fff" strokeWidth="3" fill="none" strokeLinecap="round" opacity=".75" />
    </Svg>
  );
}
