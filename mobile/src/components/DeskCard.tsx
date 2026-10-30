import { ReactNode } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { fonts } from "../theme";

/** One illustrated "desk" tile: the section's hand-drawn art on top, a
 * sticky-note label taped below it — mirroring components/desk/
 * DeskObject.tsx's label treatment on web, minus the hover-only
 * reveal (mobile shows every label at once there too). */
export default function DeskCard({
  label,
  visited,
  rotateDeg,
  aspectRatio,
  illustration,
  onPress,
}: {
  label: string;
  visited: boolean;
  rotateDeg: number;
  aspectRatio: number;
  illustration: ReactNode;
  onPress: () => void;
}) {
  return (
    <View style={{ transform: [{ rotate: `${rotateDeg}deg` }] }}>
      <TouchableOpacity onPress={onPress} activeOpacity={0.85} style={[styles.illustration, { aspectRatio }]}>
        {illustration}
      </TouchableOpacity>
      <View style={styles.labelRow}>
        <Text style={styles.label} numberOfLines={2}>
          {label}
          {visited ? "  ✓" : ""}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  illustration: {
    width: "100%",
    shadowColor: "#140a04",
    shadowOpacity: 0.4,
    shadowRadius: 6,
    shadowOffset: { width: 2, height: 4 },
  },
  labelRow: { alignItems: "center", marginTop: 8 },
  label: {
    fontFamily: fonts.hand,
    fontSize: 15,
    color: "#2b2622",
    backgroundColor: "#faf3e6",
    paddingHorizontal: 8,
    paddingVertical: 1,
    borderRadius: 2,
    textAlign: "center",
    overflow: "hidden",
    shadowColor: "#140a04",
    shadowOpacity: 0.3,
    shadowRadius: 3,
    shadowOffset: { width: 1, height: 2 },
  },
});
