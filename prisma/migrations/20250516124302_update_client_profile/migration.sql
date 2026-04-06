/*
  Warnings:

  - Added the required column `currency_id` to the `ClientProfile` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ClientProfile" ADD COLUMN     "currency_id" TEXT NOT NULL,
ADD COLUMN     "salaryFrom" INTEGER;

-- AddForeignKey
ALTER TABLE "ClientProfile" ADD CONSTRAINT "ClientProfile_currency_id_fkey" FOREIGN KEY ("currency_id") REFERENCES "Currency"("currency_id") ON DELETE RESTRICT ON UPDATE CASCADE;
