# Resume Module — Specification

## Stack
- Next.js (App Router) + tRPC + Prisma + PostgreSQL + NextAuth
- Tailwind CSS, TypeScript
- AI: абстракция над LLM API (Claude / OpenAI — настраивается через env)
- PDF: react-pdf или puppeteer (серверный рендер)

---

## Business Rules

1. Авторизованный пользователь (CLIENT) может иметь **максимум 2 резюме** (status != archived)
2. Гость может создать резюме и скачать PDF, но **без сохранения в БД** — данные в localStorage
3. ИИ-генерация: гость — 1 запрос на секцию, авторизованный — 3 запроса на секцию
4. Редактирование создаёт **новую версию** (version+1, status=draft), не трогая опубликованную
5. Удаление — soft delete (status=archived), реальная запись остаётся в БД
6. После авторизации гостя — данные из localStorage мигрируют в БД автоматически
7. Анализ резюме пересчитывается при каждой публикации

---

## Database Schema (новые таблицы)

> Существующие таблицы: Users, ClientProfile, CompanyProfile, Vacancy, Application, Currency

```prisma
enum ResumeStatus {
  DRAFT
  PUBLISHED
  ARCHIVED
}

enum ResumeSectionType {
  BASIC        // ФИО, должность
  CONTACTS     // email, телефон, город, telegram, ссылки
  ABOUT        // текст "О себе"
  EXPERIENCE   // опыт работы (массив позиций)
  EDUCATION    // образование
  SKILLS       // навыки (hard + soft)
  PORTFOLIO    // ссылки на проекты
}

model Resume {
  resume_id          String        @id @default(uuid())
  client_profile_id  String
  client_profile     ClientProfile @relation(fields: [client_profile_id], references: [client_profile_id], onDelete: Cascade)
  title              String        // пользовательское название
  desired_position   String?
  status             ResumeStatus  @default(DRAFT)
  version            Int           @default(1)
  is_active          Boolean       @default(false)
  created_at         DateTime      @default(now())
  updated_at         DateTime      @updatedAt

  sections  ResumeSection[]
  analysis  ResumeAnalysis?
  ai_logs   AiGenerationLog[]

  @@index([client_profile_id])
  @@index([status])
}

model ResumeSection {
  section_id   String            @id @default(uuid())
  resume_id    String
  resume       Resume            @relation(fields: [resume_id], references: [resume_id], onDelete: Cascade)
  type         ResumeSectionType
  order_index  Int               @default(0)
  content      Json              // структура зависит от type (см. ниже)
  is_visible   Boolean           @default(true)
  updated_at   DateTime          @updatedAt

  @@unique([resume_id, type])
  @@index([resume_id])
}

model ResumeAnalysis {
  analysis_id        String   @id @default(uuid())
  resume_id          String   @unique
  resume             Resume   @relation(fields: [resume_id], references: [resume_id], onDelete: Cascade)
  score_total        Int      // 0-100
  score_completeness Int
  score_structure    Int
  score_keywords     Int
  score_skills       Int
  recommendations    Json     // string[]
  trending_skills    Json     // string[]
  analyzed_at        DateTime @default(now())
}

model AiGenerationLog {
  log_id        String            @id @default(uuid())
  resume_id     String?
  resume        Resume?           @relation(fields: [resume_id], references: [resume_id], onDelete: SetNull)
  user_id       String
  user          Users             @relation(fields: [user_id], references: [user_id], onDelete: Cascade)
  section_type  ResumeSectionType
  tokens_used   Int               @default(0)
  created_at    DateTime          @default(now())

  @@index([user_id])
  @@index([resume_id])
}
```

### ResumeSection.content — JSON структуры по типу

```ts
// BASIC
{ name: string; surname: string; desired_position: string; photo_url?: string }

// CONTACTS
{ email: string; phone?: string; city?: string; telegram?: string; linkedin?: string; github?: string }

// ABOUT
{ text: string }

// EXPERIENCE (массив)
{ items: Array<{ company: string; position: string; period_from: string; period_to?: string; is_current: boolean; description: string }> }

// EDUCATION
{ items: Array<{ institution: string; degree: string; field: string; year_from: number; year_to?: number }> }

// SKILLS
{ hard: string[]; soft: string[] }

// PORTFOLIO
{ items: Array<{ title: string; url: string; description?: string }> }
```

---

## API Routes (tRPC router: `resume`)

```
resume.getList          — GET  список резюме текущего пользователя
resume.getItem          — GET  одно резюме со всеми секциями
resume.create           — POST создать черновик (проверить лимит 2)
resume.updateSection    — PATCH обновить секцию (autosave)
resume.publish          — POST опубликовать (запускает анализ)
resume.archive          — POST мягкое удаление
resume.exportPdf        — POST генерация PDF → blob
resume.importFromPdf    — POST загрузка PDF → парсинг ИИ → создание черновика
resume.getAnalysis      — GET  последний анализ резюме

ai.generateSectionText  — POST генерация текста для секции (rate limit)
```

---

## Routes (Next.js App Router)

```
/resume                          — список резюме пользователя
/resume/builder/[id]             — конструктор (степпер)
/resume/builder/[id]?step=N      — конкретный шаг
/resume/import                   — загрузка PDF
/resume/[id]/analysis            — страница аналитики
```

---

## File Structure (новые файлы)

```
src/
  app/(main)/
    resume/
      page.tsx                        — список резюме
      import/page.tsx                 — импорт PDF
      [id]/
        analysis/page.tsx             — аналитика
      builder/
        [id]/page.tsx                 — конструктор (степпер)
        [id]/steps/                   — компоненты шагов
          StepBasic.tsx
          StepContacts.tsx
          StepAbout.tsx
          StepExperience.tsx
          StepEducation.tsx
          StepSkills.tsx
          StepPortfolio.tsx
          StepFinal.tsx

  server/api/routers/
    resume.ts                         — tRPC router
    ai.ts                             — AI генерация

  shared/
    api/schema/resume.ts              — zod схемы
    lib/
      resumePdf.ts                    — генерация PDF
      resumeParser.ts                 — парсинг PDF через AI
      resumeAnalyzer.ts               — анализ резюме через AI

  components/
    resume/
      ResumeCard.tsx
      ResumeBuilder.tsx
      ResumeStepper.tsx
      ResumePreview.tsx
      AiSuggestionPanel.tsx
      AnalysisScore.tsx
```
