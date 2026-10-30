import { useId } from "react";
import Svg, { Circle, ClipPath, Defs, Ellipse, G, Mask, Path, RadialGradient, Rect, Stop } from "react-native-svg";

export default function AppleIllustration() {
  const u = useId();
  return (
    <Svg viewBox="0 0 90 95" width="100%" height="100%">
      <Defs>
        <RadialGradient id={`${u}ap`} cx=".35" cy=".3" r=".75">
          <Stop offset="0" stopColor="#e0704a" />
          <Stop offset=".6" stopColor="#c1552c" />
          <Stop offset="1" stopColor="#8f3a1a" />
        </RadialGradient>
        <ClipPath id={`${u}apc`}>
          <Circle cx="44" cy="52" r="38" />
        </ClipPath>
        <Mask id={`${u}bite`}>
          <Rect x="-10" y="-10" width="110" height="115" fill="#fff" />
          <Circle cx="84" cy="44" r="16" fill="#000" />
          <Circle cx="80" cy="64" r="13" fill="#000" />
        </Mask>
      </Defs>
      <G mask={`url(#${u}bite)`}>
        <Circle cx="44" cy="52" r="38" fill={`url(#${u}ap)`} />
        <G clipPath={`url(#${u}apc)`}>
          <Circle cx="84" cy="44" r="21" fill="#f3e3b8" />
          <Circle cx="80" cy="64" r="18" fill="#f3e3b8" />
          <Circle cx="84" cy="44" r="18.5" fill="#faf0d2" />
          <Circle cx="80" cy="64" r="15.5" fill="#faf0d2" />
        </G>
      </G>
      <Ellipse cx="63" cy="51" rx="1.8" ry="3" fill="#3b2a1e" transform="rotate(20 63 51)" />
      <Ellipse cx="62" cy="59" rx="1.8" ry="3" fill="#3b2a1e" transform="rotate(-15 62 59)" />
      <Ellipse cx="30" cy="36" rx="9" ry="5" fill="#fff" opacity=".22" transform="rotate(-35 30 36)" />
      <Path d="M44 18 Q44 10 48 4" stroke="#5a3a26" strokeWidth="3" fill="none" strokeLinecap="round" />
      <Path d="M47 9 Q58 0 66 6 Q58 14 47 9Z" fill="#6d7f5c" />
      <Path d="M48 9 L63 6" stroke="#56694a" strokeWidth=".8" />
    </Svg>
  );
}
