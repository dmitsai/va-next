'use client';

import { Suspense, useEffect, useMemo } from 'react';
import { clientApi } from 'trpc/client';
import { useSession } from 'next-auth/react';
import { VacancyCard } from '~/features/vacancyCard';
import cn from 'classnames';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import {
    education,
    experience,
    workSchedule,
    employmentTypes,
} from '~/shared/api/model/tags/data';
import type {
    EducationKey,
    EmploymentTypesKey,
    ExperienceKey,
    PeriodKey,
    Tags,
    WorkScheduleKey,
} from '~/shared/api/model/tags/type';
import { SkeletonVancy } from '~/entities/vacancies';
import { useVirtualVacancies } from './helpers/useVirtualVacancies';

const ListPage = () => {
    const params = useParams();
    const router = useRouter();
    const { status, data: session } = useSession();

    const searchParams = useSearchParams();

    const workScheduleKeys = searchParams.getAll(
        'workSchedule'
    ) as WorkScheduleKey[];
    const workScheduleValues = workScheduleKeys.map((key) => workSchedule[key]);

    const employmentTypesKeys = searchParams.getAll(
        'employmentTypes'
    ) as EmploymentTypesKey[];
    const employmentTypeValues = employmentTypesKeys.map(
        (key) => employmentTypes[key]
    );

    const educationKeys = searchParams.getAll('education') as EducationKey[];
    const educationValues = educationKeys.map((key) => education[key]);

    const experienceKeys = searchParams.getAll('experience') as ExperienceKey[];
    const experienceValues = experienceKeys.map((key) => experience[key]);

    const tags = {
        workSchedule: workScheduleValues,
        employmentTypes: employmentTypeValues,
        education: educationValues,
        experience: experienceValues,
    };

    const salaryFrom = searchParams.get('salaryFrom')!;

    const period = searchParams.get('period') as PeriodKey;

    const currencyName = searchParams.get('currency')!;

    const search = searchParams.get('search');

    useEffect(() => {
        console.log('LIST PAGE SEARCH', search);
    }, [search]);

    const selectedVacancyId = params.vacancyId as string;
    const {
        hasNextPage,
        data,
        fetchNextPage,
        isFetchingNextPage,
        isLoading,
        isSuccess,
    } = clientApi.vacancy.infinityVacancy.useInfiniteQuery(
        {
            salaryFrom,
            period,
            currencyName,
            search,
            tags,
            limit: 20,
        },
        {
            getNextPageParam: (lastPage) => lastPage.nextCursor,
        }
    );

    const vacancies = useMemo(() => {
        if (!data) return [];

        return data.pages.flatMap((page) => page.vacancyList ?? []);
    }, [data]);

    const { data: appliedIds = [] } =
        clientApi.application.getMyAppliedVacancyIds.useQuery(undefined, {
            enabled:
                status === 'authenticated' && session?.user?.role === 'USER',
        });

    const appliedSet = useMemo(() => new Set(appliedIds), [appliedIds]);

    const { containerRef, rows, items, virtualizer, isLastVisible } =
        useVirtualVacancies({
            vacancies,
            hasNextPage,
        });

    useEffect(() => {
        if (isLastVisible && hasNextPage && !isFetchingNextPage)
            void fetchNextPage();
    }, [hasNextPage, isFetchingNextPage, isLastVisible]);

    useEffect(() => {
        if (isSuccess && vacancies.length === 0 && selectedVacancyId) {
            const currentParams = new URLSearchParams(searchParams.toString());
            router.replace(`/vacancies?${currentParams.toString()}`);
        }
    }, [isSuccess, vacancies.length, selectedVacancyId]);

    return (
        <div
            className={
                'no-scrollbar relative h-screen w-full max-w-card shrink-0 overflow-x-hidden overflow-y-auto'
            }
            ref={containerRef}
        >
            {isSuccess && (
                <div
                    style={{
                        height: `${virtualizer.getTotalSize()}px`,
                        width: '100%',
                        position: 'relative',
                    }}
                >
                    {items.map((virtualRow) => {
                        const isLoaderRow = virtualRow.index > rows - 1;
                        const rowVacancies = vacancies.slice(
                            virtualRow.index,
                            virtualRow.index + 1
                        );

                        if (isLoaderRow)
                            return (
                                <SkeletonVancy
                                    key={`skeleton-${virtualRow.index}`}
                                    data-index={virtualRow.index}
                                    ref={virtualizer.measureElement}
                                    className={
                                        'absolute left-0 top-0 w-full pb-3'
                                    }
                                    style={{
                                        transform: `translateY(${virtualRow.start + 12}px)`,
                                    }}
                                />
                            );
                        return (
                            <div
                                ref={virtualizer.measureElement}
                                key={vacancies[virtualRow.index]?.vacancy_id}
                                data-index={virtualRow.index}
                                className={cn(
                                    'absolute left-0 top-0 w-full pb-3'
                                )}
                                style={{
                                    transform: `translateY(${virtualRow.start + 12}px)`,
                                }}
                            >
                                {rowVacancies.map((vacancy) => (
                                    <VacancyCard
                                        wrapperClassName={cn(
                                            selectedVacancyId ===
                                                vacancy.vacancy_id
                                                ? '!border-mauve'
                                                : 'border-base'
                                        )}
                                        key={`card-${vacancy.vacancy_id}`}
                                        vacancyId={vacancy.vacancy_id}
                                        title={vacancy.title}
                                        isFavorited={false}
                                        isApplied={appliedSet.has(
                                            vacancy.vacancy_id
                                        )}
                                        tags={vacancy.tags as Tags | null}
                                        description={vacancy.description}
                                        company={vacancy.company}
                                        salaryFrom={vacancy.salaryFrom}
                                        salaryTo={vacancy.salaryTo}
                                        currency={vacancy.currency}
                                        isLocal={
                                            vacancy.platform.name === 'local'
                                        }
                                        sourceUrl={vacancy.sourceUrl}
                                    />
                                ))}
                            </div>
                        );
                    })}
                </div>
            )}
            {isSuccess && items.length === 0 && (
                <div className={'flex flex-col items-start gap-y-3'}>
                    <p className={'text-14 text-text'}>
                        <span>{'По  запросу "'}</span>
                        <span className={'font-600 text-mauve'}>
                            {search ?? ''}
                        </span>
                        <span>{'" ничего не найдено'}</span>
                    </p>
                    <p className={'text-12 text-sub'}>
                        {
                            'Попробуйте другие варианты запроса или уберите фильтры'
                        }
                    </p>
                </div>
            )}
        </div>
    );
};

export default () => (
    <Suspense fallback={null}>
        <ListPage />
    </Suspense>
);
