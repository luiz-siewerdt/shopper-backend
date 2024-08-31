/*
  Warnings:

  - You are about to drop the column `measure_url_expiration` on the `Measure` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Measure" DROP COLUMN "measure_url_expiration";
