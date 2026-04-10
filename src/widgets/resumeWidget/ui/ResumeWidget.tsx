import { headers } from 'next/headers';
import { createSSRHelpers } from 'trpc/helpers';
import {
    ResumeCard,
    ResumeStepByStep,
    ResumeImportFromPdf,
} from '~/entities/resume';

const RESUME_LIMIT = 2;

export const ResumeWidget = async () => {
    const helpers = await createSSRHelpers(headers());
    const resumes = await helpers.resume.getList.fetch();

    const canCreate = resumes.length < RESUME_LIMIT;

    if (resumes.length > 0) {
        return (
            <div className="flex w-full flex-col gap-y-3">
                {resumes.map((resume) => (
                    <ResumeCard key={resume.resume_id} resume={resume} />
                ))}
            </div>
        );
    }

    return (
        <div className="flex w-full flex-col gap-y-4">
            <p className="text-16 font-600 text-text">Создать резюме</p>
            <div className="flex flex-col flex-wrap gap-4 sm:flex-row">
                <div className="h-[180px] min-w-[400px] flex-1">
                    <ResumeStepByStep />
                </div>
                {canCreate && (
                    <div className="h-[180px] min-w-[440px] flex-1">
                        <ResumeImportFromPdf />
                    </div>
                )}
            </div>
        </div>
    );
};
