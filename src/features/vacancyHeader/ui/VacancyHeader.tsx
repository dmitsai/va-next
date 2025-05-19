'use client';

import React, { useEffect, useState } from 'react';
import { CONSTANTS } from '~/shared/lib/strings';
import Button, { ButtonView } from '~/shared/ui/Button';
import { ReactComponent as IconStar } from '~/shared/assets/icons/icon-star.svg';
import { ReactComponent as IconArrow } from '~/shared/assets/icons/icon-arrow.svg';
import { ReactComponent as IconInfo } from '~/shared/assets/icons/icon-sonner-error.svg';
import cn from 'classnames';
import { Tags } from '~/shared/api/model/tags/type';
import { ServerAvatar } from '~/widgets/avatar/ui/ServerAvatar';

export interface VacancyHeaderProps {
    company: {
        imgUrl: string | null;
        title: string;
    };
    avatar: string | null;
    title: string;
    tags: Tags | null;
    isFavorited: boolean;
    isApplied: boolean;
}
export const VacancyHeader: React.FC<VacancyHeaderProps> = (props) => {
    const {
        company,
        title,
        tags: objectTags,
        isFavorited: initialIsFavorited,
        isApplied: initialIsApplied,
        avatar,
    } = props;

    const [isFavorited, setIsFavorited] = useState(initialIsFavorited);

    const [isApplied, setIsApplied] = useState(initialIsApplied);
    const tags = Object.values(objectTags ?? {}).flatMap((tag) => tag);

    return (
        <div className={'flex w-full flex-col gap-y-5'}>
            <div className={'flex w-full flex-row gap-x-5'}>
                {!avatar ? (
                    <div
                        className={
                            'flex h-20 w-20 items-center justify-center rounded-full bg-peach text-base'
                        }
                    >
                        {'AVATAR'}
                    </div>
                ) : (
                    <ServerAvatar userAvatarUrl={avatar} />
                )}
                <div
                    className={
                        'flex w-fit flex-col items-start gap-y-2 font-600 text-text'
                    }
                >
                    <span className={'text-20'}>{title}</span>
                    <div
                        className={
                            'flex flex-wrap items-center gap-x-4 gap-y-2 text-18'
                        }
                    >
                        <span>{company.title}</span>
                        <ul
                            className={
                                'flex flex-wrap items-center gap-x-4 gap-y-2 pl-0'
                            }
                        >
                            {tags.map((tag) => (
                                <li
                                    key={`vacancy-header-tag-${tag}`}
                                    className={
                                        'ml-4 list-disc first:ml-0 first:list-none'
                                    }
                                >
                                    {tag}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
            <div className={'flex w-full flex-row items-start gap-x-5'}>
                <Button
                    disabled={isApplied}
                    onClick={() => {
                        setIsApplied(true);
                    }}
                    buttonView={ButtonView.LARGE}
                    className={cn(
                        'bg-mauve text-base transition-all hover:bg-text'
                    )}
                >
                    {isApplied ? (
                        <IconInfo className={'fill-sub-secondary/70'} />
                    ) : (
                        <IconArrow className={'fill-base'} />
                    )}
                    <p className={'text-12 font-500 leading-6'}>
                        {isApplied
                            ? CONSTANTS.detailedVacancy.apply.exist
                            : CONSTANTS.detailedVacancy.apply.add}
                    </p>
                </Button>
                <Button
                    onClick={() => {
                        setIsFavorited(!isFavorited);
                    }}
                    buttonView={ButtonView.LARGE}
                    className={cn(
                        'bg-mantle text-text transition-all hover:bg-text hover:text-base',
                        isFavorited ? '' : ''
                    )}
                >
                    <IconStar
                        className={cn(
                            '',
                            isFavorited
                                ? 'fill-yellow stroke-yellow'
                                : 'fill-base stroke-text group-hover:stroke-base'
                        )}
                    />
                    <p className={'text-12 font-500 leading-6'}>
                        {isFavorited
                            ? CONSTANTS.detailedVacancy.favorite.remove
                            : CONSTANTS.detailedVacancy.favorite.add}
                    </p>
                </Button>
            </div>
        </div>
    );
};
