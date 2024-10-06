'use client';

import React, { useState } from "react";
import { ReactComponent as EyeIcon } from '~/shared/assets/icons/eye-icon.svg';
import { ReactComponent as ClosedEyeIcon } from '~/shared/assets/icons/closed-eye-icon.svg';
import DefaultInput, { type InputProps } from "../DefaultInput";



export const PasswordInput: React.FC<InputProps> = (props) => {
    const [isHidden, setIsHidden] = useState(true);
    const handleIsHidden = () => {
        setIsHidden(!isHidden);
    };
    return (
        <DefaultInput
            placeholder={'Password'}
            type={isHidden ? 'password' : 'text'}
            className={`!pl-4`}
            labelClassName={'!left-4'}
            iconProps={{
                onClick: handleIsHidden,
                className: 'right-4 !left-auto fill-sub'
            }}
            Icon={isHidden ? ClosedEyeIcon : EyeIcon}
            {...props}
        />
    )
}