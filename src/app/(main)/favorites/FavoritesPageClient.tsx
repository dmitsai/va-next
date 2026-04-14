'use client';

import { clientApi } from 'trpc/client';
import type { RouterOutputs } from 'trpc/shared';
import { FavoriteRow } from '~/widgets/favoritesWidget/ui/FavoriteRow';
import Link from 'next/link';

type Vacancy = RouterOutputs['application']['getMyFavorites'][number];

interface Props {
    initialVacancies: Vacancy[];
}

export const FavoritesPageClient = ({ initialVacancies }: Props) => {
    const { data: vacancies = initialVacancies } =
        clientApi.application.getMyFavorites.useQuery(undefined, {
            initialData: initialVacancies,
        });

    if (vacancies.length === 0) {
        return (
            <div className="flex w-full flex-col items-center gap-y-4 rounded-8 border border-surface-secondary bg-mantle py-16 text-center">
                <p className="text-16 text-sub-secondary/70">Нет избранных вакансий</p>
                <Link
                    href="/vacancies"
                    className="text-14 font-500 text-mauve transition-colors hover:text-text"
                >
                    Найти вакансии →
                </Link>
            </div>
        );
    }

    return (
        <div className="flex w-full flex-col gap-y-3">
            {vacancies.map((v) => (
                <FavoriteRow key={v.vacancy_id} vacancy={v} />
            ))}
        </div>
    );
};
