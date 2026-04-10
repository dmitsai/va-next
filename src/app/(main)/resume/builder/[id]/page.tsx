import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { getServerSession } from '~/shared/lib/auth';
import { createSSRHelpers } from 'trpc/helpers';
import { ResumeBuilder } from '~/widgets/resumeBuilder';

interface ResumeBuilderPageProps {
    params: {
        id: string;
    };
    searchParams: {
        step?: string;
    };
}

const ResumeBuilderPage = async ({
    params,
    searchParams,
}: ResumeBuilderPageProps) => {
    const session = await getServerSession();

    if (session?.user.role !== 'USER') {
        redirect('/user/login');
    }

    const initialStep = Number(searchParams?.step ?? '1');
    const step = Number.isFinite(initialStep) ? initialStep : 1;

    let initialResume = null;
    if (params.id !== 'new') {
        const helpers = await createSSRHelpers(headers());
        initialResume = await helpers.resume.getItem.fetch({
            resume_id: params.id,
        });
    }

    return (
        <ResumeBuilder
            resumeId={params.id}
            initialResume={initialResume}
            initialStep={step}
        />
    );
};

export default ResumeBuilderPage;
