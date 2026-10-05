-- CreateTable
CREATE TABLE "SideObjectMeta" (
    "pool" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "SideObjectMeta_pkey" PRIMARY KEY ("pool")
);
