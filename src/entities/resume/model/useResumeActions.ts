'use client';

import { clientApi } from 'trpc/client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ResumeWithRelations } from './types';

export const useResumeActions = (resume: ResumeWithRelations) => {
    const router = useRouter();
    const [confirmDelete, setConfirmDelete] = useState(false);

    const { mutate: archive, isPending: isArchiving } =
        clientApi.resume.archive.useMutation({
            onSuccess: () => {
                router.refresh();
            },
        });

    const { mutate: exportPdf, isPending: isExporting } =
        clientApi.resume.exportPdf.useMutation({
            onError: () => {
                // PDF export will be available soon
            },
        });

    const handleEdit = () => {
        router.push(`/resume/builder/${resume.resume_id}`);
    };

    const handleExportPdf = () => {
        exportPdf({ resume_id: resume.resume_id });
    };

    const handleDeleteClick = () => {
        if (confirmDelete) {
            archive({ resume_id: resume.resume_id });
            setConfirmDelete(false);
        } else {
            setConfirmDelete(true);
        }
    };

    // const scoreTotal = resume.analysis?.score_total;
    // const sectionsCount = resume.sections.length;

    const scoreTotal = 70;
    const sectionsCount = 3;

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
