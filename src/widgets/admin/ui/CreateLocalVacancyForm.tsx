'use client';

import React, { useEffect, useState } from 'react';
import { Control, FieldValues, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { clientApi } from 'trpc/client';
import { SalaryForm, type Salary } from '~/features/salaryForm';
import { TagsForm } from '~/features/tagsForm';
import { availableFilters as tags } from '~/entities/vacancies/model/data';
import type { Tags } from '~/shared/api/model/tags/type';
import TextInput from '~/shared/ui/TextInput';
import { TextArea } from '~/shared/ui/textArea';
import Button, { ButtonView } from '~/shared/ui/Button';
import { ReactComponent as LoadingSpin } from '~/shared/assets/icons/spin.svg';
import cn from 'classnames';
import { vacancyFormSchema } from '~/widgets/vacancyForm/model/schema';

const adminVacancySchema = vacancyFormSchema.extend({
    companyName: z.string().min(1, 'Введите название компании'),
});

type FormValues = {
    title: string;
    description: string;
    companyName: string;
    salaryFrom: string;
    salaryTo: string;
    [key: string]: string | boolean;
};

const emptyInitialValues: FormValues = {
    title: '',
    description: '',
    companyName: '',
    salaryFrom: '',
    salaryTo: '',
    ...Object.fromEntries(
        tags.flatMap((tagGroup) =>
            tagGroup.value.map((tag) => [tag.name, false]),
        ),
    ),
};

export const CreateLocalVacancyForm = () => {
    const router = useRouter();
    const [open, setOpen] = useState(false);

    const { data: currencies } = clientApi.currency.getAllCurrencies.useQuery();

    const [selectedSalaryType, setSelectedSalaryType] = useState<Salary>({
        name: 'fromTo',
        displayValue: 'указать "от" и "до"',
    });

    const [selectedCurrency, setSelectedCurrency] = useState<{
        title: string;
        currency_id?: string;
        char: string;
    }>({ title: 'RUB', char: '₽' });

    const {
        control,
        handleSubmit,
        formState: { isDirty, isValid },
        reset,
    } = useForm({
        resolver: zodResolver(adminVacancySchema),
        defaultValues: emptyInitialValues,
    });

    const mutation = clientApi.admin.createTestVacancy.useMutation({
        onSuccess: () => {
            reset(emptyInitialValues);
            router.refresh();
        },
    });

    useEffect(() => {
        if (currencies) {
            const rub = currencies.find((c) => c.title === 'RUB') ?? { title: 'RUB', char: '₽' };
            setSelectedCurrency(rub);
        }
    }, [currencies]);

    const onSubmit = (data: FormValues) => {
        const defaultTags: Tags = {
            workSchedule: [],
            employmentTypes: [],
            experience: [],
            education: [],
        };

        const selectedTags = tags.reduce(
            (acc, tagGroup) => {
                const selectedValues = tagGroup.value
                    .filter((tag) => data[tag.name] === true)
                    .map((tag) => tag.localTitle);
                acc[tagGroup.name as keyof Tags] = selectedValues;
                return acc;
            },
            { ...defaultTags } as Record<keyof typeof defaultTags, string[]>,
        ) as Tags;

        mutation.mutate({
            title: data.title,
            description: data.description,
            companyName: data.companyName,
            salaryFrom:
                selectedSalaryType.name !== 'notSpecified' && data.salaryFrom
                    ? data.salaryFrom
                    : undefined,
            salaryTo:
                selectedSalaryType.name === 'fromTo' && data.salaryTo
                    ? data.salaryTo
                    : undefined,
            currencyName: selectedCurrency.currency_id
                ? selectedCurrency.title
                : undefined,
            tags: selectedTags,
        });
    };

    return (
        <div className="rounded-8 border border-surface-tertiary">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3">
                <div>
                    <p className="text-13 font-500">
                        Создать локальную вакансию
                        <span className="ml-2 rounded-6 bg-green/10 px-1.5 py-0.5 text-11 text-green">
                            local · вручную
                        </span>
                    </p>
                    {mutation.isSuccess && (
                        <p className="mt-0.5 text-12 text-green">Вакансия создана</p>
                    )}
                    {mutation.isError && (
                        <p className="mt-0.5 text-12 text-red">{mutation.error.message}</p>
                    )}
                </div>
                <button
                    type="button"
                    onClick={() => setOpen((v) => !v)}
                    className="rounded-6 border border-surface-tertiary px-3 py-1 text-12 text-sub transition hover:border-green hover:text-green"
                >
                    {open ? 'Свернуть' : '+ Создать'}
                </button>
            </div>

            {open && (
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex flex-col gap-y-12 border-t border-surface-tertiary px-8 py-8"
                >
                    {/* Основное */}
                    <div className="flex flex-col gap-y-8">
                        <p className="text-18 text-text">Основная информация</p>
                        <div className="grid grid-cols-2 gap-x-6">
                            <TextInput
                                wrapperClassName="!max-w-full"
                                className="!max-w-full"
                                placeholder="Название вакансии..."
                                name="title"
                                control={control as unknown as Control<FieldValues>}
                            />
                            <TextInput
                                wrapperClassName="!max-w-full"
                                className="!max-w-full"
                                placeholder="Название компании..."
                                name="companyName"
                                control={control as unknown as Control<FieldValues>}
                            />
                        </div>
                        <TextArea
                            label="Описание вакансии..."
                            name="description"
                            control={control as unknown as Control<FieldValues>}
                            textAreaClassName={cn(
                                'resize-y max-h-88 min-h-52 w-full !max-w-full',
                            )}
                        />
                    </div>

                    {/* Зарплата */}
                    <SalaryForm
                        control={control as unknown as Control<FieldValues>}
                        salaryFromName="salaryFrom"
                        salaryToName="salaryTo"
                        selectedType={selectedSalaryType}
                        setSelectedType={setSelectedSalaryType}
                        selectedCurrency={selectedCurrency}
                        setSelectedCurrency={setSelectedCurrency}
                        currencies={currencies}
                    />

                    {/* Теги */}
                    <TagsForm control={control as unknown as Control<FieldValues>} />

                    {/* Кнопки */}
                    <div className="flex w-full flex-row justify-end gap-x-2">
                        <Button
                            disabled={mutation.isPending || !isValid}
                            className={cn(
                                'min-w-28 bg-mauve text-base hover:bg-text disabled:bg-mantle',
                                mutation.isPending && 'cursor-progress',
                            )}
                            type="submit"
                            buttonView={ButtonView.LARGE}
                        >
                            {mutation.isPending ? (
                                <LoadingSpin className="animate-spin fill-text" />
                            ) : (
                                'Создать вакансию'
                            )}
                        </Button>
                        <Button
                            onClick={() => reset(emptyInitialValues)}
                            disabled={!isDirty}
                            className="w-28 bg-red text-base hover:bg-text disabled:bg-mantle"
                            buttonView={ButtonView.LARGE}
                        >
                            Сбросить
                        </Button>
                    </div>
                </form>
            )}
        </div>
    );
};
