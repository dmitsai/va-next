'use client';

import React, { useLayoutEffect, useRef, useState } from 'react';
import { CONSTANTS } from '~/shared/lib/strings';
import Button, { ButtonView } from '~/shared/ui/Button';
import cn from 'classnames';

export interface VacancyDescriptionProps {
    description: string;
}

export const VacancyDescription: React.FC<VacancyDescriptionProps> = ({
    description,
}) => {
    const [isShowMore, setIsShowMore] = useState(false);
    const [canToggle, setCanToggle] = useState(false);
    const textRef = useRef<HTMLParagraphElement>(null);

    useLayoutEffect(() => {
        setIsShowMore(false);
    }, [description]);

    useLayoutEffect(() => {
        const el = textRef.current;
        if (!el || isShowMore) return;

        const update = () => {
            setCanToggle(el.scrollHeight > el.clientHeight + 1);
        };

        update();

        const observer = new ResizeObserver(update);
        observer.observe(el);
        return () => observer.disconnect();
    }, [description, isShowMore]);

    const handleToggle = () => {
        const next = !isShowMore;
        setIsShowMore(next);
        if (!next) {
            textRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    };

    const showToggle = canToggle || isShowMore;

    return (
        <div
            className={cn(
                'flex w-full flex-col gap-y-5 overflow-hidden text-text'
            )}
        >
            <p
                ref={textRef}
                className={cn(
                    'break-words whitespace-pre-line text-16 font-400',
                    !isShowMore && 'line-clamp-[14]'
                )}
            >
                {description}
            </p>
            {showToggle && (
                <Button
                    onClick={handleToggle}
                    buttonView={ButtonView.LARGE}
                    className={
                        'bg-mantle text-text transition-colors hover:bg-text hover:text-base'
                    }
                >
                    {isShowMore
                        ? CONSTANTS.showButton.less
                        : CONSTANTS.showButton.more}
                </Button>
            )}
        </div>
    );
};
