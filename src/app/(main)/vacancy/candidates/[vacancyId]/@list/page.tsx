'use client';

import { useParams } from 'next/navigation';
import { Suspense, useEffect, useMemo } from 'react';
import { clientApi } from 'trpc/client';
import { CandidateCard } from '~/features/candidateCard';
import cn from 'classnames';
import { useVirtualCandidates } from './helpers/useVirtualCandidates';

const ListPage = () => {
    const params = useParams();
    useEffect(() => {
        console.log('CANDIDATES LIST PARAMS', params);
    }, []);

    const selectedCandidate = params.candidateId;

    const {
        hasNextPage,
        data,
        fetchNextPage,
        isFetchingNextPage,
        isLoading,
        isSuccess,
    } = clientApi.application.infinityCandidateList.useInfiniteQuery(
        {
            limit: 8,
            vacancyId: params.vacancyId as string,
        },
        {
            getNextPageParam: (lastPage) => lastPage.nextCursor,
        }
    );

    const candidates = useMemo(() => {
        if (!data) return [];
        return data.pages.flatMap((page) => page.candidates ?? []);
    }, [data]);

    const { containerRef, rows, items, virtualizer, isLastVisible } =
        useVirtualCandidates({ candidates, hasNextPage });

    return (
        <div
            className={
                'no-scrollbar relative h-screen w-full max-w-card overflow-y-auto'
            }
            ref={containerRef}
        >
            {isLoading && <div>{'Загрузка'}</div>}
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
                        const rowVacancies = candidates.slice(
                            virtualRow.index,
                            virtualRow.index + 1
                        );

                        if (isLoaderRow)
                            return (
                                <div
                                    key={
                                        rowVacancies[virtualRow.index]
                                            ?.applicationId
                                    }
                                    data-index={virtualRow.index}
                                    ref={virtualizer.measureElement}
                                    className={'w-full py-3'}
                                >
                                    <span
                                        className={
                                            'line-clamp-1 w-full text-center text-black'
                                        }
                                    >
                                        Загрузка
                                    </span>
                                </div>
                            );
                        if (hasNextPage) {
                            <p className={'text-text'}>Вакансий нет</p>;
                        }
                        return (
                            <div
                                ref={virtualizer.measureElement}
                                key={
                                    candidates[virtualRow.index]?.applicationId
                                }
                                data-index={virtualRow.index}
                                className={cn(
                                    'absolute left-0 top-0 w-full pb-10'
                                )}
                                style={{
                                    transform: `translateY(${virtualRow.start + 12}px)`,
                                }}
                            >
                                {rowVacancies.map((candidate) => (
                                    <CandidateCard
                                        wrapperClassName={cn(
                                            'rounded-4 pl-4 border-l-4',
                                            selectedCandidate ===
                                                candidate.userId
                                                ? 'border-mauve'
                                                : 'border-base'
                                        )}
                                        key={`card-${candidate.userId}`}
                                        vacancyId={params.vacancyId as string}
                                        candidateId={candidate.userId}
                                        firstName={
                                            candidate.userProfile
                                                ?.name as string
                                        }
                                        lastName={
                                            candidate.userProfile
                                                ?.surname as string
                                        }
                                        applyDate={candidate.appliedAt}
                                        salaryFrom={null}
                                        currencyChar={null}
                                    />
                                ))}
                            </div>
                        );
                    })}
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
