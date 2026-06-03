import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { getServerSession } from '~/shared/lib/auth';
import { createSSRHelpers } from 'trpc/helpers';
import { FavoritesPageClient } from './FavoritesPageClient';

export const dynamic = 'force-dynamic';

export default async () => {
    const session = await getServerSession();

    if (session?.user.role !== 'USER') {
        redirect('/user/login');
    }

    const helpers = await createSSRHelpers(headers());
    const vacancies = await helpers.application.getMyFavorites.fetch();

    return (
        <main className="flex w-full flex-grow flex-col gap-y-8 px-20 py-10">
            <div className="flex flex-row items-baseline gap-x-4">
                <h1 className="text-32 font-600 text-text">Избранное</h1>
                <span className="rounded-full bg-surface px-3 py-1 text-12 font-500 text-sub">
                    {vacancies.length}
                </span>
            </div>
            <FavoritesPageClient initialVacancies={vacancies} />
        </main>
    );
};
