/*
  Warnings:

  - A unique constraint covering the columns `[user_id]` on the table `CompanyProfile` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `user_id` to the `CompanyProfile` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CompanyProfile" ADD COLUMN     "user_id" TEXT NOT NULL,
ALTER COLUMN "imgUrl" DROP NOT NULL,
ALTER COLUMN "pdfUrl" DROP NOT NULL,
ALTER COLUMN "phone" DROP NOT NULL,
ALTER COLUMN "email" DROP NOT NULL,
ALTER COLUMN "website" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Vacancy" ALTER COLUMN "salaryFrom" DROP NOT NULL,
ALTER COLUMN "salaryTo" DROP NOT NULL,
ALTER COLUMN "lan" DROP NOT NULL,
ALTER COLUMN "lng" DROP NOT NULL,
ALTER COLUMN "imgUrl" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "CompanyProfile_user_id_key" ON "CompanyProfile"("user_id");

-- AddForeignKey
ALTER TABLE "CompanyProfile" ADD CONSTRAINT "CompanyProfile_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;
