import { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { fetchInterests, fetchPreferences, saveInterests, Tag, updateTimeBudget } from "../api/interests";
import { colors, fonts } from "../theme";
import type { RootStackParamList } from "../navigation";

type Props = NativeStackScreenProps<RootStackParamList, "Onboarding">;

const TIME_BUDGETS = [5, 15, 30, 45];

export default function OnboardingScreen({ navigation, route }: Props) {
  const [tags, setTags] = useState<Tag[] | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [timeBudget, setTimeBudget] = useState<number | null>(null);
  const [hasChosenBefore, setHasChosenBefore] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    Promise.all([fetchInterests(), fetchPreferences()])
      .then(([interests, prefs]) => {
        setTags(interests.tags);
        setSelected(new Set(interests.selected));
        setHasChosenBefore(interests.hasChosen);
        setTimeBudget(prefs.timeBudgetMinutes);
      })
      .catch(() => setTags([]));
  }, []);

  function toggleTag(slug: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
  }

  async function save() {
    setSaving(true);
    try {
      await Promise.all([saveInterests(Array.from(selected)), updateTimeBudget(timeBudget)]);
    } catch {
      // The app still works with defaults even if this write failed —
      // worth retrying from the Interests screen rather than blocking here.
    } finally {
      setSaving(false);
      if (route.params?.auto) {
        navigation.replace("Home");
      } else {
        navigation.goBack();
      }
    }
  }

  const nothingChosen = selected.size === 0 && timeBudget === null;

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Text style={styles.kicker}>{hasChosenBefore ? "Your interests" : "You're becoming a regular"}</Text>
      <Text style={styles.title}>Want to make your Dilly yours?</Text>
      <Text style={styles.subtitle}>Pick what you'd like more of — we'll lean your edition that way. Change this anytime.</Text>

      {!tags ? (
        <ActivityIndicator color={colors.ink} style={{ marginTop: 30 }} />
      ) : (
        <View style={styles.chipRow}>
          {tags.map((t) => {
            const on = selected.has(t.slug);
            return (
              <TouchableOpacity key={t.slug} onPress={() => toggleTag(t.slug)} style={[styles.chip, on && styles.chipOn]}>
                <Text style={[styles.chipText, on && styles.chipTextOn]}>
                  {t.emoji} {t.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      )}

      <Text style={styles.sectionLabel}>How much time do you have?</Text>
      <Text style={styles.subtitle}>A shorter budget means a shorter edition — sections that need more time than you have just won't show up today.</Text>
      <View style={styles.chipRow}>
        {TIME_BUDGETS.map((m) => {
          const on = timeBudget === m;
          return (
            <TouchableOpacity key={m} onPress={() => setTimeBudget(on ? null : m)} style={[styles.chip, on && styles.chipOn]}>
              <Text style={[styles.chipText, on && styles.chipTextOn]}>{m === 45 ? "45+ min" : `${m} min`}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={save} disabled={saving}>
        {saving ? (
          <ActivityIndicator color={colors.paper} />
        ) : (
          <Text style={styles.saveButtonText}>{nothingChosen ? "Skip for now" : "Save & continue"}</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.paper },
  content: { padding: 20, paddingBottom: 48 },
  kicker: { fontFamily: fonts.sansSemiBold, fontSize: 11, letterSpacing: 1.4, textTransform: "uppercase", color: colors.terracotta, marginBottom: 8 },
  title: { fontFamily: fonts.serifSemiBold, fontSize: 24, color: colors.ink, marginBottom: 8 },
  subtitle: { fontFamily: fonts.sans, fontSize: 13.5, color: colors.inkMuted, marginBottom: 16, lineHeight: 19 },
  sectionLabel: { fontFamily: fonts.serifSemiBold, fontSize: 17, color: colors.ink, marginTop: 10, marginBottom: 4 },
  chipRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 10 },
  chip: { borderWidth: 1, borderColor: "rgba(43,38,34,.18)", borderRadius: 999, paddingVertical: 9, paddingHorizontal: 14, backgroundColor: colors.paperHi },
  chipOn: { borderColor: colors.terracotta, backgroundColor: "rgba(193,85,44,.08)" },
  chipText: { fontFamily: fonts.sansMedium, fontSize: 14, color: colors.ink },
  chipTextOn: { color: colors.terracotta },
  saveButton: {
    backgroundColor: colors.ink,
    borderRadius: 999,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 16,
  },
  saveButtonText: { fontFamily: fonts.sansSemiBold, fontSize: 15, color: colors.paper },
});
