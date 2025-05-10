'use client';

import Select from '~/shared/ui/Select';
import React, { useEffect, useState } from 'react';
import { Control, FieldValues, useForm } from 'react-hook-form';
import { CONSTANTS } from '~/shared/lib/strings';
import { TextArea } from '~/shared/ui/textArea';
import TextInput from '~/shared/ui/TextInput';
import { clientApi } from 'trpc/client';
import { Salary, SalaryForm } from '~/features/salaryForm';
import { Currency } from '~/features/salaryForm/ui/SalaryForm';
import { TagsForm } from '~/features/tagsForm';

export interface VacancyFormProps {}

export const VacancyForm: React.FC<VacancyFormProps> = (props) => {
    const { control } = useForm({
        defaultValues: {
            title: '',
            description: '',
            salaryFrom: '',
            salaryTo: '',
        },
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

    useEffect(() => {
        if (currencies) {
            const currencyToSet = currencies.find((c) => c.title === 'RUB') ?? {
                title: 'RUB',
                char: '₽',
            };

            setSelectedCurrency(currencyToSet);
        }
    }, [currencies]);

    return (
        <form className={'max-h- flex w-full flex-col gap-y-8'}>
            <div className={'flex w-full flex-col gap-y-4'}>
                <p className={'text-18 text-text'}>
                    {CONSTANTS.vacancy.blocks.main}
                </p>
                <TextInput
                    wrapperClassName={'max-w-full'}
                    className={'max-w-full'}
                    placeholder={'Название вакансии...'}
                    name={'title'}
                    control={control as unknown as Control<FieldValues>}
                />
                <TextArea
                    label={'Описание вакансии...'}
                    name={'description'}
                    control={control as unknown as Control<FieldValues>}
                    textAreaClassName={
                        'resize-y max-h-88 min-h-52 w-full max-w-full'
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
        </form>
    );
};
