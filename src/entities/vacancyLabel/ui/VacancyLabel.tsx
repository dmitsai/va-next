import React from 'react';
import { CONSTANTS } from '~/shared/lib/strings';
import { Badge } from '~/shared/ui/Badge';

export const VacancyLabel: React.FC<{
    mode: 'create' | 'edit';
    vacancyTitle?: string;
}> = ({ mode, vacancyTitle }) => {
    const { create, edit } = CONSTANTS.vacancy.label;
    return (
        <div className={'flex w-fit flex-row gap-x-2 text-text'}>
            <p className={'text-32 font-500'}>
                {mode === 'create' ? create : edit}
            </p>
            {mode === 'edit' && !!vacancyTitle && (
                <Badge className={'bg-mantle'} placeholder={vacancyTitle} />
            )}
        </div>
    );
};
