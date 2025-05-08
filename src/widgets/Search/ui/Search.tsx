'use client';

import React, { Suspense, useState } from 'react';
import { Control, FieldValues, useForm } from 'react-hook-form';
import cn from 'classnames';

import Button, { ButtonView } from '~/shared/ui/Button';
import SearchInput from '~/shared/ui/SearchInput';
import Select from '~/shared/ui/Select';

import { ReactComponent as IconSettings } from '~/shared/assets/icons/settings-icon.svg';
import { ReactComponent as SearchIcon } from '~/shared/assets/icons/search-icon.svg';
import { FilterMenu } from '~/features/filterMenu';
import { parseAsString, useQueryState, useQueryStates } from 'nuqs';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { periods, regions, state, filters } from '../model/data';

export interface SearchForm {
    search: string;
}

export const Search: React.FC = () => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
    const [selected, setSelected] = useState(state[0]);

    const {
        control,
        handleSubmit,
        formState: { dirtyFields },
    } = useForm<SearchForm>({
        defaultValues: {
            search: '',
        },
    });

    const { search: isSearchDirty } = dirtyFields;
    const [search, setSearch] = useQueryState('search');

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

    const onSubmit = async (data: SearchForm) => {
        if (pathname === '/') {
            await setSearch(data.search);
            router.push(`/vacancies?search=${data.search}`);
        } else {
            await setSearch(data.search);
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
                onSubmit={handleSubmit(onSubmit)}
            >
                <Select
                    selected={selected}
                    setSelected={setSelected}
                    state={state}
                />
                <div className={cn('relative flex w-full flex-row')}>
                    <SearchInput
                        name={'search'}
                        control={control as unknown as Control<FieldValues>}
                        iconProps={{
                            className: cn(
                                isSearchDirty
                                    ? '!left-0 opacity-0'
                                    : 'opacity-1',
                                'transition-all fill-sub'
                            ),
                        }}
                        wrapperClassName={cn(
                            isSearchDirty && 'pr-2',
                            '!max-w-full'
                        )}
                        className={cn(
                            isSearchDirty && '!pl-4',
                            '!max-w-full transition-all'
                        )}
                    />
                    <Button
                        type={'submit'}
                        className={cn(
                            isSearchDirty
                                ? 'opacity-1 right-0 w-10 !p-3'
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
