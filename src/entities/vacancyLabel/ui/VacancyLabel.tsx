import React from 'react';
import { CONSTANTS } from '~/shared/lib/strings';
import { Badge } from '~/shared/ui/Badge';

export const VacancyLabel: React.FC<{
    mode: 'create' | 'edit';
    vacancyTitle?: string;
}> = ({ mode, vacancyTitle }) => {
    const { create, edit } = CONSTANTS.vacancy.label;
    return (
        <div className={'flex w-fit flex-row items-center gap-x-8 text-text'}>
            <p className={'text-32 font-500'}>
                {mode === 'create' ? create : edit}
            </p>
            {mode === 'edit' && !!vacancyTitle && (
                <Badge
                    className={
                        'items-center justify-center bg-mantle py-6 text-24'
                    }
                    placeholder={vacancyTitle}
                />
            )}
        </div>
    );
};
