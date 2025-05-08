'use client';

import React, { useState } from 'react';
import { CONSTANTS, getStringifySalary } from '~/shared/lib/strings';
import cn from 'classnames';
import Button, { ButtonView } from '~/shared/ui/Button';
import { ReactComponent as IconStar } from '~/shared/assets/icons/icon-star.svg';
import { ReactComponent as IconArrow } from '~/shared/assets/icons/icon-arrow.svg';
import { Badge } from '~/shared/ui/Badge';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { type Tags } from '~/shared/api/model/tags/type';
import { getTagArrayWithColors } from '../utils/tagsWithColors';

// FIXME: temp solution for tags

export interface VacancyCardProps {
    vacancyId: string;
    title: string;
    isFavorited: boolean;
    tags: Tags | null;
    description: string;
    company: {
        imgUrl: string | null;
        title: string;
    };
    salaryFrom: number | null;
    salaryTo: number | null;
    wrapperClassName?: string;
    currency: {
        title: string;
        currency_id: string;
        char: string;
    };
}

const parseSalary = (salary: number) => {
    const thousands = Math.floor(salary / 1000).toString();
    const hundreds = (salary % 1000).toString().padStart(3, '0');
    return `${thousands}.${hundreds} ${CONSTANTS.card.currencyChar}`;
};

export const VacancyCard: React.FC<VacancyCardProps> = (props) => {
    const {
        vacancyId,
        title,
        isFavorited: initialIsFavoritedState,
        tags,
        description,
        company,
        salaryFrom,
        salaryTo,
        currency,
        wrapperClassName,
    } = props;

    const searchParams = useSearchParams();
    const params = new URLSearchParams(searchParams.toString());

    const [isFavorited, setIsFavorited] = useState(initialIsFavoritedState);

    const handleIsFavorited = () => {
        // FIXME: add internship to favorited later
        setIsFavorited(!isFavorited);
    };

    const tagArrayWithColors = getTagArrayWithColors(tags);

    return (
        <Link
            href={`/vacancies/${vacancyId}?${params}`}
            className={cn(
                'card group w-full border-2 border-base bg-mantle transition-colors',
                wrapperClassName
            )}
        >
            <div className={'flex w-full flex-col items-start'}>
                <div
                    className={
                        'group flex w-full flex-row items-center justify-between'
                    }
                >
                    <p className={'text-14 font-500 leading-6 text-text'}>
                        {title}
                    </p>
                    <Button
                        buttonView={ButtonView.SMALL}
                        className={
                            'group/favorite h-6 w-6 !px-1.5 opacity-0 duration-300 hover:bg-mantle group-hover:opacity-100'
                        }
                        onClick={(e) => {
                            e.preventDefault();
                            handleIsFavorited();
                        }}
                    >
                        <IconStar
                            className={cn(
                                'absolute',
                                isFavorited
                                    ? 'fill-yellow stroke-none'
                                    : 'fill-none stroke-text group-hover/favorite:stroke-yellow'
                            )}
                        />
                    </Button>
                </div>
                <p className={'fot-400 text-14 leading-5 text-text'}>
                    {getStringifySalary(salaryFrom, salaryTo, currency.char)}
                </p>
            </div>
            <div className={'relative h-full w-full'}>
                {/* FIXME: temp solution for display valid count of tags */}
                <div
                    className={
                        'flex h-12 max-h-card-tags flex-wrap gap-1 overflow-hidden opacity-100 transition-all duration-300 group-hover:opacity-0'
                    }
                >
                    {tagArrayWithColors.map((tag) => (
                        <Badge
                            key={tag.name.trim()}
                            placeholder={tag.name}
                            className={cn('h-5 text-base', `bg-${tag.color}`)}
                        />
                    ))}
                </div>
                <p
                    className={
                        'absolute inset-0 line-clamp-2 max-h-fit w-full text-14 font-400 leading-5 text-text opacity-0 transition-all duration-300 group-hover:opacity-100'
                    }
                >
                    {description}
                </p>
            </div>
            <div
                className={
                    'absolute bottom-3 left-0 right-0 flex w-full flex-row items-end justify-between pl-1 pr-4'
                }
            >
                {/* Add Avatar of company later */}
                <Badge
                    className={
                        'flex max-h-6 max-w-36 flex-wrap rounded-16 py-1.5 text-14 font-500 leading-5 text-sub'
                    }
                    placeholder={company.title}
                />
                <Button
                    onClick={(e) => {
                        e.preventDefault();
                    }}
                    buttonView={ButtonView.SMALL}
                    className={
                        'bg-mauve text-base opacity-0 transition-all duration-300 hover:bg-text group-hover:opacity-100'
                    }
                >
                    <IconArrow className={'fill-base'} />
                    <p className={'text-12 font-500 leading-6'}>
                        {CONSTANTS.card.apply}
                    </p>
                </Button>
            </div>
        </Link>
    );
};
