-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "plan" TEXT NOT NULL DEFAULT 'free',
    "sectionOrder" TEXT,
    "hiddenSections" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InterestTag" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "emoji" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "InterestTag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserInterest" (
    "userId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,
    "weight" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "UserInterest_pkey" PRIMARY KEY ("userId","tagId")
);

-- CreateTable
CREATE TABLE "DailyTodoCheck" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "dateISO" TEXT NOT NULL,
    "index" INTEGER NOT NULL,
    "done" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "DailyTodoCheck_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PromptEdit" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "dateISO" TEXT NOT NULL,
    "index" INTEGER NOT NULL,
    "text" TEXT NOT NULL,

    CONSTRAINT "PromptEdit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SectionEdit" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "dateISO" TEXT NOT NULL,
    "sectionId" TEXT NOT NULL,
    "field" TEXT NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "SectionEdit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TodoListItem" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "done" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TodoListItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuizQuestion" (
    "id" TEXT NOT NULL,
    "index" INTEGER NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "category" TEXT NOT NULL DEFAULT 'science',

    CONSTRAINT "QuizQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuizEdit" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "questionIndex" INTEGER NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,

    CONSTRAINT "QuizEdit_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "InterestTag_slug_key" ON "InterestTag"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "DailyTodoCheck_userId_dateISO_index_key" ON "DailyTodoCheck"("userId", "dateISO", "index");

-- CreateIndex
CREATE UNIQUE INDEX "PromptEdit_userId_dateISO_index_key" ON "PromptEdit"("userId", "dateISO", "index");

-- CreateIndex
CREATE UNIQUE INDEX "SectionEdit_userId_dateISO_sectionId_field_key" ON "SectionEdit"("userId", "dateISO", "sectionId", "field");

-- CreateIndex
CREATE UNIQUE INDEX "QuizQuestion_index_key" ON "QuizQuestion"("index");

-- CreateIndex
CREATE UNIQUE INDEX "QuizEdit_userId_questionIndex_key" ON "QuizEdit"("userId", "questionIndex");

-- AddForeignKey
ALTER TABLE "UserInterest" ADD CONSTRAINT "UserInterest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserInterest" ADD CONSTRAINT "UserInterest_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "InterestTag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DailyTodoCheck" ADD CONSTRAINT "DailyTodoCheck_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PromptEdit" ADD CONSTRAINT "PromptEdit_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SectionEdit" ADD CONSTRAINT "SectionEdit_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TodoListItem" ADD CONSTRAINT "TodoListItem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuizEdit" ADD CONSTRAINT "QuizEdit_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
