export const CONSTANTS  = {
    topBar : {
        placeholder: 'vakansiy.net',
        vacancies: 'Вакансии',
        internships : 'Стажировки',
        events : 'События',
        theme: {
            light: 'Светлая',
            dark: 'Темная',
            system: 'Системная'
        }
    },
    auth: {
        signUp: 'Зарегистрироваться',
        logIn: 'Войти',
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
                specialCharacter: 'Пароль должен содержать хотя бы один спецсимвол',

            },
            phone: {
                invalid: 'Неверный формат телефона'
            }
        }
    }
} as const;