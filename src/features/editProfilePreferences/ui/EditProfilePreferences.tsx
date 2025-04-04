//TODO: fix parsing logic
//TODO: fix error handling

'use client';

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Checkbox } from "~/shared/ui/checkbox/Checkbox";
import { Popup, PopupProps } from "~/shared/ui/Popup";
import { zodResolver } from '@hookform/resolvers/zod';

import * as z from 'zod';
import { EmploymentTypes, employmentTypes, SalaryCurrency, salaryCurrency, WorkSchedule, workSchedule } from "~/entities/preferences";
import TextInput from "~/shared/ui/TextInput";
import Select from "~/shared/ui/Select";
import Button, { ButtonView } from "~/shared/ui/Button";



export interface EditProfilePreferencesProps extends Omit<PopupProps, 'title'> { };

type EmploymentTypesKeys = keyof typeof employmentTypes;
type WorkScheduleKeys = keyof typeof workSchedule;

type PreferencesKeys = EmploymentTypesKeys | WorkScheduleKeys;

export type FormData = { [K in PreferencesKeys]: boolean } & { salary: string };

export type PreferencesForm = EmploymentTypesKeys
const schema = z.object({
    full: z.boolean().optional(),
    partTime: z.boolean().optional(),
    internship: z.boolean().optional(),
    fullday: z.boolean().optional(),
    shift: z.boolean().optional(),
    flexible: z.boolean().optional(),
    remote: z.boolean().optional(),
    salary: z.string().optional(),
}).refine((data) => {
    const employmentTypesSelected = ['full', 'partTime', 'internship'].some(key => data[key as EmploymentTypesKeys] === true);
    return employmentTypesSelected;
}, {
    message: "Нужно выбрать хотя бы один тип занятости",
    path: ['full'],
}).refine((data) => {
    const workScheduleSelected = ['fullday', 'shift', 'flexible', 'remote'].some(key => data[key as WorkScheduleKeys] === true);
    return workScheduleSelected;
}, {
    message: "Нужно выбрать хотя бы один график работы",
    path: ['fullday'],
});
const employmentTypesArray = Object.entries(employmentTypes);

const workScheduleArray = Object.entries(workSchedule);

const salaryCurrencyArray = Object.values(salaryCurrency);

interface PreferencesData {
    employmentTypes: Array<EmploymentTypes>,
    workSchedule: Array<WorkSchedule>,
    salary: string,
    salaryCurrency: SalaryCurrency,
}

const getEmploymentTypes = (full: boolean, partTime: boolean, internship: boolean) => {
    const flags = { full, partTime, internship };
    return Object.entries(flags)
        .filter(([key, value]) => value)
        .map(([key, value]) => employmentTypes[key as EmploymentTypesKeys]) as Array<EmploymentTypes>;
}
const getSelectedWorkSchedules = (fullday: boolean, shift: boolean, flexible: boolean, remote: boolean) => {
    const flags = { fullday, shift, flexible, remote };

    return Object.entries(flags)
        .filter(([key, value]) => value)
        .map(([key, value]) => workSchedule[key as WorkScheduleKeys]) as Array<WorkSchedule>;
}
const parseForm = (data: FormData, selectedSalaryCurrency: SalaryCurrency) => {
    const { salary: selectedSalary, full, partTime, internship, fullday, shift, flexible, remote } = data;

    const selectedEmploymentTypes = getEmploymentTypes(full, partTime, internship);
    const selectedWorkSchedule = getSelectedWorkSchedules(fullday, shift, flexible, remote);
    return {
        salary: selectedSalary,
        salaryCurrency: selectedSalaryCurrency,
        employmentTypes: selectedEmploymentTypes,
        workSchedule: selectedWorkSchedule,
    } as PreferencesData

}

export const EditProfilePreferences: React.FC<EditProfilePreferencesProps> = (props) => {
    const { setIsOpen } = props;
    const [selected, setSelected] = useState<SalaryCurrency>(salaryCurrency.ruble);

    const { control, handleSubmit } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            full: false,
            partTime: false,
            internship: false,
            fullday: false,
            shift: false,
            flexible: false,
            remote: false,
            salary: '',
        },
    });

    const onSubmit = (data: FormData) => {
        alert(JSON.stringify(parseForm(data, selected)));
        setIsOpen(false);
    };
    return (
        <Popup title={"Редактирование предпочтений"} {...props}>
            <form className={'flex flex-col gap-y-8 w-full items-end'} onSubmit={handleSubmit(onSubmit)}>
                <div className={'flex flex-col gap-y-4 w-full'}>
                    <span className={'text-14 text-text font-500'}>{"Тип занятости"}</span>
                    {
                        employmentTypesArray.map(([key, value]) => {
                            return <Checkbox key={key} control={control} name={key} label={value} />
                        })
                    }
                </div>
                <div className={'flex flex-col gap-y-4 w-full'}>
                    <span className={'text-14 text-text font-500'}>{"График работы"}</span>
                    {
                        workScheduleArray.map(([key, value]) => {
                            return <Checkbox key={key} control={control} name={key} label={value} />
                        })
                    }
                </div>
                <div className={'flex flex-col gap-y-4 w-full'}>
                    <span className={'text-14 text-text font-500'}>{"Уровень дохода"}</span>
                    <div className={'flex flex-row gap-x-2'}>
                        <TextInput control={control} placeholder={"100 000"} name={"salary"} />
                        <Select className={'!w-1/3'} state={salaryCurrencyArray} selected={selected} setSelected={(value) => setSelected(value as SalaryCurrency)} />
                    </div>
                </div>
                <Button type={'submit'} buttonView={ButtonView.LARGE} className="text-14  text-base bg-mauve hover:bg-text transition-colors">
                    {'Сохранить'}
                </Button>
            </form>
        </Popup>
    )
}