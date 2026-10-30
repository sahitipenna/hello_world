import { useCallback, useState } from "react";
import { ActivityIndicator, FlatList, Linking, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { fetchBookmarks, removeBookmark, ShelfItem } from "../api/bookmarks";
import { colors, fonts } from "../theme";

const TYPE_LABEL: Record<string, string> = {
  news: "Know",
  artwork: "Look",
  literary: "Read",
  travel: "Wander",
  book: "Read next",
  wonder: "Wonder",
  word: "Word",
};

export default function ShelfScreen() {
  const [items, setItems] = useState<ShelfItem[] | null>(null);

  useFocusEffect(
    useCallback(() => {
      fetchBookmarks()
        .then((d) => setItems(d.items))
        .catch(() => setItems([]));
    }, [])
  );

  function remove(item: ShelfItem) {
    setItems((prev) => prev?.filter((it) => !(it.contentType === item.contentType && it.contentId === item.contentId)) ?? null);
    removeBookmark(item.contentType, item.contentId).catch(() => {});
  }

  if (!items) {
    return (
      <View style={[styles.screen, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator color={colors.ink} />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>{items.length === 0 ? "Nothing saved yet" : `You've discovered ${items.length} ${items.length === 1 ? "thing" : "things"}`}</Text>
      <Text style={styles.subtitle}>
        {items.length === 0 ? "Tap ☆ Save on anything that catches your attention — it'll turn up here." : "Everything you've saved, newest first."}
      </Text>
      <FlatList
        data={items}
        keyExtractor={(it) => `${it.contentType}:${it.contentId}`}
        contentContainerStyle={{ paddingBottom: 32 }}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <Text style={styles.kicker}>{TYPE_LABEL[item.contentType] ?? item.contentType}</Text>
              <Text style={styles.itemTitle}>{item.title}</Text>
              {item.subtitle ? <Text style={styles.itemSubtitle}>{item.subtitle}</Text> : null}
              {item.sourceUrl ? (
                <TouchableOpacity onPress={() => Linking.openURL(item.sourceUrl!).catch(() => {})}>
                  <Text style={styles.link}>Find out more ↗</Text>
                </TouchableOpacity>
              ) : null}
            </View>
            <TouchableOpacity onPress={() => remove(item)} hitSlop={10}>
              <Text style={styles.remove}>Remove</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.paper, padding: 20 },
  title: { fontFamily: fonts.serifSemiBold, fontSize: 22, color: colors.ink, marginBottom: 6 },
  subtitle: { fontFamily: fonts.sans, fontSize: 13.5, color: colors.inkMuted, marginBottom: 18 },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(43,38,34,.1)",
  },
  kicker: { fontFamily: fonts.sansSemiBold, fontSize: 10.5, letterSpacing: 1, textTransform: "uppercase", color: colors.mustard, marginBottom: 3 },
  itemTitle: { fontFamily: fonts.serifSemiBold, fontSize: 16, color: colors.ink, marginBottom: 2 },
  itemSubtitle: { fontFamily: fonts.sans, fontSize: 13, color: colors.inkMuted, marginBottom: 4 },
  link: { fontFamily: fonts.sansMedium, fontSize: 12.5, color: colors.sky },
  remove: { fontFamily: fonts.sansMedium, fontSize: 12.5, color: colors.rust },
});
