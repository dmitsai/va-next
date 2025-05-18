'use client';

import React, { useState } from 'react';
import {
    type EmploymentTypes,
    type SalaryCurrency,
    type WorkSchedule,
} from '~/entities/preferences';
import { ReactComponent as IconEmploymentType } from '~/shared/assets/icons/icon-employment-type.svg';
import { ReactComponent as IconWorkSchedule } from '~/shared/assets/icons/icon-work-schedule.svg';
import { ReactComponent as IconSalary } from '~/shared/assets/icons/icon-salary.svg';
import { Badge } from '~/shared/ui/Badge';
import { ReactComponent as IconEdit } from '~/shared/assets/icons/icon-edit.svg';
import { EditProfilePreferences } from '~/features/editProfilePreferences/ui/EditProfilePreferences';
import { getStringifySalaryForInput } from '~/shared/lib/strings';
import { PreferencesItem } from './PreferencesItem';

export interface ProfilePreferencesProps {
    employmentTypes: Array<EmploymentTypes>;
    workSchedule: Array<WorkSchedule>;
    salary: number | undefined;
    salaryCurrency: SalaryCurrency;
}

export const ProfilePreferences: React.FC<ProfilePreferencesProps> = (
    props
) => {
    const {
        employmentTypes,
        workSchedule,
        salary: initSalary,
        salaryCurrency,
    } = props;
    const salary = getStringifySalaryForInput(initSalary ?? null);
    const [isEditMode, setIsEditMode] = useState(false);
    return (
        <>
            <EditProfilePreferences
                isOpen={isEditMode}
                setIsOpen={setIsEditMode}
                {...props}
                salary={salary}
            />
            <div className={'relative flex w-full flex-col gap-y-2 p-2'}>
                <IconEdit
                    className={
                        'absolute right-0 top-0 h-5 w-5 cursor-pointer fill-sub hover:fill-surface'
                    }
                    onClick={() => {
                        setIsEditMode(true);
                    }}
                />
                <span className={'text-14 font-500 text-text'}>
                    {'Предпочтения'}
                </span>
                <div className={'flex flex-col gap-y-2'}>
                    <PreferencesItem
                        icon={IconWorkSchedule}
                        label={'График работы'}
                    >
                        {workSchedule.map((el) => (
                            <Badge
                                key={el}
                                placeholder={el}
                                className={'bg-mantle py-2 text-14 text-text'}
                            />
                        ))}
                    </PreferencesItem>
                    <PreferencesItem
                        icon={IconEmploymentType}
                        label={'Тип занятости'}
                    >
                        {employmentTypes.map((el) => (
                            <Badge
                                key={el}
                                placeholder={el}
                                className={'bg-mantle py-2 text-14 text-text'}
                            />
                        ))}
                    </PreferencesItem>
                    <div className={'flex w-full flex-row gap-x-3'}>
                        <div className={'flex flex-row items-center gap-x-2'}>
                            <IconSalary className={'h-4 w-4 fill-sub'} />
                            <span className={'text-14 font-500 text-text'}>
                                {salary
                                    ? 'Желаемый уровень дохода:'
                                    : 'Уровень дохода не указан'}
                            </span>
                        </div>
                        {salary && (
                            <span
                                className={'text-14 text-text'}
                            >{`от ${salary} ${salaryCurrency}`}</span>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};
