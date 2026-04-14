'use client';

import { useRouter } from 'next/navigation';
import { useState, useMemo, type FormEvent } from 'react';
import cn from 'classnames';
import { clientApi } from 'trpc/client';

type Vacancy = {
    vacancy_id: string;
    title: string;
    companyName: string | null;
    salaryFrom: number | null;
    salaryTo: number | null;
    published_at: Date;
    location: { name: string } | null;
    currency: { char: string } | null;
    _count: { Application: number };
};

type SortField = 'title' | 'company' | 'salary' | 'location' | 'applications' | 'date';
type SortDir = 'asc' | 'desc';

const sortControlClass =
    'rounded-6 bg-mantle p-0.5 transition-colors hover:bg-text/10';

const SortBarsIcon = ({ invert }: { invert: boolean }) => {
    const barHeights = invert ? [13, 9, 6] : [6, 9, 13];
    return (
        <span
            aria-hidden
            className="inline-flex h-4 w-4 shrink-0 items-end justify-center gap-px text-current"
        >
            {barHeights.map((height, idx) => (
                <span
                    key={idx}
                    className="inline-block w-[3px] rounded-sm bg-current transition-[height] duration-200 ease-out"
                    style={{ height }}
                />
            ))}
        </span>
    );
};

const gridCols = 'grid-cols-[2fr_1.2fr_1fr_0.8fr_0.4fr_0.55fr_auto]';

const ColHeader = ({
    label,
    field,
    sortField,
    sortDir,
    onSort,
    className,
}: {
    label: string;
    field: SortField;
    sortField: SortField;
    sortDir: SortDir;
    onSort: (_f: SortField) => void;
    className?: string;
}) => (
    <div className={cn('flex min-w-0 flex-col items-start gap-1', className)}>
        <span className="leading-tight">{label}</span>
        <button
            type="button"
            onClick={() => onSort(field)}
            className={sortControlClass}
            aria-label={`Сортировать по ${label}`}
        >
            <SortBarsIcon invert={sortField === field && sortDir === 'desc'} />
        </button>
    </div>
);

export const VacancyTable = ({
    vacancies,
    total,
    page,
    pageSize,
    platformSlug,
    search,
}: {
    vacancies: Vacancy[];
    total: number;
    page: number;
    pageSize: number;
    platformSlug: string;
    search: string;
}) => {
    const router = useRouter();
    const [searchInput, setSearchInput] = useState(search);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [sortField, setSortField] = useState<SortField>('date');
    const [sortDir, setSortDir] = useState<SortDir>('desc');

    const deleteMutation = clientApi.admin.deleteVacancy.useMutation({
        onSuccess: () => router.refresh(),
        onSettled: () => setDeletingId(null),
    });

    const handleSearch = (e: FormEvent) => {
        e.preventDefault();
        const params = new URLSearchParams();
        if (searchInput) params.set('q', searchInput);
        params.set('page', '0');
        router.push(`/admin/vacancies/${platformSlug}?${params.toString()}`);
    };

    const goToPage = (p: number) => {
        const params = new URLSearchParams();
        if (search) params.set('q', search);
        params.set('page', String(p));
        router.push(`/admin/vacancies/${platformSlug}?${params.toString()}`);
    };

    const setNextSort = (field: SortField) => {
        if (sortField === field) {
            setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
        } else {
            setSortField(field);
            setSortDir('desc');
        }
    };

    const rows = useMemo(() =>
        [...vacancies].sort((a, b) => {
            const dir = sortDir === 'asc' ? 1 : -1;
            if (sortField === 'title') return a.title.localeCompare(b.title, 'ru') * dir;
            if (sortField === 'company')
                return (a.companyName ?? '').localeCompare(b.companyName ?? '', 'ru') * dir;
            if (sortField === 'location')
                return (a.location?.name ?? '').localeCompare(b.location?.name ?? '', 'ru') * dir;
            if (sortField === 'applications')
                return (a._count.Application - b._count.Application) * dir;
            if (sortField === 'salary') {
                const sa = a.salaryFrom ?? a.salaryTo ?? 0;
                const sb = b.salaryFrom ?? b.salaryTo ?? 0;
                return (sa - sb) * dir;
            }
            return (new Date(a.published_at).getTime() - new Date(b.published_at).getTime()) * dir;
        }),
    [vacancies, sortField, sortDir]);

    const totalPages = Math.ceil(total / pageSize);

    return (
        <div className="rounded-8 border border-surface-tertiary">
            {/* Toolbar */}
            <div className="flex items-center justify-between gap-3 border-b border-surface-tertiary px-4 py-2.5">
                <p className="text-12 text-sub">
                    <span className="font-700 text-text">{total.toLocaleString('ru-RU')}</span>
                    {' '}вакансий
                </p>
                <form onSubmit={handleSearch} className="flex gap-1.5">
                    <input
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        placeholder="Поиск по названию…"
                        className="w-52 rounded-6 border border-surface-tertiary bg-mantle px-2.5 py-1 text-12 text-text outline-none transition focus:border-mauve"
                    />
                    <button
                        type="submit"
                        className="rounded-6 border border-surface-tertiary px-2.5 py-1 text-12 text-sub transition hover:border-mauve hover:text-mauve"
                    >
                        Найти
                    </button>
                    {search && (
                        <button
                            type="button"
                            onClick={() => {
                                setSearchInput('');
                                router.push(`/admin/vacancies/${platformSlug}`);
                            }}
                            className="rounded-6 border border-surface-tertiary px-2.5 py-1 text-12 text-sub transition hover:border-red hover:text-red"
                        >
                            ✕
                        </button>
                    )}
                </form>
            </div>

            {vacancies.length === 0 ? (
                <p className="py-10 text-center text-12 text-sub">Вакансий нет</p>
            ) : (
                <div
                    className="min-h-0 overflow-auto overscroll-contain [scrollbar-gutter:stable]"
                    style={{ maxHeight: 'min(74vh, calc(100dvh - 22rem))' }}
                >
                    <div className="w-max min-w-full">
                        {/* Sticky header */}
                        <div
                            className={`sticky top-0 z-20 grid ${gridCols} items-start gap-2 border-b border-surface-tertiary bg-base px-4 py-2.5 text-12 text-sub shadow-sm`}
                        >
                            <ColHeader label="Название" field="title" sortField={sortField} sortDir={sortDir} onSort={setNextSort} />
                            <ColHeader label="Компания" field="company" sortField={sortField} sortDir={sortDir} onSort={setNextSort} />
                            <ColHeader label="Зарплата" field="salary" sortField={sortField} sortDir={sortDir} onSort={setNextSort} />
                            <ColHeader label="Регион" field="location" sortField={sortField} sortDir={sortDir} onSort={setNextSort} />
                            <ColHeader label="Отклики" field="applications" sortField={sortField} sortDir={sortDir} onSort={setNextSort} className="items-center" />
                            <ColHeader label="Дата" field="date" sortField={sortField} sortDir={sortDir} onSort={setNextSort} />
                            <div />
                        </div>

                        {/* Rows */}
                        <div className="divide-y divide-surface-tertiary">
                            {rows.map((v) => {
                                const apps = v._count.Application;
                                const salary =
                                    v.salaryFrom || v.salaryTo
                                        ? `${v.salaryFrom?.toLocaleString('ru-RU') ?? ''}${v.salaryTo ? `–${v.salaryTo.toLocaleString('ru-RU')}` : '+'} ${v.currency?.char ?? ''}`
                                        : '—';

                                return (
                                    <div
                                        key={v.vacancy_id}
                                        className={`grid ${gridCols} items-center gap-2 px-4 py-2 text-12 transition-colors hover:bg-surface0/30`}
                                    >
                                        <span className="block max-w-[220px] truncate font-500 text-text" title={v.title}>
                                            {v.title}
                                        </span>
                                        <span className="block max-w-[150px] truncate text-subtext1" title={v.companyName ?? undefined}>
                                            {v.companyName ?? '—'}
                                        </span>
                                        <span className="whitespace-nowrap text-subtext1">
                                            {salary}
                                        </span>
                                        <span className="text-subtext1">
                                            {v.location?.name ?? '—'}
                                        </span>
                                        <div className="flex justify-center">
                                            {apps > 0 ? (
                                                <span className="rounded-full bg-green/10 px-1.5 py-0.5 text-11 font-500 text-green">
                                                    {apps}
                                                </span>
                                            ) : (
                                                <span className="text-11 text-overlay0">0</span>
                                            )}
                                        </div>
                                        <span className="text-11 text-overlay0">
                                            {new Date(v.published_at).toLocaleDateString('ru-RU', {
                                                day: '2-digit',
                                                month: '2-digit',
                                            })}
                                        </span>
                                        <button
                                            type="button"
                                            disabled={deletingId === v.vacancy_id}
                                            onClick={() => {
                                                setDeletingId(v.vacancy_id);
                                                deleteMutation.mutate({ vacancyId: v.vacancy_id });
                                            }}
                                            className="rounded-6 px-1.5 py-0.5 text-11 text-sub transition hover:bg-red/10 hover:text-red disabled:opacity-40"
                                        >
                                            {deletingId === v.vacancy_id ? '…' : 'Удалить'}
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}

            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 border-t border-surface-tertiary px-4 py-2.5">
                    <button
                        type="button"
                        disabled={page === 0}
                        onClick={() => goToPage(page - 1)}
                        className="rounded-6 border border-surface-tertiary px-2.5 py-1 text-12 text-sub transition hover:border-mauve hover:text-mauve disabled:opacity-40"
                    >
                        ←
                    </button>
                    <span className="text-12 text-sub">{page + 1} / {totalPages}</span>
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
