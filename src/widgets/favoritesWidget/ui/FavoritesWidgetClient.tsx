'use client';

import { clientApi } from 'trpc/client';
import type { RouterOutputs } from 'trpc/shared';
import { FavoriteRow } from './FavoriteRow';

type Vacancy = RouterOutputs['application']['getMyFavorites'][number];

interface Props {
    initialVacancies: Vacancy[];
}

export const FavoritesWidgetClient = ({ initialVacancies }: Props) => {
    const { data: vacancies = initialVacancies } =
        clientApi.application.getMyFavorites.useQuery(undefined, {
            initialData: initialVacancies,
        });

    const preview = vacancies.slice(0, 3);

    return (
        <div className="flex w-full flex-col gap-y-2">
            {preview.map((v) => (
                <FavoriteRow key={v.vacancy_id} vacancy={v} />
            ))}
        </div>
    );
};
