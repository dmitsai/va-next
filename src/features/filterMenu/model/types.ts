export type FilterItemValue = {
    name:string,
    localTitle:string
}
export type FilterItem = {
    name: string,
    localTitle: string,
    value: Array<FilterItemValue>,
}

export type Filters = Array<FilterItem>

export type RegionItem = {
    name: string,
    localTitle: string,
}

export type Regions = Array<RegionItem>

export type PeriodItem = {
    name: string,
    localTitle: string,
}

export type Periods = Array<PeriodItem>