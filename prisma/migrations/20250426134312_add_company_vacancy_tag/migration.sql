-- CreateTable
CREATE TABLE "Tag" (
    "tag_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "localTitle" TEXT NOT NULL,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("tag_id")
);

-- CreateTable
CREATE TABLE "Vacancy" (
    "vacancy_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "company_id" TEXT NOT NULL,
    "salaryFrom" TEXT NOT NULL,
    "salaryTo" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "lan" TEXT NOT NULL,
    "lng" TEXT NOT NULL,
    "imgUrl" TEXT NOT NULL,

    CONSTRAINT "Vacancy_pkey" PRIMARY KEY ("vacancy_id")
);

-- CreateTable
CREATE TABLE "CompanyProfile" (
    "company_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "imgUrl" TEXT NOT NULL,
    "pdfUrl" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "website" TEXT NOT NULL,

    CONSTRAINT "CompanyProfile_pkey" PRIMARY KEY ("company_id")
);

-- CreateTable
CREATE TABLE "_TagToVacancy" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_TagToVacancy_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "CompanyProfile_title_key" ON "CompanyProfile"("title");

-- CreateIndex
CREATE UNIQUE INDEX "CompanyProfile_phone_key" ON "CompanyProfile"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "CompanyProfile_email_key" ON "CompanyProfile"("email");

-- CreateIndex
CREATE UNIQUE INDEX "CompanyProfile_website_key" ON "CompanyProfile"("website");

-- CreateIndex
CREATE INDEX "_TagToVacancy_B_index" ON "_TagToVacancy"("B");

-- AddForeignKey
ALTER TABLE "Vacancy" ADD CONSTRAINT "Vacancy_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "CompanyProfile"("company_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TagToVacancy" ADD CONSTRAINT "_TagToVacancy_A_fkey" FOREIGN KEY ("A") REFERENCES "Tag"("tag_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TagToVacancy" ADD CONSTRAINT "_TagToVacancy_B_fkey" FOREIGN KEY ("B") REFERENCES "Vacancy"("vacancy_id") ON DELETE CASCADE ON UPDATE CASCADE;
