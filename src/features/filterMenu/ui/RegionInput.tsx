'use client';

import React from "react";
import { Combobox } from "~/shared/ui/Combobox";
import { ReactComponent as IconPlus } from '~/shared/assets/icons/icon-plus.svg';
import { ReactComponent as DeleteIcon } from '~/shared/assets/icons/icon-trash.svg';
import Button, { ButtonView } from "~/shared/ui/Button";
import { RegionItem, Regions } from "../model/types";


export interface RegionInputProps {
    regions: Regions,
    selectedRegions: Regions,
    setRegion: (region: RegionItem | undefined) => void,
    removeRegion: (region: RegionItem) => void,
}


const InputLabel: React.FC = () => (
    <div className={'flex flex-row gap-x-2 justify-center items-center'}>
        <IconPlus className={'fill-text w-3 h-3'} />
        <span className={'text-14 text-text'}>{'Регион'}</span>
    </div>
)
export const RegionInput: React.FC<RegionInputProps> = (props) => {
    const { regions, selectedRegions, setRegion, removeRegion } = props;

    const localState = regions.map(el => el.localTitle);

    const handleComboboxSelected = (localValue: string | null) => {
        if (localValue) {
            const selected = regions.find(el => el.localTitle === localValue);
            setRegion(selected);
        }
    }

    const handleFilter = (query: string) => query === '' ? localState : localState.filter((title) => title.toLowerCase().includes(query.toLowerCase()))

    return (
        <div className={'flex flex-col w-full gap-y-3'}>
            <Combobox
                doFilter={handleFilter}
                setSelected={handleComboboxSelected}
                label={InputLabel}
                wrapperClassName={'!max-w-full'}
                inputClassName={'!max-w-full'}
            />
            <div className={'flex flex-wrap gap-2'}>
                {
                    selectedRegions.map(region => (
                        <Button
                            key={region.name}
                            className={'bg-red hover:bg-text transition-colors'}
                            buttonView={ButtonView.LARGE}
                            onClick={() => { removeRegion(region) }}
                        >
                            <DeleteIcon className={'w-4 h-4 fill-base'} />
                            <span className={'text-base'}>{region.localTitle}</span>
                        </Button>

                    ))
                }
            </div>
        </div >

    )

}