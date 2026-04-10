# Инструкция — Как работать с этой спекой в VS Code

## Файлы

| Файл | Что содержит | Когда подключать |
|------|-------------|-----------------|
| `SPEC.md` | Стек, бизнес-правила, схема БД, API, файловая структура | Всегда — в начале каждой сессии |
| `USE_CASES.md` | 8 use cases с деталями сценариев | При работе над логикой и валидацией |
| `SCREENS.md` | Описание всех экранов и компонентов | При работе над UI |

---

## Стратегия по токенам

**Не скармливай все 3 файла сразу** — это съест контекст без пользы.

Правило: **1 задача = SPEC.md + 1 доп. файл**

- Пишешь схему БД и роутер → `SPEC.md`
- Пишешь страницу /resume → `SPEC.md` + `SCREENS.md`
- Пишешь логику автосохранения → `SPEC.md` + `USE_CASES.md`
- Пишешь AiSuggestionPanel → `SPEC.md` + `SCREENS.md` + `USE_CASES.md` (UC-07)

---

## Порядок разработки (рекомендуемый)

### Этап 1 — База (только SPEC.md)
```
1. Добавить новые модели в prisma/schema.prisma
2. Запустить миграцию
3. Создать src/server/api/routers/resume.ts
4. Добавить resumeRouter в src/server/api/root.ts
5. Создать zod-схемы в src/shared/api/schema/resume.ts
```

### Этап 2 — AI сервис (SPEC.md + USE_CASES.md UC-07, UC-08)
```
6. Создать src/shared/lib/aiService.ts — абстракция над AI API
7. Создать src/shared/lib/resumeAnalyzer.ts
8. Добавить rate limiting для гостей (через IP) и авторизованных (через userId)
9. Создать src/server/api/routers/ai.ts
```

### Этап 3 — Страница списка (SPEC.md + SCREENS.md Screen 1)
```
10. src/app/(main)/resume/page.tsx
11. src/components/resume/ResumeCard.tsx
```

### Этап 4 — Конструктор (SPEC.md + SCREENS.md Screen 2 + USE_CASES.md UC-01)
```
12. src/app/(main)/resume/builder/[id]/page.tsx
13. src/components/resume/ResumeBuilder.tsx
14. src/components/resume/ResumeStepper.tsx
15. src/components/resume/ResumePreview.tsx
16. src/components/resume/AiSuggestionPanel.tsx
17. Компоненты шагов: StepBasic, StepContacts, StepAbout, StepExperience, StepEducation, StepSkills, StepPortfolio, StepFinal
```

### Этап 5 — Импорт PDF (SPEC.md + SCREENS.md Screen 3 + USE_CASES.md UC-02)
```
18. src/app/(main)/resume/import/page.tsx
19. src/shared/lib/resumeParser.ts
```

### Этап 6 — Аналитика (SPEC.md + SCREENS.md Screen 4 + USE_CASES.md UC-08)
```
20. src/app/(main)/resume/[id]/analysis/page.tsx
21. src/components/resume/AnalysisScore.tsx
```

### Этап 7 — PDF генерация (SPEC.md + USE_CASES.md UC-05)
```
22. src/shared/lib/resumePdf.ts
23. src/app/api/resume/[id]/export/route.ts
```

### Этап 8 — Гостевой режим (SPEC.md + USE_CASES.md UC-03)
```
24. Логика localStorage в ResumeBuilder
25. Миграция данных после авторизации
```

---

## Промпты для старта каждого этапа

### Этап 1 (схема БД):
```
Прочитай SPEC.md. Добавь новые модели Resume, ResumeSection, ResumeAnalysis, AiGenerationLog
в prisma/schema.prisma. Также нужно добавить в модель ClientProfile relation к Resume.
После — создай резюме роутер с процедурами: getList, getItem, create, updateSection, publish, archive.
Используй тот же паттерн что в src/server/api/routers/vacancy.ts.
```

### Этап 3 (страница списка):
```
Прочитай SPEC.md и SCREENS.md (Screen 1).
Создай страницу /resume. Стиль — как существующие страницы проекта (тёмная тема, те же компоненты).
Реализуй лимит 2 резюме с соответствующим UI.
```

### Этап 4 (конструктор):
```
Прочитай SPEC.md, SCREENS.md (Screen 2) и USE_CASES.md (UC-01, UC-04).
Создай пошаговый конструктор резюме. Layout: 3 колонки (степпер / форма / предпросмотр).
Автосохранение через tRPC mutation updateSection с debounce 2000ms.
```

---

## Важные детали для Claude в IDE

- Все новые компоненты используют **существующий стиль проекта** — смотри src/components/ как референс
- tRPC вызовы — как в существующих страницах (useQuery, useMutation)
- Авторизация проверяется через `getServerSession` или `ctx.session` в процедурах
- Роль пользователя: `CLIENT` для соискателей, `COMPANY` для работодателей — резюме только для CLIENT
- Env переменная для AI: `AI_API_KEY`, `AI_PROVIDER` (claude | openai)
- PDF генерация — серверная (API route), не клиентская
