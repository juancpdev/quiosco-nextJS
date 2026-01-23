/*
  Warnings:

  - Made the column `productImage` on table `OrderProducts` required. This step will fail if there are existing NULL values in that column.
  - Made the column `productName` on table `OrderProducts` required. This step will fail if there are existing NULL values in that column.
  - Made the column `productPrice` on table `OrderProducts` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "OrderProducts" ALTER COLUMN "productImage" SET NOT NULL,
ALTER COLUMN "productName" SET NOT NULL,
ALTER COLUMN "productPrice" SET NOT NULL;
