import React from 'react';
import { getFullName } from '~/shared/lib/strings';
import { Avatar } from '~/features/candidateCard/ui/CandidateCard';
import { CandidatePersonalInfoProps } from '../model/type';

export const CandidatePersonalInfo: React.FC<CandidatePersonalInfoProps> = (
    props
) => {
    const { firstName, lastName, patronymic, imgUrl, userId } = props;

    const fullName = getFullName({ firstName, lastName, patronymic });

    return (
        <div className={'flex w-fit flex-row gap-x-10'}>
            <Avatar id={userId} className={'!h-20 !w-20'} />
            <span className={'text-wrap text-24 font-500 text-text'}>
                {fullName}
            </span>
            {/* TODO: replace afrer add avatar component */}
        </div>
    );
};
