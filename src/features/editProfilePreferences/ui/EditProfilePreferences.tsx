// TODO: fix parsing logic
// TODO: fix error handling

'use client';

import React, { useEffect, useState } from "react";
import { Control, FieldValues, Form, useForm } from "react-hook-form";
import { Checkbox } from "~/shared/ui/checkbox/Checkbox";
import { Popup, PopupProps } from "~/shared/ui/Popup";
import { zodResolver } from '@hookform/resolvers/zod';

import * as z from 'zod';
import { EmploymentTypes, employmentTypes, SalaryCurrency, salaryCurrency, WorkSchedule, workSchedule } from "~/entities/preferences";
import TextInput from "~/shared/ui/TextInput";
import Select from "~/shared/ui/Select";
import Button, { ButtonView } from "~/shared/ui/Button";
import { clientApi } from "trpc/client";
import { ReactComponent as SpinIcon } from "~/shared/assets/icons/spin.svg";
import { title } from "process";



export interface EditProfilePreferencesProps extends Omit<PopupProps, 'title'> {
    employmentTypes: Array<EmploymentTypes>,
    workSchedule: Array<WorkSchedule>,
    salary: string | undefined,
    salaryCurrency: SalaryCurrency, };

 

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

const initialValues = {
    employmentTypes: employmentTypes ?? '',
    workSchedule: workSchedule ?? '',
    salaryCurrency: salaryCurrency ?? '',
    ...Object.fromEntries
}

const initVal = Object.entries(employmentTypes).map(([key, value]) =>([key,  ]))


// interface PreferencesDar {
//     full: boolean,
//     partTime: boolean,
//     internship:boolean,
//     fullday: boolean,
//     shift: boolean,
//     flexible: boolean,
//     remote: boolean,
//     salary: SalaryCurrency,
// }

const getEmploymentTypes = (full: boolean, partTime: boolean, internship: boolean) => {
    const flags = { full, partTime, internship };
    return Object.entries(flags)
        .filter(([_key, value]) => value)
        .map(([key, _value]) => employmentTypes[key as EmploymentTypesKeys]) as Array<EmploymentTypes>;
}
const getSelectedWorkSchedules = (fullday: boolean, shift: boolean, flexible: boolean, remote: boolean) => {
    const flags = { fullday, shift, flexible, remote };

    return Object.entries(flags)
        .filter(([_key, value]) => value)
        .map(([key, _value]) => workSchedule[key as WorkScheduleKeys]) as Array<WorkSchedule>;
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
    const { setIsOpen,  employmentTypes,  workSchedule, salary, salaryCurrency  } = props;


    const initialEmployment = Object.entries(employmentTypes).map(([key, value]) =>([key, employmentTypes.includes(value) ?? false ]))
    const initialWork = Object.entries(workSchedule).map(([key, value]) =>([key, workSchedule.includes(value) ?? false ]))

    const { data: currencies } = clientApi.currency.getAllCurrencies.useQuery();

       const [selected, setSelected] = useState<{
            title: string;
            currency_id?: string;
            char: string;
        }>({
            title: 'RUB',
            char: '₽',
        });

     useEffect(() => {
            if (currencies) {
                const currencyToSet = currencies.find((c) => c.title === 'RUB') ?? {
                    title: 'RUB',
                    char: '₽',
                };
    
                setSelected(currencyToSet);
            }
        }, [currencies]);
    
    const {
            mutate : updateClient,
            isPending : isClientPending,
            isSuccess : isClientSuccess,
            isError : isClientError,
        } = clientApi.clientProfile.updateProfile.useMutation()
    

    const { control, handleSubmit, watch, formState: {isValid}} = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            salary: " ",
            ...Object.fromEntries(initialWork),
            ...Object.fromEntries(initialEmployment)
        },
    });
   

    const onSubmit = (data: FormData) => {
        const parseData = parseForm(data, salaryCurrency);
        const preferences = { workSchedule:parseData.workSchedule, employmentTypes:parseData.employmentTypes}
         updateClient({ preferences, currencyName: selected.title, salaryFrom: parseData.salary })
        setIsOpen(false);
    };

     const formValues = watch();    

    return (
        <Popup title={"Редактирование предпочтений"} {...props}>
            <form className={'flex flex-col gap-y-8 w-full items-end'} onSubmit={handleSubmit(onSubmit)}>
                <div className={'flex flex-col gap-y-4 w-full'}>
                    <span className={'text-14 text-text font-500'}>{"Тип занятости"}</span>
                    {
                        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, no-underscore-dangle
                        employmentTypesArray.map(([key, value]) => <Checkbox checked={formValues[key as EmploymentTypesKeys]}  key={key} control={(control as unknown) as Control<FieldValues>} name={key} label={value} />)

                    }
                </div>
                <div className={'flex flex-col gap-y-4 w-full'}>
                    <span className={'text-14 text-text font-500'}>{"График работы"}</span>
                    {
                        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, no-underscore-dangle
                        workScheduleArray.map(([key, value]) => <Checkbox checked={formValues[key as WorkScheduleKeys]}  key={key} control={(control as unknown) as Control<FieldValues>} name={key} label={value} />)
                    }
                </div>
                <div className={'flex flex-col gap-y-4 w-full'}>
                    <span className={'text-14 text-text font-500'}>{"Уровень дохода"}</span>
                    <div className={'flex flex-row gap-x-2'}>
                        <TextInput control={(control as unknown) as Control<FieldValues>} placeholder={"100 000"} name={"salary"} />
                        <Select className={'!w-1/3'} state={salaryCurrencyArray} selected={selected.char} setSelected={(char) => {
                            const Currencies = currencies?.find(c => c.char === char); 
                            if (Currencies) {
                                setSelected(Currencies)
                            } else {
                                setSelected({
                                    title: 'RUB',
                                    char: '₽',
                                }
                                )}
                            }
                        } />
                    </div>
                </div>
                <Button type={'submit'} buttonView={ButtonView.LARGE} disabled={!isValid || isClientPending} className="text-14  text-base bg-mauve hover:bg-text transition-colors">
                    {isClientPending ?
                        <SpinIcon className="mt-1 animate-spin" />
                    :
                        <span>Сохранить</span>
                    }
                </Button>
            </form>
        </Popup>
    )
}