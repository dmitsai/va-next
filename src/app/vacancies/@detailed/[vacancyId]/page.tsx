// FIXME: add view when small size of content
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import { createSSRHelpers } from 'trpc/helpers';
import { VacancyDescription } from '~/features/vacancyDescription';
import { VacancyHeader } from '~/features/vacancyHeader';
import type { Tags } from '~/shared/api/model/tags/type';
import { getStringifySalary } from '~/shared/lib/strings';

const VacancyDetailPage = async ({
    params,
}: {
    params: { vacancyId: string };
}) => {
    const helpers = await createSSRHelpers(headers());

    const vacancy = await helpers.vacancy.getVacancyItem.fetch({
        vacancyId: params.vacancyId,
    });

    if (!vacancy) {
        notFound();
    }

    return (
        <main className={'flex w-full flex-col gap-y-8'}>
            <VacancyHeader
                company={vacancy.company}
                title={vacancy.title}
                tags={vacancy.tags as Tags | null}
                isFavorited={false}
                isApplied={false}
            />
            <span className={'text-32 font-600'}>
                {getStringifySalary(
                    vacancy.salaryFrom,
                    vacancy.salaryTo,
                    vacancy.currency.char,
                )}
            </span>
            <VacancyDescription description={vacancy.description} />
        </main>
    );
};

export default VacancyDetailPage;
