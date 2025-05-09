/*
  Warnings:

  - You are about to drop the column `resume` on the `ClientProfile` table. All the data in the column will be lost.
  - The `salaryFrom` column on the `Vacancy` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `salaryTo` column on the `Vacancy` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "ClientProfile" DROP COLUMN "resume",
ADD COLUMN     "pdfUrl" TEXT;

-- AlterTable
ALTER TABLE "Vacancy" DROP COLUMN "salaryFrom",
ADD COLUMN     "salaryFrom" INTEGER,
DROP COLUMN "salaryTo",
ADD COLUMN     "salaryTo" INTEGER;
