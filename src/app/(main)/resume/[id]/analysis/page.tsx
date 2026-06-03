import { redirect } from 'next/navigation';

interface Props {
    params: { id: string };
}

/** Legacy URL — canonical analysis page is /resume/analysis/[id] */
export default function LegacyResumeAnalysisRedirect({ params }: Props) {
    redirect(`/resume/analysis/${params.id}`);
}
