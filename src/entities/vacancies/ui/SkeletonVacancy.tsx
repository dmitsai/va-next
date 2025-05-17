import React from 'react';
import cn from 'classnames';

type SkeletonVancyProps = React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
>;
export const SkeletonVancy: React.FC<SkeletonVancyProps> = ({
    className,
    ...other
}) => (
    <div className={cn('card animate-pulse bg-mantle', className)} {...other} />
);
