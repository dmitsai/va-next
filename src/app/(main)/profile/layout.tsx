import { redirect } from 'next/navigation';
import React from 'react';
import { getServerSession } from '~/shared/lib/auth';

export default async ({
    client,
    company,
}: Readonly<{
    client: React.ReactNode;
    company: React.ReactNode;
}>) => {
    const session = await getServerSession();

    if (!session) {
        redirect('/user/login');
    }
    const isClient = session?.user.role === 'USER';
    const isCompany = session?.user.role === 'COMPANY';

    if (!isClient && !isCompany) {
        redirect('/user/login');
    }
    return (
        <div className={'relative flex w-full flex-col'}>
            {isClient && client}
            {isCompany && company}
        </div>
    );
};
