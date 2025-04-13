'use client';

import React, { useState } from "react";
import { Popup, PopupProps } from "~/shared/ui/Popup";
import cn from 'classnames';
import { Control, FieldValues, useForm } from "react-hook-form";
import TextInput from "~/shared/ui/TextInput";
import { salaryCurrency, SalaryCurrency } from "~/entities/preferences";
import Select from "~/shared/ui/Select";
import Button, { ButtonView } from "~/shared/ui/Button";
import { useQueryStates, parseAsString } from 'nuqs';
import { ReactComponent as ClearIcon } from '~/shared/assets/icons/icon-clear.svg';
import { ReactComponent as SearchIcon } from '~/shared/assets/icons/search-icon.svg';
import { usePathname, useRouter } from 'next/navigation';
import { RegionInput } from "./RegionInput";
import { Filter } from "./Filter";
import { FilterItemValue, Filters, Periods, RegionItem, Regions } from "../model/types";




export interface FilterMenyForm {
    salary: string,
};

export interface FilterMenuProps extends Omit<PopupProps, 'title' | 'children'> {
    filters: Filters,
    regions: Regions,
    periods: Periods
};
export interface QueryParams {
    // filters?: string[],
    // regions?: string[],
    salary?: string,
    // currency?: SalaryCurrency,
    // vacanciesDate?: string,
}

export const FilterMenu: React.FC<FilterMenuProps> = (props) => {
    const router = useRouter();
    const pathname = usePathname();

    const { filters, regions, periods, ...other } = props;

    const { control, handleSubmit, reset } = useForm<FilterMenyForm>({
        defaultValues: {
            salary: '',
        },
    });;

    const initialFiltres = Object.fromEntries(filters.map(filter => [filter.name, { name: filter.name, localTitle: filter.localTitle }]));

    const [selectedFilters, setSelectedFilters] = useState(initialFiltres);

    const salaryCurrencyArray = Object.values(salaryCurrency)
    const [selectedCurrency, setSelectedCurrency] = useState<SalaryCurrency>(salaryCurrency.ruble);

    const handleFilterChange = (filter: string, value: FilterItemValue) => {
        setSelectedFilters({
            ...selectedFilters,
            [filter]: value,
        });
    };

    const [selectedRegions, setSelectedRegions] = useState<Regions>([]);

    const handleSetRegion = (region: RegionItem | undefined) => {
        if (region) {
            setSelectedRegions(prev => (prev.includes(region) ? prev : [...prev, region]));
        }
    }

    const handleRemoveRegion = (region: RegionItem) => {
        setSelectedRegions(prev => prev.filter(el => el !== region))
    }

    const [selectedVacanciesDate, setSelectedVacanciesDate] = useState(periods.at(-1));

    const handleResetFilters = () => {
        setSelectedFilters(initialFiltres);
        setSelectedCurrency(salaryCurrency.ruble);
        reset();
        setSelectedRegions([]);
        setSelectedVacanciesDate(periods.at(-1));
    }

    const [queryParams, setQueryParams] = useQueryStates({
        filters: parseAsString.withDefault(''),
        currency: parseAsString.withDefault(''),
        salary: parseAsString.withDefault(''),
        region: parseAsString.withDefault(''),
        period: parseAsString.withDefault(''),
    }
    );


    // NOTE: fix later, add parsing query params after add vacancies
    const onSubmit = async (data: FilterMenyForm) => {
        const filters = Object.entries(selectedFilters).map(([key, value]) => `${key}=${value.name}`).join('&');;
        const region = selectedRegions.some(region => region.name === 'all') ? 'all' : selectedRegions.map(region => region.name).join('&');
        const currency = selectedCurrency.toString();
        const salary = data.salary.trim();
        const period = selectedVacanciesDate?.name ?? '';

        const newQueryParams = {
            filters,
            currency,
            salary,
            region,
            period
        };

        const queryString = Object.entries(newQueryParams).map(([key, value]) => `${key}=${value}`).join('%');

        if (pathname === '/') {
            await setQueryParams(newQueryParams);
            router.push(`/vacancies?${queryString}`);
        } else {
            await setQueryParams(newQueryParams);
        }


    };
    return (
        <Popup title={"Фильтры"} {...other}>
            <form className={'flex flex-col gap-y-8 w-full items-end'} onSubmit={handleSubmit(onSubmit)}>
                <div className={'flex flex-col gap-y-5 w-full'}>
                    <div className={'grid grid-cols-3 w-full gap-2'}>
                        {
                            filters.map(filter => {
                                const selected = selectedFilters[filter.name] ?? {} as FilterItemValue;
                                return (<Filter key={filter.name} filter={filter} selected={selected} onFilterChange={handleFilterChange} />
                                )
                            }
                            )
                        }
                    </div>
                    <div className={'flex flex-row gap-x-2 w-full'}>
                        <TextInput
                            control={(control as unknown) as Control<FieldValues>}
                            placeholder={"Уровень дохода от.."}
                            name={"salary"}
                            wrapperClassName={'!max-w-full'}
                            className={'!max-w-full'}
                        />
                        <Select
                            className={'!w-1/5'}
                            state={salaryCurrencyArray}
                            selected={selectedCurrency}
                            setSelected={(value) => setSelectedCurrency(value as SalaryCurrency)}
                        />
                    </div>
                    <RegionInput regions={regions} setRegion={handleSetRegion} removeRegion={handleRemoveRegion} selectedRegions={selectedRegions} />
                    <div className={'flex flex-col gap-y-3 w-full items-start'}>
                        <span className={'text-14 text-sub'}>{'Дата публикации вакансий'}</span>
                        <div className={'grid grid-cols-4 gap-2 w-full'}>
                            {
                                periods.map(period =>
                                (
                                    <Button
                                        key={`period-${period.name}`}
                                        onClick={() => { setSelectedVacanciesDate(period) }}
                                        className={cn('text-14 hover:bg-text hover:text-base', selectedVacanciesDate === period ? 'bg-mauve text-base' : 'bg-mantle text-text')}
                                        buttonView={ButtonView.LARGE}
                                    >
                                        {period.localTitle}
                                    </Button>
                                )
                                )
                            }
                        </div>
                    </div>
                </div>
                <div className={'flex flex-row gap-x-4 justify-end w-full'}>
                    <Button
                        className={'text-14 hover:bg-text hover:text-base bg-mantle text-text'}
                        buttonView={ButtonView.LARGE}
                        onClick={() => { handleResetFilters() }}
                    >
                        <ClearIcon className={'fill-text group-hover:fill-base'} />
                        <span>{'Очистить фильтры'}</span>
                    </Button>
                    <Button
                        type={'submit'}
                        className={'text-14 hover:bg-text hover:text-base bg-mauve text-base'}
                        buttonView={ButtonView.LARGE}
                    >
                        <SearchIcon className={'fill-base'} />
                        <span>{'Поиск'}</span>
                    </Button>
                </div>
            </form>
        </Popup>
    );
}