import React from "react";

export interface BadgeProps {
    placeholder: string;
    className?: string
}
const Badge: React.FC<BadgeProps> = ({ placeholder, className }) => (
    <div className={`flex relative px-3 rounded-xl leading-5 text-12 font-600 ${className}`}>
        {placeholder}
    </div>
)

export {Badge}