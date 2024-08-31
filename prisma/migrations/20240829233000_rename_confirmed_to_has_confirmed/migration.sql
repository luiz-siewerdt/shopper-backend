/*
  Warnings:

  - You are about to drop the column `confirmed` on the `Measure` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `Measure` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Measure" DROP COLUMN "confirmed",
DROP COLUMN "updated_at",
ADD COLUMN     "has_confirmed" BOOLEAN NOT NULL DEFAULT false;
