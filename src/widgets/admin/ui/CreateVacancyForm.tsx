'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { clientApi } from 'trpc/client';

const inputCls = 'w-full rounded border border-surface1 bg-surface0 px-2.5 py-1.5 text-xs text-text outline-none transition focus:border-mauve';

export const CreateVacancyForm = () => {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [salaryFrom, setSalaryFrom] = useState('');
    const [salaryTo, setSalaryTo] = useState('');

    const mutation = clientApi.admin.createTestVacancy.useMutation({
        onSuccess: () => {
            setOpen(false);
            setTitle('');
            setDescription('');
            setCompanyName('');
            setSalaryFrom('');
            setSalaryTo('');
            router.refresh();
        },
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        mutation.mutate({
            title,
            description,
            companyName,
            salaryFrom: salaryFrom || undefined,
            salaryTo: salaryTo || undefined,
        });
    };

    return (
        <div className="rounded-lg border border-surface0 bg-mantle">
            <div className="flex items-center justify-between px-4 py-3">
                <p className="text-sm font-medium">Создать тестовую вакансию</p>
                <button
                    type="button"
                    onClick={() => setOpen((v) => !v)}
                    className="rounded border border-surface1 px-3 py-1 text-xs text-subtext1 transition hover:border-mauve hover:text-mauve"
                >
                    {open ? 'Свернуть' : '+ Создать'}
                </button>
            </div>

            {open && (
                <form onSubmit={handleSubmit} className="border-t border-surface0 px-4 py-4">
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="mb-1 block text-xs text-subtext0">Название *</label>
                            <input required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Frontend-разработчик" className={inputCls} />
                        </div>
                        <div>
                            <label className="mb-1 block text-xs text-subtext0">Компания *</label>
                            <input required value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="ООО Тест" className={inputCls} />
                        </div>
                        <div>
                            <label className="mb-1 block text-xs text-subtext0">Зарплата от</label>
                            <input type="number" value={salaryFrom} onChange={(e) => setSalaryFrom(e.target.value)} placeholder="100000" className={inputCls} />
                        </div>
                        <div>
                            <label className="mb-1 block text-xs text-subtext0">Зарплата до</label>
                            <input type="number" value={salaryTo} onChange={(e) => setSalaryTo(e.target.value)} placeholder="200000" className={inputCls} />
                        </div>
                        <div className="col-span-2">
                            <label className="mb-1 block text-xs text-subtext0">Описание *</label>
                            <textarea
                                required
                                rows={3}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Описание вакансии..."
                                className={inputCls}
                            />
                        </div>
                    </div>

                    {mutation.isError && (
                        <p className="mt-2 text-xs text-red">{mutation.error.message}</p>
                    )}

                    <div className="mt-3">
                        <button
                            type="submit"
                            disabled={mutation.isPending}
                            className="rounded bg-mauve px-4 py-1.5 text-xs font-semibold text-base transition hover:opacity-90 disabled:opacity-50"
                        >
                            {mutation.isPending ? 'Создание…' : 'Создать вакансию'}
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
};
