-- CreateTable
CREATE TABLE "WordOfDay" (
    "id" TEXT NOT NULL,
    "word" TEXT NOT NULL,
    "pronunciation" TEXT NOT NULL DEFAULT '',
    "partOfSpeech" TEXT NOT NULL DEFAULT '',
    "definition" TEXT NOT NULL,
    "example" TEXT NOT NULL DEFAULT '',
    "category" TEXT NOT NULL DEFAULT 'literature',
    "scheduledDate" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WordOfDay_pkey" PRIMARY KEY ("id")
);
