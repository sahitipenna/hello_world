import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { colors, fonts } from "../theme";

export default function SaveButton({ saved, onToggle, small }: { saved: boolean; onToggle: () => void; small?: boolean }) {
  return (
    <TouchableOpacity onPress={onToggle} style={[styles.button, small && styles.buttonSmall]}>
      <Text style={[styles.text, small && styles.textSmall, saved && styles.textSaved]}>
        {saved ? "★ Saved" : "☆ Save"}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    alignSelf: "flex-end",
    borderWidth: 1,
    borderColor: "rgba(43,38,34,.18)",
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginBottom: 10,
  },
  buttonSmall: { paddingVertical: 3, paddingHorizontal: 9, marginBottom: 0, alignSelf: "auto" },
  text: { fontFamily: fonts.sansMedium, fontSize: 13, color: colors.inkMuted },
  textSmall: { fontSize: 11.5 },
  textSaved: { color: colors.mustard },
});
