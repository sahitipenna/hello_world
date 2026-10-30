import { ScrollView, StyleSheet, Text, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { colors, fonts, sectionAccent } from "../theme";
import type { RootStackParamList } from "../navigation";

type Props = NativeStackScreenProps<RootStackParamList, "Section">;

export default function SectionScreen({ route }: Props) {
  const { section } = route.params;
  const accent = sectionAccent[section.key] ?? colors.terracotta;
  const c = section.content;

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Text style={[styles.eyebrow, { color: accent }]}>{section.eyebrow}</Text>
      <Text style={styles.title}>{section.title}</Text>

      {!c && <Text style={styles.body}>Nothing here today — check back soon.</Text>}

      {c?.kind === "know" && (
        <View style={{ gap: 18 }}>
          {c.items.map((item) => (
            <View key={item.id} style={styles.subCard}>
              <Text style={styles.itemTitle}>{item.title}</Text>
              <Text style={styles.body}>{item.summary}</Text>
              <Text style={styles.meta}>
                {item.source} · {item.readingTimeMin} min
              </Text>
            </View>
          ))}
        </View>
      )}

      {c?.kind === "look" && (
        <>
          <Text style={styles.itemTitle}>{c.custom?.title ?? c.query}</Text>
          {c.custom?.artist ? <Text style={styles.meta}>{c.custom.artist}</Text> : null}
          <Text style={styles.body}>{c.analysis}</Text>
        </>
      )}

      {c?.kind === "read" && (
        <>
          <Text style={styles.itemTitle}>{c.poem.title}</Text>
          <Text style={styles.meta}>{c.poem.poet}</Text>
          <View style={{ marginTop: 10 }}>
            {c.poem.lines.map((line, i) => (
              <Text key={i} style={styles.poemLine}>
                {line || " "}
              </Text>
            ))}
          </View>
        </>
      )}

      {c?.kind === "wander" && (
        <>
          <Text style={styles.itemTitle}>{c.travel.title}</Text>
          <Text style={styles.meta}>{c.travel.place}</Text>
          <Text style={styles.body}>{c.travel.body}</Text>
        </>
      )}

      {c?.kind === "readnext" && (
        <>
          <Text style={styles.itemTitle}>{c.book.title}</Text>
          <Text style={styles.meta}>{c.book.author}</Text>
          <Text style={styles.body}>{c.book.reason}</Text>
        </>
      )}

      {c?.kind === "wonder" && (
        <>
          <Text style={styles.itemTitle}>{c.wonder.title}</Text>
          <Text style={styles.body}>{c.wonder.body}</Text>
          {c.wonder.source ? <Text style={styles.meta}>{c.wonder.source}</Text> : null}
        </>
      )}

      {c?.kind === "word" && (
        <>
          <Text style={styles.itemTitle}>{c.word.word}</Text>
          <Text style={styles.meta}>
            {c.word.pronunciation} · {c.word.partOfSpeech}
          </Text>
          <Text style={styles.body}>{c.word.definition}</Text>
          {c.word.example ? <Text style={styles.bodyItalic}>"{c.word.example}"</Text> : null}
        </>
      )}

      {c?.kind === "do" && (
        <View style={{ gap: 10 }}>
          {c.tasks.map((task, i) => (
            <Text key={i} style={styles.body}>
              ☐ {task.title}
            </Text>
          ))}
        </View>
      )}

      {c?.kind === "play" && (
        <Text style={styles.body}>
          The crossword isn't in the app yet — open Go Dilly on the web for today's mini.
        </Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.paper },
  content: { padding: 20, paddingBottom: 48 },
  eyebrow: { fontFamily: fonts.sansSemiBold, fontSize: 12, letterSpacing: 1.4, textTransform: "uppercase", marginBottom: 6 },
  title: { fontFamily: fonts.serifSemiBold, fontSize: 24, color: colors.ink, marginBottom: 18 },
  itemTitle: { fontFamily: fonts.serifSemiBold, fontSize: 19, color: colors.ink, marginBottom: 4 },
  meta: { fontFamily: fonts.sans, fontSize: 12.5, color: colors.inkMuted, marginBottom: 10 },
  body: { fontFamily: fonts.serif, fontSize: 16, color: colors.inkSoft, lineHeight: 24 },
  bodyItalic: { fontFamily: fonts.serifItalic, fontSize: 15, color: colors.inkMuted, marginTop: 10, lineHeight: 22 },
  poemLine: { fontFamily: fonts.serif, fontSize: 16, color: colors.inkSoft, lineHeight: 26 },
  subCard: { borderBottomWidth: 1, borderBottomColor: "rgba(43,38,34,.1)", paddingBottom: 16 },
});
