import Svg, { Ellipse, Path } from "react-native-svg";

export default function HeadphonesIllustration() {
  return (
    <Svg viewBox="0 0 150 130" width="100%" height="100%">
      <Path d="M26 72 C24 18 126 18 124 72" stroke="#2b2622" strokeWidth="12" fill="none" strokeLinecap="round" />
      <Path d="M40 40 C60 22 90 22 110 40" stroke="#6b4a63" strokeWidth="5" fill="none" strokeLinecap="round" />
      <Path d="M124 104 C134 126 96 124 74 130" stroke="#2b2622" strokeWidth="2.6" fill="none" />
      <Ellipse cx="25" cy="86" rx="21" ry="27" fill="#3a322d" />
      <Ellipse cx="27" cy="86" rx="14" ry="20" fill="#6b4a63" />
      <Ellipse cx="24" cy="80" rx="5" ry="8" fill="#fff" opacity=".14" />
      <Ellipse cx="125" cy="86" rx="21" ry="27" fill="#3a322d" />
      <Ellipse cx="123" cy="86" rx="14" ry="20" fill="#6b4a63" />
      <Ellipse cx="120" cy="80" rx="5" ry="8" fill="#fff" opacity=".14" />
    </Svg>
  );
}
