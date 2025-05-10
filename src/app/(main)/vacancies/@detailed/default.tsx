import { redirect } from 'next/navigation';
import { createSSRHelpers } from 'trpc/helpers';
import { headers } from 'next/headers';
import {
    EducationKey,
    EmploymentTypesKey,
    ExperienceKey,
    PeriodKey,
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

    const salaryFrom = searchParams.salaryFrom as string;

    const period = searchParams.period as PeriodKey;

    const currencyName = searchParams.currency as string;

    const search = searchParams.search as string;

    const { vacancyList } = await helpers.vacancy.infinityVacancy.fetch({
        limit: 1,
        tags,
        search,
        salaryFrom,
        period,
        currencyName,
    });

    if (!vacancyList?.[0]?.vacancy_id) {
        return <div className="p-8">Нет доступных вакансий</div>;
    }

    const searchParamsString = new URLSearchParams();

    Object.entries(searchParams).forEach(([key, value]) => {
        if (value !== undefined) {
            if (Array.isArray(value)) {
                value.forEach((v) => searchParamsString.append(key, v));
            } else {
                searchParamsString.append(key, value);
            }
        }
    });

    const redirectUrl = `/vacancies/${vacancyList[0].vacancy_id}${
        searchParamsString.toString() ? `?${searchParamsString.toString()}` : ''
    }`;

    redirect(redirectUrl);
};
