import { redirect } from 'next/navigation';
import { createSSRHelpers } from 'trpc/helpers';
import { headers } from 'next/headers';
import {
    EducationKey,
    EmploymentTypesKey,
    ExperienceKey,
    WorkScheduleKey,
} from '~/shared/api/model/tags/type';
import {
    education,
    employmentTypes,
    experience,
    workSchedule,
} from '~/shared/api/model/tags/data';

const parseParam = (param: string | string[] | undefined) => {
    if (!param) return [];
    if (typeof param === 'string') return [param];
    return param;
};

export default async ({
    searchParams,
}: {
    searchParams: { [key: string]: string | string[] | undefined };
    // eslint-disable-next-line consistent-return
}) => {
    const helpers = await createSSRHelpers(headers());

    const workScheduleKeys = parseParam(
        searchParams.workSchedule
    ) as WorkScheduleKey[];
    const workScheduleValues = workScheduleKeys.map((key) => workSchedule[key]);

    const employmentTypesKeys = parseParam(
        searchParams.employmentTypes
    ) as EmploymentTypesKey[];
    const employmentTypeValues = employmentTypesKeys.map(
        (key) => employmentTypes[key]
    );
    const educationKeys = parseParam(searchParams.education) as EducationKey[];
    const educationValues = educationKeys.map((key) => education[key]);

    const experienceKeys = parseParam(
        searchParams.experience
    ) as ExperienceKey[];
    const experienceValues = experienceKeys.map((key) => experience[key]);

    const tags = {
        workSchedule: workScheduleValues,
        employmentTypes: employmentTypeValues,
        education: educationValues,
        experience: experienceValues,
    };

    console.log('TAGS', tags);

    const search = searchParams.search as string;
    console.log('SEARCH', search);

    const { vacancyList } = await helpers.vacancy.infinityVacancy.fetch({
        limit: 1,
        tags,
        search,
    });

    if (!vacancyList?.[0]?.vacancy_id) {
        return <div className="p-8">Нет доступных вакансий</div>;
    }

    // Создаем URLSearchParams из текущих searchParams
    const searchParamsString = new URLSearchParams();

    // Добавляем параметры, исключая undefined значения
    Object.entries(searchParams).forEach(([key, value]) => {
        if (value !== undefined) {
            if (Array.isArray(value)) {
                value.forEach((v) => searchParamsString.append(key, v));
            } else {
                searchParamsString.append(key, value);
            }
        }
    });

    // Формируем URL с сохранением search params
    const redirectUrl = `/vacancies/${vacancyList[0].vacancy_id}${
        searchParamsString.toString() ? `?${searchParamsString.toString()}` : ''
    }`;

    redirect(redirectUrl);
};
