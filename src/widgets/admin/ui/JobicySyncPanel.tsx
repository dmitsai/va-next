'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { clientApi } from 'trpc/client';
import { JOBICY_GEO } from '~/server/services/vacancy-sync';

type Preset = { label: string; text: string; area?: string; count?: number };

const J_PRESETS: Preset[] = [
    { label: 'Developer', text: 'developer', count: 50 },
    { label: 'Designer', text: 'designer', count: 50 },
    { label: 'Marketing', text: 'marketing', count: 50 },
    { label: 'Data / AI', text: 'data', count: 50 },
    { label: 'DevOps', text: 'devops', count: 50 },
    { label: 'Product', text: 'product manager', count: 50 },
];

export const JobicySyncPanel = () => {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [text, setText] = useState('');
    const [area, setArea] = useState('');
    const [count, setCount] = useState(50);

    const syncMutation = clientApi.vacancySync.syncFromJobicy.useMutation({
        onSuccess: () => router.refresh(),
    });

    const applyPreset = (p: Preset) => {
        setText(p.text);
        if (p.area !== undefined) setArea(p.area);
        if (p.count !== undefined) setCount(p.count);
    };

    const handleSync = (e: FormEvent) => {
        e.preventDefault();
        syncMutation.mutate({
            text: text.trim() || undefined,
            area: area || undefined,
            count,
        });
    };

    const inputCls =
        'rounded-6 border border-surface-tertiary bg-base px-2.5 py-1.5 text-12 text-text outline-none transition focus:border-blue';
    const selectCls = `${inputCls} cursor-pointer`;

    return (
        <div className="rounded-8 border border-surface-tertiary">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3">
                <div>
                    <p className="text-13 font-500">
                        Синхронизация с Jobicy
                        <span className="ml-2 rounded-6 bg-blue/10 px-1.5 py-0.5 text-11 text-blue">
                            Remote · без токена
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
                    className="rounded-6 border border-surface-tertiary px-3 py-1 text-12 text-sub transition hover:border-blue hover:text-blue"
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
                            {J_PRESETS.map((p) => (
                                <button
                                    key={p.label}
                                    type="button"
                                    onClick={() => applyPreset(p)}
                                    className="rounded-6 border border-surface-tertiary px-2.5 py-1 text-12 text-subtext1 transition hover:border-blue hover:bg-blue/5 hover:text-blue"
                                >
                                    {p.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <form onSubmit={handleSync}>
                        <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                            {/* Left */}
                            <div className="flex flex-col gap-3">
                                <div>
                                    <label className="mb-1 block text-12 text-sub">
                                        Тег / поисковый запрос
                                    </label>
                                    <input
                                        type="text"
                                        value={text}
                                        onChange={(e) => setText(e.target.value)}
                                        placeholder="developer, designer, marketing…"
                                        className={`w-full ${inputCls}`}
                                    />
                                    <p className="mt-1 text-11 text-overlay0">
                                        Поиск по тегам вакансий на Jobicy (en)
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <label className="mb-1 block text-12 text-sub">География</label>
                                        <select
                                            value={area}
                                            onChange={(e) => setArea(e.target.value)}
                                            className={`w-full ${selectCls}`}
                                        >
                                            {JOBICY_GEO.map(([v, l]) => (
                                                <option key={v} value={v}>{l}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="mb-1 block text-12 text-sub">Количество</label>
                                        <input
                                            type="number"
                                            min={1}
                                            max={50}
                                            value={count}
                                            onChange={(e) => setCount(Number(e.target.value))}
                                            className={`w-full ${inputCls}`}
                                        />
                                        <p className="mt-1 text-11 text-overlay0">макс. 50</p>
                                    </div>
                                </div>
                            </div>

                            {/* Right — about + action */}
                            <div className="flex flex-col justify-between gap-3">
                                <div className="rounded-6 border border-surface-tertiary bg-mantle px-3 py-3">
                                    <p className="mb-1 text-12 font-500 text-subtext1">О платформе</p>
                                    <ul className="flex flex-col gap-1 text-12 text-sub">
                                        <li>· Международная remote-доска вакансий</li>
                                        <li>· Бесплатный API, без ключа</li>
                                        <li>· Только удалённые вакансии</li>
                                        <li>· Вакансии на английском языке</li>
                                    </ul>
                                </div>

                                <div className="flex items-center gap-2">
                                    <button
                                        type="submit"
                                        disabled={syncMutation.isPending}
                                        className="rounded-6 bg-blue px-4 py-1.5 text-12 font-600 text-base transition hover:opacity-90 disabled:opacity-50"
                                    >
                                        {syncMutation.isPending ? 'Синхронизация…' : 'Запустить'}
                                    </button>
                                    {syncMutation.isPending && (
                                        <span className="text-12 text-sub">Идёт загрузка данных…</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};
