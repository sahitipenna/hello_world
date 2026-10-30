import { useId } from "react";
import Svg, { Circle, Defs, G, Path, RadialGradient, Stop } from "react-native-svg";

export default function PlantIllustration() {
  const u = useId();
  return (
    <Svg viewBox="0 0 170 170" width="100%" height="100%">
      <Defs>
        <RadialGradient id={`${u}pot`} cx=".38" cy=".34" r=".7">
          <Stop offset="0" stopColor="#d9764c" />
          <Stop offset=".7" stopColor="#b24f2a" />
          <Stop offset="1" stopColor="#8a3a1c" />
        </RadialGradient>
        <RadialGradient id={`${u}soil`} cx=".5" cy=".5" r=".6">
          <Stop offset="0" stopColor="#4a3322" />
          <Stop offset="1" stopColor="#2e1f14" />
        </RadialGradient>
      </Defs>
      <Circle cx="85" cy="85" r="52" fill={`url(#${u}pot)`} />
      <Circle cx="85" cy="85" r="44" fill={`url(#${u}soil)`} />
      <G transform="translate(85 85)">
        <Path d="M0 0 Q18 -40 0 -80 Q-18 -40 0 0Z" fill="#5f7350" transform="rotate(-10)" />
        <Path d="M0 0 Q16 -36 0 -74 Q-16 -36 0 0Z" fill="#7d9166" transform="rotate(38)" />
        <Path d="M0 0 Q18 -38 0 -78 Q-18 -38 0 0Z" fill="#6d7f5c" transform="rotate(84)" />
        <Path d="M0 0 Q15 -34 0 -70 Q-15 -34 0 0Z" fill="#56694a" transform="rotate(130)" />
        <Path d="M0 0 Q18 -40 0 -80 Q-18 -40 0 0Z" fill="#7d9166" transform="rotate(178)" />
        <Path d="M0 0 Q16 -36 0 -72 Q-16 -36 0 0Z" fill="#6d7f5c" transform="rotate(224)" />
        <Path d="M0 0 Q17 -38 0 -76 Q-17 -38 0 0Z" fill="#5f7350" transform="rotate(272)" />
        <Path d="M0 0 Q14 -30 0 -62 Q-14 -30 0 0Z" fill="#8fa378" transform="rotate(316)" />
        <G stroke="#b9c6a0" strokeWidth="1.2" opacity=".55" fill="none">
          <Path d="M0 0 L0 -74" transform="rotate(-10)" />
          <Path d="M0 0 L0 -70" transform="rotate(84)" />
          <Path d="M0 0 L0 -74" transform="rotate(178)" />
          <Path d="M0 0 L0 -70" transform="rotate(272)" />
        </G>
        <Path d="M0 0 Q10 -22 0 -44 Q-10 -22 0 0Z" fill="#a3b58a" transform="rotate(20)" />
        <Path d="M0 0 Q10 -22 0 -42 Q-10 -22 0 0Z" fill="#93a67c" transform="rotate(200)" />
      </G>
    </Svg>
  );
}
