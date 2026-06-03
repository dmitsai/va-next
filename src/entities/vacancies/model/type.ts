export type FilterItemValue = {
    name: string;
    localTitle: string;
};
export type FilterItem = {
    name: string;
    localTitle: string;
    value: Array<FilterItemValue>;
};

export type Filters = Array<FilterItem>;
