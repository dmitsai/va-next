import React from "react";

export interface BadgeProps {
    placeholder:string;
    className?:string
}
export const Badge:React.FC<BadgeProps> = ({placeholder,className}) => {

    return (
        <span className={`flex relative badge px-3 rounded-xl ${className}`}>
            {placeholder}
        </span>
    );
}