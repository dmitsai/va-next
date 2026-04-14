import { headers } from 'next/headers';
import { createSSRHelpers } from 'trpc/helpers';
import Link from 'next/link';
import { FavoritesWidgetClient } from './FavoritesWidgetClient';

const PREVIEW_LIMIT = 3;

export const FavoritesWidget = async () => {
    const helpers = await createSSRHelpers(headers());

    let vacancies;
    try {
        const all = await helpers.application.getMyFavorites.fetch();
        vacancies = all.slice(0, PREVIEW_LIMIT);
    } catch {
        return null;
    }

    return (
        <div className="flex w-full flex-col gap-y-3">
            <div className="flex w-full flex-row items-center justify-between">
                <p className="text-16 font-600 text-text">Избранное</p>
                {vacancies.length > 0 && (
                    <Link
                        href="/favorites"
                        className="text-14 text-sub-secondary/70 transition-colors hover:text-mauve"
                    >
                        Все избранные →
                    </Link>
                )}
            </div>

            {vacancies.length === 0 ? (
                <div className="flex w-full flex-col items-center gap-y-3 rounded-8 border border-surface-secondary bg-mantle py-8 text-center">
                    <p className="text-14 text-sub-secondary/70">Нет избранных вакансий</p>
                    <Link
                        href="/vacancies"
                        className="text-14 font-500 text-mauve transition-colors hover:text-text"
                    >
                        Найти вакансии →
                    </Link>
                </div>
            ) : (
                <FavoritesWidgetClient initialVacancies={vacancies} />
            )}
        </div>
    );
};
