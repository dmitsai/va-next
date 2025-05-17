'use client';

import React, { useEffect, useState } from 'react';
import { Control, FieldValues, useForm } from 'react-hook-form';
import { CONSTANTS } from '~/shared/lib/strings';
import { TextArea } from '~/shared/ui/textArea';
import TextInput from '~/shared/ui/TextInput';
import { clientApi } from 'trpc/client';
import { Salary, SalaryForm } from '~/features/salaryForm';
import { TagsForm } from '~/features/tagsForm';
import { availableFilters as tags } from '~/entities/vacancies/model/data';
import Button, { ButtonView } from '~/shared/ui/Button';
import { zodResolver } from '@hookform/resolvers/zod';
import { Tags } from '~/shared/api/model/tags/type';
import { ReactComponent as LoadingSpin } from '~/shared/assets/icons/spin.svg';
import cn from 'classnames';
import { vacancyFormSchema } from '../model/schema';
import { parseSalary } from '../model/utils';

export interface VacancyFormProps {
    title?: string;
    description?: string;
    salaryFrom?: string;
    salaryTo?: string;
    initialTags?: Tags | null;
    vacancyId?: string;

    mode: 'edit' | 'create';
}

type FormValues = {
    title: string;
    description: string;
    salaryFrom: string;
    salaryTo: string;

    [key: string]: string | boolean; // NOTE: TEMP SOLUTION
};

export const VacancyForm: React.FC<VacancyFormProps> = (props) => {
    const {
        title,
        description,
        salaryFrom,
        salaryTo,
        initialTags,
        vacancyId,
        mode,
    } = props;
    const {
        mutate: createVacancy,
        isPending: isCreatingPending,
        isSuccess: isCreatingSuccess,
        isError: isCreatingError,
    } = clientApi.vacancy.createVacancy.useMutation();
    const {
        mutate: updateVacancy,
        isPending: isUpdatingPending,
        isSuccess: isUpdatingSuccess,
        isError: isUpdatingError,
        isIdle: isUpdatingIdle,
    } = clientApi.vacancy.updateVacancy.useMutation();

    const initialValues = {
        title: title ?? '',
        description: description ?? '',
        salaryFrom: salaryFrom ?? '',
        salaryTo: salaryTo ?? '',
        ...Object.fromEntries(
            tags.flatMap((tagGroup) =>
                tagGroup.value.map((tag) => [
                    tag.name,
                    initialTags?.[tagGroup.name as keyof Tags]?.includes(
                        // FIXME: temp solition
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-expect-error
                        tag.localTitle
                    ) ?? false,
                ])
            )
        ),
    };

    const {
        control,
        handleSubmit,
        formState: { isDirty, isValid },
        reset,
    } = useForm({
        resolver: zodResolver(vacancyFormSchema),
        defaultValues: initialValues,
    });

    const { data: currencies } = clientApi.currency.getAllCurrencies.useQuery();

    const [selectedSalartType, setSelectedSalaryType] = useState<Salary>({
        name: 'fromTo',
        displayValue: 'указать "от" и "до"',
    });

    const [selectedCurrency, setSelectedCurrency] = useState<{
        title: string;
        currency_id?: string;
        char: string;
    }>({
        title: 'RUB',
        char: '₽',
    });

    const onSubmit = (data: FormValues) => {
        const salary = {
            from:
                selectedSalartType.name === 'notSpecified'
                    ? null
                    : parseSalary(data.salaryFrom),
            to:
                selectedSalartType.name === 'fromTo'
                    ? parseSalary(data.salaryTo)
                    : null,
            currencyName: selectedCurrency.currency_id
                ? selectedCurrency.title
                : null,
        };

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
            { ...defaultTags } as Record<keyof typeof defaultTags, string[]>
        ) as Tags;

        const vacancy = {
            title: data.title,
            description: data.description,
            salaryFrom: salary.from,
            salaryTo: salary.to,
            currencyName: salary.currencyName,
            tags: selectedTags,
        };

        // eslint-disable-next-line no-unused-expressions, @typescript-eslint/no-unused-expressions
        mode === 'create' && createVacancy(vacancy);
        // eslint-disable-next-line no-unused-expressions, @typescript-eslint/no-unused-expressions
        mode === 'edit' && updateVacancy({ vacancy_id: vacancyId, ...vacancy });
    };

    useEffect(() => {
        if (currencies) {
            const currencyToSet = currencies.find((c) => c.title === 'RUB') ?? {
                title: 'RUB',
                char: '₽',
            };

            setSelectedCurrency(currencyToSet);
        }
    }, [currencies]);

    useEffect(() => {
        if (isCreatingSuccess) {
            reset(initialValues);
        }
    }, [isCreatingSuccess]);

    return (
        <form
            className={'flex w-full flex-col gap-y-12'}
            onSubmit={handleSubmit(onSubmit)}
        >
            <div className={'flex w-full flex-col gap-y-8'}>
                <p className={'text-18 text-text'}>
                    {CONSTANTS.vacancy.blocks.main}
                </p>
                <TextInput
                    wrapperClassName={'!max-w-full'}
                    className={'!max-w-full'}
                    placeholder={'Название вакансии...'}
                    name={'title'}
                    control={control as unknown as Control<FieldValues>}
                />
                <TextArea
                    label={'Описание вакансии...'}
                    name={'description'}
                    control={control as unknown as Control<FieldValues>}
                    textAreaClassName={
                        'resize-y max-h-88 min-h-52 w-full !max-w-full'
                    }
                />
            </div>
            <SalaryForm
                control={control as unknown as Control<FieldValues>}
                salaryFromName={'salaryFrom'}
                salaryToName={'salaryTo'}
                selectedType={selectedSalartType}
                setSelectedType={setSelectedSalaryType}
                selectedCurrency={selectedCurrency}
                setSelectedCurrency={setSelectedCurrency}
                currencies={currencies}
            />
            <TagsForm control={control as unknown as Control<FieldValues>} />
            <div className={'flex w-full flex-row justify-end gap-x-2'}>
                <Button
                    disabled={
                        isCreatingPending || isUpdatingPending || !isValid
                    }
                    className={cn(
                        'min-w-28 bg-mauve text-base hover:bg-text disabled:bg-mantle',
                        (isCreatingPending || isUpdatingPending) &&
                            'cursor-progress'
                    )}
                    type={'submit'}
                    buttonView={ButtonView.LARGE}
                >
                    {isCreatingPending || isUpdatingPending ? (
                        <LoadingSpin className={'animate-spin fill-text'} />
                    ) : (
                        CONSTANTS.vacancy.btn.save(mode)
                    )}
                </Button>
                <Button
                    onClick={() => {
                        reset(initialValues);
                    }}
                    disabled={!isDirty}
                    className={
                        'w-28 bg-red text-base hover:bg-text disabled:bg-mantle'
                    }
                    buttonView={ButtonView.LARGE}
                >
                    {CONSTANTS.vacancy.btn.cancel}
                </Button>
            </div>
        </form>
    );
};
