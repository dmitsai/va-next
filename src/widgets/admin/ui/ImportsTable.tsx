'use client';

import { useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import cn from 'classnames';
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react';
import { useRouter } from 'next/navigation';

type ImportRunSerialized = {
    import_run_id: string;
    source: string;
    status: string;
    query: string | null;
    triggeredBy: string;
    startedAt: number;
    finishedAt: number | null;
    itemsFound: number;
    itemsCreated: number;
    itemsUpdated: number;
    errorMessage: string | null;
};

const STATUS_DOT: Record<string, string> = {
    COMPLETED: 'bg-green',
    FAILED: 'bg-red',
    RUNNING: 'bg-yellow animate-pulse',
};

const STATUS_LABELS: Record<string, string> = {
    COMPLETED: 'Готово',
    FAILED: 'Ошибка',
    RUNNING: 'В процессе',
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

type SortField =
    | 'status'
    | 'triggeredBy'
    | 'source'
    | 'query'
    | 'itemsFound'
    | 'itemsCreated'
    | 'itemsUpdated'
    | 'startedAt'
    | 'duration';

type SortDirection = 'asc' | 'desc';

function formatDate(ts: number) {
    return new Date(ts).toLocaleString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
    });
}

function formatDuration(startTs: number, endTs: number) {
    const ms = endTs - startTs;
    if (ms < 0) return '—';
    if (ms < 1000) return `${ms}мс`;
    const secs = Math.round(ms / 1000);
    if (secs < 60) return `${secs}с`;
    return `${Math.floor(secs / 60)}м ${secs % 60}с`;
}

function durationMs(run: ImportRunSerialized): number | null {
    if (run.finishedAt == null) return null;
    return run.finishedAt - run.startedAt;
}

const FILTER_LABELS: Record<string, string> = {
    all: 'Все',
    cron: 'Авто',
    manual: 'Ручные',
};

const QUERY_EMPTY_VALUE = '__EMPTY__';

const sortControlClass =
    'rounded-6 bg-mantle p-0.5 transition-colors hover:bg-text/10';

/** Три столбика, выровнены по низу: при смене сортировки плавно меняют высоту. */
const SortBarsIcon = ({ invert }: { invert: boolean }) => {
    const barHeights = invert ? [13, 9, 6] : [6, 9, 13];

    return (
        <span
            aria-hidden
            className="inline-flex h-4 w-4 shrink-0 items-end justify-center gap-px text-current"
        >
            {barHeights.map((height, idx) => (
                <span
                    key={['sort-bar-l', 'sort-bar-m', 'sort-bar-r'][idx]}
                    className="inline-block w-[3px] rounded-sm bg-current transition-[height] duration-200 ease-out"
                    style={{ height }}
                />
            ))}
        </span>
    );
};

/** Воронка; активный фильтр — цвет с родителя (`text-mauve`), без отдельной точки. */
const FilterFunnelIcon = ({ className }: { className?: string }) => (
    <svg
        className={cn('text-current', className)}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
    >
        <path
            d="M6.66667 6H17.3333C17.5101 6 17.6797 6.07024 17.8047 6.19526C17.9298 6.32029 18 6.48986 18 6.66667V7.724C18 7.9008 17.9297 8.07034 17.8047 8.19533L13.5287 12.4713C13.4036 12.5963 13.3334 12.7659 13.3333 12.9427V17.146C13.3333 17.2473 13.3102 17.3473 13.2658 17.4384C13.2213 17.5295 13.1567 17.6092 13.0768 17.6716C12.9969 17.7339 12.9039 17.7772 12.8047 17.7982C12.7056 17.8192 12.603 17.8173 12.5047 17.7927L11.1713 17.4593C11.0272 17.4232 10.8992 17.34 10.8078 17.2228C10.7163 17.1056 10.6667 16.9613 10.6667 16.8127V12.9427C10.6666 12.7659 10.5964 12.5963 10.4713 12.4713L6.19533 8.19533C6.0703 8.07034 6.00004 7.9008 6 7.724V6.66667C6 6.48986 6.07024 6.32029 6.19526 6.19526C6.32029 6.07024 6.48986 6 6.66667 6Z"
            stroke="currentColor"
            strokeWidth="1.35"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

const TableHeaderFilterSelect = ({
    active,
    options,
    selected,
    onChange,
    listClassName,
}: {
    active: boolean;
    options: string[];
    selected: string;
    onChange: (_item: string) => void;
    listClassName?: string;
}) => (
    <Popover className={cn('min-w-0 shrink-0', listClassName)}>
        <PopoverButton
            className={cn(
                sortControlClass,
                'flex items-center justify-center outline-none',
                '!rounded-6 !py-1 !text-11 !leading-none',
                active ? '!text-mauve' : '!text-text',
                'hover:!bg-text hover:!text-base',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mauve/40'
            )}
        >
            <FilterFunnelIcon className="block h-4 w-4 shrink-0" />
            <span className="sr-only">{selected}</span>
        </PopoverButton>
        <PopoverPanel
            portal
            anchor="bottom"
            transition
            className={cn(
                'z-50 mt-2 rounded-6 border-2 border-mauve bg-base p-2 shadow-lg outline-none',
                'min-w-[12rem] max-w-[min(100vw-2rem,24rem)]',
                'transition duration-100 ease-in [--anchor-gap:var(--spacing-1)]',
                'data-[closed]:data-[leave]:opacity-0'
            )}
        >
            {({ close }) => (
                <div className="flex max-h-64 flex-col gap-0.5 overflow-y-auto">
                    {options.map((item) => (
                        <button
                            key={item}
                            type="button"
                            onClick={() => {
                                onChange(item);
                                close();
                            }}
                            className={cn(
                                'rounded-6 px-3 py-1.5 text-left text-14 font-400 leading-5 text-text transition-colors hover:bg-mantle',
                                item === selected && 'bg-mantle font-500'
                            )}
                        >
                            {item}
                        </button>
                    ))}
                </div>
            )}
        </PopoverPanel>
    </Popover>
);

export const ImportsTable = ({
    runs,
    total,
    page,
    totalPages,
    filter,
    sourceChoices,
    queryChoices,
    hasEmptyQuery,
}: {
    runs: ImportRunSerialized[];
    total: number;
    page: number;
    totalPages: number;
    filter: string;
    sourceChoices: string[];
    queryChoices: string[];
    hasEmptyQuery: boolean;
}) => {
    const router = useRouter();
    const setFilter = (f: string) =>
        router.push(`/admin/imports?filter=${f}&page=0`);
    const goToPage = (p: number) =>
        router.push(`/admin/imports?filter=${filter}&page=${p}`);

    const [statusFilter, setStatusFilter] = useState<string>('ALL');
    const [sourceFilter, setSourceFilter] = useState<string>('ALL');
    const [queryFilter, setQueryFilter] = useState<string>('ALL');
    const [sortField, setSortField] = useState<SortField>('startedAt');
    const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

    useEffect(() => {
        setSourceFilter('ALL');
        setQueryFilter('ALL');
        setStatusFilter('ALL');
    }, [filter]);

    const statusOptions = useMemo(
        () =>
            Array.from(new Set(runs.map((run) => run.status))).sort((a, b) =>
                a.localeCompare(b)
            ),
        [runs]
    );

    const statusSelectOptions = useMemo(() => {
        const labels = statusOptions.map((s) => STATUS_LABELS[s] ?? s);
        if (statusFilter !== 'ALL' && !statusOptions.includes(statusFilter)) {
            labels.push(STATUS_LABELS[statusFilter] ?? statusFilter);
        }
        return ['Все статусы', ...labels];
    }, [statusFilter, statusOptions]);

    const statusSelectValue = useMemo(() => {
        if (statusFilter === 'ALL') return 'Все статусы';
        if (!statusOptions.includes(statusFilter)) return 'Все статусы';
        return STATUS_LABELS[statusFilter] ?? statusFilter;
    }, [statusFilter, statusOptions]);

    const sourceSelectOptions = useMemo(() => {
        const rest =
            sourceFilter !== 'ALL' && !sourceChoices.includes(sourceFilter)
                ? [...sourceChoices, sourceFilter]
                : sourceChoices;
        return ['Все источники', ...rest];
    }, [sourceChoices, sourceFilter]);

    const sourceSelectValue = useMemo(
        () => (sourceFilter === 'ALL' ? 'Все источники' : sourceFilter),
        [sourceFilter]
    );

    const querySelectOptions = useMemo(() => {
        const list: string[] = ['Все запросы'];
        if (hasEmptyQuery) list.push('Без запроса');
        list.push(...queryChoices);
        if (
            queryFilter !== 'ALL' &&
            queryFilter !== QUERY_EMPTY_VALUE &&
            !queryChoices.includes(queryFilter)
        ) {
            list.push(queryFilter);
        }
        return list;
    }, [hasEmptyQuery, queryChoices, queryFilter]);

    const querySelectValue = useMemo(() => {
        if (queryFilter === 'ALL') return 'Все запросы';
        if (queryFilter === QUERY_EMPTY_VALUE) {
            return hasEmptyQuery ? 'Без запроса' : 'Все запросы';
        }
        return queryFilter;
    }, [hasEmptyQuery, queryFilter]);

    const rows = useMemo(() => {
        const filtered = runs.filter((run) => {
            if (statusFilter !== 'ALL' && run.status !== statusFilter) {
                return false;
            }
            if (sourceFilter !== 'ALL' && run.source !== sourceFilter) {
                return false;
            }
            if (queryFilter === 'ALL') {
                return true;
            }
            if (queryFilter === QUERY_EMPTY_VALUE) {
                const q = run.query;
                return q == null || q === '';
            }
            return run.query === queryFilter;
        });

        const sorted = [...filtered].sort((a, b) => {
            const dir = sortDirection === 'asc' ? 1 : -1;
            if (sortField === 'itemsFound') {
                return (a.itemsFound - b.itemsFound) * dir;
            }
            if (sortField === 'itemsCreated') {
                return (a.itemsCreated - b.itemsCreated) * dir;
            }
            if (sortField === 'itemsUpdated') {
                return (a.itemsUpdated - b.itemsUpdated) * dir;
            }
            if (sortField === 'status') {
                const left = STATUS_LABELS[a.status] ?? a.status;
                const right = STATUS_LABELS[b.status] ?? b.status;
                return left.localeCompare(right, 'ru') * dir;
            }
            if (sortField === 'triggeredBy') {
                return a.triggeredBy.localeCompare(b.triggeredBy, 'ru') * dir;
            }
            if (sortField === 'source') {
                return a.source.localeCompare(b.source, 'ru') * dir;
            }
            if (sortField === 'query') {
                return (a.query ?? '').localeCompare(b.query ?? '', 'ru') * dir;
            }
            if (sortField === 'duration') {
                const da = durationMs(a);
                const db = durationMs(b);
                if (da == null && db == null) return 0;
                if (da == null) return 1 * dir;
                if (db == null) return -1 * dir;
                return (da - db) * dir;
            }
            return (a.startedAt - b.startedAt) * dir;
        });

        return sorted;
    }, [
        runs,
        sortField,
        sortDirection,
        statusFilter,
        sourceFilter,
        queryFilter,
    ]);

    const setNextSort = (field: SortField) => {
        if (sortField === field) {
            setSortDirection((value) => (value === 'asc' ? 'desc' : 'asc'));
            return;
        }
        setSortField(field);
        setSortDirection('desc');
    };

    const sortInvert = (field: SortField) =>
        sortField === field && sortDirection === 'desc';

    const gridCols =
        'grid-cols-[1.15fr_0.9fr_1fr_1.35fr_0.7fr_0.75fr_0.85fr_0.95fr_0.75fr]';
    const hasStatusFilter = statusFilter !== 'ALL';
    const hasSourceFilter = sourceFilter !== 'ALL';
    const hasQueryFilter = queryFilter !== 'ALL';
    const hasAnyLocalFilter =
        hasStatusFilter || hasSourceFilter || hasQueryFilter;

    const resetLocalFilters = () => {
        setStatusFilter('ALL');
        setSourceFilter('ALL');
        setQueryFilter('ALL');
    };

    const onStatusSelectLabel = (label: string) => {
        if (label === 'Все статусы') {
            setStatusFilter('ALL');
            return;
        }
        const code = statusOptions.find(
            (s) => (STATUS_LABELS[s] ?? s) === label
        );
        if (code != null) setStatusFilter(code);
    };

    const onSourceSelectLabel = (label: string) => {
        setSourceFilter(label === 'Все источники' ? 'ALL' : label);
    };

    const onQuerySelectLabel = (label: string) => {
        if (label === 'Все запросы') setQueryFilter('ALL');
        else if (label === 'Без запроса') setQueryFilter(QUERY_EMPTY_VALUE);
        else setQueryFilter(label);
    };

    let tableSection: ReactNode;
    if (runs.length === 0) {
        tableSection = (
            <p className="px-4 py-10 text-center text-14 text-sub">
                Нет записей
            </p>
        );
    } else if (rows.length === 0) {
        tableSection = (
            <p className="px-4 py-10 text-center text-14 text-sub">
                Нет строк по выбранным фильтрам на этой странице
            </p>
        );
    } else {
        tableSection = (
            <div
                className={cn(
                    'min-h-0 max-h-[min(72vh,calc(100dvh-12.5rem))] overflow-auto overscroll-contain',
                    '[scrollbar-gutter:stable]'
                )}
            >
                <div className="w-max min-w-full">
                    <div
                        className={`sticky top-0 z-20 grid ${gridCols} items-start gap-2 border-b border-surface-tertiary bg-base px-4 py-2.5 text-12 text-sub shadow-sm`}
                    >
                        <div className="flex min-w-0 flex-col items-center gap-1 text-center">
                            <span className="leading-tight">Статус</span>
                            <div className="flex w-full min-w-0 items-center justify-center gap-1">
                                <button
                                    type="button"
                                    onClick={() => setNextSort('status')}
                                    className={sortControlClass}
                                    title="Сортировать по статусу"
                                    aria-label="Сортировать по статусу"
                                >
                                    <SortBarsIcon
                                        invert={sortInvert('status')}
                                    />
                                </button>
                                <TableHeaderFilterSelect
                                    active={hasStatusFilter}
                                    options={statusSelectOptions}
                                    selected={statusSelectValue}
                                    onChange={onStatusSelectLabel}
                                />
                            </div>
                        </div>
                        <div className="flex min-w-0 flex-col items-center gap-1 text-center">
                            <span className="leading-tight">Тип</span>
                            <div className="flex items-center justify-center">
                                <button
                                    type="button"
                                    onClick={() => setNextSort('triggeredBy')}
                                    className={sortControlClass}
                                    title="Сортировать по типу"
                                    aria-label="Сортировать по типу"
                                >
                                    <SortBarsIcon
                                        invert={sortInvert('triggeredBy')}
                                    />
                                </button>
                            </div>
                        </div>
                        <div className="flex min-w-0 flex-col items-center gap-1 text-center">
                            <span className="leading-tight">Источник</span>
                            <div className="flex w-full min-w-0 items-center justify-center gap-1">
                                <button
                                    type="button"
                                    onClick={() => setNextSort('source')}
                                    className={sortControlClass}
                                    title="Сортировать по источнику"
                                    aria-label="Сортировать по источнику"
                                >
                                    <SortBarsIcon
                                        invert={sortInvert('source')}
                                    />
                                </button>
                                <TableHeaderFilterSelect
                                    active={hasSourceFilter}
                                    options={sourceSelectOptions}
                                    selected={sourceSelectValue}
                                    onChange={onSourceSelectLabel}
                                />
                            </div>
                        </div>
                        <div className="flex min-w-0 flex-col items-center gap-1 text-center">
                            <span className="leading-tight">Запрос</span>
                            <div className="flex w-full min-w-0 items-center justify-center gap-1">
                                <button
                                    type="button"
                                    onClick={() => setNextSort('query')}
                                    className={sortControlClass}
                                    title="Сортировать по запросу"
                                    aria-label="Сортировать по запросу"
                                >
                                    <SortBarsIcon
                                        invert={sortInvert('query')}
                                    />
                                </button>
                                <TableHeaderFilterSelect
                                    active={hasQueryFilter}
                                    options={querySelectOptions}
                                    selected={querySelectValue}
                                    onChange={onQuerySelectLabel}
                                />
                            </div>
                        </div>
                        <div className="flex min-w-0 flex-col items-center gap-1 text-center">
                            <span className="leading-tight">Найдено</span>
                            <div className="flex items-center justify-center">
                                <button
                                    type="button"
                                    onClick={() => setNextSort('itemsFound')}
                                    className={sortControlClass}
                                    title="Сортировать по найденным"
                                    aria-label="Сортировать по найденным"
                                >
                                    <SortBarsIcon
                                        invert={sortInvert('itemsFound')}
                                    />
                                </button>
                            </div>
                        </div>
                        <div className="flex min-w-0 flex-col items-center gap-1 text-center">
                            <span className="leading-tight">Создано</span>
                            <div className="flex items-center justify-center">
                                <button
                                    type="button"
                                    onClick={() => setNextSort('itemsCreated')}
                                    className={sortControlClass}
                                    title="Сортировать по созданным"
                                    aria-label="Сортировать по созданным"
                                >
                                    <SortBarsIcon
                                        invert={sortInvert('itemsCreated')}
                                    />
                                </button>
                            </div>
                        </div>
                        <div className="flex min-w-0 flex-col items-center gap-1 text-center">
                            <span className="leading-tight">Обновлено</span>
                            <div className="flex items-center justify-center">
                                <button
                                    type="button"
                                    onClick={() => setNextSort('itemsUpdated')}
                                    className={sortControlClass}
                                    title="Сортировать по обновлённым"
                                    aria-label="Сортировать по обновлённым"
                                >
                                    <SortBarsIcon
                                        invert={sortInvert('itemsUpdated')}
                                    />
                                </button>
                            </div>
                        </div>
                        <div className="flex min-w-0 flex-col items-center gap-1 text-center">
                            <span className="leading-tight">Начало</span>
                            <div className="flex items-center justify-center">
                                <button
                                    type="button"
                                    onClick={() => setNextSort('startedAt')}
                                    className={sortControlClass}
                                    title="Сортировать по времени начала"
                                    aria-label="Сортировать по времени начала"
                                >
                                    <SortBarsIcon
                                        invert={sortInvert('startedAt')}
                                    />
                                </button>
                            </div>
                        </div>
                        <div className="flex min-w-0 flex-col items-center gap-1 text-center">
                            <span className="leading-tight">Время</span>
                            <div className="flex items-center justify-center">
                                <button
                                    type="button"
                                    onClick={() => setNextSort('duration')}
                                    className={sortControlClass}
                                    title="Сортировать по длительности"
                                    aria-label="Сортировать по длительности"
                                >
                                    <SortBarsIcon
                                        invert={sortInvert('duration')}
                                    />
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="divide-y divide-surface-tertiary">
                        {rows.map((run) => (
                            <div
                                key={run.import_run_id}
                                className={`grid ${gridCols} items-center gap-2 px-4 py-2.5 text-12`}
                            >
                                <div className="flex min-w-0 justify-center">
                                    <span
                                        className={`inline-flex w-fit items-center gap-1 rounded-full px-2 py-1 text-11 ${
                                            STATUS_BADGE[run.status] ??
                                            'bg-surface1 text-subtext0'
                                        }`}
                                    >
                                        <span
                                            className={`h-1.5 w-1.5 shrink-0 rounded-full ${STATUS_DOT[run.status] ?? 'bg-overlay1'}`}
                                        />
                                        {STATUS_LABELS[run.status] ??
                                            run.status}
                                    </span>
                                </div>
                                <div className="flex min-w-0 justify-center">
                                    <span
                                        className={`inline-flex w-fit rounded px-1.5 py-0.5 text-11 ${
                                            TYPE_BADGE[run.triggeredBy] ??
                                            TYPE_BADGE.manual
                                        }`}
                                    >
                                        {run.triggeredBy === 'cron'
                                            ? 'авто'
                                            : 'ручной'}
                                    </span>
                                </div>
                                <div className="flex min-w-0 justify-center text-center">
                                    <span
                                        className="text-subtext1 block max-w-full truncate"
                                        title={run.source}
                                    >
                                        {run.source}
                                    </span>
                                </div>
                                <div className="flex min-w-0 justify-center text-center">
                                    <span
                                        className="text-subtext1 block max-w-full truncate"
                                        title={run.query ?? '—'}
                                    >
                                        {run.query ?? '—'}
                                    </span>
                                </div>
                                <div className="text-subtext0 flex min-w-0 justify-center text-center">
                                    {run.itemsFound}
                                </div>
                                <div className="font-medium flex min-w-0 justify-center text-center text-green">
                                    +{run.itemsCreated}
                                </div>
                                <div className="flex min-w-0 justify-center text-center text-blue">
                                    ~{run.itemsUpdated}
                                </div>
                                <div className="text-overlay0 flex min-w-0 justify-center text-center">
                                    {formatDate(run.startedAt)}
                                </div>
                                <div className="text-subtext0 flex min-w-0 justify-center text-center">
                                    {run.finishedAt
                                        ? formatDuration(
                                              run.startedAt,
                                              run.finishedAt
                                          )
                                        : '…'}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="rounded-8 border border-surface-tertiary">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-surface-tertiary px-4 py-3">
                <div className="flex flex-wrap items-center gap-2">
                    <p className="font-medium text-14">
                        Записей:{' '}
                        <span className="font-700 text-text">{total}</span>
                    </p>
                    {hasStatusFilter ? (
                        <span className="rounded-6 bg-mantle px-2 py-0.5 text-11 text-sub">
                            Статус:{' '}
                            {STATUS_LABELS[statusFilter] ?? statusFilter}
                        </span>
                    ) : null}
                    {hasSourceFilter ? (
                        <span className="max-w-[12rem] truncate rounded-6 bg-mantle px-2 py-0.5 text-11 text-sub">
                            Источник: {sourceFilter}
                        </span>
                    ) : null}
                    {hasQueryFilter ? (
                        <span className="max-w-[12rem] truncate rounded-6 bg-mantle px-2 py-0.5 text-11 text-sub">
                            Запрос:{' '}
                            {queryFilter === QUERY_EMPTY_VALUE
                                ? 'Без запроса'
                                : queryFilter}
                        </span>
                    ) : null}
                    {hasAnyLocalFilter ? (
                        <button
                            type="button"
                            onClick={resetLocalFilters}
                            className="rounded-6 border border-surface-tertiary px-2 py-0.5 text-11 text-sub transition-colors hover:border-mauve hover:text-mauve"
                        >
                            Сбросить фильтры
                        </button>
                    ) : null}
                </div>
                <div className="flex gap-0.5 rounded-6 border border-surface-tertiary bg-mantle p-0.5">
                    {(['all', 'manual', 'cron'] as const).map((f) => (
                        <button
                            key={f}
                            type="button"
                            onClick={() => setFilter(f)}
                            className={`rounded-6 px-3 py-1 text-12 transition-colors ${
                                filter === f
                                    ? 'bg-base text-text shadow-sm'
                                    : 'text-sub hover:text-text'
                            }`}
                        >
                            {FILTER_LABELS[f]}
                        </button>
                    ))}
                </div>
            </div>

            {tableSection}

            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 border-t border-surface-tertiary px-4 py-3">
                    <button
                        type="button"
                        disabled={page === 0}
                        onClick={() => goToPage(page - 1)}
                        className="rounded-6 border border-surface-tertiary px-2.5 py-1 text-12 text-sub transition hover:border-mauve hover:text-mauve disabled:opacity-40"
                    >
                        ←
                    </button>
                    <span className="text-subtext0 text-12">
                        {page + 1} / {totalPages}
                    </span>
                    <button
                        type="button"
                        disabled={page >= totalPages - 1}
                        onClick={() => goToPage(page + 1)}
                        className="rounded-6 border border-surface-tertiary px-2.5 py-1 text-12 text-sub transition hover:border-mauve hover:text-mauve disabled:opacity-40"
                    >
                        →
                    </button>
                </div>
            )}
        </div>
    );
};
