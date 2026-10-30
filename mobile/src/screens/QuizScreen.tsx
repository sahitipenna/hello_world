import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { completeQuizTier, fetchQuizGenres, fetchQuizQuestions } from "../api/quiz";
import { colors, fonts } from "../theme";
import { QuizDifficulty, QuizGenreInfo, QuizQ } from "../types";

const DIFFICULTY_LABEL: Record<QuizDifficulty, string> = { easy: "Easy", medium: "Medium", hard: "Hard" };
const TIERS: QuizDifficulty[] = ["easy", "medium", "hard"];

function normalize(s: string): string {
  return s
    .toLowerCase()
    .trim()
    .replace(/[.,!?;:'"()]/g, "")
    .replace(/\s+/g, " ");
}

function isLikelyCorrect(typed: string, correct: string): boolean {
  const t = normalize(typed);
  const c = normalize(correct);
  if (!t) return false;
  if (t === c) return true;
  if (t.length >= 3 && (c.includes(t) || t.includes(c))) return true;
  return false;
}

export default function QuizScreen() {
  const [genres, setGenres] = useState<QuizGenreInfo[] | null>(null);
  const [genre, setGenre] = useState<QuizGenreInfo | null>(null);
  const [difficulty, setDifficulty] = useState<QuizDifficulty | null>(null);
  const [questions, setQuestions] = useState<QuizQ[] | null>(null);
  const [current, setCurrent] = useState(0);
  const [typed, setTyped] = useState("");
  const [checked, setChecked] = useState(false);
  const [correct, setCorrect] = useState(false);
  const [justFinished, setJustFinished] = useState<QuizDifficulty | null>(null);
  const [levelComplete, setLevelComplete] = useState(false);
  const [unlockedAfterComplete, setUnlockedAfterComplete] = useState<QuizDifficulty[] | null>(null);
  const autoAdvanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    loadGenres();
    return () => {
      if (autoAdvanceTimer.current) clearTimeout(autoAdvanceTimer.current);
    };
  }, []);

  function clearAutoAdvance() {
    if (autoAdvanceTimer.current) {
      clearTimeout(autoAdvanceTimer.current);
      autoAdvanceTimer.current = null;
    }
  }

  function loadGenres() {
    fetchQuizGenres()
      .then((d) => setGenres(d.genres ?? []))
      .catch(() => setGenres([]));
  }

  function openGenre(g: QuizGenreInfo) {
    setGenre(g);
    setDifficulty(null);
    setJustFinished(null);
    setLevelComplete(false);
    setUnlockedAfterComplete(null);
  }

  function backToGenres() {
    setGenre(null);
    setDifficulty(null);
    setQuestions(null);
    setLevelComplete(false);
    setUnlockedAfterComplete(null);
  }

  function startDifficulty(d: QuizDifficulty) {
    if (!genre) return;
    setDifficulty(d);
    setQuestions(null);
    setCurrent(0);
    resetAnswerState();
    setJustFinished(null);
    setLevelComplete(false);
    setUnlockedAfterComplete(null);
    fetchQuizQuestions(genre.slug, d)
      .then((data) => setQuestions(data.questions ?? []))
      .catch(() => setQuestions([]));
  }

  function resetAnswerState() {
    clearAutoAdvance();
    setTyped("");
    setChecked(false);
    setCorrect(false);
  }

  function checkAnswer() {
    if (!questions) return;
    const q = questions[current];
    const isCorrect = isLikelyCorrect(typed, q.answer);
    setCorrect(isCorrect);
    setChecked(true);
    clearAutoAdvance();
    if (isCorrect) {
      autoAdvanceTimer.current = setTimeout(() => {
        autoAdvanceTimer.current = null;
        go(1);
      }, 900);
    }
  }

  async function go(delta: number) {
    if (!questions || !genre || !difficulty) return;
    const atEnd = current === questions.length - 1 && delta === 1;
    if (atEnd) {
      try {
        const data = await completeQuizTier(genre.slug, difficulty);
        const idx = TIERS.indexOf(difficulty);
        const nextTier = idx >= 0 && idx + 1 < TIERS.length ? TIERS[idx + 1] : undefined;
        const newlyUnlocked = difficulty === "medium" && nextTier && data.unlocked?.includes(nextTier);
        setJustFinished(newlyUnlocked ? (nextTier as QuizDifficulty) : null);
        setUnlockedAfterComplete(data.unlocked ?? null);
        loadGenres();
      } catch {
        // stay on the completion screen even if the progress write failed
      }
      setLevelComplete(true);
      return;
    }
    setJustFinished(null);
    setCurrent((cur) => (cur + delta + questions.length) % questions.length);
    resetAnswerState();
  }

  if (!genres) {
    return (
      <View style={[styles.screen, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator color={colors.ink} />
      </View>
    );
  }

  // Screen 1: genres
  if (!genre) {
    return (
      <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
        <Text style={styles.title}>Daily Quiz</Text>
        <Text style={styles.subtitle}>Pick a genre to start.</Text>
        <View style={styles.chipRow}>
          {genres.map((g) => (
            <TouchableOpacity key={g.slug} style={styles.chip} onPress={() => openGenre(g)}>
              <Text style={styles.chipText}>
                {g.emoji} {g.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    );
  }

  // Screen 2: difficulty picker
  if (!difficulty || !questions) {
    return (
      <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
        <TouchableOpacity onPress={backToGenres}>
          <Text style={styles.back}>← Genres</Text>
        </TouchableOpacity>
        <Text style={styles.subtitle}>
          {genre.emoji} {genre.label}
        </Text>
        <View style={{ gap: 10, marginTop: 10 }}>
          {TIERS.map((t) => {
            const isUnlocked = genre.unlocked.includes(t);
            const isAvailable = genre.available[t];
            const disabled = !isUnlocked || !isAvailable;
            return (
              <TouchableOpacity
                key={t}
                disabled={disabled}
                onPress={() => startDifficulty(t)}
                style={[styles.tierRow, disabled && styles.tierRowDisabled]}
              >
                <Text style={[styles.tierLabel, disabled && styles.tierLabelDisabled]}>{DIFFICULTY_LABEL[t]}</Text>
                <Text style={styles.tierMeta}>
                  {!isUnlocked ? "🔒 finish Medium first" : !isAvailable ? "coming soon" : "15 questions"}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    );
  }

  if (questions.length === 0) {
    return (
      <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
        <TouchableOpacity onPress={backToGenres}>
          <Text style={styles.back}>← Genres</Text>
        </TouchableOpacity>
        <Text style={styles.subtitle}>No questions here yet — check back soon.</Text>
      </ScrollView>
    );
  }

  // Screen 3: tier complete
  if (levelComplete) {
    const nextTier = TIERS[TIERS.indexOf(difficulty) + 1] as QuizDifficulty | undefined;
    const nextReady = Boolean(nextTier && unlockedAfterComplete?.includes(nextTier) && genre.available[nextTier]);
    return (
      <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
        <TouchableOpacity onPress={backToGenres}>
          <Text style={styles.back}>← Genres</Text>
        </TouchableOpacity>
        <Text style={styles.eyebrow}>
          {genre.emoji} {genre.label} · {DIFFICULTY_LABEL[difficulty]}
        </Text>
        <Text style={styles.title}>✓ {DIFFICULTY_LABEL[difficulty]} complete!</Text>
        {nextReady && nextTier ? (
          <>
            <Text style={styles.subtitle}>
              {justFinished === nextTier
                ? `Nice work — ${DIFFICULTY_LABEL[nextTier]} is now unlocked.`
                : `${DIFFICULTY_LABEL[nextTier]} is ready whenever you are.`}
            </Text>
            <TouchableOpacity style={styles.primaryButton} onPress={() => startDifficulty(nextTier)}>
              <Text style={styles.primaryButtonText}>Next: {DIFFICULTY_LABEL[nextTier]} →</Text>
            </TouchableOpacity>
          </>
        ) : (
          <Text style={styles.subtitle}>You've finished every level for {genre.label} — nice work.</Text>
        )}
      </ScrollView>
    );
  }

  // Screen 4: the question itself
  const q = questions[current];
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.rowBetween}>
        <TouchableOpacity onPress={backToGenres}>
          <Text style={styles.back}>← Genres</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.eyebrow}>
        {genre.emoji} {genre.label} · {DIFFICULTY_LABEL[difficulty]} · {current + 1} of {questions.length}
      </Text>
      <Text style={styles.question}>{q.question}</Text>

      <View style={styles.answerRow}>
        <TextInput
          value={typed}
          onChangeText={(v) => {
            setTyped(v);
            setChecked(false);
            clearAutoAdvance();
          }}
          onSubmitEditing={checkAnswer}
          placeholder="Type your answer…"
          placeholderTextColor={colors.inkMuted}
          style={styles.input}
        />
        <TouchableOpacity onPress={checkAnswer} style={styles.checkButton}>
          <Text style={styles.checkButtonText}>Check</Text>
        </TouchableOpacity>
      </View>

      {checked && (
        <Text style={styles.feedback}>
          {correct ? (
            <Text style={{ color: colors.sage }}>✓ Correct!</Text>
          ) : (
            <>
              <Text style={{ color: colors.rust }}>Not quite. </Text>
              <Text style={{ color: colors.rust, fontFamily: fonts.sansSemiBold }}>The answer: {q.answer}</Text>
            </>
          )}
        </Text>
      )}

      <View style={styles.rowBetween}>
        <TouchableOpacity onPress={() => go(-1)}>
          <Text style={styles.navButton}>← Prev</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => go(1)} disabled={!checked}>
          <Text style={[styles.navButton, !checked && styles.navButtonDisabled]}>
            {current === questions.length - 1 ? "Finish" : "Next"} →
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.paper },
  content: { padding: 20, paddingBottom: 48 },
  title: { fontFamily: fonts.serifSemiBold, fontSize: 20, color: colors.ink, marginBottom: 10 },
  subtitle: { fontFamily: fonts.sans, fontSize: 14, color: colors.inkMuted, marginBottom: 14 },
  eyebrow: { fontFamily: fonts.sansSemiBold, fontSize: 12, letterSpacing: 1, textTransform: "uppercase", color: colors.plum, marginBottom: 10 },
  back: { fontFamily: fonts.sans, fontSize: 13, color: colors.inkMuted, marginBottom: 14 },
  chipRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: { borderWidth: 1, borderColor: "rgba(43,38,34,.15)", borderRadius: 999, paddingVertical: 8, paddingHorizontal: 14 },
  chipText: { fontFamily: fonts.sansMedium, fontSize: 14, color: colors.ink },
  tierRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(43,38,34,.15)",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  tierRowDisabled: { borderColor: "rgba(43,38,34,.08)" },
  tierLabel: { fontFamily: fonts.sansSemiBold, fontSize: 15, color: colors.ink },
  tierLabelDisabled: { color: "rgba(43,38,34,.35)" },
  tierMeta: { fontFamily: fonts.sans, fontSize: 12.5, color: colors.inkMuted },
  question: { fontFamily: fonts.serif, fontSize: 17, color: colors.ink, marginBottom: 16, lineHeight: 24 },
  answerRow: { flexDirection: "row", gap: 8, marginBottom: 10 },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "rgba(43,38,34,.2)",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontFamily: fonts.sans,
    fontSize: 15,
    color: colors.ink,
    backgroundColor: colors.paperHi,
  },
  checkButton: { backgroundColor: colors.ink, borderRadius: 10, paddingHorizontal: 18, justifyContent: "center" },
  checkButtonText: { fontFamily: fonts.sansSemiBold, fontSize: 14, color: colors.paper },
  feedback: { fontFamily: fonts.sans, fontSize: 14, marginBottom: 12 },
  rowBetween: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 12 },
  navButton: { fontFamily: fonts.sansSemiBold, fontSize: 14, color: colors.inkMuted },
  navButtonDisabled: { color: "rgba(43,38,34,.25)" },
  primaryButton: { backgroundColor: colors.ink, borderRadius: 10, paddingVertical: 12, paddingHorizontal: 18, alignSelf: "flex-start" },
  primaryButtonText: { fontFamily: fonts.sansSemiBold, fontSize: 14, color: colors.paper },
});
