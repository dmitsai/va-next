import { headers } from 'next/headers';
import { createSSRHelpers } from 'trpc/helpers';
import { ImportsTable } from '~/widgets/admin';

export const dynamic = 'force-dynamic';

const ImportsPage = async ({
    searchParams,
}: {
    searchParams: { filter?: string; page?: string };
}) => {
    const filter = (searchParams.filter ?? 'all') as 'all' | 'manual' | 'cron';
    const page = Math.max(0, Number(searchParams.page ?? 0));
    const pageSize = 30;

    const helpers = await createSSRHelpers(headers());
    const [data, allData, importFilterOptions] = await Promise.all([
        helpers.admin.getImportRuns.fetch({
            triggeredBy: filter,
            page,
            pageSize,
        }),
        helpers.admin.getImportRuns.fetch({
            triggeredBy: 'all',
            page: 0,
            pageSize: 100,
        }),
        helpers.admin.getImportRunFilterOptions.fetch({
            triggeredBy: filter,
        }),
    ]);

    const totalPages = Math.ceil(data.total / pageSize);
    const completed = allData.runs.filter(
        (r) => r.status === 'COMPLETED'
    ).length;
    const failed = allData.runs.filter((r) => r.status === 'FAILED').length;
    const running = allData.runs.filter((r) => r.status === 'RUNNING').length;

    return (
        <div className="flex flex-col gap-5">
            <div>
                <h2 className="text-24 font-700">История импортов</h2>
                <p className="mt-0.5 text-14 text-surface">
                    Все синхронизации с внешними платформами
                </p>
            </div>

            <div className="grid grid-cols-3 gap-3">
                {[
                    {
                        label: 'Завершено',
                        value: completed,
                        color: 'text-green',
                    },
                    { label: 'Ошибки', value: failed, color: 'text-red' },
                    {
                        label: 'В процессе',
                        value: running,
                        color: 'text-yellow',
                    },
                ].map((s) => (
                    <div
                        key={s.label}
                        className="rounded-8 border border-surface-tertiary px-4 py-3"
                    >
                        <p className="text-14 text-sub">{s.label}</p>
                        <p className={`text-26 mt-1 font-700 ${s.color}`}>
                            {s.value}
                        </p>
                    </div>
                ))}
            </div>

            <ImportsTable
                runs={data.runs.map((r) => ({
                    ...r,
                    startedAt: r.startedAt.getTime(),
                    finishedAt: r.finishedAt?.getTime() ?? null,
                }))}
                total={data.total}
                page={page}
                totalPages={totalPages}
                filter={filter}
                sourceChoices={importFilterOptions.sources}
                queryChoices={importFilterOptions.queries}
                hasEmptyQuery={importFilterOptions.hasEmptyQuery}
            />
        </div>
    );
};

export default ImportsPage;
