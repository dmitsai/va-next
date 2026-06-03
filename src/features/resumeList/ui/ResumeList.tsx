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
    // Build display titles: use desired_position, deduplicate with (1), (2)...
    const getBase = (r: ResumeWithRelations) =>
        r.desired_position?.trim() || r.title?.trim() || 'Резюме';

    const positionCounts = new Map<string, number>();
    const positionIndex = new Map<string, number>();
    resumes.forEach((r) => {
        const key = getBase(r);
        positionCounts.set(key, (positionCounts.get(key) ?? 0) + 1);
    });
    const displayTitles = resumes.map((r) => {
        const base = getBase(r);
        if ((positionCounts.get(base) ?? 0) <= 1) return base;
        const idx = (positionIndex.get(base) ?? 0) + 1;
        positionIndex.set(base, idx);
        return idx === 1 ? base : `${base} (${idx - 1})`;
    });

    return (
        <div className="flex flex-col gap-y-3">
            {resumes.map((resume, i) => (
                <ResumeCard key={resume.resume_id} resume={resume} displayTitle={displayTitles[i]} />
            ))}
        </div>
    );
};
