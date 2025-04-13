import Link from "next/link";
import type React from "react";
import { CONSTANTS } from "~/shared/lib/strings";
import Button, { ButtonView } from "~/shared/ui/Button";
import { ReactComponent as IconStar } from '~/shared/assets/icons/icon-star.svg';
import { ReactComponent as IconBell } from '~/shared/assets/icons/icon-bell.svg';
import { ReactComponent as IconUser } from '~/shared/assets/icons/icon-user.svg';
import { type Icon } from "~/shared/lib/types";
import { ThemePicker } from "./ThemePicker";

// FIXME: temp solution, fix after add autharization 

export interface TopBarProps {
    isAuth: boolean;
}

export interface ButtonContent {
    icon: Icon,
    key: string,
}

export interface LinkItem {
    href: string,
    label: string,
}

export const TopBar: React.FC<TopBarProps> = ({ isAuth }) => {
    const links: Array<LinkItem> = [
        {
            href: './vacancies',
            label: CONSTANTS.topBar.vacancies
        },
        {
            href: './internships',
            label: CONSTANTS.topBar.internships
        },
        {
            href: './events',
            label: CONSTANTS.topBar.events
        },
    ];

    const buttons: Array<ButtonContent> = [
        {
            icon: IconStar,
            key: 'link-favourite'

        },
        {
            icon: IconBell,
            key: 'link-notification'
        },
        {
            icon: IconUser,
            key: 'link-profile'
        }
    ];

    return (
        <header className={'static bg-base z-20 top-0 left-0 right-0 flex flex-row w-full py-5 px-20 justify-between max-h-16'}>
            <div className={'flex flex-row gap-x-8 items-center'}>
                <Link className={'text-14 font-700 leading-6 text-text hover:text-sub/70'} href={"/"}>{CONSTANTS.topBar.placeholder}</Link>
                <div className={'flex flex-row gap-x-6'}>
                    {
                        links.map(link => (
                            <Link key={link.label} href={link.href} className={'muted text-sub-secondary/70 hover:text-text'}>
                                {link.label}
                            </Link>
                        ))
                    }
                </div>
            </div>
            <div className={'flex flex-row gap-x-4'}>
                {
                    !isAuth ?
                        <div className={'flex flex-row gap-x-1'}>
                            <Button buttonView={ButtonView.SMALL} className={'muted bg-mauve  hover:text-base hover:bg-text  text-base'} >{CONSTANTS.auth.signUp}</Button>
                            <Button buttonView={ButtonView.SMALL} className={'muted bg-mantle hover:text-base hover:bg-text'} >{CONSTANTS.auth.logIn}</Button>
                        </div>
                        :
                        <div className={'flex flex-row gap-x-4 items-center justify-center'}>
                            {
                                buttons.map(button => (
                                    <Button key={button.key} buttonView={ButtonView.SMALL} className={'bg-mantle  hover:bg-text  !px-1.5  transition-colors'}>
                                        <button.icon className={'fill-text group-disabled:fill-sub-secondary/70 group-hover:fill-base'} />
                                    </Button>
                                ))
                            }
                        </div>
                }
                <ThemePicker />
            </div>
        </header>
    )
}