import { prisma } from "./db";
import { QuizDifficulty } from "./types";

const TIERS: QuizDifficulty[] = ["easy", "medium", "hard"];

/** Easy is always unlocked; each further tier unlocks once the one before it is completed. */
export async function getUnlockedDifficulties(userId: string, genre: string): Promise<QuizDifficulty[]> {
  const completed = await prisma.quizProgress.findMany({
    where: { userId, genre },
    select: { difficulty: true },
  });
  const completedSet = new Set(completed.map((c) => c.difficulty));

  const unlocked: QuizDifficulty[] = ["easy"];
  for (let i = 1; i < TIERS.length; i++) {
    if (completedSet.has(TIERS[i - 1])) {
      unlocked.push(TIERS[i]);
    } else {
      break;
    }
  }
  return unlocked;
}
