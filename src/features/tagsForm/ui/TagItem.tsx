import { type FilterItem as Tag } from '~/entities/vacancies';
import React from 'react';
import { Checkbox } from '~/shared/ui/checkbox';
import { Control, FieldValues } from 'react-hook-form';

export interface TagItemProps {
    tag: Tag;
    control: Control<FieldValues>;
}

export const TagItem: React.FC<TagItemProps> = ({ tag, control }) => {
    const { localTitle, value } = tag;
    return (
        <div className={'flex w-full flex-row text-text'}>
            <span className={'w-full max-w-select text-16 font-600'}>
                {localTitle}
            </span>
            <div className={'flex w-full flex-row gap-x-8'}>
                {value.map((value) => (
                    <Checkbox
                        wrapperClassName={'!w-fit'}
                        control={control}
                        key={value.name}
                        name={value.name}
                        label={value.localTitle}
                    />
                ))}
            </div>
        </div>
    );
};
