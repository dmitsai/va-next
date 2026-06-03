/*
  Warnings:

  - You are about to drop the column `employment` on the `ClientProfile` table. All the data in the column will be lost.
  - You are about to drop the column `salary` on the `ClientProfile` table. All the data in the column will be lost.
  - You are about to drop the column `schedule` on the `ClientProfile` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ClientProfile" DROP COLUMN "employment",
DROP COLUMN "salary",
DROP COLUMN "schedule",
ADD COLUMN     "preferences" JSONB;
