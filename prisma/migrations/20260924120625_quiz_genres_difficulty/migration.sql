-- DropIndex
DROP INDEX "QuizEdit_userId_questionIndex_key";

-- DropIndex
DROP INDEX "QuizQuestion_index_key";

-- AlterTable
ALTER TABLE "QuizEdit" ADD COLUMN     "difficulty" TEXT NOT NULL,
ADD COLUMN     "genre" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "QuizQuestion" DROP COLUMN "category",
ADD COLUMN     "difficulty" TEXT NOT NULL DEFAULT 'easy',
ADD COLUMN     "genre" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "QuizGenre" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "emoji" TEXT NOT NULL DEFAULT '',
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "QuizGenre_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuizProgress" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "genre" TEXT NOT NULL,
    "difficulty" TEXT NOT NULL,
    "completedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "QuizProgress_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "QuizGenre_slug_key" ON "QuizGenre"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "QuizProgress_userId_genre_difficulty_key" ON "QuizProgress"("userId", "genre", "difficulty");

-- CreateIndex
CREATE UNIQUE INDEX "QuizEdit_userId_genre_difficulty_questionIndex_key" ON "QuizEdit"("userId", "genre", "difficulty", "questionIndex");

-- CreateIndex
CREATE UNIQUE INDEX "QuizQuestion_genre_difficulty_index_key" ON "QuizQuestion"("genre", "difficulty", "index");

-- AddForeignKey
ALTER TABLE "QuizProgress" ADD CONSTRAINT "QuizProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

