import React from 'react';
import cn from 'classnames';
import Image from 'next/image';

export const ServerAvatar: React.FC<{
    userAvatarUrl?: string;
    className?: string;
}> = ({ className, userAvatarUrl }) => (
    <div className={cn('group relative h-20 w-20 rounded-full', className)}>
        {userAvatarUrl ? (
            <Image
                src={userAvatarUrl ?? ''}
                alt={'avatar'}
                width={80}
                height={80}
                className={'rounded-full object-cover'}
            />
        ) : (
            <div
                className={
                    'h-full w-full rounded-full bg-peach group-hover:bg-peach/70'
                }
            />
        )}
    </div>
);
