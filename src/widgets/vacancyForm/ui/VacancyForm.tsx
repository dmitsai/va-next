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
import { availableFilters as tags } from '~/entities/vacancies/model/data';
import Button, { ButtonView } from '~/shared/ui/Button';
import { zodResolver } from '@hookform/resolvers/zod';
import { vacancyFormSchema } from '../model/schema';

export interface VacancyFormProps {}


type FormValues = {

    title: string;
    description: string;
    salaryFrom: string;
    salaryTo: string;

    [key: string]: string | boolean; // NOTE: TEMP SOLUTION
  };

export const VacancyForm: React.FC<VacancyFormProps> = (props) => {


    const { control, handleSubmit} = useForm({
        resolver: zodResolver(vacancyFormSchema),
        defaultValues: {
            title: '',
            description: '',
            salaryFrom: '',
            salaryTo: '',
            ...tags.reduce((acc, tagGroup) => {
                tagGroup.value.forEach((tag) => {
                  acc[tag.name] = false; 
                });
                return acc;
              }, {} as Record<string, boolean>),
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

    const onSubmit = (data: FormValues) => {
        const selectedTags = tags.reduce((acc, tagGroup) => {
          const selectedValues = tagGroup.value
            .filter((tag) => data[tag.name] === true)
            .map((tag) => tag.name);
          
          if (selectedValues.length > 0) {
            acc[tagGroup.name] = selectedValues;
          }
          return acc;
        }, {} as Record<string, string[]>);
    
        console.log("Данные формы:", {
          ...data,
          tags: selectedTags, 
        });
    
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

    return (
        <form className={'max-h- flex w-full flex-col gap-y-12'} onSubmit={handleSubmit(onSubmit)}>
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
                <div className={'flex flex-row w-full justify-end gap-x-2'}>               
                    <Button className={'bg-mauve text-base hover:bg-text'} type={'submit'} buttonView={ButtonView.LARGE}>{CONSTANTS.vacancy.btn.save.create}</Button>
                    <Button className={'bg-red text-base hover:bg-text'} buttonView={ButtonView.LARGE}>{CONSTANTS.vacancy.btn.cancel}</Button>
                </div>
        </form>
    );
};
