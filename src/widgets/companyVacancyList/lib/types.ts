import { RouterOutputs } from 'trpc/shared';

export type CreateVacancyCard = {
    __isCreateCard: true;
    vacancy_id: string;
};

export type Vacancy =
    RouterOutputs['vacancy']['infinityVacancy']['vacancyList'][number];

export type UseHorizontalVirtualVacancies = {
    vacancies: Vacancy[];
    hasNextPage?: boolean;
};
