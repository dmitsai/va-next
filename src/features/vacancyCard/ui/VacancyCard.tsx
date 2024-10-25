'use client';

import React, { useState } from "react"
import Card, { type CardWrapperProps } from "~/entities/cardWrapper"
import { CONSTANTS } from "~/shared/lib/strings";
import cn from 'classnames';
import Button, { ButtonView } from "~/shared/ui/Button";
import { ReactComponent as IconStar } from '~/shared/assets/icons/icon-star.svg';
import { ReactComponent as IconArrow } from '~/shared/assets/icons/icon-arrow.svg';
import { Badge } from "~/shared/ui/Badge";

// FIXME: temp solution for tags

export interface Tags {
    label: string,
    color: string,
}

export interface InternshipCardProps {
    title: string,
    isFavorited: boolean,
    tags: Array<Tags>,
    description: string,
    company: {
        imgUrl?: string,
        title: string,
    },
    salary: number,
    wrapperProps?: CardWrapperProps
}

const parseSalary = (salary: number) => {
    const thousands = Math.floor(salary / 1000).toString();
    const hundreds = (salary % 1000).toString().padStart(3, '0')
    return `${thousands}.${hundreds} ${CONSTANTS.card.currencyChar}`
}

export const VacancyCard: React.FC<InternshipCardProps> = (props) => {
    const { title, isFavorited: initialIsFavoritedState, tags, description, company, salary: numberSalary, wrapperProps } = props;
    const salary = parseSalary(numberSalary);

    const [isFavorited, setIsFavorited] = useState(initialIsFavoritedState);

    const handleIsFavorited = () => {
        // FIXME: add internship to favorited later
        setIsFavorited(!isFavorited);
    }

    return (
        <Card className={cn('w-full bg-mantle', wrapperProps?.className)}>
            <div className={'flex flex-col items-start w-full'}>
                <div className={'group flex flex-row w-full justify-between items-center'}>
                    <p className={'text-text text-14 font-500 leading-6'}>{title}</p>
                    <Button buttonView={ButtonView.SMALL} className={'group/favorite group-hover:opacity-100  opacity-0 hover:bg-mantle !px-1.5 duration-300 w-6 h-6'} onClick={handleIsFavorited}>
                        <IconStar className={cn('absolute', isFavorited ? 'fill-yellow stroke-none' : 'fill-none stroke-text group-hover/favorite:stroke-base')} />
                    </Button>
                </div>
                <p className={'text-text fot-400 text-14 leading-5'}>{salary}</p>
            </div>
            <div className={'relative h-full w-full'}>
                {/* FIXME: temp solution for display valid count of tags */}
                <div className={'flex flex-wrap gap-1 max-h-[68px] overflow-hidden group-hover:opacity-0 opacity-100 transition-all duration-300'}>
                    {
                        tags.map(tag => (<Badge key={tag.label.trim()} placeholder={tag.label} className={cn('text-base h-5', `${tag.color}`)} />))
                    }
                </div>
                <p className={'absolute inset-0 group-hover:opacity-100 opacity-0 line-clamp-2  font-400 text-14 leading-5 text-text max-h-fit transition-all duration-300 w-full'}>
                    {description}
                </p>
            </div>
            <div className={'absolute bottom-3 left-0 right-0 flex flex-row justify-between items-end w-full pl-1 pr-4'}>
                {/* Add Avatar of company later */}
                <Badge className={'font-500 text-14 leading-5 text-sub py-1.5 rounded-16 flex flex-wrap max-w-36 max-h-6'} placeholder={company.title} />
                <Button buttonView={ButtonView.SMALL} className={'text-base bg-mauve hover:bg-text group-hover:opacity-100 opacity-0 transition-all duration-300'}>
                    <IconArrow className={'fill-base'} />
                    <p className={'text-12 font-500 leading-6'}>{CONSTANTS.card.apply}</p>
                </Button>
            </div>
        </Card>
    )
}