import React from "react";

export interface BadgeProps {
    placeholder: string;
    className?: string;
    title?: string;
}
export const Badge: React.FC<BadgeProps> = ({ placeholder, className, title }) => (
    <div
        className={`flex relative px-3 rounded-xl leading-5 text-12 font-600 w-fit ${className}`}
        title={title}
    >
        {placeholder}
    </div>
);