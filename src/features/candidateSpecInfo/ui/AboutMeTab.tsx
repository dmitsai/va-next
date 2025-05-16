'use client';

import React, { useState } from 'react';
import cn from 'classnames';
import Button, { ButtonView } from '~/shared/ui/Button';
import { CONSTANTS } from '~/shared/lib/strings';
import { OptionalString } from '~/shared/lib/types';

export interface AboutMeTabProps {
    aboutMe: OptionalString;
}
export const AboutMeTab: React.FC<AboutMeTabProps> = ({ aboutMe }) => {
    const [isShowMore, setIsShowMore] = useState(false);

    return (
        <>
            {!aboutMe && <div>{'ошибка'}</div>}
            {aboutMe && (
                <div
                    className={cn(
                        'flex w-full flex-col gap-y-5 overflow-hidden text-text'
                    )}
                >
                    <p
                        className={cn(
                            'whitespace-pre-line text-16 font-400',
                            !isShowMore && 'line-clamp-[14]'
                        )}
                    >
                        {aboutMe}
                    </p>
                    {aboutMe.length >= 360 && (
                        <Button
                            onClick={() => {
                                setIsShowMore(!isShowMore);
                            }}
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
            )}
        </>
    );
};
