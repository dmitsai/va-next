import React from 'react';
import cn from 'classnames';

type SkeletonVancyProps = React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
>;

export const SkeletonCandidate: React.FC<SkeletonVancyProps> = ({
    className,
    ...other
}) => (
    <div
        className={cn(
            'flex max-h-14 w-full max-w-card flex-row gap-x-1 pl-5 pr-5',
            className
        )}
        {...other}
    >
        <div className={'w-1/4'}>
            <div className={'h-14 w-14 animate-pulse rounded-full bg-mantle'} />
        </div>
        <div className={'flex w-full flex-col gap-y-3 pt-1'}>
            <div className={'h-5 w-full animate-pulse rounded-8 bg-mantle'} />
            <div className={'h-3 w-1/2 animate-pulse rounded-8 bg-mantle'} />
        </div>
    </div>
);
