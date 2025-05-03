'use client';

import { useEffect, useMemo } from 'react';
import { clientApi } from 'trpc/client';
import { VacancyCard } from '~/features/vacancyCard';
import { Tags } from '~/features/vacancyCard/ui/VacancyCard';
import cn from 'classnames';
import { useVirtualVacancies } from './helpers/useVirtualVacancies';
import { useParams } from 'next/navigation';

export default () => {
  const params = useParams();
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
      limit: 6,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    },
  );

  const vacancies = useMemo(() => {
    if (!data) return [];

    return data.pages.flatMap((page) => page.vacancyList ?? []);
  }, [data]);

  const { containerRef, rows, items, virtualizer, isLastVisible } =
    useVirtualVacancies({
      vacancies,
      hasNextPage,
    });

  useEffect(() => {
    if (isLastVisible && hasNextPage && !isFetchingNextPage)
      void fetchNextPage();
  }, [hasNextPage, isFetchingNextPage, isLastVisible]);

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
            const rowVacancies = vacancies.slice(
              virtualRow.index,
              virtualRow.index + 1,
            );

            if (isLoaderRow)
              return (
                <div
                  key={rowVacancies[virtualRow.index]?.vacancy_id}
                  data-index={virtualRow.index}
                  ref={virtualizer.measureElement}
                  className={'w-full py-3'}
                >
                  <span
                    className={'line-clamp-1 w-full text-center text-black'}
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
                key={vacancies[virtualRow.index]?.vacancy_id}
                data-index={virtualRow.index}
                className={cn('absolute left-0 top-0 w-full')}
                style={{
                  transform: `translateY(${virtualRow.start}px)`,
                }}
              >
                {rowVacancies.map((vacancy) => (
                  <VacancyCard
                    wrapperClassName={cn(
                      selectedVacancyId === vacancy.vacancy_id
                        ? 'border-mauve'
                        : 'border-mantle',
                    )}
                    key={`card-${vacancy.vacancy_id}`}
                    vacancyId={vacancy.vacancy_id}
                    title={'test'}
                    isFavorited={false}
                    tags={[]}
                    description={'test'}
                    company={{ imgUrl: null, title: 'Test' }}
                    salary={65000}
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
