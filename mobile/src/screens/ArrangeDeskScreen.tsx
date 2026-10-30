import { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors, fonts } from "../theme";
import { DESK_SKIN_COLOR, DeskPrefs, DeskSkin, fetchDeskPrefs, saveDeskSkin, saveHiddenSections, saveSectionOrder } from "../lib/deskPrefs";

const SKINS: { id: DeskSkin; label: string }[] = [
  { id: "dark", label: "Dark wood" },
  { id: "light", label: "Light wood" },
  { id: "white", label: "White" },
  { id: "green", label: "Green" },
];

export default function ArrangeDeskScreen() {
  const [prefs, setPrefs] = useState<DeskPrefs | null>(null);
  const [order, setOrder] = useState<string[]>([]);
  const [hidden, setHidden] = useState<string[]>([]);
  const [skin, setSkin] = useState<DeskSkin>("dark");

  useEffect(() => {
    fetchDeskPrefs()
      .then((p) => {
        setPrefs(p);
        setOrder(p.sectionOrder.length > 0 ? p.sectionOrder : p.allSections.map((s) => s.key));
        setHidden(p.hiddenSections);
        setSkin(p.deskSkin);
      })
      .catch(() => setPrefs({ deskSkin: "dark", sectionOrder: [], hiddenSections: [], allSections: [] }));
  }, []);

  function changeSkin(next: DeskSkin) {
    setSkin(next);
    saveDeskSkin(next).catch(() => {});
  }

  function toggleHidden(key: string) {
    const next = hidden.includes(key) ? hidden.filter((h) => h !== key) : [...hidden, key];
    setHidden(next);
    saveHiddenSections(next).catch(() => {});
  }

  function move(key: string, dir: -1 | 1) {
    const idx = order.indexOf(key);
    const newIdx = idx + dir;
    if (newIdx < 0 || newIdx >= order.length) return;
    const next = [...order];
    [next[idx], next[newIdx]] = [next[newIdx], next[idx]];
    setOrder(next);
    saveSectionOrder(next).catch(() => {});
  }

  if (!prefs) {
    return (
      <View style={[styles.screen, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator color={colors.ink} />
      </View>
    );
  }

  const metaByKey = new Map(prefs.allSections.map((s) => [s.key, s]));

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Text style={styles.sectionLabel}>Table</Text>
      <View style={styles.skinRow}>
        {SKINS.map((s) => {
          const on = s.id === skin;
          return (
            <TouchableOpacity key={s.id} onPress={() => changeSkin(s.id)} style={styles.skinItem}>
              <View style={[styles.skinChip, { backgroundColor: DESK_SKIN_COLOR[s.id] }, on && styles.skinChipOn]} />
              <Text style={styles.skinLabel}>{s.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <Text style={styles.sectionLabel}>On the desk</Text>
      <View style={{ gap: 2 }}>
        {order.map((key, i) => {
          const meta = metaByKey.get(key);
          if (!meta) return null;
          const on = !hidden.includes(key);
          return (
            <View key={key} style={styles.row}>
              <View style={styles.arrowCol}>
                <TouchableOpacity disabled={i === 0} onPress={() => move(key, -1)} hitSlop={6}>
                  <Text style={[styles.arrow, i === 0 && styles.arrowDisabled]}>▲</Text>
                </TouchableOpacity>
                <TouchableOpacity disabled={i === order.length - 1} onPress={() => move(key, 1)} hitSlop={6}>
                  <Text style={[styles.arrow, i === order.length - 1 && styles.arrowDisabled]}>▼</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity style={styles.rowMain} onPress={() => toggleHidden(key)}>
                <View style={[styles.checkbox, on && styles.checkboxOn]}>{on && <Text style={styles.checkmark}>✓</Text>}</View>
                <Text style={[styles.rowLabel, !on && styles.rowLabelOff]}>{meta.title}</Text>
              </TouchableOpacity>
            </View>
          );
        })}
      </View>

      <Text style={styles.note}>Put things away; bring them back whenever.</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.paper },
  content: { padding: 20, paddingBottom: 48 },
  sectionLabel: { fontFamily: fonts.sansSemiBold, fontSize: 11, letterSpacing: 1.4, textTransform: "uppercase", color: colors.inkMuted, marginTop: 14, marginBottom: 10 },
  skinRow: { flexDirection: "row", gap: 18 },
  skinItem: { alignItems: "center", gap: 6 },
  skinChip: { width: 52, height: 34, borderRadius: 4, borderWidth: 1, borderColor: "rgba(43,38,34,.2)" },
  skinChipOn: { borderWidth: 3, borderColor: colors.terracotta },
  skinLabel: { fontFamily: fonts.sans, fontSize: 12, color: colors.ink },
  row: { flexDirection: "row", alignItems: "center", gap: 10, paddingVertical: 4 },
  arrowCol: { gap: 0 },
  arrow: { fontSize: 11, color: "rgba(43,38,34,.5)", paddingVertical: 1 },
  arrowDisabled: { color: "rgba(43,38,34,.15)" },
  rowMain: { flexDirection: "row", alignItems: "center", gap: 12, flex: 1, paddingVertical: 8 },
  checkbox: { width: 20, height: 20, borderRadius: 3, borderWidth: 1.8, borderColor: "#2b2622", alignItems: "center", justifyContent: "center" },
  checkboxOn: { backgroundColor: "rgba(193,85,44,.1)" },
  checkmark: { color: colors.terracotta, fontSize: 13, fontFamily: fonts.sansSemiBold },
  rowLabel: { fontFamily: fonts.sans, fontSize: 15, color: colors.ink },
  rowLabelOff: { color: "rgba(43,38,34,.45)", textDecorationLine: "line-through" },
  note: { fontFamily: fonts.serifItalic, fontSize: 13.5, color: colors.inkMuted, marginTop: 20 },
});
