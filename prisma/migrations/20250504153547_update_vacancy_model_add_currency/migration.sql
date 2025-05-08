/*
  Warnings:

  - You are about to drop the column `lan` on the `Vacancy` table. All the data in the column will be lost.
  - You are about to drop the column `lng` on the `Vacancy` table. All the data in the column will be lost.
  - You are about to drop the `Tag` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_TagToVacancy` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `currency_id` to the `Vacancy` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_TagToVacancy" DROP CONSTRAINT "_TagToVacancy_A_fkey";

-- DropForeignKey
ALTER TABLE "_TagToVacancy" DROP CONSTRAINT "_TagToVacancy_B_fkey";

-- AlterTable
ALTER TABLE "Vacancy" DROP COLUMN "lan",
DROP COLUMN "lng",
ADD COLUMN     "currency_id" TEXT NOT NULL,
ADD COLUMN     "published_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "tags" JSONB;

-- DropTable
DROP TABLE "Tag";

-- DropTable
DROP TABLE "_TagToVacancy";

-- CreateTable
CREATE TABLE "Currency" (
    "currency_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "char" TEXT NOT NULL,

    CONSTRAINT "Currency_pkey" PRIMARY KEY ("currency_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Currency_title_key" ON "Currency"("title");

-- CreateIndex
CREATE UNIQUE INDEX "Currency_char_key" ON "Currency"("char");

-- AddForeignKey
ALTER TABLE "Vacancy" ADD CONSTRAINT "Vacancy_currency_id_fkey" FOREIGN KEY ("currency_id") REFERENCES "Currency"("currency_id") ON DELETE RESTRICT ON UPDATE CASCADE;
