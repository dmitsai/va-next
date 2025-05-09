'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';
import { availableFilters, availablePeriods, availableRegions } from './data';

type FilterItemValue = {
    name: string;
    localTitle: string;
};

type FiltersResult = {
    [k: string]: FilterItemValue[];
};
export type RegionItem = {
    name: string;
    localTitle: string;
};

export type Regions = Array<RegionItem>;

export type PeriodItem = {
    name: string;
    localTitle: string;
};

export type Periods = Array<PeriodItem>;

export const useVacancyFilter = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const getSearch = () => {
        const search = searchParams.get('search');
        return search;
    };

    const setSearch = useCallback(
        (searchValue: string) => {
            const currentParams = new URLSearchParams(searchParams.toString());

            currentParams.set('search', searchValue);
            router.replace(`${pathname}?${currentParams.toString()}`);
        },
        [searchParams, pathname, router]
    );

    const getFilters = (): FiltersResult => {
        const result: FiltersResult = {};

        availableFilters.forEach((filterCategory) => {
            const paramValues = searchParams.getAll(filterCategory.name);
            result[filterCategory.name] = filterCategory.value.filter((item) =>
                paramValues.includes(item.name)
            );
        });

        return result;
    };

    const getSalary = () => {
        const salaryFrom = searchParams.get('salaryFrom');
        return { salaryFrom };
    };

    const getRegions = useCallback(() => {
        const selectedRegions = searchParams.getAll('region');
        const regions = availableRegions.filter((region) =>
            selectedRegions.includes(region.name)
        );

        return { regions };
    }, [searchParams, pathname, router]);

    const getPeriod = useCallback(() => {
        const periodName = searchParams.get('period');
        const period = availablePeriods.find(
            (period) => period.name === periodName
        );
        return { period };
    }, [searchParams, pathname, router]);

    const getCurrencyName = useCallback(() => {
        const currencyName = searchParams.get('currency');
        return { currencyName };
    }, [searchParams, pathname, router]);

    const updateAllFilters = useCallback(
        (params: {
            filters?: Record<string, string[]>;
            salary?: string;
            regions?: RegionItem[];
            period?: PeriodItem;
            currencyName?: string;
        }) => {
            const currentParams = new URLSearchParams(searchParams.toString());

            if (params.filters) {
                Object.keys(params.filters).forEach((key) => {
                    currentParams.delete(key);
                });

                Object.entries(params.filters).forEach(([key, values]) => {
                    values.forEach((value) => {
                        currentParams.append(key, value);
                    });
                });
            }

            if (params.salary !== undefined) {
                if (params.salary) {
                    currentParams.set('salaryFrom', params.salary);
                } else {
                    currentParams.delete('salaryFrom');
                }
            }

            if (params.regions !== undefined) {
                currentParams.delete('region');
                params.regions.forEach((region) => {
                    currentParams.append('region', region.name);
                });
            }

            if (params.period !== undefined) {
                currentParams.set('period', params.period.name);
            }

            if (params.currencyName !== undefined) {
                currentParams.set('currency', params.currencyName);
            }

            router.replace(`${pathname}?${currentParams.toString()}`);
        },
        [searchParams, pathname, router]
    );

    const removeAllFilters = useCallback(() => {
        const currentParams = new URLSearchParams(searchParams.toString());

        availableFilters.forEach((filter) => {
            currentParams.delete(filter.name);
        });

        currentParams.delete('salaryFrom');

        currentParams.delete('region');

        currentParams.delete('period');

        currentParams.delete('currency');

        router.replace(`${pathname}?${currentParams.toString()}`);
    }, [searchParams, pathname, router]);

    return {
        removeAllFilters,
        updateAllFilters,
        getCurrencyName,
        getPeriod,
        getRegions,
        getSalary,
        getFilters,
        getSearch,
        setSearch,
    };
};
