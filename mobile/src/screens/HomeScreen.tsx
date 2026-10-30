import { useCallback, useState } from "react";
import { ActivityIndicator, RefreshControl, ScrollView, StyleSheet, Text, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { fetchDaily } from "../api/daily";
import { colors, fonts } from "../theme";
import { DailyEditionResponse, EditionSection } from "../types";
import type { RootStackParamList } from "../navigation";
import { SECTION_ILLUSTRATION, SECTION_ASPECT } from "../illustrations";
import DeskCard from "../components/DeskCard";
import { DESK_SKIN_COLOR, DeskSkin, fetchDeskPrefs, isDarkSkin } from "../lib/deskPrefs";

type Props = NativeStackScreenProps<RootStackParamList, "Home">;

// Full-width "feature" cards, same split as web's WIDE_MOBILE_KEYS in
// lib/deskLayout.ts — everything else pairs up two per row.
const WIDE_KEYS = new Set(["read", "wander"]);
const ROTATIONS = [-3, 2.5, -2, 3, -3.5, 2];

function illustrationProps(section: EditionSection): Record<string, unknown> | undefined {
  return section.key === "readnext" && section.content?.kind === "readnext" ? { title: section.content.book.title } : undefined;
}

export default function HomeScreen({ navigation }: Props) {
  const [data, setData] = useState<DailyEditionResponse | null>(null);
  const [order, setOrder] = useState<string[]>([]);
  const [hidden, setHidden] = useState<string[]>([]);
  const [skin, setSkin] = useState<DeskSkin>("dark");
  const [visited, setVisited] = useState<Set<string>>(new Set());
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(() => {
    setError(null);
    return Promise.all([fetchDaily(), fetchDeskPrefs()])
      .then(([daily, prefs]) => {
        setData(daily);
        setOrder(prefs.sectionOrder.length > 0 ? prefs.sectionOrder : prefs.allSections.map((s) => s.key));
        setHidden(prefs.hiddenSections);
        setSkin(prefs.deskSkin);
      })
      .catch(() => setError("Couldn't reach Go Dilly. Check your connection and try again."));
  }, []);

  // Refetches every time Home regains focus — not just on mount — so
  // saving interests/time-budget/arrange-desk changes elsewhere shows up
  // immediately rather than stale until a manual pull-to-refresh.
  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  async function onRefresh() {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }

  function openSection(section: EditionSection) {
    setVisited((prev) => new Set(prev).add(section.key));
    if (section.key === "quiz") {
      navigation.navigate("Quiz");
    } else if (data) {
      navigation.navigate("Section", { section, dateISO: data.dateISO, initialTodoChecks: data.todoChecks ?? {} });
    }
  }

  const sectionsByKey = new Map((data?.sections ?? []).map((s) => [s.key, s]));
  const visibleOrder = order.length > 0 ? order : data?.sections.map((s) => s.key) ?? [];
  const visibleSections = visibleOrder.map((key) => sectionsByKey.get(key)).filter((s): s is EditionSection => Boolean(s) && !hidden.includes(s!.key));

  // Groups into rows: a WIDE_KEYS section spans alone, everything else
  // pairs up two at a time — same shape as web's mobileFlowLayout rows.
  const rows: EditionSection[][] = [];
  let pendingNarrow: EditionSection | null = null;
  for (const section of visibleSections) {
    if (WIDE_KEYS.has(section.key)) {
      if (pendingNarrow) {
        rows.push([pendingNarrow]);
        pendingNarrow = null;
      }
      rows.push([section]);
    } else if (pendingNarrow) {
      rows.push([pendingNarrow, section]);
      pendingNarrow = null;
    } else {
      pendingNarrow = section;
    }
  }
  if (pendingNarrow) rows.push([pendingNarrow]);

  const lightText = isDarkSkin(skin);

  return (
    <ScrollView
      style={[styles.screen, { backgroundColor: DESK_SKIN_COLOR[skin] }]}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={lightText ? colors.paper : colors.ink} />}
    >
      <Text style={[styles.wordmark, lightText && styles.textLight]}>Go Dilly</Text>
      <Text style={[styles.greeting, lightText ? styles.textLightMuted : styles.textDarkMuted]}>
        Hello there. Take a little time for yourself.
      </Text>

      {error && <Text style={styles.error}>{error}</Text>}
      {!data && !error && <ActivityIndicator color={colors.paper} style={{ marginTop: 40 }} />}

      <View style={{ gap: 28 }}>
        {rows.map((row, i) => (
          <View key={i} style={row.length === 1 ? styles.rowSingle : styles.rowPair}>
            {row.map((section, j) => {
              const Illustration = SECTION_ILLUSTRATION[section.key];
              if (!Illustration) return null;
              const wide = WIDE_KEYS.has(section.key);
              return (
                <View key={section.key} style={wide ? styles.slotWide : styles.slotHalf}>
                  <DeskCard
                    label={section.title}
                    visited={visited.has(section.key)}
                    rotateDeg={ROTATIONS[(i * 2 + j) % ROTATIONS.length]}
                    aspectRatio={SECTION_ASPECT[section.key] ?? 1}
                    illustration={<Illustration {...illustrationProps(section)} />}
                    onPress={() => openSection(section)}
                  />
                </View>
              );
            })}
          </View>
        ))}
      </View>

      {data && <Text style={styles.signoff}>That's enough for today. Go have a life.</Text>}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { padding: 20, paddingBottom: 48 },
  wordmark: { fontFamily: fonts.hand, fontSize: 34, color: colors.ink, marginBottom: 4 },
  greeting: { fontFamily: fonts.sans, fontSize: 13, marginBottom: 24 },
  textLight: { color: colors.paper },
  textLightMuted: { color: "rgba(250,243,230,.75)" },
  textDarkMuted: { color: "rgba(43,38,34,.65)" },
  error: { fontFamily: fonts.sans, color: colors.terracotta, marginTop: 20 },
  rowSingle: { alignItems: "center" },
  rowPair: { flexDirection: "row", gap: 16 },
  slotWide: { width: "78%" },
  slotHalf: { flex: 1 },
  signoff: {
    fontFamily: fonts.hand,
    fontSize: 18,
    color: "rgba(250,243,230,.7)",
    textAlign: "center",
    marginTop: 30,
  },
});
