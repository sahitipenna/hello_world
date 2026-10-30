import { useId } from "react";
import Svg, { Defs, G, Path, Pattern, Rect, Text as SvgText } from "react-native-svg";
import { fonts } from "../theme";

export default function CrosswordIllustration() {
  const u = useId();
  return (
    <Svg viewBox="0 0 160 210" width="100%" height="100%" preserveAspectRatio="none">
      <Defs>
        <Pattern id={`${u}cw`} width="20" height="20" patternUnits="userSpaceOnUse">
          <Rect width="20" height="20" fill="none" stroke="#2b2622" strokeWidth=".9" />
        </Pattern>
        <Pattern id={`${u}cl`} width="10" height="8" patternUnits="userSpaceOnUse">
          <Rect width="10" height="1.6" fill="#b7c7cc" />
        </Pattern>
        <Pattern id={`${u}sp`} width="13" height="18" patternUnits="userSpaceOnUse">
          <Rect x="4" y="1" width="4.5" height="15" rx="2.2" fill="#8c8378" />
          <Rect x="5" y="2" width="1.4" height="12" rx=".7" fill="#d8d2c8" />
        </Pattern>
      </Defs>
      <Rect x="9" y="17" width="148" height="190" rx="3" fill="#c9b48e" />
      <Rect x="5" y="13" width="148" height="190" rx="3" fill="#fffaf0" />
      <Rect x="14" y="4" width="130" height="18" fill={`url(#${u}sp)`} />
      <SvgText x="30" y="44" fontFamily={fonts.sansSemiBold} fontSize="8.5" letterSpacing="1.5" fill="#4f7d8c">
        THE MINI · No. 214
      </SvgText>
      <Rect x="30" y="52" width="100" height="100" fill="#fffaf0" />
      <Rect x="30" y="52" width="100" height="100" fill={`url(#${u}cw)`} stroke="#2b2622" strokeWidth="1.8" />
      <SvgText x="36" y="68" fontFamily={fonts.hand} fontSize="15" fill="#4f7d8c">
        H
      </SvgText>
      <SvgText x="56" y="68" fontFamily={fonts.hand} fontSize="15" fill="#4f7d8c">
        E
      </SvgText>
      <SvgText x="36" y="88" fontFamily={fonts.hand} fontSize="15" fill="#4f7d8c">
        E
      </SvgText>
      <Rect x="30" y="160" width="100" height="36" fill={`url(#${u}cl)`} />
      <G transform="rotate(-34 96 150)">
        <Rect x="40" y="146" width="96" height="8" fill="#d9a02c" />
        <Rect x="40" y="149" width="96" height="2" fill="#b98415" />
        <Path d="M136 146 L152 150 L136 154Z" fill="#e8c9a0" />
        <Path d="M147 148.7 L152 150 L147 151.3Z" fill="#2b2622" />
        <Rect x="30" y="146" width="10" height="8" fill="#9a958d" />
        <Rect x="22" y="146" width="9" height="8" rx="2" fill="#d98a6a" />
      </G>
    </Svg>
  );
}
