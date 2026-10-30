import { useId } from "react";
import Svg, { Circle, Defs, LinearGradient, Path, Pattern, Rect, Stop, Text as SvgText } from "react-native-svg";
import { fonts } from "../theme";

export default function NewsIllustration() {
  const u = useId();
  return (
    <Svg viewBox="0 0 220 270" width="100%" height="100%" preserveAspectRatio="none">
      <Defs>
        <LinearGradient id={`${u}np`} x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#fbf6ea" />
          <Stop offset="1" stopColor="#e9dfca" />
        </LinearGradient>
        <LinearGradient id={`${u}npf`} x1="0" y1="0" x2="0" y2="1">
          <Stop offset=".45" stopColor="#5a4630" stopOpacity="0" />
          <Stop offset=".5" stopColor="#5a4630" stopOpacity=".16" />
          <Stop offset=".53" stopColor="#fff" stopOpacity=".3" />
          <Stop offset=".6" stopColor="#fff" stopOpacity="0" />
        </LinearGradient>
        <Pattern id={`${u}col`} width="10" height="7" patternUnits="userSpaceOnUse">
          <Rect width="10" height="2.4" fill="#b3a894" />
        </Pattern>
      </Defs>
      <Rect x="16" y="14" width="196" height="246" rx="2" fill="#d8ccb3" transform="rotate(5 110 135)" />
      <Rect x="10" y="10" width="200" height="250" rx="2" fill="#e6dcc5" transform="rotate(-3.5 110 135)" />
      <Rect x="10" y="9" width="200" height="252" rx="2" fill={`url(#${u}np)`} />
      <SvgText x="110" y="39" textAnchor="middle" fontFamily={fonts.serifSemiBold} fontSize="21" fill="#2b2622">
        The Dilly Times
      </SvgText>
      <Rect x="22" y="47" width="176" height="1.6" fill="#2b2622" />
      <Rect x="22" y="51" width="176" height=".8" fill="#2b2622" />
      <Rect x="22" y="61" width="150" height="7" fill="#3b342e" />
      <Rect x="22" y="72" width="108" height="7" fill="#3b342e" />
      <Rect x="22" y="88" width="104" height="70" fill="#a9b597" />
      <Path d="M22 138 Q58 116 88 130 T126 124 V158 H22Z" fill="#6d7f5c" />
      <Circle cx="104" cy="104" r="9" fill="#d9a02c" opacity=".85" />
      <Rect x="134" y="88" width="64" height="70" fill={`url(#${u}col)`} />
      <Rect x="22" y="168" width="54" height="84" fill={`url(#${u}col)`} />
      <Rect x="83" y="168" width="54" height="84" fill={`url(#${u}col)`} />
      <Rect x="144" y="168" width="54" height="84" fill={`url(#${u}col)`} />
      <Rect x="10" y="9" width="200" height="252" fill={`url(#${u}npf)`} />
      <Path d="M2 150 L218 139" stroke="#a8441f" strokeWidth="2.4" />
      <Path d="M118 0 L125 270" stroke="#a8441f" strokeWidth="2.4" />
      <Path d="M121 145 q10 8 4 18 M121 145 q-12 6 -10 16" stroke="#a8441f" strokeWidth="2" fill="none" />
    </Svg>
  );
}
