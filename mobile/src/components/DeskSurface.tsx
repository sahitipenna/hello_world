import { ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import Svg, { Defs, Pattern, RadialGradient, Rect, Stop } from "react-native-svg";
import { DESK_SKIN_COLOR, DeskSkin } from "../lib/deskPrefs";

// Approximates web's DeskSurface.tsx layered background (a highlight
// radial gradient + a vignette + a fine grain pattern) with what RN/
// react-native-svg can actually draw: two radial gradients plus, for the
// wood skins specifically, a faint diagonal plank-grain pattern. White
// stays near-flat (matches web's very low grain opacity there); green
// stays completely flat/solid -- explicitly asked for, no texture at all.
const HIGHLIGHT_OPACITY: Record<DeskSkin, number> = { dark: 0.22, light: 0.3, white: 0.12, green: 0 };
const VIGNETTE_OPACITY: Record<DeskSkin, number> = { dark: 0.4, light: 0.26, white: 0.08, green: 0 };
const GRAIN_SKINS = new Set<DeskSkin>(["dark", "light"]);

export default function DeskSurface({ skin, children }: { skin: DeskSkin; children: ReactNode }) {
  const showGrain = GRAIN_SKINS.has(skin);
  return (
    <View style={[styles.wrap, { backgroundColor: DESK_SKIN_COLOR[skin] }]}>
      {skin !== "green" && (
        <Svg style={StyleSheet.absoluteFill} width="100%" height="100%">
          <Defs>
            <RadialGradient id="hl" cx="10%" cy="0%" r="75%">
              <Stop offset="0" stopColor="#ffd696" stopOpacity={HIGHLIGHT_OPACITY[skin]} />
              <Stop offset="1" stopColor="#ffd696" stopOpacity="0" />
            </RadialGradient>
            <RadialGradient id="vg" cx="50%" cy="35%" r="75%">
              <Stop offset="0.55" stopColor="#140a04" stopOpacity="0" />
              <Stop offset="1" stopColor="#140a04" stopOpacity={VIGNETTE_OPACITY[skin]} />
            </RadialGradient>
            {showGrain && (
              <Pattern id="grain" width="34" height="34" patternUnits="userSpaceOnUse" patternTransform="rotate(7)">
                <Rect x="0" y="0" width="34" height="34" fill="none" />
                <Rect x="0" y="0" width="2.4" height="34" fill="#140a04" opacity="0.07" />
                <Rect x="16" y="0" width="1" height="34" fill="#fff" opacity="0.05" />
              </Pattern>
            )}
          </Defs>
          <Rect width="100%" height="100%" fill="url(#hl)" />
          <Rect width="100%" height="100%" fill="url(#vg)" />
          {showGrain && <Rect width="100%" height="100%" fill="url(#grain)" />}
        </Svg>
      )}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { position: "relative" },
});
