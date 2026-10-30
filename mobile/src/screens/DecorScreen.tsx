import { Linking, ScrollView, StyleSheet, Text, TouchableOpacity } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { colors, fonts } from "../theme";
import type { RootStackParamList } from "../navigation";

type Props = NativeStackScreenProps<RootStackParamList, "Decor">;

export default function DecorScreen({ route }: Props) {
  const { object } = route.params;
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      {object.description ? <Text style={styles.description}>{object.description}</Text> : null}
      <Text style={styles.title}>{object.title}</Text>
      {object.sub ? <Text style={styles.sub}>{object.sub}</Text> : null}
      <Text style={styles.body}>{object.body}</Text>
      {object.url ? (
        <TouchableOpacity
          style={[styles.linkButton, { backgroundColor: object.accent }]}
          onPress={() => Linking.openURL(object.url!).catch(() => {})}
        >
          <Text style={styles.linkButtonText}>{object.linkLabel ?? "Open"}</Text>
        </TouchableOpacity>
      ) : null}
      {object.note ? <Text style={styles.note}>{object.note}</Text> : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.paper },
  content: { padding: 20, paddingBottom: 48, gap: 14 },
  description: { fontFamily: fonts.serifItalic, fontSize: 13.5, color: "#8a8178" },
  title: { fontFamily: fonts.serif, fontSize: 28, color: colors.ink },
  sub: { fontFamily: fonts.sans, fontSize: 14, color: colors.inkMuted },
  body: { fontFamily: fonts.sans, fontSize: 16, color: colors.ink, lineHeight: 24 },
  linkButton: { alignSelf: "flex-start", borderRadius: 999, paddingVertical: 10, paddingHorizontal: 18 },
  linkButtonText: { fontFamily: fonts.sansSemiBold, fontSize: 14, color: colors.paper },
  note: { fontFamily: fonts.hand, fontSize: 20, color: colors.rust },
});
