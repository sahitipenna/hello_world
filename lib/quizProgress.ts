import { prisma } from "./db";
import { QuizDifficulty } from "./types";

/** Easy and medium are open to anyone; hard unlocks once medium is completed. */
export async function getUnlockedDifficulties(userId: string, genre: string): Promise<QuizDifficulty[]> {
  const completed = await prisma.quizProgress.findMany({
    where: { userId, genre, difficulty: "medium" },
    select: { difficulty: true },
  });
  const unlocked: QuizDifficulty[] = ["easy", "medium"];
  if (completed.length > 0) unlocked.push("hard");
  return unlocked;
}
