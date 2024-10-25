'use client';

import React from "react"
import Card, { CardWrapperProps } from "~/entities/cardWrapper";
import { CONSTANTS } from "~/shared/lib/strings";
import Button, { ButtonView } from "~/shared/ui/Button";
import { ReactComponent as IconEventDark } from '~/shared/assets/icons/icon-event-dark.svg';
import { ReactComponent as IconEventLight } from '~/shared/assets/icons/icon-event-light.svg'
import Image from 'next/image';
import cn from 'classnames';
import { Theme, useTheme } from "~/shared/lib/theme";

export interface EventCardProps {
    title: string,
    date: string, // timestamp
    imgUrl?: string,
    region: string,
    wrapperProps?: CardWrapperProps
}

// FIXME: add formating of date
function formatDate(timestamp: string) {
    const date = new Date(Number(timestamp) * 1000);
    const monthNumber = (date.getMonth());
    const month = CONSTANTS.months[monthNumber];
    const day = date.getDate();
    return `${day} ${month}`;
}

export const EventCard: React.FC<EventCardProps> = (props) => {
    const { title, date, imgUrl, region, wrapperProps } = props;
    const { theme } = useTheme();
    const EventIcon = theme === Theme.dark ? IconEventDark : IconEventLight;
    const formatedDate = formatDate(date);
    return (
        <div className={'flex flex-col gap-y-2 w-full max-w-card'}>
            <Card className={cn('w-full !px-0 !py-0 !h-max-event-card', wrapperProps?.className)}>
                {!imgUrl && <h3 className={'absolute top-3 left-3 text-text'}>{title}</h3>}
                {
                    imgUrl ? <Image src={imgUrl} className={'w-full h-full object-cover'} alt={'Event'} /> : <EventIcon className={'w-full h-full'} />
                }
            </Card>
            <div className={'flex flex-row w-full items-center justify-between'}>
                <div className={'flex flex-col'}>
                    <p className={'text-14 font-500 leading-6 text-text'}>{title}</p>
                    <p className={'text-12 font-500 leading-5 text-sub-secondary/70'}>{`${formatedDate}, ${region}`}</p>
                </div>
                <Button buttonView={ButtonView.LARGE} className={'bg-mantle text-text'}>
                    <p className={'text-14 font-500 leading-6'}>{CONSTANTS.card.learnMore}</p>
                </Button>
            </div>
        </div>
    )
}