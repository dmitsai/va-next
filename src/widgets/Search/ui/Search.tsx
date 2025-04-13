'use client';

import React, { useState } from 'react';
import { Control, FieldValues, useForm } from 'react-hook-form';
import cn from 'classnames';

import Button, { ButtonView } from "~/shared/ui/Button";
import SearchInput from "~/shared/ui/SearchInput";
import Select from "~/shared/ui/Select";

import { ReactComponent as IconSettings } from "~/shared/assets/icons/settings-icon.svg";
import { ReactComponent as SearchIcon } from '~/shared/assets/icons/search-icon.svg';
import { FilterMenu } from '~/features/filterMenu';


const tempFilters = [
    { name: 'speciality', localTitle: 'Специальность', value: [{ name: 'webDeveloper', localTitle: 'Web-разработчик' }, { name: 'backend', localTitle: 'Backend-разработчик' }] },
    { name: 'workSchedule', localTitle: 'График работы', value: [{ name: 'fullDay', localTitle: 'Полный день' }, { name: 'flexible', localTitle: 'Гибкий график' }] },
    { name: 'experience', localTitle: 'Опыт', value: [{ name: 'lowerOneYear', localTitle: 'менее 1 года' }, { name: '1-3Years', localTitle: '1-3 года' }] },
    { name: 'education', localTitle: 'Образование', value: [{ name: 'higher', localTitle: 'Высшие образование' }, { name: 'noEducation', localTitle: 'Нет образования' }] },
    { name: 'employmentType', localTitle: 'тип занятости', value: [{ name: 'full', localTitle: 'Полная занятость' }, { name: 'parttime', localTitle: 'Частичная занятость' }] },
];

const regions = [
    { name: 'moscow', localTitle: 'Москва' },
    { name: 'omsk', localTitle: 'Омск' },
    { name: 'samara', localTitle: 'Самара' },
    { name: 'all', localTitle: 'Все регионы' },
];

const periods = [
    { name: 'day', localTitle: 'День' },
    { name: 'mouth', localTitle: 'Месяц' },
    { name: '3mouth', localTitle: '3 месяца' },
    { name: 'all', localTitle: 'Все время' },
]
const state = ['Вакансии', 'Стажировки'];

export interface SearchForm {
    search: string,
}

export const Search: React.FC = () => {
    const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
    const [selected, setSelected] = useState(state[0]);

    const { control, handleSubmit, formState: { dirtyFields } } = useForm<SearchForm>({
        defaultValues: {
            search: ''
        },
    });

    const { search: isSearchDirty } = dirtyFields;

    const onSubmit = (data: SearchForm) => {
        console.info('search:', JSON.stringify(data));
    };

    return (
        <>
            <FilterMenu filters={tempFilters} regions={regions} periods={periods} isOpen={isFilterMenuOpen} setIsOpen={setIsFilterMenuOpen} />
            <form className={'flex flex-row gap-x-2 w-full'} onSubmit={handleSubmit(onSubmit)}>
                <Select selected={selected} setSelected={setSelected} state={state} />
                <div className={cn('relative flex flex-row w-full')}>
                    <SearchInput
                        name={'search'}
                        control={(control as unknown) as Control<FieldValues>}
                        iconProps={{ className: cn(isSearchDirty ? '!left-0 opacity-0' : 'opacity-1', 'transition-all fill-sub') }}
                        wrapperClassName={cn(isSearchDirty && 'pr-2', '!max-w-full')}
                        className={cn(isSearchDirty && '!pl-4', '!max-w-full transition-all')}
                    />
                    <Button type={'submit'} className={cn(isSearchDirty ? 'opacity-1 w-10 !p-3 right-0' : 'opacity-0 w-0 !p-0 -right-12', 'aboslute overflow-hidden group  bg-mauve text-text hover:bg-text h-10 !transition-all duration-1000')} buttonView={ButtonView.LARGE}>
                        <SearchIcon className={'absolute fill-base'} />
                    </Button>
                </div>
                <Button className={'group !p-3 bg-mantle hover:bg-text w-full max-w-10  transition-colors'} buttonView={ButtonView.LARGE} onClick={() => { setIsFilterMenuOpen(true) }}>
                    <IconSettings className={'absolute fill-text group-hover:fill-base'} />
                </Button>
            </form>
        </>
    )
}