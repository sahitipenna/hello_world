import { useEffect, useState } from "react";
import { ActivityIndicator, Image, Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { colors, fonts, sectionAccent } from "../theme";
import type { RootStackParamList } from "../navigation";
import { resolveArt, resolveBookCover, ArtResolution, BookCoverResolution } from "../api/extras";
import { apiPatch } from "../api/client";
import { addBookmark, fetchBookmarks, removeBookmark } from "../api/bookmarks";
import { EditionContent } from "../types";
import SaveButton from "../components/SaveButton";

type Props = NativeStackScreenProps<RootStackParamList, "Section">;

function LinkText({ url, children }: { url: string; children: string }) {
  return (
    <TouchableOpacity onPress={() => Linking.openURL(url).catch(() => {})}>
      <Text style={styles.link}>{children}</Text>
    </TouchableOpacity>
  );
}

/** Which single-item content kinds are bookmarkable, and the
 * {contentType, contentId} /api/bookmarks identifies them by — matches
 * lib/contentLookup.ts's BOOKMARKABLE_TYPES. "know" is handled
 * separately below since it's several items, not one. */
function bookmarkTarget(content: EditionContent): { contentType: string; contentId: string } | null {
  if (!content) return null;
  switch (content.kind) {
    case "look":
      return { contentType: "artwork", contentId: content.artworkId };
    case "read":
      return content.poem.id ? { contentType: "literary", contentId: content.poem.id } : null;
    case "wander":
      return content.travel.id ? { contentType: "travel", contentId: content.travel.id } : null;
    case "readnext":
      return content.book.id ? { contentType: "book", contentId: content.book.id } : null;
    case "wonder":
      return { contentType: "wonder", contentId: content.wonder.id };
    case "word":
      return { contentType: "word", contentId: content.word.id };
    default:
      return null;
  }
}

export default function SectionScreen({ route }: Props) {
  const { section, dateISO, initialTodoChecks } = route.params;
  const accent = sectionAccent[section.key] ?? colors.terracotta;
  const c = section.content;

  // Live resolutions the server doesn't inline into /api/daily — the same
  // client-side calls components/ArtCard.tsx and BookRecommendation.tsx
  // make on web (see mobile/README.md's "not yet ported" note, which this
  // closes for these two).
  const [art, setArt] = useState<ArtResolution | null>(null);
  const [artLoading, setArtLoading] = useState(false);
  const [bookCover, setBookCover] = useState<BookCoverResolution | null>(null);
  const [checks, setChecks] = useState<Record<number, boolean>>(initialTodoChecks);
  const [savedKeys, setSavedKeys] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchBookmarks()
      .then((d) => setSavedKeys(new Set(d.items.map((it) => `${it.contentType}:${it.contentId}`))))
      .catch(() => {});
  }, []);

  function toggleSave(contentType: string, contentId: string) {
    const key = `${contentType}:${contentId}`;
    const alreadySaved = savedKeys.has(key);
    setSavedKeys((prev) => {
      const next = new Set(prev);
      if (alreadySaved) next.delete(key);
      else next.add(key);
      return next;
    });
    const call = alreadySaved ? removeBookmark(contentType, contentId) : addBookmark(contentType, contentId);
    call.catch(() => {
      // Revert optimistic update on failure.
      setSavedKeys((prev) => {
        const next = new Set(prev);
        if (alreadySaved) next.add(key);
        else next.delete(key);
        return next;
      });
    });
  }

  const target = bookmarkTarget(c);
  const saveRow = target ? (
    <SaveButton saved={savedKeys.has(`${target.contentType}:${target.contentId}`)} onToggle={() => toggleSave(target.contentType, target.contentId)} />
  ) : null;

  useEffect(() => {
    if (c?.kind === "look" && !c.custom) {
      setArtLoading(true);
      resolveArt(c.query, c.artworkId)
        .then(setArt)
        .catch(() => setArt(null))
        .finally(() => setArtLoading(false));
    }
  }, [c]);

  useEffect(() => {
    if (c?.kind === "readnext") {
      resolveBookCover(c.book.title, c.book.author)
        .then(setBookCover)
        .catch(() => setBookCover(null));
    }
  }, [c]);

  function toggleTask(i: number, category: string) {
    const done = !checks[i];
    const next = { ...checks, [i]: done };
    setChecks(next);
    apiPatch("/api/todos/checks", { dateISO, index: i, done, category }).catch(() => {});
  }

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
              <View style={styles.knowItemFooter}>
                <Text style={[styles.meta, { marginBottom: 0 }]}>
                  {item.source} · {item.readingTimeMin} min
                </Text>
                <SaveButton small saved={savedKeys.has(`news:${item.id}`)} onToggle={() => toggleSave("news", item.id)} />
              </View>
            </View>
          ))}
        </View>
      )}

      {c?.kind === "look" && (
        <>
          {saveRow}
          <View style={styles.artFrame}>
            {c.custom?.image || art?.image ? (
              <Image source={{ uri: c.custom?.image ?? art?.image }} style={styles.artImage} resizeMode="cover" />
            ) : artLoading ? (
              <ActivityIndicator color={colors.inkMuted} />
            ) : (
              <Text style={styles.noImage}>no image found</Text>
            )}
          </View>
          <Text style={styles.itemTitle}>{c.custom?.title ?? art?.title ?? c.query}</Text>
          {c.custom?.artist ?? art?.artist ? <Text style={styles.meta}>{c.custom?.artist ?? art?.artist}</Text> : null}
          <Text style={styles.body}>{c.analysis}</Text>
          {(c.custom?.sourceUrl ?? art?.sourceUrl) ? (
            <LinkText url={(c.custom?.sourceUrl ?? art?.sourceUrl)!}>See it at the museum ↗</LinkText>
          ) : null}
        </>
      )}

      {c?.kind === "read" && (
        <>
          {saveRow}
          <View style={{ marginBottom: 14 }}>
            {c.poem.lines.map((line, i) => (
              <Text key={i} style={styles.poemLine}>
                {line || " "}
              </Text>
            ))}
          </View>
          <Text style={styles.itemTitle}>{c.poem.title}</Text>
          <Text style={styles.meta}>
            {c.poem.poet}
            {c.poem.year ? `, ${c.poem.year}` : ""}
          </Text>
          {c.poem.context ? <Text style={styles.bodyItalic}>{c.poem.context}</Text> : null}
          {c.poem.sourceUrl ? <LinkText url={c.poem.sourceUrl}>Read the full work ↗</LinkText> : null}
        </>
      )}

      {c?.kind === "wander" && (
        <>
          {saveRow}
          <Text style={styles.itemTitle}>{c.travel.title}</Text>
          <Text style={styles.meta}>{c.travel.place}</Text>
          <Text style={styles.body}>{c.travel.body}</Text>
        </>
      )}

      {c?.kind === "readnext" && (
        <>
          {saveRow}
          <View style={styles.bookRow}>
            <View style={styles.bookCoverFrame}>
              {bookCover?.cover ? (
                <Image source={{ uri: bookCover.cover }} style={styles.bookCoverImage} resizeMode="cover" />
              ) : (
                <Text style={styles.noImageSmall}>no cover</Text>
              )}
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.itemTitle}>{c.book.title}</Text>
              <Text style={styles.meta}>{c.book.author}</Text>
            </View>
          </View>
          <Text style={styles.body}>{c.book.reason}</Text>
          {bookCover?.sourceUrl ? <LinkText url={bookCover.sourceUrl}>Find it ↗</LinkText> : null}
        </>
      )}

      {c?.kind === "wonder" && (
        <>
          {saveRow}
          <Text style={styles.itemTitle}>{c.wonder.title}</Text>
          <Text style={styles.body}>{c.wonder.body}</Text>
          {c.wonder.source ? <Text style={styles.meta}>{c.wonder.source}</Text> : null}
        </>
      )}

      {c?.kind === "word" && (
        <>
          {saveRow}
          <Text style={styles.itemTitle}>{c.word.word}</Text>
          <Text style={styles.meta}>
            {c.word.pronunciation} · {c.word.partOfSpeech}
          </Text>
          <Text style={styles.body}>{c.word.definition}</Text>
          {c.word.example ? <Text style={styles.bodyItalic}>"{c.word.example}"</Text> : null}
        </>
      )}

      {c?.kind === "do" && (
        <View style={{ gap: 12 }}>
          {c.tasks.map((task, i) => {
            const done = !!checks[i];
            return (
              <TouchableOpacity key={i} style={styles.taskRow} onPress={() => toggleTask(i, task.category)} activeOpacity={0.7}>
                <View style={[styles.checkbox, done && styles.checkboxDone]}>
                  {done && <Text style={styles.checkmark}>✓</Text>}
                </View>
                <Text style={[styles.body, done && styles.taskDone, { flex: 1 }]}>{task.title}</Text>
              </TouchableOpacity>
            );
          })}
          <Text style={styles.meta}>
            {Object.values(checks).filter(Boolean).length} of {c.tasks.length} done
          </Text>
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
  bodyItalic: { fontFamily: fonts.serifItalic, fontSize: 14, color: colors.inkMuted, marginTop: 4, marginBottom: 8, lineHeight: 20 },
  poemLine: { fontFamily: fonts.serifItalic, fontSize: 17, color: colors.inkSoft, lineHeight: 27 },
  subCard: { borderBottomWidth: 1, borderBottomColor: "rgba(43,38,34,.1)", paddingBottom: 16 },
  knowItemFooter: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 2 },
  link: { fontFamily: fonts.sansMedium, fontSize: 13.5, color: colors.sky, marginTop: 4 },
  artFrame: {
    width: "100%",
    aspectRatio: 1.2,
    backgroundColor: colors.paper2,
    borderRadius: 8,
    marginBottom: 14,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  artImage: { width: "100%", height: "100%" },
  noImage: { fontFamily: fonts.sans, fontSize: 12, color: "rgba(43,38,34,.3)" },
  noImageSmall: { fontFamily: fonts.sans, fontSize: 10.5, color: "rgba(43,38,34,.3)", textAlign: "center", paddingHorizontal: 4 },
  bookRow: { flexDirection: "row", gap: 14, marginBottom: 12 },
  bookCoverFrame: {
    width: 108,
    aspectRatio: 2 / 3,
    backgroundColor: colors.paper2,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  bookCoverImage: { width: "100%", height: "100%" },
  taskRow: { flexDirection: "row", alignItems: "flex-start", gap: 12 },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: "rgba(43,38,34,.3)",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 1,
  },
  checkboxDone: { backgroundColor: colors.sage, borderColor: colors.sage },
  checkmark: { color: colors.paperHi, fontSize: 13, fontFamily: fonts.sansSemiBold },
  taskDone: { textDecorationLine: "line-through", color: "rgba(43,38,34,.4)" },
});
