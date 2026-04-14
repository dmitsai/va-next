'use client';

import { useMemo } from 'react';
import { useSession } from 'next-auth/react';
import { clientApi } from 'trpc/client';
import { VacancyCard } from '~/features/vacancyCard';
import type { Tags } from '~/shared/api/model/tags/type';
import type { RouterOutputs } from 'trpc/shared';

type Vacancy =
    RouterOutputs['vacancy']['infinityVacancy']['vacancyList'][number];

interface VacancyListClientProps {
    vacancies: Vacancy[];
}

export const VacancyListClient = ({ vacancies }: VacancyListClientProps) => {
    const { status, data: session } = useSession();

    const { data: appliedIds = [] } =
        clientApi.application.getMyAppliedVacancyIds.useQuery(undefined, {
            enabled: status === 'authenticated' && session?.user?.role === 'USER',
        });

    const appliedSet = useMemo(() => new Set(appliedIds), [appliedIds]);

    return (
        <>
            {vacancies.map((vacancy) => (
                <VacancyCard
                    key={vacancy.vacancy_id}
                    vacancyId={vacancy.vacancy_id}
                    title={vacancy.title}
                    isFavorited={false}
                    isApplied={appliedSet.has(vacancy.vacancy_id)}
                    tags={vacancy.tags as Tags | null}
                    description={vacancy.description}
                    company={vacancy.company}
                    salaryFrom={vacancy.salaryFrom}
                    salaryTo={vacancy.salaryTo}
                    currency={vacancy.currency}
                    isLocal={vacancy.platform.name === 'local'}
                    sourceUrl={vacancy.sourceUrl}
                />
            ))}
        </>
    );
};
