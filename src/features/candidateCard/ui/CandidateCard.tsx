import React from 'react';
import {
    getDayWMonth,
    getFullName,
    getStringifySalary,
} from '~/shared/lib/strings';
import cn from 'classnames';
import Link from 'next/link';
import { ServerAvatar } from '~/widgets/avatar/ui/ServerAvatar';

export interface CandidateCardProps {
    candidateId: string;
    firstName: string | null | undefined;
    lastName: string | null | undefined;
    applyDate: Date;
    salaryFrom: number | null | undefined;
    currencyChar: string | null;
    vacancyId: string;
    imgUrl: string | null | undefined;

    wrapperClassName?: string;
}

export const CandidateCard: React.FC<CandidateCardProps> = (props) => {
    const {
        candidateId,
        firstName,
        lastName,
        applyDate,
        salaryFrom,
        currencyChar,
        wrapperClassName,
        vacancyId,
        imgUrl,
    } = props;

    const stringifyApplyDate = getDayWMonth(applyDate);
    const stringifyFullname = getFullName({ firstName, lastName });
    const stringifySalary = getStringifySalary(salaryFrom, null, currencyChar);
    return (
        <Link
            href={`/vacancy/candidates/${vacancyId}/${candidateId}`}
            className={cn(
                'flex w-full max-w-card flex-row gap-x-4',
                wrapperClassName
            )}
        >
            <div className={'w-1/4'}>
                <ServerAvatar userAvatarUrl={imgUrl ?? ''} />
            </div>
            <div className={'flex w-full flex-col'}>
                <div className={'flex w-full flex-row justify-between'}>
                    <p className={'text-14 font-600 text-text'}>
                        {stringifyFullname}
                    </p>
                    <p className={'text-10 text-sub'}>{stringifyApplyDate}</p>
                </div>
                <p className={'w-full text-12'}>{stringifySalary}</p>
            </div>
        </Link>
    );
};
