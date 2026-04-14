'use client';

import { useState, useMemo, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import type { InputSyncFromHHSchema } from '~/shared/api/schema/external-vacancy';
import { clientApi } from 'trpc/client';

const HH_AREAS: [string, string][] = [
    ['', 'Все регионы'],
    ['113', 'Россия'],
    ['1', 'Москва'],
    ['2', 'Санкт-Петербург'],
    ['3', 'Екатеринбург'],
    ['4', 'Новосибирск'],
    ['88', 'Казань'],
];

const HH_EXPERIENCE = [
    { value: '', label: 'Любой опыт' },
    { value: 'noExperience', label: 'Без опыта' },
    { value: 'between1And3', label: '1–3 года' },
    { value: 'between3And6', label: '3–6 лет' },
    { value: 'moreThan6', label: '> 6 лет' },
] as const;

const HH_EMPLOYMENT = [
    { value: '', label: 'Любая' },
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

type Preset = {
    label: string;
    text: string;
    area?: string;
    experience?: string;
    employment?: string;
    schedule?: string;
    maxPages?: number;
};

const HH_PRESETS: Preset[] = [
    { label: 'Frontend', text: 'frontend разработчик', area: '113', schedule: 'remote' },
    { label: 'Backend', text: 'backend разработчик', area: '113' },
    { label: 'Python', text: 'python разработчик', area: '113' },
    { label: 'Fullstack', text: 'fullstack разработчик', area: '113' },
    { label: 'DevOps', text: 'devops инженер', area: '113' },
    { label: 'Data Science', text: 'data scientist аналитик', area: '113' },
    { label: 'Без опыта · IT', text: 'разработчик', area: '113', experience: 'noExperience' },
    { label: 'Remote · Москва', text: 'разработчик', area: '1', schedule: 'remote' },
];

const IT_CATEGORY_KEYWORD = 'информационные технологии';

export const HHSyncPanel = () => {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [text, setText] = useState('');
    const [area, setArea] = useState('');
    const [experience, setExperience] = useState('');
    const [employment, setEmployment] = useState('');
    const [schedule, setSchedule] = useState('');
    const [maxPages, setMaxPages] = useState(3);
    const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
    const [roleSearch, setRoleSearch] = useState('');

    const rolesQuery = clientApi.vacancySync.getProfessionalRoles.useQuery(undefined, {
        staleTime: 1000 * 60 * 30,
    });

    const syncMutation = clientApi.vacancySync.syncFromHH.useMutation({
        onSuccess: () => router.refresh(),
    });
    const cancelSyncMutation = clientApi.vacancySync.cancelRunningHHSync.useMutation({
        onSuccess: () => router.refresh(),
    });

    const filteredRoles = useMemo(() => {
        const all = rolesQuery.data ?? [];
        const q = roleSearch.trim().toLowerCase();
        if (!q) return all;
        return all.filter((r) => r.name.toLowerCase().includes(q));
    }, [rolesQuery.data, roleSearch]);

    const itRoles = useMemo(
        () =>
            (rolesQuery.data ?? []).filter((r) =>
                r.name.toLowerCase().includes(IT_CATEGORY_KEYWORD),
            ),
        [rolesQuery.data],
    );

    const selectedRoleNames = useMemo(
        () =>
            Object.fromEntries(
                (rolesQuery.data ?? [])
                    .filter((role) => selectedRoles.includes(role.id))
                    .map((role) => [role.id, role.name]),
            ),
        [rolesQuery.data, selectedRoles],
    );

    const toggleRole = (id: string) =>
        setSelectedRoles((prev) =>
            prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id],
        );

    const applyPreset = (p: Preset) => {
        setText(p.text);
        setArea(p.area ?? '');
        setExperience(p.experience ?? '');
        setEmployment(p.employment ?? '');
        setSchedule(p.schedule ?? '');
        setMaxPages(p.maxPages ?? 3);
    };

    const handleSync = (e: FormEvent) => {
        e.preventDefault();
        syncMutation.mutate({
            text: text.trim() || undefined,
            area: area || undefined,
            experience: (experience || undefined) as InputSyncFromHHSchema['experience'],
            employment: (employment || undefined) as InputSyncFromHHSchema['employment'],
            schedule: (schedule || undefined) as InputSyncFromHHSchema['schedule'],
            professionalRoles: selectedRoles.length > 0 ? selectedRoles : undefined,
            maxPages,
        });
    };

    const inputCls =
        'rounded-6 border border-surface-tertiary bg-base px-2.5 py-1.5 text-12 text-text outline-none transition focus:border-mauve';
    const selectCls = `${inputCls} cursor-pointer`;

    return (
        <div className="rounded-8 border border-surface-tertiary">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3">
                <div>
                    <p className="text-13 font-500">
                        Синхронизация с HH.ru
                        <span className="ml-2 rounded-6 bg-mauve/10 px-1.5 py-0.5 text-11 text-mauve">
                            API · токен
                        </span>
                    </p>
                    {syncMutation.isSuccess && syncMutation.data && (
                        <p className="mt-0.5 text-12 text-green">
                            Найдено {syncMutation.data.totalFound} · создано +{syncMutation.data.totalCreated} · обновлено ~{syncMutation.data.totalUpdated}
                        </p>
                    )}
                    {syncMutation.isError && (
                        <p className="mt-0.5 text-12 text-red">{syncMutation.error.message}</p>
                    )}
                </div>
                <button
                    type="button"
                    onClick={() => setOpen((v) => !v)}
                    className="rounded-6 border border-surface-tertiary px-3 py-1 text-12 text-sub transition hover:border-mauve hover:text-mauve"
                >
                    {open ? 'Свернуть' : 'Настроить'}
                </button>
            </div>

            {open && (
                <div className="border-t border-surface-tertiary px-4 py-4">
                    {/* Presets */}
                    <div className="mb-4">
                        <p className="mb-2 text-11 font-500 uppercase tracking-wider text-overlay0">
                            Пресеты
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                            {HH_PRESETS.map((p) => (
                                <button
                                    key={p.label}
                                    type="button"
                                    onClick={() => applyPreset(p)}
                                    className="rounded-6 border border-surface-tertiary px-2.5 py-1 text-12 text-subtext1 transition hover:border-mauve hover:bg-mauve/5 hover:text-mauve"
                                >
                                    {p.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <form onSubmit={handleSync}>
                        <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                            {/* Left column */}
                            <div className="flex flex-col gap-3">
                                <div>
                                    <label className="mb-1 block text-12 text-sub">
                                        Поисковый запрос
                                    </label>
                                    <input
                                        type="text"
                                        value={text}
                                        onChange={(e) => setText(e.target.value)}
                                        placeholder="Frontend разработчик, аналитик…"
                                        className={`w-full ${inputCls}`}
                                    />
                                    <p className="mt-1 text-11 text-overlay0">
                                        Используйте ключевые слова из названия должности
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <label className="mb-1 block text-12 text-sub">Регион</label>
                                        <select
                                            value={area}
                                            onChange={(e) => setArea(e.target.value)}
                                            className={`w-full ${selectCls}`}
                                        >
                                            {HH_AREAS.map(([v, l]) => (
                                                <option key={v} value={v}>{l}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="mb-1 block text-12 text-sub">Опыт работы</label>
                                        <select
                                            value={experience}
                                            onChange={(e) => setExperience(e.target.value)}
                                            className={`w-full ${selectCls}`}
                                        >
                                            {HH_EXPERIENCE.map((o) => (
                                                <option key={o.value} value={o.value}>{o.label}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="mb-1 block text-12 text-sub">Занятость</label>
                                        <select
                                            value={employment}
                                            onChange={(e) => setEmployment(e.target.value)}
                                            className={`w-full ${selectCls}`}
                                        >
                                            {HH_EMPLOYMENT.map((o) => (
                                                <option key={o.value} value={o.value}>{o.label}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="mb-1 block text-12 text-sub">График</label>
                                        <select
                                            value={schedule}
                                            onChange={(e) => setSchedule(e.target.value)}
                                            className={`w-full ${selectCls}`}
                                        >
                                            {HH_SCHEDULE.map((o) => (
                                                <option key={o.value} value={o.value}>{o.label}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="flex items-end gap-4">
                                    <div>
                                        <label className="mb-1 block text-12 text-sub">
                                            Страниц
                                        </label>
                                        <input
                                            type="number"
                                            min={1}
                                            max={20}
                                            value={maxPages}
                                            onChange={(e) => setMaxPages(Number(e.target.value))}
                                            className={`w-20 ${inputCls}`}
                                        />
                                        <p className="mt-1 text-11 text-overlay0">≈{maxPages * 100} вакансий</p>
                                    </div>

                                    <div className="flex gap-2 pb-0.5">
                                        <button
                                            type="submit"
                                            disabled={syncMutation.isPending}
                                            className="rounded-6 bg-mauve px-4 py-1.5 text-12 font-600 text-base transition hover:opacity-90 disabled:opacity-50"
                                        >
                                            {syncMutation.isPending ? 'Синхронизация…' : 'Запустить'}
                                        </button>
                                        {syncMutation.isPending && (
                                            <button
                                                type="button"
                                                onClick={() => cancelSyncMutation.mutate()}
                                                disabled={cancelSyncMutation.isPending}
                                                className="rounded-6 border border-red/50 px-4 py-1.5 text-12 font-600 text-red transition hover:bg-red/10 disabled:opacity-50"
                                            >
                                                {cancelSyncMutation.isPending ? 'Отменяем…' : 'Отменить'}
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {cancelSyncMutation.isSuccess && syncMutation.isPending && (
                                    <p className="text-12 text-sub">
                                        Запрос на отмену отправлен. Синхронизация остановится в ближайшее время.
                                    </p>
                                )}
                            </div>

                            {/* Right column — professional roles */}
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center justify-between">
                                    <label className="text-12 text-sub">
                                        Профессиональные роли
                                        {rolesQuery.isLoading && (
                                            <span className="ml-1 text-overlay0">(загрузка…)</span>
                                        )}
                                    </label>
                                    <div className="flex gap-1">
                                        {itRoles.length > 0 && (
                                            <button
                                                type="button"
                                                onClick={() => setSelectedRoles(itRoles.map((r) => r.id))}
                                                className="rounded-6 border border-blue/30 bg-blue/10 px-2 py-0.5 text-11 text-blue transition hover:bg-blue/20"
                                            >
                                                IT ({itRoles.length})
                                            </button>
                                        )}
                                        {selectedRoles.length > 0 && (
                                            <button
                                                type="button"
                                                onClick={() => setSelectedRoles([])}
                                                className="rounded-6 border border-surface-tertiary px-2 py-0.5 text-11 text-sub transition hover:text-red"
                                            >
                                                Сбросить
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {selectedRoles.length > 0 && (
                                    <div className="flex max-h-12 flex-wrap gap-1 overflow-y-auto">
                                        {selectedRoles.slice(0, 8).map((id) => (
                                            <span
                                                key={id}
                                                className="inline-flex items-center gap-1 rounded-6 bg-mauve/10 px-1.5 py-0.5 text-11 text-mauve"
                                            >
                                                {selectedRoleNames[id]?.split(' (')[0] ?? id}
                                                <button
                                                    type="button"
                                                    onClick={() => toggleRole(id)}
                                                    className="hover:text-red"
                                                >
                                                    ×
                                                </button>
                                            </span>
                                        ))}
                                        {selectedRoles.length > 8 && (
                                            <span className="text-11 text-sub">
                                                +{selectedRoles.length - 8}
                                            </span>
                                        )}
                                    </div>
                                )}

                                {rolesQuery.data && (
                                    <>
                                        <input
                                            type="text"
                                            value={roleSearch}
                                            onChange={(e) => setRoleSearch(e.target.value)}
                                            placeholder="Поиск роли…"
                                            className={`w-full ${inputCls}`}
                                        />
                                        <div
                                            className="flex-1 overflow-y-auto rounded-6 border border-surface-tertiary bg-mantle"
                                            style={{ maxHeight: 172 }}
                                        >
                                            {filteredRoles.length === 0 ? (
                                                <p className="px-3 py-2 text-12 text-sub">Ничего не найдено</p>
                                            ) : (
                                                filteredRoles.slice(0, 150).map((role) => (
                                                    <label
                                                        key={role.id}
                                                        className="flex cursor-pointer items-center gap-2 px-2.5 py-1 text-12 transition hover:bg-surface0/50"
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedRoles.includes(role.id)}
                                                            onChange={() => toggleRole(role.id)}
                                                            className="accent-mauve"
                                                        />
                                                        <span className="text-subtext1">{role.name}</span>
                                                    </label>
                                                ))
                                            )}
                                            {filteredRoles.length > 150 && (
                                                <p className="px-2.5 py-1 text-11 text-overlay0">
                                                    Показано 150 из {filteredRoles.length} — уточните запрос
                                                </p>
                                            )}
                                        </div>
                                        <p className="text-11 text-overlay0">
                                            Роли ограничивают поиск конкретными профессиями HH.ru
                                        </p>
                                    </>
                                )}
                            </div>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};
