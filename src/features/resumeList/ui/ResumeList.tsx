import React from 'react';
import { ResumeCard, ResumeWithRelations } from '~/entities/resume';
import { ReactComponent as IconFile } from '~/shared/assets/icons/icon-file.svg';

interface ResumeListProps {
    resumes: ResumeWithRelations[];
}
export const ResumeList: React.FC<ResumeListProps> = ({ resumes }) => {
    if (resumes.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center gap-y-3 rounded-10 border-2 border-base bg-mantle py-16">
                <IconFile className="h-10 w-10 fill-sub" />
                <p className="text-14 font-500 text-sub">
                    У вас пока нет резюме
                </p>
                <p className="text-12 text-sub-secondary">
                    Создайте с нуля или загрузите существующее
                </p>
            </div>
        );
    }
    return (
        <div className="flex flex-col gap-y-3">
            {resumes.map((resume) => (
                <ResumeCard key={resume.resume_id} resume={resume} />
            ))}
        </div>
    );
};
