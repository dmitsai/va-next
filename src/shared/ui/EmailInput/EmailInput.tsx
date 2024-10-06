import React from "react";
import DefaultInput, { type InputProps } from "../DefaultInput";

export const EmailInput: React.FC<InputProps> = (props) => (
    <DefaultInput placeholder={'name@example.com'} type={'email'} {...props} />
)