/*
  Warnings:

  - You are about to drop the column `vendorId` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `Vendor` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Vendor" DROP CONSTRAINT "Vendor_userId_fkey";

-- DropIndex
DROP INDEX "users_vendorId_key";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "vendorId",
ADD COLUMN     "businessAddress" TEXT,
ADD COLUMN     "businessName" TEXT,
ADD COLUMN     "phoneNumber" TEXT,
ALTER COLUMN "isActive" SET DEFAULT false;

-- DropTable
DROP TABLE "Vendor";
