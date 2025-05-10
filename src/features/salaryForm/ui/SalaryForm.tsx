'use client';

import cn from 'classnames';
import React, { useEffect, useState } from 'react';
import Select from '~/shared/ui/Select';
import { Control, FieldValues } from 'react-hook-form';
import { CONSTANTS } from '~/shared/lib/strings';
import TextInput from '~/shared/ui/TextInput';
import { clientApi } from 'trpc/client';
import {
    displaySalariesState,
    salaries,
    Salary,
    salaryType,
    SalaryType,
} from '../model/state';

export interface Currency {
    title: string;
    currency_id?: string;
    char: string;
}

export interface SalaryFormProps {
    control: Control<FieldValues>;
    salaryFromName: string;
    salaryToName: string;

    selectedType: Salary;
    setSelectedType: (type: Salary) => void;
    selectedCurrency: Currency;
    setSelectedCurrency: (currency: Currency) => void;
    currencies: Currency[] | undefined;
}

export const SalaryForm: React.FC<SalaryFormProps> = (props) => {
    const {
        control,
        salaryFromName,
        salaryToName,
        selectedType,
        setSelectedType,
        selectedCurrency,
        setSelectedCurrency,
        currencies,
    } = props;

    const handleSetSelectedType = (value: string) => {
        setSelectedType(
            salaries.find((el) => el.displayValue === value) ?? {
                name: 'fromTo',
                displayValue: 'указать "от" и "до"',
            }
        );
    };

    const handleSetSelectedCurrency = (value: string) => {
        setSelectedCurrency(
            currencies?.find((currency) => currency.char === value) ?? {
                title: 'RUB',
                char: '₽',
            }
        );
    };

    return (
        <div className={'flex w-full flex-col gap-y-4'}>
            <div className={'flex w-1/2 flex-row justify-start gap-x-4'}>
                <p className={'w-fit text-18 text-text'}>
                    {CONSTANTS.vacancy.blocks.salary}
                </p>
                {/* TODO: move to variables */}
                <Select
                    className={'!max-w-[14.5rem] gap-x-2'}
                    selected={
                        selectedType?.displayValue ?? 'Указать "от" и "до"'
                    }
                    setSelected={handleSetSelectedType}
                    state={displaySalariesState}
                />
            </div>
            {selectedType.displayValue !== salaryType.notSpecified && (
                <div className={'flex w-1/2 flex-row items-center gap-x-2'}>
                    <span className={'text-14'}>
                        {CONSTANTS.vacancy.salary.from}
                    </span>
                    <TextInput
                        wrapperClassName={cn(
                            selectedType.displayValue === salaryType.onlyFrom
                                ? 'max-w-full'
                                : 'max-w-1/2'
                        )}
                        className={'max-w-full'}
                        name={salaryFromName}
                        control={control}
                        placeholder={''}
                    />
                    {selectedType.displayValue !== salaryType.onlyFrom && (
                        <>
                            <span className={'text-14'}>
                                {CONSTANTS.vacancy.salary.to}
                            </span>
                            <TextInput
                                wrapperClassName={'max-w-1/2'}
                                className={'max-w-full'}
                                name={salaryToName}
                                control={control}
                                placeholder={''}
                            />
                        </>
                    )}
                    {currencies && (
                        <Select
                            className={'!w-1/6'}
                            state={currencies.map((currency) => currency.char)}
                            selected={selectedCurrency.char}
                            setSelected={handleSetSelectedCurrency}
                        />
                    )}
                </div>
            )}
        </div>
    );
};
