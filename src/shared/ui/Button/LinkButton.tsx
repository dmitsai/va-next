import React, { AnchorHTMLAttributes } from 'react';
import cn from 'classnames';
import Link, { LinkProps } from 'next/link';

export const LinkView = {
    SMALL: 'small',
    LARGE: 'large',
} as const;

export type LinkViewType = (typeof LinkView)[keyof typeof LinkView];

export interface LinkButtonProps
    extends LinkProps,
        Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
    linkView: LinkViewType;
}

const LinkButton: React.FC<LinkButtonProps> = (props) => {
    const { children, linkView, className, href, ...other } = props;
    return (
        <Link
            href={href}
            {...other}
            className={cn(
                linkView === LinkView.SMALL
                    ? 'max-h-6 px-3 py-1.5'
                    : 'max-h-10 px-4 py-3',
                'group relative flex flex-row items-center justify-center gap-x-2 rounded-6 outline-none transition-colors disabled:bg-surface-tertiary disabled:text-sub-secondary/70',
                className
            )}
        >
            {children}
        </Link>
    );
};

export { LinkButton };
