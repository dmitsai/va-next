import React from "react";
import DefaultInput, { type InputProps } from "~/shared/ui/DefaultInput";

export const PhoneInput: React.FC<InputProps> = (props) => (
    <DefaultInput placeholder={'+7 (777) 777-77-77'} type={'text'} {...props} />
);