'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { Popup, PopupProps } from '~/shared/ui/Popup';
import cn from 'classnames';
import { Control, FieldValues, useForm } from 'react-hook-form';
import TextInput from '~/shared/ui/TextInput';
import {
    employmentTypes,
    salaryCurrency,
    SalaryCurrency,
    workSchedule,
} from '~/entities/preferences';
import Select from '~/shared/ui/Select';
import Button, { ButtonView } from '~/shared/ui/Button';
import { useQueryStates, parseAsString, parseAsArrayOf } from 'nuqs';
import { ReactComponent as ClearIcon } from '~/shared/assets/icons/icon-clear.svg';
import { ReactComponent as SearchIcon } from '~/shared/assets/icons/search-icon.svg';
import { usePathname, useRouter } from 'next/navigation';
import { clientApi } from 'trpc/client';
import { experience } from '~/shared/api/model/tags/data';
import { useVacancyFilter } from '~/entities/vacancies/model/hook';
import { zodResolver } from '@hookform/resolvers/zod';
import { RegionInput } from './RegionInput';
import { Filter } from './Filter';
import {
    FilterItemValue,
    Filters,
    Periods,
    RegionItem,
    Regions,
} from '../model/types';
import { filterMenuSchema } from '../model/schema';

export interface FilterMenyForm {
    salaryFrom: string;
}

export interface FilterMenuProps
    extends Omit<PopupProps, 'title' | 'children'> {
    filters: Filters;
    regions: Regions;
    periods: Periods;
}
export interface QueryParams {
    filters?: string[];
    regions?: string[];
    salary?: string;
    currency?: SalaryCurrency;
    vacanciesDate?: string;
}

export const FilterMenu: React.FC<FilterMenuProps> = (props) => {
    const router = useRouter();
    const pathname = usePathname();

    const { filters, regions, periods, setIsOpen, ...other } = props;
    const {
        removeAllFilters,
        getFilters,
        getSalary,
        getCurrencyName,
        getPeriod,
        updateAllFilters,
    } = useVacancyFilter();

    const initialFilters = getFilters();
    const { salaryFrom: initialSalaryFrom } = getSalary();
    const { period: initialPeriod } = getPeriod();
    const { currencyName: initialCurrencyName } = getCurrencyName();

    const { control, handleSubmit, reset } = useForm<FilterMenyForm>({
        resolver: zodResolver(filterMenuSchema),
        defaultValues: {
            salaryFrom: initialSalaryFrom ? initialSalaryFrom : '',
        },
    });

    const [selectedFilters, setSelectedFilters] = useState(initialFilters);

    const { data: currencies } = clientApi.currency.getAllCurrencies.useQuery();

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
            const currencyToSet = initialCurrencyName
                ? (currencies.find((c) => c.title === initialCurrencyName) ?? {
                      title: 'RUB',
                      char: '₽',
                  })
                : {
                      title: 'RUB',
                      char: '₽',
                  };
            setSelectedCurrency(currencyToSet);
        }
    }, [currencies, initialCurrencyName]);

    const handleFilterChange = (filter: string, value: FilterItemValue[]) => {
        setSelectedFilters({
            ...selectedFilters,
            [filter]: value,
        });
    };

    const [selectedRegions, setSelectedRegions] = useState<Regions>([]);

    const handleSetRegion = (region: RegionItem | undefined) => {
        if (region) {
            setSelectedRegions((prev) =>
                prev.includes(region) ? prev : [...prev, region]
            );
        }
    };

    const handleRemoveRegion = (region: RegionItem) => {
        setSelectedRegions((prev) => prev.filter((el) => el !== region));
    };

    const [selectedVacanciesDate, setSelectedVacanciesDate] = useState(
        periods.find((p) => p.name === initialPeriod?.name) ?? periods.at(-1)
    );

    const handleResetFilters = () => {
        const filtersToRemove: Record<string, string[]> = {};

        Object.entries(selectedFilters).forEach(([key, value]) => {
            filtersToRemove[key] = value.map((el) => el.name);
        });
        setSelectedFilters(
            Object.fromEntries(
                filters.map((filter) => [filter.name, [] as FilterItemValue[]])
            )
        );
        setSelectedCurrency({
            title: 'RUB',
            char: '₽',
        });
        reset();
        setSelectedRegions([]);
        setSelectedVacanciesDate(periods.at(-1));

        removeAllFilters();
    };

    const onSubmit = (data: FilterMenyForm) => {
        const filtersToSet: Record<string, string[]> = {};

        Object.entries(selectedFilters).forEach(([key, value]) => {
            filtersToSet[key] = value.map((el) => el.name);
        });

        const salary = data.salaryFrom
            .split('')
            .filter((e) => e.trim().length)
            .join('');

        const regionsToSet =
            selectedRegions.length > 0
                ? selectedRegions.filter((region) =>
                      selectedRegions.some((r) => r.name === 'all')
                          ? region.name === 'all'
                          : true
                  )
                : [];
        const currencyName = selectedCurrency?.title;
        updateAllFilters({
            filters: filtersToSet,
            salary,
            regions: regionsToSet,
            period: selectedVacanciesDate,
            currencyName,
        });

        setIsOpen(false);
    };
    return (
        <Popup
            title={'Фильтры'}
            setIsOpen={setIsOpen}
            {...other}
            panelClassName={'!w-full'}
        >
            <form
                className={'flex w-full flex-col items-end gap-y-8'}
                onSubmit={handleSubmit(onSubmit)}
            >
                <div className={'flex w-full flex-col gap-y-6'}>
                    <div className={'grid w-full grid-cols-3 gap-4'}>
                        {filters.map((filter) => {
                            const selected =
                                selectedFilters[filter.name] ??
                                ([] as FilterItemValue[]);
                            return (
                                <Filter
                                    key={filter.name}
                                    filter={filter}
                                    selected={selected}
                                    onFilterChange={handleFilterChange}
                                />
                            );
                        })}
                    </div>
                    <div className={'flex w-full flex-row gap-x-2'}>
                        <TextInput
                            control={control as unknown as Control<FieldValues>}
                            placeholder={'Уровень дохода от..'}
                            name={'salaryFrom'}
                            wrapperClassName={'!max-w-full'}
                            className={'!max-w-full'}
                        />
                        <Select
                            className={'!w-1/5'}
                            state={
                                currencies
                                    ? currencies.map(
                                          (currency) => currency.char
                                      )
                                    : []
                            }
                            selected={selectedCurrency?.char}
                            setSelected={(value) =>
                                setSelectedCurrency((prev) => {
                                    const selected = currencies?.find(
                                        (currency) => currency.char === value
                                    );

                                    return selected
                                        ? selected
                                        : {
                                              title: 'RUB',
                                              char: '₽',
                                          };
                                })
                            }
                        />
                    </div>
                    <RegionInput
                        regions={regions}
                        setRegion={handleSetRegion}
                        removeRegion={handleRemoveRegion}
                        selectedRegions={selectedRegions}
                    />
                    <div className={'flex w-full flex-col items-start gap-y-3'}>
                        <span className={'text-14 text-sub'}>
                            {'Дата публикации вакансий'}
                        </span>
                        <div className={'grid w-full grid-cols-4 gap-2'}>
                            {periods.map((period) => (
                                <Button
                                    key={`period-${period.name}`}
                                    onClick={() => {
                                        setSelectedVacanciesDate(period);
                                    }}
                                    className={cn(
                                        'text-14 hover:bg-text hover:text-base',
                                        selectedVacanciesDate === period
                                            ? 'bg-mauve text-base'
                                            : 'bg-mantle text-text'
                                    )}
                                    buttonView={ButtonView.LARGE}
                                >
                                    {period.localTitle}
                                </Button>
                            ))}
                        </div>
                    </div>
                </div>
                <div className={'flex w-full flex-row justify-end gap-x-4'}>
                    <Button
                        className={
                            'bg-mantle text-14 text-text hover:bg-text hover:text-base'
                        }
                        buttonView={ButtonView.LARGE}
                        onClick={() => {
                            handleResetFilters();
                        }}
                    >
                        <ClearIcon
                            className={'fill-text group-hover:fill-base'}
                        />
                        <span>{'Очистить фильтры'}</span>
                    </Button>
                    <Button
                        type={'submit'}
                        className={
                            'bg-mauve text-14 text-base hover:bg-text hover:text-base'
                        }
                        buttonView={ButtonView.LARGE}
                    >
                        <SearchIcon className={'fill-base'} />
                        <span>{'Поиск'}</span>
                    </Button>
                </div>
            </form>
        </Popup>
    );
};
