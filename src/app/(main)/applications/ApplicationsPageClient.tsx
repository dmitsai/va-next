'use client';

import { useState } from 'react';
import cn from 'classnames';
import { clientApi } from 'trpc/client';
import type { RouterOutputs } from 'trpc/shared';
import { ApplicationRow } from '~/widgets/applicationsWidget/ui/ApplicationRow';
import Button, { ButtonView } from '~/shared/ui/Button';
import Link from 'next/link';

type FilterType = 'all' | 'local' | 'external';

const FILTER_TABS: { value: FilterType; label: string }[] = [
    { value: 'all',      label: 'Все'       },
    { value: 'local',    label: 'Платформа' },
    { value: 'external', label: 'Внешние'   },
];

type Application =
    RouterOutputs['application']['getMyApplications']['applications'][number];

interface Props {
    initialApplications: Application[];
    initialNextCursor: string | null | undefined;
}

export const ApplicationsPageClient = ({
    initialApplications,
    initialNextCursor,
}: Props) => {
    const [allApplications, setAllApplications] =
        useState<Application[]>(initialApplications);
    const [cursor, setCursor] = useState<string | null | undefined>(
        initialNextCursor
    );
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [filter, setFilter] = useState<FilterType>('all');

    const utils = clientApi.useUtils();

    // Реактивный список — при invalidate после удаления перезапрашивает первую страницу
    const { data: freshData } = clientApi.application.getMyApplications.useQuery(
        { limit: 20 },
        {
            initialData: {
                applications: initialApplications,
                nextCursor: initialNextCursor,
            },
        }
    );

    const allApps = freshData?.applications ?? allApplications;
    const applications = allApps.filter((app) => {
        if (filter === 'all') return true;
        const isLocal = app.vacancy.platform.name === 'local';
        return filter === 'local' ? isLocal : !isLocal;
    });

    const handleLoadMore = async () => {
        if (!cursor) return;
        setIsLoadingMore(true);
        try {
            const data = await utils.application.getMyApplications.fetch({
                limit: 20,
                cursor,
            });
            setAllApplications((prev) => [...prev, ...data.applications]);
            setCursor(data.nextCursor);
        } finally {
            setIsLoadingMore(false);
        }
    };

    if (applications.length === 0) {
        return (
            <div className="flex w-full flex-col items-center gap-y-4 rounded-8 border border-surface-secondary bg-mantle py-16 text-center">
                <p className="text-16 text-sub-secondary/70">Откликов пока нет</p>
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
        <div className="flex w-full flex-col gap-y-4">
            <div className="flex flex-row gap-x-1">
                {FILTER_TABS.map((tab) => (
                    <button
                        key={tab.value}
                        type="button"
                        onClick={() => setFilter(tab.value)}
                        className={cn(
                            'rounded-6 px-3 py-1.5 text-12 font-500 transition-colors',
                            filter === tab.value
                                ? 'bg-mauve text-base'
                                : 'bg-surface-tertiary text-sub hover:bg-surface'
                        )}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>
            <div className="flex w-full flex-col gap-y-3">
            {applications.map((app) => (
                <ApplicationRow key={app.application_id} application={app} />
            ))}
            {cursor && (
                <div className="flex justify-center pt-2">
                    <Button
                        onClick={() => void handleLoadMore()}
                        disabled={isLoadingMore}
                        buttonView={ButtonView.LARGE}
                        className="bg-mantle hover:bg-surface-tertiary"
                    >
                        <span className="text-14 font-500 text-sub">
                            {isLoadingMore ? 'Загрузка...' : 'Показать ещё'}
                        </span>
                    </Button>
                </div>
            )}
            </div>
        </div>
    );
};
