'use client';

import { useState } from 'react';
import { clientApi } from 'trpc/client';
import type { RouterOutputs } from 'trpc/shared';
import { ApplicationRow } from '~/widgets/applicationsWidget/ui/ApplicationRow';
import Button, { ButtonView } from '~/shared/ui/Button';
import Link from 'next/link';

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

    const applications = freshData?.applications ?? allApplications;

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
    );
};
