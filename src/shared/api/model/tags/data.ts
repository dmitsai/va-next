import { PeriodKey } from './type';

export const employmentTypes = {
    full: 'Полная занятость',
    partTime: 'Частичная занятость',
    project: 'Проектная работа',
    internship: 'Стажировка',
} as const;

export const workSchedule = {
    fullday: 'Полный день',
    shift: 'Сменный график',
    flexible: 'Гибкий график',
    remote: 'Удалённая работа',
} as const;

export const education = {
    noEducation: 'Нет образования',
    middle: 'Среднее профессиональное',
    higher: 'Высшие образование',
} as const;

export const experience = {
    noExperience: 'Нет опыта',
    FromOneToThreeYears: 'От 1 года до 3 лет',
    FromThreeToSixYears: 'От 3 до 6 лет',
    MoreSixYears: 'Более 6 лет',
} as const;

export const periods = {
    day: 'День',
    month: 'Месяц',
    threeMonths: '3 месяца',
    all: 'Все время',
} as const;

export const periodsKeys = ['day', 'month', 'threeMonths', 'all'] as const;
