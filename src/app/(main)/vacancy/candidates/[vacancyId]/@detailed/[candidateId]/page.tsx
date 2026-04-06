import { headers } from 'next/headers';
import { createSSRHelpers } from 'trpc/helpers';
import { DetailedCandidate } from '~/widgets/detailedCandidate';

export default async ({
    params,
}: {
    params: { vacancyId: string; candidateId: string };
}) => {
    const helpers = await createSSRHelpers(headers());
    const candidate = await helpers.application.getCandidateItem.fetch({
        vacancyId: params.vacancyId,
        candidateId: params.candidateId,
    });

    return (
        <main className={'w-full'}>
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
