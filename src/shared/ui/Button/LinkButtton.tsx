import React, { AnchorHTMLAttributes } from "react";
import cn from 'classnames';
import Link, { LinkProps } from "next/link";

export const LinkView = {
    SMALL: 'small',
    LARGE: 'large',
} as const;

export type LinkViewType = (typeof LinkView)[keyof typeof LinkView];

export interface LinkButtonProps extends LinkProps, Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>  {
    linkView: LinkViewType;
}
  

const LinkButton: React.FC<LinkButtonProps> = (props) => {
    const { children, linkView, className, href, ...other } = props;
    return (

        <Link href={href} {...other} className={cn(linkView === LinkView.SMALL ? 'py-1.5 px-3 max-h-6' : 'px-4 py-3 max-h-10', 'relative group flex flex-row gap-x-2 items-center justify-center rounded-6 outline-none disabled:text-sub-secondary/70 disabled:bg-surface-tertiary transition-colors', className)}>
            {children}
        </Link>

    )
}

export { LinkButton }
