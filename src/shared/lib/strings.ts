import { number } from 'zod';

export const CONSTANTS = {
    topBar: {
        placeholder: 'vakansiy.net',
        vacancies: 'Вакансии',
        internships: 'Стажировки',
        events: 'События',
        theme: {
            light: 'Светлая',
            dark: 'Темная',
            system: 'Системная',
        },
    },
    auth: {
        lable: {
            signUp: 'Создать учётную запись',
            logIn: 'Войти в учётную запись',
            code: 'Введите код отправленный на вашу почту',
        },
        signUp: 'Регистрация',
        logIn: 'Вход',
        description:
            'Вы можете создать или войти в свою учетную запись  и узнавать о новых вакансиях первыми',
        enterEmail: 'Введите свой адрес электронной почты ',
        enterPassword: 'Введите свой пароль',
        code: 'Отправить код еще раз',
        resume: 'Введите своё имя и фамилию',
        continue: 'или войти как',
        company: 'Компания',
        user: 'Соискатель',
    },
    home: {
        vacancies: {
            placeholder: {
                unauthecated: 'Свежие вакансии',
                authecated: 'Вакансии для вашего резюме:',
            },
            viewAll: 'Посмотреть все вакансии',
        },
    },
    errors: {
        validation: {
            email: {
                invalid: 'Неверный формат почты',
            },
            password: {
                min: 'Пароль должен быть не менее 8 символов.',
                lower: 'Пароль должен содержать хотя бы одну строчную букву',
                upper: 'Пароль должен содержать хотя бы одну прописную букву',
                number: 'Пароль должен содержать хотя бы одну цифру',
                specialCharacter:
                    'Пароль должен содержать хотя бы один спецсимвол',
            },
            phone: {
                invalid: 'Неверный формат телефона',
            },
            salary: {
                number: 'Уровень дохода должен быть числом',
            },
            vacancy: {
                title: 'Название обязательно',
                description: {
                    required: 'Описание обязательно',
                    min: 'Слишком короткое описание',
                },
            },
        },
    },
    card: {
        apply: 'Откликтнуться',
        currencyChar: '₽',
        learnMore: 'Подробнее',
    },
    months: [
        'Января',
        'Февраля',
        'Марта',
        'Апреля',
        'Мая',
        'Июня',
        'Июля',
        'Августа',
        'Сентября',
        'Октября',
        'Ноября',
        'Декабря',
    ],
    detailedVacancy: {
        salary: {
            from: 'от',
            to: 'до',
            empty: 'По договоренности',
        },
        apply: {
            add: 'Откликтнуться',
            exist: 'Вы уже откликнулись',
        },
        favorite: {
            add: 'Добавить в избранные',
            remove: 'В избранных',
        },
    },
    currency: {
        euro: '€',
        ruble: '₽',
        dollar: '$',
    },
    showButton: {
        more: 'Показать больше',
        less: 'Показать меньше',
    },
    vacancy: {
        label: {
            create: 'Создание вакансии',
            edit: 'Редактирование вакансии:',
        },
        blocks: {
            main: 'Основная информация',
            salary: 'Уровень дохода',
            tags: 'Теги вакансии',
        },
        salary: {
            from: 'от',
            to: 'до',
        },
        btn: {
            save: (mode: 'create' | 'edit') =>
                mode === 'create' ? 'Создать' : 'Сохранить изменения',
            cancel: 'Отмена',
        },
    },
} as const;

export const getStringifySalary = (
    salaryFrom: number | null | undefined,
    salaryTo: number | null,
    salaryCurrency: string | null
) => {
    const { from, to } = CONSTANTS.detailedVacancy.salary;
    const currency = salaryCurrency ?? CONSTANTS.currency.ruble;

    const formatNumber = (num: number): string =>
        num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');

    if (salaryFrom && salaryTo) {
        return `${from} ${formatNumber(salaryFrom)} ${to} ${formatNumber(salaryTo)} ${currency}`;
    }
    if (salaryFrom) {
        return `${from} ${formatNumber(salaryFrom)} ${currency}`;
    }
    return CONSTANTS.detailedVacancy.salary.empty;
};

export const getStringifySalaryForInput = (value: number | null): string => {
    if (value === null) {
        return '';
    }

    return value
        .toString()
        .replace(/\D/g, '')
        .replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
};

export const getDayWMonth = (date: Date) => {
    const dateObj = new Date(date);
    const currentDate = new Date();

    const day = String(dateObj.getDate()).padStart(2, '0');
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const year = String(dateObj.getFullYear()).slice(-2);

    const isCurrentYear = dateObj.getFullYear() === currentDate.getFullYear();

    return isCurrentYear ? `${day}.${month}` : `${day}.${month}.${year}`;
};

type GetFullName = ({
    firstName,
    lastName,
    patronymic,
}: {
    firstName?: string | null;
    lastName?: string | null;
    patronymic?: string | null;
}) => string;

export const getFullName: GetFullName = ({
    firstName,
    lastName,
    patronymic,
}) => {
    if (firstName && lastName) {
        if (patronymic) {
            return `${lastName} ${firstName}  ${patronymic}`;
        }
        return `${lastName} ${firstName}`;
    }

    return 'Не указано';
};
