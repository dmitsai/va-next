import React from "react";
import { ReactComponent as SearchIcon } from '~/shared/assets/icons/search-icon.svg';
import DefaultInput, { type InputProps } from "../DefaultInput";

export const SearchInput: React.FC<InputProps> = (props) => (
    <DefaultInput placeholder={'Search...'} Icon={SearchIcon} iconProps={{ className: 'fill-sub' }} {...props} />
)