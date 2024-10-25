'use client';

import React, { useState } from "react";
import Card, { type CardWrapperProps } from "~/entities/cardWrapper";
import Button, { ButtonView } from "~/shared/ui/Button";
import { ReactComponent as IconStar } from '~/shared/assets/icons/icon-star.svg';
import { ReactComponent as IconArrow } from '~/shared/assets/icons/icon-arrow.svg';
import cn from 'classnames';

import { Badge } from "~/shared/ui";
import { CONSTANTS } from "~/shared/lib/strings";

export interface InternshipCardProps {
    title: string,
    isFavorited: boolean,
    tags: string[],
    description: string,
    company: {
        imgUrl?: string,
        title: string,
    }
    wrapperProps?: CardWrapperProps
}

export const InternshipCard: React.FC<InternshipCardProps> = (props) => {
    const { title, isFavorited: initialIsFavoritedState, tags, description, company, wrapperProps } = props;

    const [isFavorited, setIsFavorited] = useState(initialIsFavoritedState);

    const handleIsFavorited = () => {
        // FIXME: add internship to favorited later
        setIsFavorited(!isFavorited);
    }

    return (
        // FIXME: remove default bg style for card
        <Card className={cn('w-full bg-green', wrapperProps?.className)}>
            <div className={'group flex flex-row w-full justify-between items-center'}>
                <h3 className={'text-base'}>{title}</h3>
                <Button buttonView={ButtonView.SMALL} className={'group/favorite group-hover:opacity-100 opacity-0 !px-1.5 hover:bg-text bg-mantle transition-all duration-400 w-6 h-6'} onClick={handleIsFavorited}>
                    <IconStar className={cn('absolute', isFavorited ? 'fill-yellow stroke-none' : 'fill-none stroke-text group-hover/favorite:stroke-base')} />
                </Button>
            </div>
            <div className={'relative h-full w-full'}>
                {/* FIXME: temp solution for display valid count of tags */}
                <div className={'flex flex-wrap gap-1 max-h-[68px] overflow-hidden group-hover:opacity-0 opacity-100 transition-all duration-300'}>
                    {
                        tags.map(tag => (<Badge key={tag} placeholder={tag} className={'bg-base text-text h-5'} />))
                    }
                </div>
                <p className={'absolute inset-0 group-hover:opacity-100 opacity-0 line-clamp-3 font-400 text-14 leading-5 text-base max-h-card-description w-full transition-all duration-300'}>
                    {description}
                </p>
            </div>
            <div className={'absolute bottom-3 left-0 right-0 flex flex-row justify-between items-end w-full px-4'}>
                {/* Add Avatar of company later */}
                <Badge className={'font-500 text-14 leading-5 text-sub bg-base py-1.5 !rounded-16 flex flex-wrap max-w-36'} placeholder={company.title} />
                <Button buttonView={ButtonView.LARGE} className={'text-text bg-mantle hover:bg-text hover:text-base group-hover:opacity-100 opacity-0 group/button transition-all duration-400'}>
                    <IconArrow className={'fill-text group-hover/button:fill-base'} />
                    <p className={'text-14 font-500 leading-6'}>{CONSTANTS.card.apply}</p>
                </Button>
            </div>
        </Card>
    )
}