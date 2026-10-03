-- CreateTable
CREATE TABLE "SideObjectItem" (
    "id" TEXT NOT NULL,
    "pool" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "sub" TEXT NOT NULL DEFAULT '',
    "body" TEXT NOT NULL,
    "note" TEXT NOT NULL DEFAULT '',
    "url" TEXT,
    "linkLabel" TEXT,
    "category" TEXT NOT NULL DEFAULT '',
    "scheduledDate" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SideObjectItem_pkey" PRIMARY KEY ("id")
);
