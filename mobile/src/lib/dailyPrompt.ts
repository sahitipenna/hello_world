import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "godilly-interests-answered-date";

function todayISO(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** The "what are you curious about today" prompt shows once per day, on
 * the first launch that day — tapping Save/Skip counts as answering it
 * (don't show again today); backgrounding or force-quitting the app
 * without tapping either means it's still unanswered, so it shows again
 * on the next launch, same day or not. */
export async function hasAnsweredToday(): Promise<boolean> {
  try {
    return (await AsyncStorage.getItem(KEY)) === todayISO();
  } catch {
    return false;
  }
}

export async function markAnsweredToday(): Promise<void> {
  try {
    await AsyncStorage.setItem(KEY, todayISO());
  } catch {}
}
