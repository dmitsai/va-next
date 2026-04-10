'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ResumeSectionType } from '@prisma/client';
import { clientApi } from 'trpc/client';
import { exportResumeToPdf } from '~/shared/lib/resumePdfExport';
import { emptyState, type ResumeFormState } from '~/widgets/resumeBuilder/model/types';
import { computeResumeScore } from './lib';
import { ResumeWithRelations } from './types';

function resumeToFormState(resume: ResumeWithRelations): ResumeFormState {
    const byType = new Map(resume.sections.map((s) => [s.type, s]));
    return {
        BASIC: { ...emptyState.BASIC, ...((byType.get(ResumeSectionType.BASIC)?.content ?? {}) as object) },
        CONTACTS: { ...emptyState.CONTACTS, ...((byType.get(ResumeSectionType.CONTACTS)?.content ?? {}) as object) },
        ABOUT: { ...emptyState.ABOUT, ...((byType.get(ResumeSectionType.ABOUT)?.content ?? {}) as object) },
        EXPERIENCE: (() => {
            const exp = byType.get(ResumeSectionType.EXPERIENCE)?.content as { items: unknown[] } | undefined;
            return exp?.items?.length ? (exp as ResumeFormState['EXPERIENCE']) : { items: [...emptyState.EXPERIENCE.items] };
        })(),
        EDUCATION: (() => {
            const edu = byType.get(ResumeSectionType.EDUCATION)?.content as { items: unknown[] } | undefined;
            return edu?.items?.length ? (edu as ResumeFormState['EDUCATION']) : { items: [...emptyState.EDUCATION.items] };
        })(),
        SKILLS: { ...emptyState.SKILLS, ...((byType.get(ResumeSectionType.SKILLS)?.content ?? {}) as object) },
        PORTFOLIO: (() => {
            const port = byType.get(ResumeSectionType.PORTFOLIO)?.content as { items: unknown[] } | undefined;
            return port?.items?.length ? (port as ResumeFormState['PORTFOLIO']) : { items: [...emptyState.PORTFOLIO.items] };
        })(),
    };
}

export const useResumeActions = (resume: ResumeWithRelations) => {
    const router = useRouter();
    const [confirmDelete, setConfirmDelete] = useState(false);

    const { mutate: archive, isPending: isArchiving } =
        clientApi.resume.archive.useMutation({
            onSuccess: () => {
                router.refresh();
            },
        });

    const handleEdit = () => {
        router.push(`/resume/builder/${resume.resume_id}`);
    };

    const handleExportPdf = () => {
        exportResumeToPdf(resumeToFormState(resume));
    };

    const isExporting = false;

    const handleDeleteClick = () => {
        if (confirmDelete) {
            archive({ resume_id: resume.resume_id });
            setConfirmDelete(false);
        } else {
            setConfirmDelete(true);
        }
    };

    const scoreTotal = computeResumeScore(resume.sections);
    const sectionsCount = resume.sections.length;

    return {
        handleEdit,
        handleExportPdf,
        handleDeleteClick,
        scoreTotal,
        sectionsCount,
        isArchiving,
        isExporting,
        confirmDelete,
        setConfirmDelete,
    };
};
