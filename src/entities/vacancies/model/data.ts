import {
    education,
    employmentTypes,
    experience,
    workSchedule,
} from '~/shared/api/model/tags/data';

export const availableFilters = [
    {
        name: 'employmentTypes',
        localTitle: 'Тип занятости',
        value: Object.entries(employmentTypes).map(([key, value]) => ({
            name: key,
            localTitle: value,
        })),
    },
    {
        name: 'workSchedule',
        localTitle: 'График работы',
        value: Object.entries(workSchedule).map(([key, value]) => ({
            name: key,
            localTitle: value,
        })),
    },
    {
        name: 'education',
        localTitle: 'Образование',
        value: Object.entries(education).map(([key, value]) => ({
            name: key,
            localTitle: value,
        })),
    },
    {
        name: 'experience',
        localTitle: 'Опыт',
        value: Object.entries(experience).map(([key, value]) => ({
            name: key,
            localTitle: value,
        })),
    },
];

export const availablePeriods = [
    { name: 'day', localTitle: 'День' },
    { name: 'month', localTitle: 'Месяц' },
    { name: 'threeMonths', localTitle: '3 месяца' },
    { name: 'all', localTitle: 'Все время' },
];

// NOTE: TEMP SOLUTION
export const availableRegions = [
    { name: 'moscow', localTitle: 'Москва' },
    { name: 'omsk', localTitle: 'Омск' },
    { name: 'samara', localTitle: 'Самара' },
    { name: 'all', localTitle: 'Все регионы' },
];
