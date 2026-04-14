'use client';

import Link from 'next/link';
import type { DashboardStats } from '../model/dashboard';
import { formatDateTime, STATUS_DOT, STATUS_LABELS } from '../model/dashboard';

type RecentImportsCardProps = {
    recentImports: DashboardStats['recentImports'];
};

const STATUS_BADGE: Record<string, string> = {
    COMPLETED: 'bg-green/10 text-green',
    FAILED: 'bg-red/10 text-red',
    RUNNING: 'bg-yellow/15 text-yellow',
};

const TYPE_BADGE: Record<string, string> = {
    cron: 'bg-surface1 text-subtext0',
    manual: 'bg-mauve/10 text-mauve',
};

export const RecentImportsCard = ({
    recentImports,
}: RecentImportsCardProps) => {
    const rows = recentImports;

    return (
        <div className="rounded-8 border border-surface-tertiary">
            <div className="border-b border-surface-tertiary px-4 py-3">
                <div>
                    <p className="text-16">Последние импорты</p>
                    <p className="text-12 text-sub">
                        История запусков и изменений вакансий.
                    </p>
                </div>
            </div>
            {rows.length === 0 ? (
                <p className="px-4 py-6 text-center text-14 text-sub">
                    Импортов пока нет
                </p>
            ) : (
                <div className="max-h-[360px] overflow-auto">
                    <div className="min-w-[760px]">
                        <div className="grid grid-cols-[minmax(220px,1.6fr)_minmax(140px,1fr)_minmax(140px,1fr)_minmax(110px,.8fr)_minmax(130px,1fr)] items-center gap-3 border-b border-surface-tertiary bg-base px-4 py-2.5 text-center text-12 text-sub">
                            <span className="text-left">Запрос и источник</span>
                            <span>Статус</span>
                            <span>Изменения вакансий</span>
                            <span>Тип</span>
                            <span>Время</span>
                        </div>
                        <div className="divide-y divide-surface-tertiary">
                            {rows.map((run) => (
                                <div
                                    key={run.import_run_id}
                                    className="grid grid-cols-[minmax(220px,1.6fr)_minmax(140px,1fr)_minmax(140px,1fr)_minmax(110px,.8fr)_minmax(130px,1fr)] items-center gap-3 px-4 py-2.5 text-center"
                                >
                                    <div className="min-w-0 text-left">
                                        <p
                                            className="truncate text-13 text-subtext1"
                                            title={run.query ?? run.source}
                                        >
                                            {run.query ?? run.source}
                                        </p>
                                        <p className="text-11 text-overlay0">
                                            № записи {run.import_run_id}
                                        </p>
                                    </div>
                                    <span
                                        className={`mx-auto inline-flex w-fit items-center gap-1 rounded-full px-2 py-1 text-11 ${STATUS_BADGE[run.status] ?? 'bg-surface1 text-subtext0'}`}
                                    >
                                        <span
                                            className={`h-1.5 w-1.5 rounded-full ${STATUS_DOT[run.status] ?? 'bg-overlay1'}`}
                                        />
                                        {STATUS_LABELS[run.status] ?? run.status}
                                    </span>
                                    <span className="text-12 text-subtext0">
                                        {run.itemsCreated} изм.
                                    </span>
                                    <span
                                        className={`mx-auto inline-flex w-fit rounded px-1.5 py-0.5 text-11 ${
                                            TYPE_BADGE[run.triggeredBy] ??
                                            TYPE_BADGE.manual
                                        }`}
                                    >
                                        {run.triggeredBy === 'cron'
                                            ? 'авто'
                                            : 'ручной'}
                                    </span>
                                    <span className="text-12 text-overlay0">
                                        {formatDateTime(run.startedAt)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
            <div className="border-t border-surface-tertiary px-4 py-3 text-right">
                <Link
                    href="/imports"
                    className="text-12 text-sub transition-colors hover:text-mauve"
                >
                    Посмотреть все
                </Link>
            </div>
        </div>
    );
};
