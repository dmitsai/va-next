// NOTE: add navigation logic after add auth flow

import React from "react";
import { Divider, dividerView } from "~/entities/divider";
import { CONSTANTS } from "~/shared/lib/strings";
import { LinkButton, LinkView } from "~/shared/ui/Button/LinkButtton";

export const AuthBlock: React.FC = () => (
    <div className={'flex flex-col gap-y-8 w-full'}>
        <div className={'w-full flex flex-row items-center gap-x-1'}>
            <Divider view={dividerView.horizontal} />
            <span className={'text-sub text-12'}>{'или'}</span>
            <Divider view={dividerView.horizontal} />
        </div>
        <div className={'flex flex-row w-full gap-x-5 items-center'}>
            <span className={'text-text text-14 w-full'}>
                {
                    CONSTANTS.auth.description
                }
            </span>
            <div className={'flex flex-col gap-y-2 w-full h-full'}>
                <LinkButton href='./user/auth' className={'muted bg-mauve hover:text-base hover:bg-text text-base text-14'} linkView={LinkView.LARGE} >{CONSTANTS.auth.signUp}</LinkButton>
                <LinkButton href='./user/login' className={'muted bg-mantle hover:text-base hover:bg-text text-14'} linkView={LinkView.LARGE} >{CONSTANTS.auth.logIn}</LinkButton>
            </div>
        </div>
    </div>
)