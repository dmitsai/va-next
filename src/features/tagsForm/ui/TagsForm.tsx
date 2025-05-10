import React from 'react';
import { availableFilters as tags } from '~/entities/vacancies/model/data';
import { CONSTANTS } from '~/shared/lib/strings';
import { Control, FieldValues } from 'react-hook-form';
import { TagItem } from './TagItem';

export interface TagsFormProps {
    control: Control<FieldValues>;
}
export const TagsForm: React.FC<TagsFormProps> = (props) => {
    const { control } = props;
    const r = 1;
    return (
        <div className={'flex w-full flex-col gap-y-8'}>
            <p className={'text-18 text-text'}>
                {CONSTANTS.vacancy.blocks.tags}
            </p>
            <div className={'grid grid-cols-2 gap-x-8 gap-y-12'}>
                {tags.map((tag) => (
                    <TagItem key={tag.name} tag={tag} control={control} />
                ))}
            </div>
        </div>
    );
};
