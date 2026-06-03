import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { createSSRHelpers } from 'trpc/helpers';
import { CreateLocalVacancyForm, HHSyncPanel, TrudvsemSyncPanel, JobicySyncPanel, RemotiveSyncPanel, VacancyTable } from '~/widgets/admin';

const PLATFORMS = ['hh', 'trudvsem', 'jobicy', 'remotive', 'local'] as const;
type PlatformSlug = (typeof PLATFORMS)[number];

const PLATFORM_LABELS: Record<PlatformSlug, string> = {
    hh: 'HH.ru',
    trudvsem: 'Труд Всём',
    jobicy: 'Jobicy',
    remotive: 'Remotive',
    local: 'Локальные',
};

const PLATFORM_DESCRIPTIONS: Record<PlatformSlug, string> = {
    hh: 'HH.ru — API недоступен с 15.12.2025',
    trudvsem: 'Импортированные с Труд Всём (Роструд)',
    jobicy: 'Remote-вакансии с Jobicy (международные)',
    remotive: 'Remote-вакансии с Remotive (международные)',
    local: 'Созданные вручную',
};

export const dynamic = 'force-dynamic';

const VacanciesPlatformPage = async ({
    params,
    searchParams,
}: {
    params: { platform: string };
    searchParams: { page?: string; q?: string };
}) => {
    const slug = params.platform as PlatformSlug;
    if (!PLATFORMS.includes(slug)) notFound();

    const page = Math.max(0, Number(searchParams.page ?? 0));
    const search = searchParams.q ?? '';

    const helpers = await createSSRHelpers(headers());
    const data = await helpers.admin.getVacancies.fetch({
        platformName: slug,
        page,
        pageSize: 20,
        search: search || undefined,
    });

    return (
        <div className="flex flex-col gap-5">
            {/* Heading */}
            <div>
                <h2 className="text-24 font-700">Вакансии</h2>
                <p className="mt-0.5 text-14 text-sub">{PLATFORM_DESCRIPTIONS[slug]}</p>
            </div>

            {/* Platform tabs */}
            <div className="flex gap-0.5 rounded-6 border border-surface-tertiary bg-mantle p-0.5 w-fit">
                {PLATFORMS.map((p) => (
                    <Link
                        key={p}
                        href={`/admin/vacancies/${p}`}
                        className={`rounded-6 px-3 py-1 text-12 font-500 transition-colors ${
                            slug === p
                                ? 'bg-base text-text shadow-sm'
                                : 'text-sub hover:text-text'
                        }`}
                    >
                        {PLATFORM_LABELS[p]}
                    </Link>
                ))}
            </div>

            {/* Sync panels */}
            {slug === 'hh' && <HHSyncPanel />}
            {slug === 'trudvsem' && <TrudvsemSyncPanel />}
            {slug === 'jobicy' && <JobicySyncPanel />}
            {slug === 'remotive' && <RemotiveSyncPanel />}
            {slug === 'local' && <CreateLocalVacancyForm />}

            <VacancyTable
                vacancies={data.vacancies}
                total={data.total}
                page={page}
                pageSize={20}
                platformSlug={slug}
                search={search}
            />
        </div>
    );
};

export default VacanciesPlatformPage;
