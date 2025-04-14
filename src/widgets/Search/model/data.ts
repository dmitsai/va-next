
export const tempFilters = [
    { name: 'speciality', localTitle: 'Специальность', value: [{ name: 'webDeveloper', localTitle: 'Web-разработчик' }, { name: 'backend', localTitle: 'Backend-разработчик' }] },
    { name: 'workSchedule', localTitle: 'График работы', value: [{ name: 'fullDay', localTitle: 'Полный день' }, { name: 'flexible', localTitle: 'Гибкий график' }] },
    { name: 'experience', localTitle: 'Опыт', value: [{ name: 'lowerOneYear', localTitle: 'менее 1 года' }, { name: '1-3Years', localTitle: '1-3 года' }] },
    { name: 'education', localTitle: 'Образование', value: [{ name: 'higher', localTitle: 'Высшие образование' }, { name: 'noEducation', localTitle: 'Нет образования' }] },
    { name: 'employmentType', localTitle: 'тип занятости', value: [{ name: 'full', localTitle: 'Полная занятость' }, { name: 'parttime', localTitle: 'Частичная занятость' }] },
];

export const regions = [
    { name: 'moscow', localTitle: 'Москва' },
    { name: 'omsk', localTitle: 'Омск' },
    { name: 'samara', localTitle: 'Самара' },
    { name: 'all', localTitle: 'Все регионы' },
];

export const periods = [
    { name: 'day', localTitle: 'День' },
    { name: 'mouth', localTitle: 'Месяц' },
    { name: '3mouth', localTitle: '3 месяца' },
    { name: 'all', localTitle: 'Все время' },
];

export const state = ['Вакансии', 'Стажировки'];