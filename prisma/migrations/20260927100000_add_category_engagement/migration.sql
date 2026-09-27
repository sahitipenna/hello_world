-- CreateTable
CREATE TABLE "CategoryEngagement" (
    "userId" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "score" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "CategoryEngagement_pkey" PRIMARY KEY ("userId","category")
);

-- AddForeignKey
ALTER TABLE "CategoryEngagement" ADD CONSTRAINT "CategoryEngagement_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

