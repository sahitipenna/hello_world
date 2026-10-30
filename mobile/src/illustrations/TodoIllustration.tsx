import { useId } from "react";
import Svg, { Defs, G, Path, Pattern, Rect, Text as SvgText } from "react-native-svg";
import { fonts } from "../theme";

export default function TodoIllustration() {
  const u = useId();
  return (
    <Svg viewBox="0 0 140 165" width="100%" height="100%" preserveAspectRatio="none">
      <Defs>
        <Pattern id={`${u}tl`} width="10" height="20" patternUnits="userSpaceOnUse">
          <Rect y="19" width="10" height="1" fill="#9dbac2" />
        </Pattern>
      </Defs>
      <Rect x="4" y="6" width="134" height="157" rx="2" fill="#e8d7a8" />
      <Rect x="2" y="4" width="134" height="157" rx="2" fill="#fbf1d2" />
      <Rect x="2" y="42" width="134" height="116" fill={`url(#${u}tl)`} />
      <Rect x="22" y="22" width="1.2" height="139" fill="#c1552c" opacity=".55" />
      <Rect x="2" y="4" width="134" height="15" rx="2" fill="#c1552c" />
      <Rect x="2" y="16" width="134" height="3" fill="#a8441f" />
      <SvgText x="30" y="38" fontFamily={fonts.hand} fontSize="16" fill="#2b2622">
        today —
      </SvgText>
      <G fill="none" stroke="#2b2622" strokeWidth="1.2">
        <Rect x="30" y="48" width="9" height="9" />
        <Rect x="30" y="68" width="9" height="9" />
        <Rect x="30" y="88" width="9" height="9" />
        <Rect x="30" y="108" width="9" height="9" />
        <Rect x="30" y="128" width="9" height="9" />
      </G>
      <Path d="M31 52 L34 56 L41 45" stroke="#c1552c" strokeWidth="2" fill="none" />
      <G fill="none" stroke="#4a423b" strokeWidth="1.3">
        <Path d="M46 53 q6 -4 12 0 t12 0 t12 0 t12 0 t10 0" />
        <Path d="M46 73 q6 -4 12 0 t12 0 t12 0 t10 0" />
        <Path d="M46 93 q6 -4 12 0 t12 0 t12 0 t12 0 t12 0" />
        <Path d="M46 113 q6 -4 12 0 t12 0 t12 0" />
        <Path d="M46 133 q6 -4 12 0 t12 0 t12 0 t12 0" />
      </G>
      <Path d="M44 52 L112 52" stroke="#c1552c" strokeWidth="1.2" opacity=".7" />
    </Svg>
  );
}
