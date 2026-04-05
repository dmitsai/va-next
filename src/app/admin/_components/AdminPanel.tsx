'use client';

import type { ImportRun } from '@prisma/client';
import { signOut } from 'next-auth/react';
import { useState, useMemo, type FormEvent } from 'react';
import type { InputSyncFromHHSchema } from '~/shared/api/schema/external-vacancy';
import { clientApi } from 'trpc/client';

const HH_AREAS: Record<string, string> = {
    '': 'Все регионы',
    '113': 'Россия',
    '1': 'Москва',
    '2': 'Санкт-Петербург',
    '3': 'Екатеринбург',
    '4': 'Новосибирск',
    '88': 'Казань',
    '66': 'Нижний Новгород',
    '104': 'Краснодар',
};

const HH_EXPERIENCE = [
    { value: '', label: 'Любой' },
    { value: 'noExperience', label: 'Нет опыта' },
    { value: 'between1And3', label: 'От 1 до 3 лет' },
    { value: 'between3And6', label: 'От 3 до 6 лет' },
    { value: 'moreThan6', label: 'Более 6 лет' },
] as const;

const HH_EMPLOYMENT = [
    { value: '', label: 'Любой' },
    { value: 'full', label: 'Полная' },
    { value: 'part', label: 'Частичная' },
    { value: 'project', label: 'Проектная' },
    { value: 'probation', label: 'Стажировка' },
] as const;

const HH_SCHEDULE = [
    { value: '', label: 'Любой' },
    { value: 'fullDay', label: 'Полный день' },
    { value: 'shift', label: 'Сменный' },
    { value: 'flexible', label: 'Гибкий' },
    { value: 'remote', label: 'Удалённо' },
] as const;

const StatusBadge = ({ status }: { status: string }) => {
    const styles: Record<string, string> = {
        COMPLETED: 'bg-green/10 text-green',
        FAILED: 'bg-red/10 text-red',
        RUNNING: 'bg-yellow/10 text-yellow',
    };
    const labels: Record<string, string> = {
        COMPLETED: 'Готово',
        FAILED: 'Ошибка',
        RUNNING: 'В процессе',
    };

    return (
        <span
            className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${styles[status] ?? ''}`}
        >
            {labels[status] ?? status}
        </span>
    );
};

const formatDate = (date: Date | string): string => {
    const d = new Date(date);
    return d.toLocaleString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
    });
};

const formatDuration = (start: Date | string, end: Date | string): string => {
    const ms = new Date(end).getTime() - new Date(start).getTime();
    if (ms < 1000) return `${ms}мс`;
    const secs = Math.round(ms / 1000);
    if (secs < 60) return `${secs}с`;
    const mins = Math.floor(secs / 60);
    const remainSecs = secs % 60;
    return `${mins}м ${remainSecs}с`;
};

export const AdminPanel = ({ userEmail }: { userEmail: string }) => {
    const [text, setText] = useState('');
    const [area, setArea] = useState('');
    const [experience, setExperience] = useState('');
    const [employment, setEmployment] = useState('');
    const [schedule, setSchedule] = useState('');
    const [maxPages, setMaxPages] = useState(5);
    const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
    const [roleSearch, setRoleSearch] = useState('');

    const rolesQuery =
        clientApi.vacancySync.getProfessionalRoles.useQuery(undefined, {
            staleTime: 1000 * 60 * 30,
        });

    const importRunsQuery = clientApi.vacancySync.getImportRuns.useQuery();

    const syncMutation = clientApi.vacancySync.syncFromHH.useMutation({
        onSuccess: () => {
            void importRunsQuery.refetch();
        },
    });

    const filteredRoles = useMemo(() => {
        if (!rolesQuery.data) return [];
        if (!roleSearch.trim()) return rolesQuery.data;
        const q = roleSearch.toLowerCase();
        return rolesQuery.data.filter((r) =>
            r.name.toLowerCase().includes(q),
        );
    }, [rolesQuery.data, roleSearch]);

    const selectedRoleNames = useMemo(() => {
        if (!rolesQuery.data) return {};
        return rolesQuery.data.reduce<Record<string, string>>((map, r) => {
            if (!selectedRoles.includes(r.id)) return map;
            return { ...map, [r.id]: r.name };
        }, {});
    }, [rolesQuery.data, selectedRoles]);

    const toggleRole = (id: string) => {
        setSelectedRoles((prev) =>
            prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id],
        );
    };

    const handleSync = (e: FormEvent) => {
        e.preventDefault();

        const experienceParam: InputSyncFromHHSchema['experience'] =
            experience === ''
                ? undefined
                : (experience as NonNullable<
                      InputSyncFromHHSchema['experience']
                  >);

        const employmentParam: InputSyncFromHHSchema['employment'] =
            employment === ''
                ? undefined
                : (employment as NonNullable<
                      InputSyncFromHHSchema['employment']
                  >);

        const scheduleParam: InputSyncFromHHSchema['schedule'] =
            schedule === ''
                ? undefined
                : (schedule as NonNullable<InputSyncFromHHSchema['schedule']>);

        syncMutation.mutate({
            text: text.trim() || undefined,
            area: area || undefined,
            experience: experienceParam,
            employment: employmentParam,
            schedule: scheduleParam,
            professionalRoles:
                selectedRoles.length > 0 ? selectedRoles : undefined,
            maxPages,
        });
    };

    return (
        <div className="flex flex-col gap-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h2>Админ-панель</h2>
                <div className="flex items-center gap-4">
                    <span className="small text-subtext0">{userEmail}</span>
                    <button
                        type="button"
                        onClick={() => signOut({ callbackUrl: '/admin' })}
                        className="small rounded-md border border-surface1 px-3 py-1 text-subtext0 transition hover:border-red hover:text-red"
                    >
                        Выйти
                    </button>
                </div>
            </div>

            {/* Sync form */}
            <section className="rounded-10 border border-surface0 bg-mantle p-6">
                <h3 className="mb-4">Синхронизация с hh.ru</h3>
                <form onSubmit={handleSync} className="flex flex-col gap-4">
                    <label className="flex flex-col gap-1">
                        <span className="small text-subtext0">
                            Поисковый запрос (необязательно)
                        </span>
                        <input
                            type="text"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            placeholder="Frontend разработчик"
                            className="rounded-md border border-surface1 bg-surface0 px-3 py-2 text-text outline-none transition focus:border-mauve"
                        />
                    </label>

                    {/* Professional roles multi-select */}
                    <div className="flex flex-col gap-1">
                        <span className="small text-subtext0">
                            Профессиональные роли
                            {rolesQuery.isLoading && ' (загрузка...)'}
                        </span>

                        {selectedRoles.length > 0 && (
                            <div className="mb-1 flex flex-wrap gap-1">
                                {selectedRoles.map((id) => (
                                    <span
                                        key={id}
                                        className="inline-flex items-center gap-1 rounded-full bg-mauve/15 px-2 py-0.5 text-xs text-mauve"
                                    >
                                        {selectedRoleNames[id] ?? id}
                                        <button
                                            type="button"
                                            onClick={() => toggleRole(id)}
                                            className="ml-0.5 hover:text-red"
                                        >
                                            &times;
                                        </button>
                                    </span>
                                ))}
                                <button
                                    type="button"
                                    onClick={() => setSelectedRoles([])}
                                    className="text-xs text-subtext0 hover:text-red"
                                >
                                    Очистить все
                                </button>
                            </div>
                        )}

                        {rolesQuery.data && (
                            <>
                                <input
                                    type="text"
                                    value={roleSearch}
                                    onChange={(e) =>
                                        setRoleSearch(e.target.value)
                                    }
                                    placeholder="Поиск ролей..."
                                    className="rounded-md border border-surface1 bg-surface0 px-3 py-2 text-sm text-text outline-none transition focus:border-mauve"
                                />
                                <div className="mt-1 max-h-48 overflow-y-auto rounded-md border border-surface1 bg-surface0">
                                    {filteredRoles.length === 0 && (
                                        <p className="px-3 py-2 text-sm text-subtext0">
                                            Ничего не найдено
                                        </p>
                                    )}
                                    {filteredRoles.slice(0, 100).map((role) => (
                                        <label
                                            key={role.id}
                                            className="flex cursor-pointer items-center gap-2 px-3 py-1.5 text-sm transition hover:bg-surface1/50"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={selectedRoles.includes(
                                                    role.id,
                                                )}
                                                onChange={() =>
                                                    toggleRole(role.id)
                                                }
                                                className="accent-mauve"
                                            />
                                            <span className="text-text">
                                                {role.name}
                                            </span>
                                        </label>
                                    ))}
                                    {filteredRoles.length > 100 && (
                                        <p className="px-3 py-2 text-xs text-subtext0">
                                            Показано 100 из{' '}
                                            {filteredRoles.length}. Уточните
                                            поиск.
                                        </p>
                                    )}
                                </div>
                            </>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <label className="flex flex-col gap-1">
                            <span className="small text-subtext0">Регион</span>
                            <select
                                value={area}
                                onChange={(e) => setArea(e.target.value)}
                                className="rounded-md border border-surface1 bg-surface0 px-3 py-2 text-text outline-none transition focus:border-mauve"
                            >
                                {Object.entries(HH_AREAS).map(([v, l]) => (
                                    <option key={v} value={v}>
                                        {l}
                                    </option>
                                ))}
                            </select>
                        </label>

                        <label className="flex flex-col gap-1">
                            <span className="small text-subtext0">Опыт</span>
                            <select
                                value={experience}
                                onChange={(e) => setExperience(e.target.value)}
                                className="rounded-md border border-surface1 bg-surface0 px-3 py-2 text-text outline-none transition focus:border-mauve"
                            >
                                {HH_EXPERIENCE.map((o) => (
                                    <option key={o.value} value={o.value}>
                                        {o.label}
                                    </option>
                                ))}
                            </select>
                        </label>

                        <label className="flex flex-col gap-1">
                            <span className="small text-subtext0">
                                Занятость
                            </span>
                            <select
                                value={employment}
                                onChange={(e) => setEmployment(e.target.value)}
                                className="rounded-md border border-surface1 bg-surface0 px-3 py-2 text-text outline-none transition focus:border-mauve"
                            >
                                {HH_EMPLOYMENT.map((o) => (
                                    <option key={o.value} value={o.value}>
                                        {o.label}
                                    </option>
                                ))}
                            </select>
                        </label>

                        <label className="flex flex-col gap-1">
                            <span className="small text-subtext0">График</span>
                            <select
                                value={schedule}
                                onChange={(e) => setSchedule(e.target.value)}
                                className="rounded-md border border-surface1 bg-surface0 px-3 py-2 text-text outline-none transition focus:border-mauve"
                            >
                                {HH_SCHEDULE.map((o) => (
                                    <option key={o.value} value={o.value}>
                                        {o.label}
                                    </option>
                                ))}
                            </select>
                        </label>
                    </div>

                    <label className="flex flex-col gap-1">
                        <span className="small text-subtext0">
                            Макс. страниц (1 стр. = до 100 вакансий)
                        </span>
                        <input
                            type="number"
                            min={1}
                            max={20}
                            value={maxPages}
                            onChange={(e) =>
                                setMaxPages(Number(e.target.value))
                            }
                            className="w-24 rounded-md border border-surface1 bg-surface0 px-3 py-2 text-text outline-none transition focus:border-mauve"
                        />
                    </label>

                    <button
                        type="submit"
                        disabled={syncMutation.isPending}
                        className="self-start rounded-md bg-mauve px-6 py-2 font-semibold text-base transition hover:opacity-90 disabled:opacity-50"
                    >
                        {syncMutation.isPending
                            ? 'Синхронизация...'
                            : 'Запустить синхронизацию'}
                    </button>

                    {syncMutation.isSuccess && syncMutation.data && (
                        <div className="rounded-md bg-green/10 px-4 py-3 text-sm text-green">
                            Готово! Найдено: {syncMutation.data.totalFound},
                            создано: {syncMutation.data.totalCreated},
                            обновлено: {syncMutation.data.totalUpdated}
                        </div>
                    )}

                    {syncMutation.isError && (
                        <div className="rounded-md bg-red/10 px-4 py-3 text-sm text-red">
                            Ошибка: {syncMutation.error.message}
                        </div>
                    )}
                </form>
            </section>

            {/* Import runs */}
            <section className="rounded-10 border border-surface0 bg-mantle p-6">
                <div className="mb-4 flex items-center justify-between">
                    <h3>История импортов</h3>
                    <button
                        type="button"
                        onClick={() => {
                            void importRunsQuery.refetch();
                        }}
                        className="small rounded-md border border-surface1 px-3 py-1 text-subtext0 transition hover:border-mauve hover:text-mauve"
                    >
                        Обновить
                    </button>
                </div>

                {importRunsQuery.isLoading && (
                    <p className="text-subtext0">Загрузка...</p>
                )}

                {importRunsQuery.data?.length === 0 && (
                    <p className="text-subtext0">Импортов пока нет</p>
                )}

                {(importRunsQuery.data?.length ?? 0) > 0 && (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-surface1 text-left text-subtext0">
                                    <th className="px-2 py-2">Статус</th>
                                    <th className="px-2 py-2">Источник</th>
                                    <th className="px-2 py-2">Запрос</th>
                                    <th className="px-2 py-2">Найдено</th>
                                    <th className="px-2 py-2">Создано</th>
                                    <th className="px-2 py-2">Обновлено</th>
                                    <th className="px-2 py-2">Начало</th>
                                    <th className="px-2 py-2">
                                        Длительность
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {importRunsQuery.data?.map((run: ImportRun) => (
                                    <tr
                                        key={run.import_run_id}
                                        className="border-b border-surface0 transition hover:bg-surface0/50"
                                    >
                                        <td className="px-2 py-2">
                                            <StatusBadge
                                                status={run.status}
                                            />
                                        </td>
                                        <td className="px-2 py-2">
                                            {run.source}
                                        </td>
                                        <td className="max-w-[200px] truncate px-2 py-2">
                                            {run.query ?? '—'}
                                        </td>
                                        <td className="px-2 py-2">
                                            {run.itemsFound}
                                        </td>
                                        <td className="px-2 py-2">
                                            {run.itemsCreated}
                                        </td>
                                        <td className="px-2 py-2">
                                            {run.itemsUpdated}
                                        </td>
                                        <td className="px-2 py-2 text-subtext0">
                                            {formatDate(run.startedAt)}
                                        </td>
                                        <td className="px-2 py-2 text-subtext0">
                                            {run.finishedAt
                                                ? formatDuration(
                                                      run.startedAt,
                                                      run.finishedAt,
                                                  )
                                                : '...'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>
        </div>
    );
};
