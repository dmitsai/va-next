'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { clientApi } from 'trpc/client';
import { REMOTIVE_CATEGORIES } from '~/server/services/vacancy-sync';

type Preset = { label: string; text?: string; category?: string; limit?: number };

const R_PRESETS: Preset[] = [
    { label: 'Software Dev', category: 'software-dev', limit: 100 },
    { label: 'Frontend', text: 'frontend', category: 'frontend', limit: 100 },
    { label: 'Backend', text: 'backend', category: 'backend', limit: 100 },
    { label: 'DevOps', category: 'devops-sysadmin', limit: 100 },
    { label: 'Data / AI', category: 'data', limit: 100 },
    { label: 'Design', category: 'design', limit: 100 },
    { label: 'QA', category: 'qa', limit: 100 },
    { label: 'Product', category: 'product', limit: 100 },
];

export const RemotiveSyncPanel = () => {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [text, setText] = useState('');
    const [category, setCategory] = useState('');
    const [limit, setLimit] = useState(100);

    const syncMutation = clientApi.vacancySync.syncFromRemotive.useMutation({
        onSuccess: () => router.refresh(),
    });

    const applyPreset = (p: Preset) => {
        if (p.text !== undefined) setText(p.text);
        if (p.category !== undefined) setCategory(p.category);
        if (p.limit !== undefined) setLimit(p.limit);
    };

    const handleSync = (e: FormEvent) => {
        e.preventDefault();
        syncMutation.mutate({
            text: text.trim() || undefined,
            category: category || undefined,
            limit,
        });
    };

    const inputCls =
        'rounded-6 border border-surface-tertiary bg-base px-2.5 py-1.5 text-12 text-text outline-none transition focus:border-teal';
    const selectCls = `${inputCls} cursor-pointer`;

    return (
        <div className="rounded-8 border border-surface-tertiary">
            <div className="flex items-center justify-between px-4 py-3">
                <div>
                    <p className="text-13 font-500">
                        Синхронизация с Remotive
                        <span className="ml-2 rounded-6 bg-teal/10 px-1.5 py-0.5 text-11 text-teal">
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
                    className="rounded-6 border border-surface-tertiary px-3 py-1 text-12 text-sub transition hover:border-teal hover:text-teal"
                >
                    {open ? 'Свернуть' : 'Настроить'}
                </button>
            </div>

            {open && (
                <div className="border-t border-surface-tertiary px-4 py-4">
                    <div className="mb-4">
                        <p className="mb-2 text-11 font-500 uppercase tracking-wider text-overlay0">
                            Пресеты
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                            {R_PRESETS.map((p) => (
                                <button
                                    key={p.label}
                                    type="button"
                                    onClick={() => applyPreset(p)}
                                    className="rounded-6 border border-surface-tertiary px-2.5 py-1 text-12 text-subtext1 transition hover:border-teal hover:bg-teal/5 hover:text-teal"
                                >
                                    {p.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <form onSubmit={handleSync}>
                        <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                            <div className="flex flex-col gap-3">
                                <div>
                                    <label className="mb-1 block text-12 text-sub">
                                        Поисковый запрос
                                    </label>
                                    <input
                                        type="text"
                                        value={text}
                                        onChange={(e) => setText(e.target.value)}
                                        placeholder="frontend, react, python…"
                                        className={`w-full ${inputCls}`}
                                    />
                                    <p className="mt-1 text-11 text-overlay0">
                                        Поиск по ключевым словам (en)
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <label className="mb-1 block text-12 text-sub">Категория</label>
                                        <select
                                            value={category}
                                            onChange={(e) => setCategory(e.target.value)}
                                            className={`w-full ${selectCls}`}
                                        >
                                            {REMOTIVE_CATEGORIES.map(([v, l]) => (
                                                <option key={v} value={v}>{l}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="mb-1 block text-12 text-sub">Количество</label>
                                        <input
                                            type="number"
                                            min={1}
                                            max={100}
                                            value={limit}
                                            onChange={(e) => setLimit(Number(e.target.value))}
                                            className={`w-full ${inputCls}`}
                                        />
                                        <p className="mt-1 text-11 text-overlay0">макс. 100</p>
                                    </div>
                                </div>
                            </div>

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
                                        className="rounded-6 bg-teal px-4 py-1.5 text-12 font-600 text-base transition hover:opacity-90 disabled:opacity-50"
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
