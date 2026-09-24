import { NextRequest, NextResponse } from "next/server";
import { getOrCreateUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { QuizDifficulty } from "@/lib/types";

const VALID_DIFFICULTIES: QuizDifficulty[] = ["easy", "medium", "hard"];

export async function GET(req: NextRequest) {
  const genre = req.nextUrl.searchParams.get("genre");
  const difficulty = req.nextUrl.searchParams.get("difficulty") as QuizDifficulty | null;

  if (!genre || !difficulty || !VALID_DIFFICULTIES.includes(difficulty)) {
    return NextResponse.json({ error: "genre and a valid difficulty are required" }, { status: 400 });
  }

  const user = await getOrCreateUser();
  const [questions, edits] = await Promise.all([
    prisma.quizQuestion.findMany({ where: { genre, difficulty }, orderBy: { index: "asc" } }),
    prisma.quizEdit.findMany({ where: { userId: user.id, genre, difficulty } }),
  ]);

  const editByIndex = new Map(edits.map((e) => [e.questionIndex, e]));
  const merged = questions.map((q) => {
    const edit = editByIndex.get(q.index);
    return {
      index: q.index,
      question: edit?.question ?? q.question,
      answer: edit?.answer ?? q.answer,
      genre: q.genre,
      difficulty: q.difficulty,
    };
  });

  return NextResponse.json({ questions: merged }, { headers: { "Cache-Control": "private, no-store" } });
}

export async function PATCH(req: NextRequest) {
  const user = await getOrCreateUser();
  const body = await req.json().catch(() => null);
  const { genre, difficulty, index, question, answer } = body ?? {};

  if (
    typeof genre !== "string" ||
    typeof difficulty !== "string" ||
    !VALID_DIFFICULTIES.includes(difficulty as QuizDifficulty) ||
    typeof index !== "number" ||
    typeof question !== "string" ||
    typeof answer !== "string"
  ) {
    return NextResponse.json({ error: "invalid body" }, { status: 400 });
  }
  const q = question.trim().slice(0, 300);
  const a = answer.trim().slice(0, 300);
  if (!q || !a) {
    return NextResponse.json({ error: "question and answer are required" }, { status: 400 });
  }

  await prisma.quizEdit.upsert({
    where: { userId_genre_difficulty_questionIndex: { userId: user.id, genre, difficulty, questionIndex: index } },
    update: { question: q, answer: a },
    create: { userId: user.id, genre, difficulty, questionIndex: index, question: q, answer: a },
  });

  return NextResponse.json({ ok: true, question: q, answer: a });
}
