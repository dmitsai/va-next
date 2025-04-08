'use client';

import React from 'react';
import DefaultInput, { type InputProps } from '~/shared/ui/DefaultInput';


export interface TextInputProps extends InputProps {
    placeholder: string,
}

export const TextInput: React.FC<TextInputProps> = (props) => (
    <DefaultInput type={'text'} {...props} />
)