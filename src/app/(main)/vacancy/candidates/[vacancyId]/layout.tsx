import { headers } from 'next/headers';
import React from 'react';
import { createSSRHelpers } from 'trpc/helpers';
import { Badge } from '~/shared/ui/Badge';

export default async ({
    detailed,
    list,
    params,
}: Readonly<{
    detailed: React.ReactNode;
    list: React.ReactNode;
    params: { vacancyId: string };
}>) => {
    const helpers = await createSSRHelpers(headers());
    const vacancy = await helpers.vacancy.getVacancyItem.fetch({
        vacancyId: params.vacancyId,
    });

    return (
        <main className={'relative flex max-h-page w-full flex-col gap-y-10'}>
            <div className={'flex w-full flex-row items-center gap-x-4'}>
                <p className={'text-32 font-500'}> {`Отклики на вакансию:`}</p>
                <Badge
                    placeholder={vacancy.title}
                    className={
                        'items-center justify-center bg-mantle py-6 text-24'
                    }
                />
            </div>
            <div className={'flex w-full flex-row gap-x-10'}>
                {list}
                {detailed}
            </div>
        </main>
    );
};
