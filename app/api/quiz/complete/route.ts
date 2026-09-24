import { NextRequest, NextResponse } from "next/server";
import { getOrCreateUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getUnlockedDifficulties } from "@/lib/quizProgress";
import { QuizDifficulty } from "@/lib/types";

const VALID_DIFFICULTIES: QuizDifficulty[] = ["easy", "medium", "hard"];

/** Marks a (genre, difficulty) tier finished for this user, unlocking the next tier. */
export async function POST(req: NextRequest) {
  const user = await getOrCreateUser();
  const body = await req.json().catch(() => null);
  const { genre, difficulty } = body ?? {};

  if (typeof genre !== "string" || !VALID_DIFFICULTIES.includes(difficulty)) {
    return NextResponse.json({ error: "invalid body" }, { status: 400 });
  }

  await prisma.quizProgress.upsert({
    where: { userId_genre_difficulty: { userId: user.id, genre, difficulty } },
    update: {},
    create: { userId: user.id, genre, difficulty },
  });

  const unlocked = await getUnlockedDifficulties(user.id, genre);
  return NextResponse.json({ ok: true, unlocked });
}
