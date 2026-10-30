import { useId } from "react";
import Svg, { ClipPath, Defs, Ellipse, G, LinearGradient, Line, Path, Rect, Stop } from "react-native-svg";

/** Original folk-art still-life — flat gouache-style shapes, a striped
 * bowl of fruit on a striped tablecloth, muted earthy palette. Ported
 * from components/desk/illustrations/ArtIllustration.tsx on web. */
export default function ArtIllustration() {
  const u = useId();
  return (
    <Svg viewBox="0 0 185 235" width="100%" height="100%" preserveAspectRatio="none">
      <Defs>
        <LinearGradient id={`${u}fr`} x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#c8913f" />
          <Stop offset=".45" stopColor="#9a6a2c" />
          <Stop offset="1" stopColor="#6e4520" />
        </LinearGradient>
        <LinearGradient id={`${u}wall`} x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#e6cbb8" />
          <Stop offset="1" stopColor="#d9b9a0" />
        </LinearGradient>
        <ClipPath id={`${u}bowlclip`}>
          <Path d="M56 128 L129 128 L119 158 Q92 168 66 158 Z" />
        </ClipPath>
      </Defs>
      <Rect x="0" y="0" width="185" height="235" rx="3" fill={`url(#${u}fr)`} />
      <Rect x="4" y="4" width="177" height="227" rx="2" fill="none" stroke="#e6b865" strokeWidth="1.2" opacity=".6" />
      <Rect x="15" y="15" width="155" height="205" fill="#5a3a1c" />
      <Rect x="19" y="19" width="147" height="197" fill="#f3ead7" />

      <Rect x="34" y="34" width="117" height="167" fill={`url(#${u}wall)`} />

      <Rect x="34" y="150" width="117" height="51" fill="#c1552c" />
      <G stroke="#8f3a1a" strokeWidth="5" opacity=".85">
        <Line x1="34" y1="158" x2="151" y2="158" />
        <Line x1="34" y1="170" x2="151" y2="170" />
        <Line x1="34" y1="182" x2="151" y2="182" />
        <Line x1="34" y1="194" x2="151" y2="194" />
      </G>

      <Path d="M56 128 L129 128 L119 158 Q92 168 66 158 Z" fill="#f3ead7" stroke="#2b2622" strokeWidth="2" />
      <G clipPath={`url(#${u}bowlclip)`}>
        <Rect x="56" y="128" width="73" height="34" fill="#6b4a63" />
        <Rect x="62" y="128" width="7" height="34" fill="#f3ead7" />
        <Rect x="76" y="128" width="7" height="34" fill="#f3ead7" />
        <Rect x="90" y="128" width="7" height="34" fill="#f3ead7" />
        <Rect x="104" y="128" width="7" height="34" fill="#f3ead7" />
        <Rect x="118" y="128" width="7" height="34" fill="#f3ead7" />
      </G>
      <Path d="M56 128 L129 128 L119 158 Q92 168 66 158 Z" fill="none" stroke="#2b2622" strokeWidth="2" />
      <Ellipse cx="92.5" cy="128" rx="36.5" ry="7" fill="none" stroke="#2b2622" strokeWidth="2" />

      <G stroke="#2b2622" strokeWidth="1.8" strokeLinejoin="round">
        <Ellipse cx="70" cy="118" rx="15" ry="17" fill="#d9a02c" />
        <Ellipse cx="92" cy="108" rx="16" ry="18" fill="#c1552c" />
        <Ellipse cx="114" cy="119" rx="14" ry="16" fill="#d9a02c" />
        <Ellipse cx="82" cy="126" rx="13" ry="14" fill="#9a6d12" />
      </G>
      <Path d="M92 90 q2 -8 8 -10" stroke="#5a6b4b" strokeWidth="2.4" fill="none" strokeLinecap="round" />
      <Path d="M96 82 q10 -4 14 4 q-8 6 -14 -4Z" fill="#6d7f5c" stroke="#2b2622" strokeWidth="1.2" />
      <Path d="M63 106 q10 -4 8 8" stroke="#fff" strokeWidth="1.6" fill="none" opacity=".5" strokeLinecap="round" />
      <Path d="M85 98 q10 -5 9 7" stroke="#fff" strokeWidth="1.6" fill="none" opacity=".45" strokeLinecap="round" />

      <Rect x="34" y="34" width="117" height="167" fill="none" stroke="#2b2622" strokeOpacity=".25" />
    </Svg>
  );
}
