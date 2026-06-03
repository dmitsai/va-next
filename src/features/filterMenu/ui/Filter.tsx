import React from 'react';
import { Select, SelectProps } from '~/shared/ui/Select/Select';
import { MultiSelect } from '~/shared/ui/Select';
import { FilterItem, FilterItemValue } from '../model/types';

export interface FilterProps {
    filter: FilterItem;
    selected: FilterItemValue[];
    onFilterChange: (filter: string, value: FilterItemValue[]) => void;
}

export const Filter: React.FC<FilterProps> = (props) => {
    const { filter, selected, onFilterChange } = props;

    const localState = filter.value.map((el) => el.localTitle);
    const localSelected = selected.map((el) => el.localTitle);
    const handleSelectChange = (localValues: string[]) => {
        const selectedValues = localValues
            .map((localValue) =>
                filter.value.find((value) => value.localTitle === localValue)
            )
            .filter((value) => value !== undefined);

        onFilterChange(filter.name, selectedValues);
    };

    return (
        <MultiSelect
            placeholder={filter.localTitle}
            className={'!max-w-full text-14'}
            selected={localSelected}
            setSelected={handleSelectChange}
            options={localState}
        />
    );
};
