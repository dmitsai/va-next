import { headers } from 'next/headers';
import { createSSRHelpers } from 'trpc/helpers';
import { VacancySnippet } from '~/features/vacancySnippet';
import { DetailedCandidate } from '~/widgets/detailedCandidate';

export default async ({
    params,
}: {
    params: { vacancyId: string; candidateId: string };
}) => {
    const helpers = await createSSRHelpers(headers());
    const [candidate, vacancy] = await Promise.all([
        helpers.application.getCandidateItem.fetch({
            vacancyId: params.vacancyId,
            candidateId: params.candidateId,
        }),
        helpers.vacancy.getVacancyItem.fetch({
            vacancyId: params.vacancyId,
        }),
    ]);

    return (
        <main className={'flex w-full flex-col gap-y-8'}>
            {vacancy ? (
                <VacancySnippet
                    description={vacancy.description}
                    sourceUrl={vacancy.sourceUrl}
                />
            ) : null}
            <DetailedCandidate
                firstName={candidate.name}
                lastName={candidate.surname}
                aboutMe={candidate.about_me}
                userId={candidate.user_id}
                {...candidate}
            />
        </main>
    );
};
