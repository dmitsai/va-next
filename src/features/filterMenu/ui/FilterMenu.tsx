'use client';

import React, { Suspense, useState } from 'react';
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
import { useQueryStates, parseAsString } from 'nuqs';
import { ReactComponent as ClearIcon } from '~/shared/assets/icons/icon-clear.svg';
import { ReactComponent as SearchIcon } from '~/shared/assets/icons/search-icon.svg';
import { usePathname, useRouter } from 'next/navigation';
import { clientApi } from 'trpc/client';
import { experience } from '~/shared/api/model/tags/data';
import { RegionInput } from './RegionInput';
import { Filter } from './Filter';
import {
    FilterItemValue,
    Filters,
    Periods,
    RegionItem,
    Regions,
} from '../model/types';

export interface FilterMenyForm {
    salary: string;
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

    const { control, handleSubmit, reset } = useForm<FilterMenyForm>({
        defaultValues: {
            salary: '',
        },
    });

    const initialFiltres = Object.fromEntries(
        filters.map((filter) => [
            filter.name,
            { name: filter.name, localTitle: filter.localTitle },
        ])
    );

    const [selectedFilters, setSelectedFilters] = useState(initialFiltres);

    const { data: currencies } = clientApi.currency.getAllCurrencies.useQuery();
    // NOTE: TEMP SOLUTION
    const initialCurrency =
        currencies && currencies?.length !== 0
            ? currencies[0]
            : {
                  title: 'RUB',
                  currency_id: undefined,
                  char: '₽',
              };
    const [selectedCurrency, setSelectedCurrency] = useState(initialCurrency);

    const handleFilterChange = (filter: string, value: FilterItemValue) => {
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
        periods.at(-1)
    );

    const handleResetFilters = () => {
        setSelectedFilters(initialFiltres);
        setSelectedCurrency(initialCurrency);
        reset();
        setSelectedRegions([]);
        setSelectedVacanciesDate(periods.at(-1));

        // eslint-disable-next-line no-use-before-define
        void setQueryParams(null);
    };

    const [queryParams, setQueryParams] = useQueryStates({
        // NOTE: TEMP SOLUTION
        workSchedule: parseAsString.withDefault(''),
        employmentTypes: parseAsString.withDefault(''),
        education: parseAsString.withDefault(''),
        experience: parseAsString.withDefault(''),
        currency: parseAsString.withDefault(''),
        salary: parseAsString.withDefault(''),
        region: parseAsString.withDefault(''),
        period: parseAsString.withDefault(''),
    });

    // NOTE: fix later, add parsing query params after add vacancies
    const onSubmit = async (data: FilterMenyForm) => {
        const queryParams: Record<string, string> = {};

        Object.entries(selectedFilters).forEach(([key, value]) => {
            if (value.name && value.name !== initialFiltres[key]?.name) {
                queryParams[key] = `${value.name}`;
            }
        });

        if (selectedRegions.length > 0) {
            queryParams.regions = selectedRegions.some(
                (region) => region.name === 'all'
            )
                ? 'all'
                : `[${selectedRegions.map((region) => region.name).join(',')}]`;
        }

        if (data.salary.trim()) {
            queryParams.salary = data.salary.trim();
        }

        queryParams.currency = selectedCurrency?.title ?? 'RUB';

        if (selectedVacanciesDate?.name) {
            queryParams.period = selectedVacanciesDate.name;
        }

        // Формируем строку запроса
        const queryString = new URLSearchParams(queryParams).toString();

        if (pathname === '/') {
            await setQueryParams(queryParams);
            setIsOpen(false);
            router.push(`/vacancies?${queryString}`);
        } else {
            await setQueryParams(queryParams);
            setIsOpen(false);
        }
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
                <div className={'flex w-full flex-col gap-y-5'}>
                    <div className={'grid w-full grid-cols-3 gap-2'}>
                        {filters.map((filter) => {
                            const selected =
                                selectedFilters[filter.name] ??
                                ({} as FilterItemValue);
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
                            name={'salary'}
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
                                setSelectedCurrency(
                                    currencies?.find(
                                        (currency) => currency.char === value
                                    )
                                )
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
