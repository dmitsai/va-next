import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { getServerSession } from '~/shared/lib/auth';
import { createSSRHelpers } from 'trpc/helpers';
import { ApplicationsPageClient } from './ApplicationsPageClient';

export const dynamic = 'force-dynamic';

export default async () => {
    const session = await getServerSession();

    if (session?.user.role !== 'USER') {
        redirect('/user/login');
    }

    const helpers = await createSSRHelpers(headers());
    const data = await helpers.application.getMyApplications.fetch({ limit: 20 });

    return (
        <main className="flex w-full flex-grow flex-col gap-y-8 px-20 py-10">
            <div className="flex flex-row items-baseline gap-x-4">
                <h1 className="text-32 font-600 text-text">Мои отклики</h1>
                <span className="rounded-full bg-surface px-3 py-1 text-12 font-500 text-sub">
                    {data.applications.length > 0 ? `${data.applications.length}+` : '0'}
                </span>
            </div>
            <ApplicationsPageClient
                initialApplications={data.applications}
                initialNextCursor={data.nextCursor}
            />
        </main>
    );
};
