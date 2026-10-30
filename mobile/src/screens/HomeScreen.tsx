import { useCallback, useState } from "react";
import { ActivityIndicator, RefreshControl, ScrollView, StyleSheet, Text, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { fetchDaily } from "../api/daily";
import { colors, fonts } from "../theme";
import { DailyEditionResponse, EditionSection, SideObject } from "../types";
import type { RootStackParamList } from "../navigation";
import { SECTION_ILLUSTRATION, SECTION_ASPECT, DECOR_ILLUSTRATION, DECOR_ASPECT } from "../illustrations";
import DeskCard from "../components/DeskCard";
import DeskSurface from "../components/DeskSurface";
import { DeskSkin, fetchDeskPrefs, isDarkSkin } from "../lib/deskPrefs";

type Props = NativeStackScreenProps<RootStackParamList, "Home">;

// Full-width "feature" cards, same split as web's WIDE_MOBILE_KEYS in
// lib/deskLayout.ts — everything else pairs up two per row, and a
// narrow section left alone (because a wide one interrupted the
// pairing) gets a half-width slot too, not a full-width one.
const WIDE_KEYS = new Set(["read", "wander"]);
const NARROW_WIDTH = "46%";
const WIDE_WIDTH = "78%";
const ROTATIONS = [-3, 2.5, -2, 3, -3.5, 2];

function illustrationProps(section: EditionSection): Record<string, unknown> | undefined {
  return section.key === "readnext" && section.content?.kind === "readnext" ? { title: section.content.book.title } : undefined;
}

type Row = { kind: "sections"; items: EditionSection[] } | { kind: "decor"; item: SideObject };

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

  function openDecor(object: SideObject) {
    setVisited((prev) => new Set(prev).add(object.id));
    navigation.navigate("Decor", { object });
  }

  const sectionsByKey = new Map((data?.sections ?? []).map((s) => [s.key, s]));
  const visibleOrder = order.length > 0 ? order : data?.sections.map((s) => s.key) ?? [];
  const visibleSections = visibleOrder.map((key) => sectionsByKey.get(key)).filter((s): s is EditionSection => Boolean(s) && !hidden.includes(s!.key));

  // Groups sections into rows (a WIDE_KEYS section spans alone,
  // everything else pairs up two at a time), then spreads the decor
  // objects across the gaps between rows — one roughly every
  // sectionRows.length/decor.length rows — the same two-phase shape as
  // web's mobileFlowLayout, so decor never dumps as a block at the end.
  const sectionRows: EditionSection[][] = [];
  let pendingNarrow: EditionSection | null = null;
  for (const section of visibleSections) {
    if (WIDE_KEYS.has(section.key)) {
      if (pendingNarrow) {
        sectionRows.push([pendingNarrow]);
        pendingNarrow = null;
      }
      sectionRows.push([section]);
    } else if (pendingNarrow) {
      sectionRows.push([pendingNarrow, section]);
      pendingNarrow = null;
    } else {
      pendingNarrow = section;
    }
  }
  if (pendingNarrow) sectionRows.push([pendingNarrow]);

  const decorObjects = data?.sideObjects ?? [];
  const rows: Row[] = [];
  if (decorObjects.length > 0 && sectionRows.length > 0) {
    const gap = sectionRows.length / decorObjects.length;
    const decorAfterRow = new Map<number, SideObject[]>();
    decorObjects.forEach((obj, idx) => {
      const rowIndex = Math.min(sectionRows.length - 1, Math.round(gap * (idx + 1)) - 1);
      decorAfterRow.set(rowIndex, [...(decorAfterRow.get(rowIndex) ?? []), obj]);
    });
    sectionRows.forEach((row, idx) => {
      rows.push({ kind: "sections", items: row });
      for (const obj of decorAfterRow.get(idx) ?? []) rows.push({ kind: "decor", item: obj });
    });
  } else {
    for (const row of sectionRows) rows.push({ kind: "sections", items: row });
    for (const obj of decorObjects) rows.push({ kind: "decor", item: obj });
  }

  const lightText = isDarkSkin(skin);
  let rotationIndex = 0;

  return (
    <ScrollView
      style={styles.screen}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={lightText ? colors.paper : colors.ink} />}
    >
      <DeskSurface skin={skin}>
      <View style={styles.content}>
      <Text style={[styles.wordmark, lightText && styles.textLight]}>Go Dilly</Text>
      <Text style={[styles.greeting, lightText ? styles.textLightMuted : styles.textDarkMuted]}>
        Hello there. Take a little time for yourself.
      </Text>

      {error && <Text style={styles.error}>{error}</Text>}
      {!data && !error && <ActivityIndicator color={colors.paper} style={{ marginTop: 40 }} />}

      <View style={{ gap: 26 }}>
        {rows.map((row, i) => {
          if (row.kind === "decor") {
            const Illustration = DECOR_ILLUSTRATION[row.item.id] ?? DECOR_ILLUSTRATION[row.item.label.toLowerCase()];
            // Side-object ids are pool keys (mug/plant/headphones/apple)
            // server-side — fall back through a couple of guesses rather
            // than silently dropping an object a new pool key was added
            // for but this map hasn't been updated to include yet.
            const aspect = DECOR_ASPECT[row.item.id] ?? 1;
            if (!Illustration) return null;
            const rotateDeg = ROTATIONS[rotationIndex++ % ROTATIONS.length];
            return (
              <View key={`decor-${row.item.id}`} style={styles.rowSingle}>
                <View style={styles.decorSlot}>
                  <DeskCard
                    label={row.item.label}
                    visited={visited.has(row.item.id)}
                    rotateDeg={rotateDeg}
                    aspectRatio={aspect}
                    illustration={<Illustration />}
                    onPress={() => openDecor(row.item)}
                  />
                </View>
              </View>
            );
          }

          const sections = row.items;
          const rowIsWide = sections.length === 1 && WIDE_KEYS.has(sections[0].key);
          return (
            <View key={`row-${i}`} style={rowIsWide ? styles.rowSingle : styles.rowPair}>
              {sections.map((section) => {
                const Illustration = SECTION_ILLUSTRATION[section.key];
                if (!Illustration) return null;
                const slotStyle =
                  sections.length === 1 ? { width: rowIsWide ? WIDE_WIDTH : NARROW_WIDTH } : styles.slotHalf;
                const rotateDeg = ROTATIONS[rotationIndex++ % ROTATIONS.length];
                return (
                  <View key={section.key} style={slotStyle}>
                    <DeskCard
                      label={section.title}
                      visited={visited.has(section.key)}
                      rotateDeg={rotateDeg}
                      aspectRatio={SECTION_ASPECT[section.key] ?? 1}
                      illustration={<Illustration {...illustrationProps(section)} />}
                      onPress={() => openSection(section)}
                    />
                  </View>
                );
              })}
            </View>
          );
        })}
      </View>

      {data && <Text style={styles.signoff}>That's enough for today. Go have a life.</Text>}
      </View>
      </DeskSurface>
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
  slotHalf: { flex: 1 },
  decorSlot: { width: "34%" },
  signoff: {
    fontFamily: fonts.hand,
    fontSize: 18,
    color: "rgba(250,243,230,.7)",
    textAlign: "center",
    marginTop: 30,
  },
});
