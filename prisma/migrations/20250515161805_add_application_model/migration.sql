-- CreateTable
CREATE TABLE "Application" (
    "application_id" TEXT NOT NULL,
    "vacancy_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Application_pkey" PRIMARY KEY ("application_id")
);

-- CreateIndex
CREATE INDEX "Application_vacancy_id_idx" ON "Application"("vacancy_id");

-- CreateIndex
CREATE INDEX "Application_user_id_idx" ON "Application"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "Application_vacancy_id_user_id_key" ON "Application"("vacancy_id", "user_id");

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_vacancy_id_fkey" FOREIGN KEY ("vacancy_id") REFERENCES "Vacancy"("vacancy_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;
