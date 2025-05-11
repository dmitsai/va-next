'use client';

import React, { useEffect, useMemo } from 'react';
import { clientApi } from 'trpc/client';
import { VacancyCard } from '~/features/vacancyCard';
import Link from 'next/link';
import { useHorizontalVirtualVacancies } from '../lib/hook';
import { Vacancy } from '../lib/types';
import { VacancyCreator } from './VacancyCreator';

export interface CompanyVacancyListProps {
    companyId: string;
}

export const CompanyVacancyList: React.FC<CompanyVacancyListProps> = ({
    companyId,
}) => {
    const {
        hasNextPage,
        data,
        fetchNextPage,
        isFetchingNextPage,
        isLoading,
        isSuccess,
    } = clientApi.vacancy.infinityVacancy.useInfiniteQuery(
        {
            limit: 8,
            companyId,
        },
        {
            getNextPageParam: (lastPage) => lastPage.nextCursor,
        }
    );

    const vacancies = useMemo(() => {
        if (!data) return [];
        return data.pages.flatMap((page) => page.vacancyList ?? []);
    }, [data]);

    const vacanciesWithCreate = useMemo(
        () => [
            {
                __isCreateCard: true,
                vacancy_id: 'create-vacancy',
            } as unknown as Vacancy,
            ...vacancies,
        ],
        [vacancies]
    );

    const { containerRef, rows, items, virtualizer, isLastVisible } =
        useHorizontalVirtualVacancies({
            vacancies: vacanciesWithCreate,
            hasNextPage,
        });

    useEffect(() => {
        if (isLastVisible && hasNextPage && !isFetchingNextPage) {
            void fetchNextPage();
        }
    }, [hasNextPage, isFetchingNextPage, isLastVisible]);

    return (
        <div className="relative h-[420px] w-full">
            <div
                ref={containerRef}
                className="h-full w-full overflow-x-auto py-4"
            >
                {isLoading && <div className="p-4">Загрузка...</div>}
                {isSuccess && (
                    <div
                        style={{
                            width: `${virtualizer.getTotalSize()}px`,
                            height: '100%',
                            position: 'relative',
                        }}
                    >
                        {items.map((virtualRow) => {
                            const isLoaderRow = virtualRow.index > rows - 1;
                            const rowVacancies = vacanciesWithCreate.slice(
                                virtualRow.index * 4,
                                virtualRow.index * 4 + 4
                            );

                            if (isLoaderRow) {
                                return (
                                    <div
                                        key={`loader-${virtualRow.index}`}
                                        data-index={virtualRow.index}
                                        ref={virtualizer.measureElement}
                                        className="absolute top-0 flex-shrink-0 px-3"
                                        style={{
                                            left: `${virtualRow.start}px`,
                                            width: '720px',
                                            height: '100%',
                                        }}
                                    >
                                        <div className="grid h-full grid-cols-2 grid-rows-2 gap-4">
                                            {Array.from({ length: 4 }).map(
                                                (_, i) => (
                                                    <div
                                                        // eslint-disable-next-line react/no-array-index-key
                                                        key={`loader-${i}`}
                                                        className="rounded-lg bg-gray-100 p-4"
                                                    >
                                                        Загрузка...
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    </div>
                                );
                            }

                            return (
                                <div
                                    key={`row-${virtualRow.index}`}
                                    ref={virtualizer.measureElement}
                                    data-index={virtualRow.index}
                                    className="absolute top-0 flex-shrink-0 px-3"
                                    style={{
                                        left: `${virtualRow.start}px`,
                                        width: '720px',
                                        height: '100%',
                                    }}
                                >
                                    <div className="grid h-full grid-cols-2 grid-rows-2 gap-4">
                                        {rowVacancies.map((vacancy) => {
                                            if (
                                                '__isCreateCard' in vacancy &&
                                                // eslint-disable-next-line no-underscore-dangle
                                                vacancy.__isCreateCard
                                            ) {
                                                return <VacancyCreator />;
                                            }

                                            return (
                                                <VacancyCard
                                                    key={`card-${vacancy.vacancy_id}`}
                                                    wrapperClassName="h-full"
                                                    vacancyId={
                                                        vacancy.vacancy_id
                                                    }
                                                    title={vacancy.title}
                                                    isFavorited={false}
                                                    tags={vacancy.tags}
                                                    description={
                                                        vacancy.description
                                                    }
                                                    company={vacancy.company}
                                                    salaryFrom={
                                                        vacancy.salaryFrom
                                                    }
                                                    salaryTo={vacancy.salaryTo}
                                                    currency={vacancy.currency}
                                                    view="company"
                                                />
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};
