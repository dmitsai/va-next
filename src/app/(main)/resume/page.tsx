import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { getServerSession } from '~/shared/lib/auth';
import { createSSRHelpers } from 'trpc/helpers';
import { ResumeList } from '~/features/resumeList';
import {
    ResumeHeader,
    ResumeImportFromPdf,
    ResumeStepByStep,
} from '~/entities/resume';

export const dynamic = 'force-dynamic';

const RESUME_LIMIT = 2;

export default async () => {
    const session = await getServerSession();

    if (session?.user.role !== 'USER') {
        redirect('/user/login');
    }

    const helpers = await createSSRHelpers(headers());
    const resumes = await helpers.resume.getList.fetch();

    const activeCount = resumes.length;
    const canCreate = activeCount < RESUME_LIMIT;

    return (
        <main className="flex w-full flex-grow flex-col gap-y-8 px-20 py-10">
            <ResumeHeader
                activeCount={activeCount}
                limit={RESUME_LIMIT}
                canCreate={canCreate}
            />
            <ResumeList resumes={resumes} />
            {canCreate && (
                <div className="flex flex-col gap-y-4">
                    <div className="flex items-center justify-between">
                        <p className="text-20 font-600 text-text">
                            Создать новое
                        </p>
                        <span className="rounded-full bg-surface px-3 py-1 text-12 font-500 text-sub">
                            Использовано: {activeCount} / {RESUME_LIMIT} резюме
                        </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <ResumeStepByStep />
                        <ResumeImportFromPdf />
                    </div>
                </div>
            )}
        </main>
    );
};
