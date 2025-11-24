/*
  Warnings:

  - Added the required column `deliveryType` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `paymentMethod` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "address" TEXT,
ADD COLUMN     "deliveryType" TEXT NOT NULL,
ADD COLUMN     "note" TEXT,
ADD COLUMN     "paymentInfo" JSONB,
ADD COLUMN     "paymentMethod" TEXT NOT NULL,
ADD COLUMN     "phone" TEXT NOT NULL,
ADD COLUMN     "table" INTEGER;
