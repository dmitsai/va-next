'use client';
import Link from "next/link";
import React from "react";
import { CONSTANTS } from "~/shared/lib/strings";
import Button, { ButtonView } from "~/shared/ui/Button";
import { ReactComponent as IconStar } from '~/shared/assets/icons/icon-star.svg';
import { ReactComponent as IconBell } from '~/shared/assets/icons/icon-bell.svg';
import { ReactComponent as IconUser } from '~/shared/assets/icons/icon-user.svg';
import { ReactComponent as IconMoon } from '~/shared/assets/icons/icon-moon.svg';
import { ReactComponent as IconSun } from '~/shared/assets/icons/icon-sun.svg';
import { Theme, useTheme } from "~/shared/lib/theme";

// FIXME: temp solution, fix after add autharization 

export interface TopBarProps {
    isAuth: boolean;
}

export const TopBar: React.FC<TopBarProps> = ({ isAuth }) => {
    const { theme, switchTheme } = useTheme();
    return (
        <header className={'fixed top-0 left-0 right-0 flex flex-row w-full py-5 px-20 justify-between'}>
            <div className={'flex flex-row gap-x-8 items-center'}>
                <Link className={'text-14 font-700 leading-6 text-text'} href={"./"}>{CONSTANTS.topBar.placeholder}</Link>
                <div className={'flex flex-row gap-x-6 opacity-70 muted text-sub'}>
                    <Link href={"./vacancies"} >{CONSTANTS.topBar.vacancies}</Link>
                    <Link href={"./internships"} >{CONSTANTS.topBar.internships}</Link>
                    <Link href={"./events"} >{CONSTANTS.topBar.events}</Link>
                </div>
            </div>
            <div className={'flex flex-row gap-x-4'}>
                {
                    !isAuth ?
                        <div className={'flex flex-row gap-x-1'}>
                            <Button buttonView={ButtonView.SMALL} className={'muted bg-mauve text-base'} >{CONSTANTS.auth.signUp}</Button>
                            <Button buttonView={ButtonView.SMALL} className={'muted bg-mantle'} >{CONSTANTS.auth.logIn}</Button>
                        </div>
                        :
                        <div className={'flex flex-row gap-x-4 items-center justify-center'}>
                            <Button buttonView={ButtonView.SMALL} className={'bg-mantle !px-1.5'}>
                                <IconStar className={'fill-text'} />
                            </Button>
                            <Button buttonView={ButtonView.SMALL} className={'bg-mantle !px-1.5'}>
                                <IconBell className={'fill-text'} />
                            </Button>
                            <Button buttonView={ButtonView.SMALL} className={'bg-mantle !px-1.5'}>
                                <IconUser className={'fill-text'} />
                            </Button>
                        </div>
                }

                <Button buttonView={ButtonView.SMALL} onClick={() => { switchTheme() }} className={'bg-mantle !px-1.5'}>
                    {theme === Theme.LIGHT ? <IconMoon className={'fill-text'} /> : <IconSun className={'fill-text'} />}
                </Button>
            </div>
        </header>
    )
}