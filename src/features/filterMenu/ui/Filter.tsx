import React from "react";
import { Select, SelectProps } from "~/shared/ui/Select/Select";
import { FilterItem, FilterItemValue } from "../model/types";

export interface FilterProps {
    filter: FilterItem,
    selected: FilterItemValue,
    onFilterChange: (filter: string, value: FilterItemValue) => void;
};

export const Filter: React.FC<FilterProps> = (props) => {
    const { filter, selected, onFilterChange } = props;

    const localState = filter.value.map(el => el.localTitle);

    const handleSelectChange = (localValue: string) => {
        const selectedValue = filter.value.find(el => el.localTitle === localValue) ?? selected;
        onFilterChange(filter.name, selectedValue);
    };

    return (<Select selected={selected.localTitle} setSelected={handleSelectChange} state={localState} className={'!max-w-full text-14'} />)
};