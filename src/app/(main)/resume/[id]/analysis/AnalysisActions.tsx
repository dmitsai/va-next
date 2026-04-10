'use client';

import { useRouter } from 'next/navigation';
import { clientApi } from 'trpc/client';

interface AnalysisActionsProps {
    resumeId: string;
}

export const RunAnalysisButton = ({ resumeId }: AnalysisActionsProps) => {
    const router = useRouter();
    const { mutate: publish, isPending } = clientApi.resume.publish.useMutation({
        onSuccess: () => router.refresh(),
    });

    return (
        <button
            type="button"
            disabled={isPending}
            onClick={() => publish({ resume_id: resumeId })}
            className="rounded-8 bg-mauve px-5 py-2.5 text-13 font-600 text-base transition-opacity hover:opacity-90 disabled:opacity-50"
        >
            {isPending ? 'Анализирую…' : 'Запустить анализ'}
        </button>
    );
};

export const ExportPdfButton = ({ resumeId }: AnalysisActionsProps) => {
    const { mutate: exportPdf, isPending } =
        clientApi.resume.exportPdf.useMutation();

    return (
        <button
            type="button"
            disabled={isPending}
            onClick={() => exportPdf({ resume_id: resumeId })}
            className="rounded-8 bg-surface/40 px-4 py-2 text-13 font-500 text-sub transition-colors hover:bg-surface hover:text-text disabled:opacity-50"
        >
            Скачать PDF
        </button>
    );
};
