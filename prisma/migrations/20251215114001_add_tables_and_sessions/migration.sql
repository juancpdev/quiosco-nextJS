-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "sessionId" TEXT,
ADD COLUMN     "tableId" INTEGER,
ALTER COLUMN "status" SET DEFAULT 'pending',
ALTER COLUMN "status" SET DATA TYPE TEXT;

-- CreateTable
CREATE TABLE "Table" (
    "id" SERIAL NOT NULL,
    "number" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'available',
    "sessionId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Table_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Table_number_key" ON "Table"("number");

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_tableId_fkey" FOREIGN KEY ("tableId") REFERENCES "Table"("id") ON DELETE SET NULL ON UPDATE CASCADE;
