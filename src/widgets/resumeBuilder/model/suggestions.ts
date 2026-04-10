/**
 * Подсказки боковой панели конструктора резюме.
 * Сверяйся с полями формы: `ResumeFormState` в `model/types.ts`.
 *
 * Редактируй `items` внутри `pool` для шагов с `pickMin` / `pickMax`
 * (случайно показывается от pickMin до pickMax карточек).
 *
 * Формат текста:
 * - `**фрагмент**` — выделяется жирным;
 * - `{{name}}`, `{{position}}`, `{{count}}` — подстановка в `TipText` / `interpolateTemplate`.
 */

export type SidebarTip = {
    id: string;
    icon: string;
    text: string;
};

export type SidebarTipPool = {
    pickMin: number;
    pickMax: number;
    items: readonly SidebarTip[];
};

export function shuffleArray<T>(items: readonly T[]): T[] {
    const a = [...items];
    for (let i = a.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        const tmp = a[i]!;
        a[i] = a[j]!;
        a[j] = tmp;
    }
    return a;
}

export function randomInt(min: number, max: number): number {
    return min + Math.floor(Math.random() * (max - min + 1));
}

export function pickRandomTips(pool: SidebarTipPool): SidebarTip[] {
    const { pickMin, pickMax, items } = pool;
    if (items.length === 0) return [];
    const want = randomInt(pickMin, pickMax);
    const n = Math.min(want, items.length);
    return shuffleArray(items).slice(0, n);
}

export function interpolateTemplate(
    template: string,
    vars: Record<string, string | number>
): string {
    return template.replace(/\{\{(\w+)\}\}/g, (_, key: string) => {
        const v = vars[key];
        return v !== undefined ? String(v) : `{{${key}}}`;
    });
}

export const sidebarSuggestions = {
    basic: {
        greeting: {
            withName:
                'Привет, {{name}}! Заполни оставшиеся данные — это займёт около 5 минут.',
            default:
                'Привет! Давай составим резюме, которое выделит тебя среди сотен кандидатов.',
        },
        tips: {
            photoMissing: {
                id: 'basic-photo-missing',
                icon: '📸',
                text: 'С фото анкета выглядит завершённее — добавь ссылку на фото выше, если есть подходящее изображение.',
            },
            photoPresent: {
                id: 'basic-photo-ok',
                icon: '✅',
                text: 'Отлично, фото добавлено! Это повышает шансы на отклик.',
            },
            vacancySearch: {
                id: 'basic-vacancy-count',
                icon: '🔍',
                text: 'По запросу **«{{position}}»** найдено **{{count}}** актуальных вакансий на платформе.',
            },
            desiredPosition: {
                id: 'basic-desired-position',
                icon: '💡',
                text: 'Указывай должность максимально конкретно: «Frontend-разработчик (React)» лучше, чем просто «Разработчик» — по ней же считается подбор вакансий на платформе.',
            },
        },
    },

    contacts: {
        card: {
            hint: 'Используй кнопку **«Из профиля»** — контакты подтянутся автоматически.',
            fillFromProfileButton: 'Заполнить из профиля',
        },
        pool: {
            pickMin: 3,
            pickMax: 5,
            items: [
                {
                    id: 'contacts-email',
                    icon: '📧',
                    text: 'Email — главный канал связи с рекрутером. Убедись, что адрес рабочий и проверяется регулярно.',
                },
                {
                    id: 'contacts-telegram',
                    icon: '💬',
                    text: 'Telegram-контакт увеличивает скорость ответа: многие рекрутеры пишут именно туда.',
                },
                {
                    id: 'contacts-city',
                    icon: '🌍',
                    text: 'Укажи город — у вакансий на платформе есть локация, так проще найти совпадения по месту работы.',
                },
                {
                    id: 'contacts-username',
                    icon: '🧼',
                    text: 'Ник в Telegram/почте вида "killer228" — быстрый способ не получить ответ. Используй нейтральный и профессиональный.',
                },
                {
                    id: 'contacts-phone',
                    icon: '📱',
                    text: 'Телефон лучше в международном формате (**+7…**) — так его проще скопировать и набрать без ошибок.',
                },
                {
                    id: 'contacts-extra',
                    icon: '🔗',
                    text: 'Ниже есть поля **LinkedIn** и **GitHub** — заполни хотя бы одно: рекрутеру проще понять твой бэкграунд.',
                },
            ],
        } satisfies SidebarTipPool,
    },

    about: {
        tooShort: {
            id: 'about-too-short',
            icon: '⚠️',
            text: 'Слишком коротко — добавь больше деталей о своём опыте и целях.',
        },
        tooLong: {
            id: 'about-too-long',
            icon: '✂️',
            text: 'Текст великоват — попробуй сократить до 3–4 ключевых мыслей.',
        },
        pool: {
            pickMin: 3,
            pickMax: 5,
            items: [
                {
                    id: 'about-first-person',
                    icon: '✍️',
                    text: 'Пиши от первого лица и конкретно: что умеешь, чем занимался, чего хочешь.',
                },
                {
                    id: 'about-length',
                    icon: '📏',
                    text: 'Оптимальный объём — 3–5 предложений (150–300 символов). Кратко и ёмко.',
                },
                {
                    id: 'about-keywords',
                    icon: '🎯',
                    text: 'Упомяни ключевые технологии из желаемой должности — это поднимает релевантность.',
                },
                {
                    id: 'about-specialization',
                    icon: '🚀',
                    text: 'Расскажи о своей специализации: «5 лет в fintech, специализируюсь на высоконагруженных системах».',
                },
                {
                    id: 'about-cliches',
                    icon: '💼',
                    text: 'Избегай шаблонов типа «ответственный, коммуникабельный» — они не несут ценности.',
                },
                {
                    id: 'about-value',
                    icon: '💰',
                    text: 'Ответь на вопрос: какую пользу ты приносишь бизнесу? Не "что делал", а "что изменилось благодаря тебе".',
                },
                {
                    id: 'about-role-focus',
                    icon: '🎯',
                    text: 'Подстраивай блок "О себе" под конкретную вакансию — универсальные тексты работают хуже.',
                },
            ],
        } satisfies SidebarTipPool,
    },

    experience: {
        totalExperienceTitle: 'Суммарный опыт',
        pool: {
            pickMin: 3,
            pickMax: 5,
            items: [
                {
                    id: 'exp-metrics',
                    icon: '📝',
                    text: 'Описывай достижения через цифры: «Ускорил загрузку страницы на 40%» сильнее, чем «Оптимизировал производительность».',
                },
                {
                    id: 'exp-bullets',
                    icon: '🔢',
                    text: 'Добавь 3–5 конкретных достижений на каждое место работы — рекрутеры это ценят.',
                },
                {
                    id: 'exp-position',
                    icon: '🎯',
                    text: 'Подчёркивай навыки, релевантные для позиции **«{{position}}»**.',
                },
                {
                    id: 'exp-action-verbs',
                    icon: '⚡',
                    text: 'Начинай пункты с действий: «Разработал», «Оптимизировал», «Внедрил» — это делает текст живым и уверенным.',
                },
                {
                    id: 'exp-stack',
                    icon: '🛠',
                    text: 'Указывай стек для каждой позиции — это экономит время рекрутера и повышает шансы на отклик.',
                },
                {
                    id: 'exp-relevance',
                    icon: '🧹',
                    text: 'Старый или нерелевантный опыт можно сокращать — лучше меньше, но по делу.',
                },
                {
                    id: 'exp-growth',
                    icon: '📈',
                    text: 'Покажи рост: повышение, расширение зоны ответственности или усложнение задач.',
                },
            ],
        } satisfies SidebarTipPool,
    },

    education: {
        pool: {
            pickMin: 3,
            pickMax: 5,
            items: [
                {
                    id: 'edu-trust',
                    icon: '🎓',
                    text: 'Профильное образование по специальности усиливает первое впечатление от резюме, если оно связано с целевой ролью.',
                },
                {
                    id: 'edu-online',
                    icon: '📚',
                    text: 'Онлайн-курсы (Coursera, Яндекс Практикум) тоже считаются — добавляй их отдельной записью.',
                },
                {
                    id: 'edu-projects',
                    icon: '🏅',
                    text: 'Укажи дипломные проекты, если они релевантны — это отличный способ показать практические навыки.',
                },
                {
                    id: 'edu-grade',
                    icon: '⭐',
                    text: 'Красный диплом или высокий средний балл можно кратко указать в **степени** или **специальности**, если это уместно для роли.',
                },
                {
                    id: 'edu-order',
                    icon: '💡',
                    text: 'Указывай образование в обратном порядке — самое свежее сверху.',
                },
                {
                    id: 'edu-relevance',
                    icon: '🎯',
                    text: 'Если образование не связано с профессией — смести фокус на курсы и практический опыт.',
                },
            ],
        } satisfies SidebarTipPool,
    },

    skills: {
        forPositionTitle: 'Навыки для «{{position}}»',
        tapToAdd: 'Нажми на навык, чтобы добавить',
        allPopularAdded: 'Все популярные навыки уже добавлены!',
        pool: {
            pickMin: 3,
            pickMax: 5,
            items: [
                {
                    id: 'skills-relevance',
                    icon: '🎯',
                    text: 'Добавляй навыки, которые встречаются в описаниях желаемых вакансий — это поднимает релевантность резюме.',
                },
                {
                    id: 'skills-count',
                    icon: '📊',
                    text: 'В форме можно до **25** навыков; на практике удобнее **8–15** самых сильных — длинный список сложнее воспринимать.',
                },
                {
                    id: 'skills-specific',
                    icon: '💡',
                    text: 'Указывай конкретные технологии и версии: «React 18», «PostgreSQL 15», а не просто «базы данных».',
                },
                {
                    id: 'skills-order',
                    icon: '↔️',
                    text: 'Меняй порядок чипов **перетаскиванием** — слева размести то, что важнее всего для желаемой роли.',
                },
                {
                    id: 'skills-suggest',
                    icon: '🔎',
                    text: 'Начни вводить навык — покажутся подсказки из каталога платформы; так проще попасть в популярные формулировки.',
                },
                {
                    id: 'skills-honesty',
                    icon: '⚠️',
                    text: 'Не добавляй навыки «на всякий случай» — по каждому из них могут уточнить на собеседовании.',
                },
            ],
        } satisfies SidebarTipPool,
    },

    portfolio: {
        pool: {
            pickMin: 3,
            pickMax: 5,
            items: [
                {
                    id: 'portfolio-github',
                    icon: '🔗',
                    text: 'Ссылку на **GitHub** можно дублировать в контактах и вынести ключевые репозитории сюда с описанием — так удобнее смотреть с резюме.',
                },
                {
                    id: 'portfolio-desc',
                    icon: '📖',
                    text: 'Напиши краткое описание к каждому проекту: стек, задача, результат.',
                },
                {
                    id: 'portfolio-quality',
                    icon: '🌟',
                    text: 'Выбирай 2–4 лучших проекта, а не всё подряд — качество важнее количества.',
                },
                {
                    id: 'portfolio-metrics',
                    icon: '🚀',
                    text: 'Проекты с реальными пользователями или бизнес-метриками особенно ценятся.',
                },
                {
                    id: 'portfolio-links',
                    icon: '💼',
                    text: 'Портфолио — твоя витрина. Убедись, что все ссылки рабочие и проекты открываются.',
                },
                {
                    id: 'portfolio-live',
                    icon: '🌐',
                    text: 'Если есть возможность — добавь live-демо. Работает лучше, чем просто код.',
                },
                {
                    id: 'portfolio-readme',
                    icon: '🧾',
                    text: 'Хороший README в GitHub — это половина успеха. Объясни, что это и зачем вообще существует.',
                },
            ],
        } satisfies SidebarTipPool,
    },
} as const;
