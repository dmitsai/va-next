import React from 'react';
import { getFullName } from '~/shared/lib/strings';
import { ServerAvatar } from '~/widgets/avatar/ui/ServerAvatar';
import { CandidatePersonalInfoProps } from '../model/type';

export const CandidatePersonalInfo: React.FC<CandidatePersonalInfoProps> = (
    props
) => {
    const { firstName, lastName, patronymic, imgUrl, userId } = props;

    const fullName = getFullName({ firstName, lastName, patronymic });

    return (
        <div className={'flex w-fit flex-row gap-x-10'}>
            <ServerAvatar
                userAvatarUrl={imgUrl ?? ''}
                className={'!h-20 !w-20'}
            />
            <span className={'text-wrap text-24 font-500 text-text'}>
                {fullName}
            </span>
            {/* TODO: replace afrer add avatar component */}
        </div>
    );
};
