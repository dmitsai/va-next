'use client';

import React, { Suspense, useState } from 'react';
import cn from 'classnames';

import Button, { ButtonView } from '~/shared/ui/Button';
import Select from '~/shared/ui/Select';

import { ReactComponent as IconSettings } from '~/shared/assets/icons/settings-icon.svg';
import { ReactComponent as SearchIcon } from '~/shared/assets/icons/search-icon.svg';
import { FilterMenu } from '~/features/filterMenu';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useVacancyFilter } from '~/entities/vacancies/model/hook';
import { periods, regions, state, filters } from '../model/data';

export const SearchComponent: React.FC = () => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const { setSearch } = useVacancyFilter();

    const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
    const [selected, setSelected] = useState(state[0]);
    const [searchValue, setSearchValue] = useState(
        () => searchParams.get('search') ?? ''
    );

    const isSearchDirty = searchValue.length > 0;

    const relevantParamNames = [
        ...filters.map((f) => f.name),
        ...regions.map((r) => r.name),
        ...periods.map((p) => p.name),
    ];
    const hasNonSearchParams = Array.from(searchParams.keys()).some(
        (param) => param !== 'search' && relevantParamNames.includes(param)
    );
    const isFiltered =
        hasNonSearchParams ||
        (searchParams.has('search') && searchParams.size > 1);

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (pathname === '/') {
            const updatedParams = new URLSearchParams(searchParams.toString());
            updatedParams.set('search', searchValue);
            router.replace(`/vacancies?${updatedParams.toString()}`);
        } else {
            setSearch(searchValue);
        }
    };

    return (
        <Suspense>
            <FilterMenu
                filters={filters}
                regions={regions}
                periods={periods}
                isOpen={isFilterMenuOpen}
                setIsOpen={setIsFilterMenuOpen}
            />
            <form
                className={'flex w-full flex-row gap-x-2'}
                onSubmit={onSubmit}
            >
                <Select
                    selected={selected}
                    setSelected={setSelected}
                    state={state}
                />
                <div className={cn('relative flex w-full flex-row')}>
                    <div
                        className={cn(
                            'group relative w-full text-14 font-400 leading-5',
                            isSearchDirty && 'pr-2',
                            '!max-w-full'
                        )}
                    >
                        <input
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                            placeholder="Поиск вакансий..."
                            className={cn(
                                'peer w-full rounded-6 border-2 border-transparent bg-mantle py-2 pr-4 text-text caret-text outline-none focus:border-mauve',
                                isSearchDirty ? 'pl-4' : 'pl-11',
                                '!max-w-full transition-all'
                            )}
                        />
                        <SearchIcon
                            className={cn(
                                'absolute left-4 top-1/2 -translate-y-1/2 transition-all fill-sub',
                                isSearchDirty ? '!left-0 opacity-0' : 'opacity-100'
                            )}
                        />
                    </div>
                    <Button
                        type={'submit'}
                        className={cn(
                            isSearchDirty
                                ? 'opacity-100 right-0 w-10 !p-3'
                                : '-right-12 w-0 !p-0 opacity-0',
                            'aboslute group h-10 overflow-hidden bg-mauve text-text !transition-all duration-1000 hover:bg-text'
                        )}
                        buttonView={ButtonView.LARGE}
                    >
                        <SearchIcon className={'absolute fill-base'} />
                    </Button>
                </div>
                <Button
                    className={cn(
                        isFiltered ? 'bg-mauve' : 'bg-mantle',
                        'group w-full max-w-10 !p-3 transition-colors hover:bg-text'
                    )}
                    buttonView={ButtonView.LARGE}
                    onClick={() => {
                        setIsFilterMenuOpen(true);
                    }}
                >
                    <IconSettings
                        className={cn(
                            isFiltered ? 'fill-base' : 'fill-text',
                            'absolute group-hover:fill-base'
                        )}
                    />
                </Button>
            </form>
        </Suspense>
    );
};

export const Search = () => (
    <Suspense>
        <SearchComponent />
    </Suspense>
);
