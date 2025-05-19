// FIXME: add view when small size of content
import { headers } from 'next/headers';
import { createSSRHelpers } from 'trpc/helpers';
import { VacancyDescription } from '~/features/vacancyDescription';
import { VacancyHeader } from '~/features/vacancyHeader';
import { CONSTANTS, getStringifySalary } from '~/shared/lib/strings';

export default async ({ params }: { params: { vacancyId: string } }) => {
    const helpers = await createSSRHelpers(headers());

    const vacancy = await helpers.vacancy.getVacancyItem.fetch({
        vacancyId: params.vacancyId,
    });

    return (
        <main className={'flex w-full flex-col gap-y-8'}>
            <VacancyHeader
                avatar={vacancy.company.imgUrl}
                company={vacancy.company}
                title={vacancy.title}
                tags={vacancy.tags}
                isFavorited={false}
                isApplied={false}
            />
            <span className={'text-32 font-600'}>
                {getStringifySalary(
                    vacancy.salaryFrom,
                    vacancy.salaryTo,
                    vacancy.currency.char
                )}
            </span>
            <VacancyDescription description={vacancy.description} />
        </main>
    );
};
