import React from "react";
import cn from 'classnames';

export const dividerView = {
    horizontal: 'horizontal',
    vertical: 'vertical',

} as const;

export type DividerView = (typeof dividerView)[keyof typeof dividerView];

export interface DividerProps {
    classname?: string,
    view: DividerView
}
export const Divider: React.FC<DividerProps> = ({ classname, view }) => (
    <div className={cn('bg-surface-tertiary', view === dividerView.horizontal ? 'w-full h-[2px]' : 'h-full w-px', classname)} />
)