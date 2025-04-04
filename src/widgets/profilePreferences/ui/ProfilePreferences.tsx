'use client';

import React, { useState } from "react";
import { type EmploymentTypes, type SalaryCurrency, type WorkSchedule } from "~/entities/preferences"
import { ReactComponent as IconEmploymentType } from '~/shared/assets/icons/icon-employment-type.svg';
import { ReactComponent as IconWorkSchedule } from '~/shared/assets/icons/icon-work-schedule.svg';
import { ReactComponent as IconSalary } from '~/shared/assets/icons/icon-salary.svg';
import Badge from "~/shared/ui/badge";
import { ReactComponent as IconEdit } from '~/shared/assets/icons/icon-edit.svg';
import { EditProfilePreferences } from "~/features/editProfilePreferences/ui/EditProfilePreferences";
import { PreferencesItem } from "./PreferencesItem";

export interface ProfilePreferencesProps {
    employmentTypes: Array<EmploymentTypes>,
    workSchedule: Array<WorkSchedule>,
    salary: string | undefined,
    salaryCurrency: SalaryCurrency,
}

export const ProfilePreferences: React.FC<ProfilePreferencesProps> = (props) => {
    const { employmentTypes, workSchedule, salary, salaryCurrency } = props;
    const [isEditMode, setIsEditMode] = useState(false);
    return (
        <>
            <EditProfilePreferences isOpen={isEditMode} setIsOpen={setIsEditMode} />
            <div className={'relative flex flex-col gap-y-2 p-2 w-full'}>
                <IconEdit className={'absolute right-0 top-0 w-5 h-5 fill-sub hover:fill-surface cursor-pointer'} onClick={() => { setIsEditMode(true) }} />
                <span className={'text-14 text-text font-500'}>{'Предпочтения'}</span>
                <div className={'flex flex-col gap-y-2'}>
                    <PreferencesItem icon={IconWorkSchedule} label={"График работы"}>
                        {
                            workSchedule.map(el => (
                                <Badge key={el} placeholder={el} className={'text-14 text-text bg-mantle py-2'} />
                            ))
                        }
                    </PreferencesItem>
                    <PreferencesItem icon={IconEmploymentType} label={"Тип занятости"}>
                        {
                            employmentTypes.map(el => (
                                <Badge key={el} placeholder={el} className={'text-14 text-text bg-mantle py-2'} />
                            ))
                        }
                    </PreferencesItem>
                    <div className={'flex flex-row gap-x-3 w-full'}>
                        <div className={'flex flex-row gap-x-2 items-center'}>
                            <IconSalary className={'fill-sub w-4 h-4'} />
                            <span className={'text-14 text-text font-500'}>{salary ? 'Желаемый уровень дохода:' : 'Уровень дохода не указан'}</span>
                        </div>
                        {salary && <span className={'text-text text-14'}>{`от ${salary} ${salaryCurrency}`}</span>}
                    </div>
                </div>
            </div>
        </>
    )
}