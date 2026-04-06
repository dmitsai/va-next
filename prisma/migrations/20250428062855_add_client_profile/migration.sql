-- CreateTable
CREATE TABLE "ClientProfile" (
    "client_profile_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "surname" TEXT,
    "patronymic" TEXT,
    "telegram" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "about_me" TEXT,
    "schedule" TEXT NOT NULL,
    "employment" TEXT,
    "salary" TEXT,
    "resume" TEXT,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "ClientProfile_pkey" PRIMARY KEY ("client_profile_id")
);

-- CreateTable
CREATE TABLE "_FavoriteVacancies" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_FavoriteVacancies_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "ClientProfile_telegram_key" ON "ClientProfile"("telegram");

-- CreateIndex
CREATE UNIQUE INDEX "ClientProfile_phone_key" ON "ClientProfile"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "ClientProfile_email_key" ON "ClientProfile"("email");

-- CreateIndex
CREATE UNIQUE INDEX "ClientProfile_user_id_key" ON "ClientProfile"("user_id");

-- CreateIndex
CREATE INDEX "_FavoriteVacancies_B_index" ON "_FavoriteVacancies"("B");

-- AddForeignKey
ALTER TABLE "ClientProfile" ADD CONSTRAINT "ClientProfile_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FavoriteVacancies" ADD CONSTRAINT "_FavoriteVacancies_A_fkey" FOREIGN KEY ("A") REFERENCES "ClientProfile"("client_profile_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FavoriteVacancies" ADD CONSTRAINT "_FavoriteVacancies_B_fkey" FOREIGN KEY ("B") REFERENCES "Vacancy"("vacancy_id") ON DELETE CASCADE ON UPDATE CASCADE;
