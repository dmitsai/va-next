'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { HomeLink } from '~/widgets/topBar/ui/HomeLink';
import { Divider } from '~/entities/divider';

const NAV_GROUPS = [
    {
        label: 'Вакансии',
        items: [
            { href: '/admin/vacancies/hh', label: 'HH.ru' },
            { href: '/admin/vacancies/trudvsem', label: 'Труд Всем' },
            { href: '/admin/vacancies/jobicy', label: 'Jobicy' },
            { href: '/admin/vacancies/local', label: 'vakansiy.net' },
        ],
    },
    {
        label: 'Данные',
        items: [
            { href: '/admin/imports', label: 'Импорты' },
            { href: '/admin/users', label: 'Пользователи' },
        ],
    },
];

export const AdminSidebar = () => {
    const pathname = usePathname();

    const isActive = (href: string) => pathname.startsWith(href);

    return (
        <aside className="border-surface0 flex w-48 shrink-0 flex-col bg-base">
            <div className="px-4 pb-2 pt-4">
                <HomeLink href={'/admin/dashboard'} />
            </div>
            <Divider view={'horizontal'} />
            <nav className="flex flex-1 flex-col gap-5 pb-4 pt-2">
                {NAV_GROUPS.map((group) => (
                    <div key={group.label}>
                        <p className="mb-1 px-4 text-14 text-surface">
                            {group.label}
                        </p>
                        <div className="flex flex-col gap-0.5">
                            {group.items.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`px-4 py-1.5 text-12 transition-colors hover:bg-mauve/15 ${
                                        isActive(item.href)
                                            ? 'bg-surface0 font-medium text-text'
                                            : 'text-subtext1 hover:bg-surface0/60 hover:text-text'
                                    }`}
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </div>
                    </div>
                ))}
            </nav>
            <button
                type="button"
                onClick={() => signOut({ callbackUrl: '/admin' })}
                className="w-full px-4 py-1.5 text-left text-14 text-text transition-colors hover:bg-red/15 hover:text-red"
            >
                Выйти
            </button>
        </aside>
    );
};
