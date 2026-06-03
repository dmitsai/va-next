// FIXME: add view when small size of content
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import { createSSRHelpers } from 'trpc/helpers';
import { VacancyDescription } from '~/features/vacancyDescription';
import { VacancyHeader } from '~/features/vacancyHeader';
import type { Tags } from '~/shared/api/model/tags/type';
import { getStringifySalary } from '~/shared/lib/strings';
import { getServerSession } from '~/shared/lib/auth';

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

    const session = await getServerSession();
    const isUser = session?.user?.role === 'USER';

    let isApplied = false;
    let isFavorited = false;

    if (isUser) {
        const [appliedResult, favoritedResult] = await Promise.allSettled([
            helpers.application.checkIsApplied.fetch({
                vacancyId: params.vacancyId,
            }),
            helpers.application.checkIsFavorited.fetch({
                vacancyId: params.vacancyId,
            }),
        ]);

        isApplied =
            appliedResult.status === 'fulfilled' ? appliedResult.value : false;
        isFavorited =
            favoritedResult.status === 'fulfilled'
                ? favoritedResult.value
                : false;
    }

    return (
        <main className={'flex w-full flex-col gap-y-8'}>
            <VacancyHeader
                vacancyId={vacancy.vacancy_id}
                isLocal={vacancy.platform.name === 'local'}
                sourceUrl={vacancy.sourceUrl}
                avatar={vacancy.company.imgUrl}
                company={vacancy.company}
                title={vacancy.title}
                tags={vacancy.tags as Tags | null}
                isFavorited={isFavorited}
                isApplied={isApplied}
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

export default VacancyDetailPage;
