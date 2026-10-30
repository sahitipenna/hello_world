import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { fetchDaily } from "../api/daily";
import { colors, fonts, sectionAccent } from "../theme";
import { DailyEditionResponse, EditionSection } from "../types";
import type { RootStackParamList } from "../navigation";

type Props = NativeStackScreenProps<RootStackParamList, "Home">;

function sectionSubtitle(section: EditionSection): string {
  const c = section.content;
  if (!c) return section.tagline;
  switch (c.kind) {
    case "know":
      return c.items[0]?.title ?? section.tagline;
    case "look":
      return c.custom?.title ?? c.query;
    case "read":
      return `${c.poem.title} — ${c.poem.poet}`;
    case "wander":
      return c.travel.title;
    case "readnext":
      return `${c.book.title} — ${c.book.author}`;
    case "wonder":
      return c.wonder.title;
    case "word":
      return c.word.word;
    case "do":
      return `${c.tasks.length} little things`;
    case "quiz":
      return "Pick a genre, test yourself";
    default:
      return section.tagline;
  }
}

export default function HomeScreen({ navigation }: Props) {
  const [data, setData] = useState<DailyEditionResponse | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(() => {
    setError(null);
    return fetchDaily()
      .then(setData)
      .catch(() => setError("Couldn't reach Go Dilly. Check your connection and try again."));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function onRefresh() {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }

  function openSection(section: EditionSection) {
    if (section.key === "quiz") {
      navigation.navigate("Quiz");
    } else if (data) {
      navigation.navigate("Section", { section, dateISO: data.dateISO, initialTodoChecks: data.todoChecks ?? {} });
    }
  }

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.paper} />}
    >
      <Text style={styles.wordmark}>Go Dilly</Text>
      <Text style={styles.greeting}>Hello there. Take a little time for yourself.</Text>

      {error && <Text style={styles.error}>{error}</Text>}
      {!data && !error && <ActivityIndicator color={colors.paper} style={{ marginTop: 40 }} />}

      {data?.sections.map((section) => (
        <TouchableOpacity
          key={section.key}
          activeOpacity={0.8}
          onPress={() => openSection(section)}
          style={styles.card}
        >
          <View style={[styles.accentBar, { backgroundColor: sectionAccent[section.key] ?? colors.terracotta }]} />
          <View style={styles.cardBody}>
            <Text style={[styles.eyebrow, { color: sectionAccent[section.key] ?? colors.terracotta }]}>
              {section.eyebrow}
            </Text>
            <Text style={styles.cardTitle}>{section.title}</Text>
            <Text style={styles.cardSubtitle} numberOfLines={2}>
              {sectionSubtitle(section)}
            </Text>
          </View>
        </TouchableOpacity>
      ))}

      {data && (
        <Text style={styles.signoff}>That's enough for today. Go have a life.</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.ink },
  content: { padding: 20, paddingBottom: 48 },
  wordmark: { fontFamily: fonts.hand, fontSize: 34, color: colors.paper, marginBottom: 4 },
  greeting: { fontFamily: fonts.sans, fontSize: 13, color: "rgba(250,243,230,.75)", marginBottom: 20 },
  error: { fontFamily: fonts.sans, color: colors.terracotta, marginTop: 20 },
  card: {
    flexDirection: "row",
    backgroundColor: colors.paper,
    borderRadius: 10,
    marginBottom: 14,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  accentBar: { width: 6 },
  cardBody: { flex: 1, padding: 16 },
  eyebrow: { fontFamily: fonts.sansSemiBold, fontSize: 11, letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 4 },
  cardTitle: { fontFamily: fonts.serifSemiBold, fontSize: 18, color: colors.ink, marginBottom: 4 },
  cardSubtitle: { fontFamily: fonts.sans, fontSize: 13.5, color: colors.inkMuted },
  signoff: {
    fontFamily: fonts.hand,
    fontSize: 18,
    color: "rgba(250,243,230,.7)",
    textAlign: "center",
    marginTop: 24,
  },
});
