import Link from 'next/link';
import type React from 'react';
import { CONSTANTS } from '~/shared/lib/strings';
import Button, { ButtonView } from '~/shared/ui/Button';
import { ReactComponent as IconStar } from '~/shared/assets/icons/icon-star.svg';
import { ReactComponent as IconBell } from '~/shared/assets/icons/icon-bell.svg';
import { ReactComponent as IconUser } from '~/shared/assets/icons/icon-user.svg';
import { type Icon } from '~/shared/lib/types';
import { useSession } from 'next-auth/react';
import { getServerSession } from '~/shared/lib/auth';
import { LinkButton, LinkView } from '~/shared/ui/Button/LinkButtton';
import { ThemePicker } from './ThemePicker';
import { HomeLink } from './HomeLink';

// FIXME: temp solution, fix after add autharization

export interface ButtonContent {
    href: string;
    icon: Icon;
    key: string;
}

export interface LinkItem {
    href: string;
    label: string;
}

export const TopBar: React.FC = async () => {
    const links: Array<LinkItem> = [
        {
            href: './vacancies',
            label: CONSTANTS.topBar.vacancies,
        },
        {
            href: './internships',
            label: CONSTANTS.topBar.internships,
        },
        {
            href: './events',
            label: CONSTANTS.topBar.events,
        },
    ];

    const buttons: Array<ButtonContent> = [
        {
            href: './favourite',
            icon: IconStar,
            key: 'link-favourite',
        },
        {
            href: './profile',
            icon: IconUser,
            key: 'link-profile',
        },
    ];
    const session = await getServerSession();

    const isAuth = !!session;

    return (
        <header
            className={
                'static left-0 right-0 top-0 z-20 flex max-h-16 w-full flex-row justify-between bg-base px-20 py-5'
            }
        >
            <div className={'flex flex-row items-center gap-x-8'}>
                <HomeLink />
                <div className={'flex flex-row gap-x-6'}>
                    {links.map((link) => (
                        <Link
                            key={link.label}
                            href={link.href}
                            className={
                                'muted text-sub-secondary/70 hover:text-text'
                            }
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>
            </div>
            <div className={'flex flex-row gap-x-4'}>
                {!isAuth ? (
                    <div className={'flex flex-row gap-x-1'}>
                        <Button
                            buttonView={ButtonView.SMALL}
                            className={
                                'muted bg-mauve text-base hover:bg-text hover:text-base'
                            }
                        >
                            {CONSTANTS.auth.signUp}
                        </Button>
                        <Button
                            buttonView={ButtonView.SMALL}
                            className={
                                'muted bg-mantle hover:bg-text hover:text-base'
                            }
                        >
                            {CONSTANTS.auth.logIn}
                        </Button>
                    </div>
                ) : (
                    <div
                        className={
                            'flex flex-row items-center justify-center gap-x-4'
                        }
                    >
                        {buttons.map((button) => (
                            <LinkButton
                                href={button.href}
                                key={button.key}
                                linkView={LinkView.SMALL}
                                className={
                                    'bg-mantle !px-1.5 transition-colors hover:bg-text'
                                }
                            >
                                <button.icon
                                    className={
                                        'fill-text group-hover:fill-base group-disabled:fill-sub-secondary/70'
                                    }
                                />
                            </LinkButton>
                        ))}
                    </div>
                )}
                <ThemePicker />
            </div>
        </header>
    );
};
