import { headers } from 'next/headers';
import { getServerSession } from '~/shared/lib/auth';
import React from 'react';
import { redirect } from 'next/navigation';

export default async ({
    children,
}: Readonly<{ children: React.ReactNode }>) => {
    const session = await getServerSession();
    const headersList = headers();
    const referer = headersList.get('referer');

    if (!session || session.user.role !== 'COMPANY') redirect(referer ?? '/');

    return (
        <div className={'relative flex w-full flex-col px-20 py-10'}>
            {children}
        </div>
    );
};
