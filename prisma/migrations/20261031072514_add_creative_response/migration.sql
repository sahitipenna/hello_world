-- CreateTable
CREATE TABLE "CreativeResponse" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "dateISO" TEXT NOT NULL,
    "promptText" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "isKeyMemory" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CreativeResponse_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CreativeResponse_userId_dateISO_key" ON "CreativeResponse"("userId", "dateISO");

-- AddForeignKey
ALTER TABLE "CreativeResponse" ADD CONSTRAINT "CreativeResponse_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
