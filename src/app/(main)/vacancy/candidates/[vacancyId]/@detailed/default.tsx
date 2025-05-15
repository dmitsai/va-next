import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { createSSRHelpers } from 'trpc/helpers';

// eslint-disable-next-line consistent-return
export default async ({ params }: { params: { vacancyId: string } }) => {
    const helpers = await createSSRHelpers(headers());

    const { candidates } =
        await helpers.application.infinityCandidateList.fetch({
            limit: 1,
            vacancyId: params.vacancyId,
        });

    if (!candidates?.[0]?.userId) {
        return <div className="p-8">Нет доступных откликов</div>;
    }

    const redirectUrl = `/vacancy/candidates/${params.vacancyId}/${candidates[0].userId}`;

    redirect(redirectUrl);
};
