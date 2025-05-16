import React from 'react';
import {
    getDayWMonth,
    getFullName,
    getStringifySalary,
} from '~/shared/lib/strings';
import cn from 'classnames';
import Link from 'next/link';

export interface CandidateCardProps {
    candidateId: string;
    firstName: string | null | undefined;
    lastName: string | null | undefined;
    applyDate: Date;
    salaryFrom: number | null | undefined;
    currencyChar: string | null;
    vacancyId: string;

    wrapperClassName?: string;
}

// TODO: replace after add avatar component

export const Avatar: React.FC<{ id: string; className?: string }> = ({
    id,
    className,
}) => (
    <div
        key={id}
        className={cn(
            'flex h-14 w-14 flex-col items-center justify-center rounded-full bg-peach',
            className
        )}
    >
        {'AVA'}
    </div>
);
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
            <Avatar id={candidateId} />
            <div className={'flex w-fit flex-col'}>
                <div className={'flex flex-row gap-x-8'}>
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
