import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';

/**
 * Хардкодный список должностей на сервере.
 * В будущем можно заменить на запрос к БД или внешнему API.
 */
export const POSITIONS_LIST = [
    // IT — разработка
    'Frontend-разработчик',
    'Frontend-разработчик (React)',
    'Frontend-разработчик (Vue)',
    'Frontend-разработчик (Angular)',
    'Backend-разработчик',
    'Backend-разработчик (Node.js)',
    'Backend-разработчик (Python)',
    'Backend-разработчик (Java)',
    'Backend-разработчик (Go)',
    'Backend-разработчик (PHP)',
    'Fullstack-разработчик',
    'Fullstack-разработчик (React + Node.js)',
    'Fullstack-разработчик (Next.js)',
    'Mobile-разработчик (iOS)',
    'Mobile-разработчик (Android)',
    'Mobile-разработчик (React Native)',
    'Mobile-разработчик (Flutter)',
    'iOS-разработчик (Swift)',
    'Android-разработчик (Kotlin)',
    'Python-разработчик',
    'Java-разработчик',
    'C#-разработчик (.NET)',
    'C++-разработчик',
    'Go-разработчик',
    'Rust-разработчик',
    'Ruby on Rails разработчик',
    'PHP-разработчик (Laravel)',
    'Разработчик игр (Unity)',
    'Разработчик игр (Unreal Engine)',
    'Blockchain-разработчик',
    'Smart contract разработчик',
    // IT — инфраструктура и DevOps
    'DevOps-инженер',
    'Site Reliability Engineer (SRE)',
    'Platform Engineer',
    'Cloud Engineer',
    'AWS-инженер',
    'Системный администратор',
    'Сетевой инженер',
    'Инженер по безопасности',
    'Специалист по информационной безопасности',
    'Penetration Tester',
    // IT — данные и ML
    'Data Engineer',
    'Data Scientist',
    'ML Engineer',
    'MLOps Engineer',
    'Аналитик данных',
    'BI-аналитик',
    'Data Analyst',
    'NLP-инженер',
    'Computer Vision Engineer',
    // IT — управление и аналитика
    'Системный аналитик',
    'Бизнес-аналитик',
    'Продуктовый аналитик',
    'Технический аналитик',
    'Архитектор решений',
    'Технический архитектор',
    'Enterprise Architect',
    // IT — QA
    'QA-инженер',
    'QA Automation Engineer',
    'Тестировщик',
    'SDET',
    // IT — управление продуктом
    'Product Manager',
    'Product Owner',
    'Technical Product Manager',
    'Growth Manager',
    // IT — дизайн
    'UX/UI Дизайнер',
    'Product Designer',
    'UI Designer',
    'UX Researcher',
    'Graphic Designer',
    'Motion Designer',
    'Web Designer',
    // IT — управление командой
    'Tech Lead',
    'Engineering Manager',
    'CTO',
    'Scrum Master',
    'Agile Coach',
    'IT Project Manager',
    // Маркетинг и продажи
    'Маркетолог',
    'Digital-маркетолог',
    'SMM-специалист',
    'SEO-специалист',
    'Performance-маркетолог',
    'Таргетолог',
    'Контент-менеджер',
    'Копирайтер',
    'PR-менеджер',
    'Менеджер по продажам',
    'Руководитель отдела продаж',
    'Key Account Manager',
    'Brand Manager',
    'Менеджер по рекламе',
    // Финансы и право
    'Финансовый аналитик',
    'Финансовый менеджер',
    'Бухгалтер',
    'Главный бухгалтер',
    'Аудитор',
    'Экономист',
    'Юрист',
    'Корпоративный юрист',
    // HR
    'HR-менеджер',
    'IT-рекрутер',
    'Рекрутер',
    'HR Business Partner',
    'Talent Acquisition Specialist',
    // Менеджмент
    'Проджект-менеджер',
    'Операционный менеджер',
    'Генеральный директор',
    'Директор по развитию',
    'Руководитель проекта',
    // Прочее
    'Customer Success Manager',
    'Technical Support Engineer',
    'Технический писатель',
    'Аналитик',
    'Консультант',
] as const;

export const positionsRouter = createTRPCRouter({
    search: publicProcedure
        .input(z.object({ query: z.string(), limit: z.number().default(8) }))
        .query(({ input }) => {
            if (input.query.length < 2) return [];
            const q = input.query.toLowerCase();
            return POSITIONS_LIST.filter((p) =>
                p.toLowerCase().includes(q)
            ).slice(0, input.limit);
        }),
});
