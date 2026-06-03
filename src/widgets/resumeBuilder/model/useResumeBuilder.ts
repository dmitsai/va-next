'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ResumeSectionType } from '@prisma/client';
import { clientApi } from 'trpc/client';
import { exportResumeToPdf } from '~/shared/lib/resumePdfExport';
import {
    emptyState,
    STEP_TO_TAB_ID,
    TAB_ID_TO_STEP,
    validateStep,
    type ResumeFormState,
    type ResumeWithRelations,
    type StepErrors,
} from './types';

function toState(resume: ResumeWithRelations | null): ResumeFormState {
    if (!resume) return emptyState;
    const byType = new Map(resume.sections.map((s) => [s.type, s]));

    return {
        BASIC: {
            ...emptyState.BASIC,
            ...((byType.get(ResumeSectionType.BASIC)?.content ?? {}) as object),
        },
        CONTACTS: {
            ...emptyState.CONTACTS,
            ...((byType.get(ResumeSectionType.CONTACTS)?.content ??
                {}) as object),
        },
        ABOUT: {
            ...emptyState.ABOUT,
            ...((byType.get(ResumeSectionType.ABOUT)?.content ?? {}) as object),
        },
        EXPERIENCE: (() => {
            const exp = byType.get(ResumeSectionType.EXPERIENCE)?.content as
                | { items: unknown[] }
                | undefined;
            return exp?.items?.length
                ? (exp as ResumeFormState['EXPERIENCE'])
                : { items: [...emptyState.EXPERIENCE.items] };
        })(),
        EDUCATION: (() => {
            const edu = byType.get(ResumeSectionType.EDUCATION)?.content as
                | { items: unknown[] }
                | undefined;
            return edu?.items?.length
                ? (edu as ResumeFormState['EDUCATION'])
                : { items: [...emptyState.EDUCATION.items] };
        })(),
        SKILLS: {
            ...emptyState.SKILLS,
            ...((byType.get(ResumeSectionType.SKILLS)?.content ??
                {}) as object),
        },
        PORTFOLIO: (() => {
            const port = byType.get(ResumeSectionType.PORTFOLIO)?.content as
                | { items: unknown[] }
                | undefined;
            return port?.items?.length
                ? (port as ResumeFormState['PORTFOLIO'])
                : { items: [...emptyState.PORTFOLIO.items] };
        })(),
    };
}

function normalizeStep(step: number) {
    if (!Number.isFinite(step)) return 1;
    return Math.max(1, Math.min(8, step));
}

export function useResumeBuilder(
    resumeId: string,
    initialResume: ResumeWithRelations | null,
    initialStep: number
) {
    const router = useRouter();

    const [currentStep, setCurrentStep] = useState(normalizeStep(initialStep));
    const [state, setState] = useState<ResumeFormState>(toState(initialResume));
    const [dirty, setDirty] = useState<
        Partial<Record<ResumeSectionType, boolean>>
    >({});
    const [stepErrors, setStepErrors] = useState<StepErrors>({});
    const [currentResumeId, setCurrentResumeId] = useState(
        resumeId === 'new' ? '' : resumeId
    );

    const {
        data: resume,
        isLoading,
        refetch,
    } = clientApi.resume.getItem.useQuery(
        { resume_id: currentResumeId },
        {
            enabled: Boolean(currentResumeId),
            initialData: initialResume ?? undefined,
        }
    );

    const { mutateAsync: createResume, isPending: isCreating } =
        clientApi.resume.create.useMutation();
    const { mutate: updateSection, isPending: isSaving } =
        clientApi.resume.updateSection.useMutation();
    const { mutate: publishResume, isPending: isPublishing } =
        clientApi.resume.publish.useMutation({
            onSuccess: (data) => {
                void refetch();
                router.push(`/resume/analysis/${data.resume_id}`);
            },
        });
    const [isExporting, setIsExporting] = useState(false);

    const { data: profile } =
        clientApi.clientProfile.getProfile.useQuery(undefined);

    // Sync resume data when it refreshes — skip if user has unsaved changes
    useEffect(() => {
        if (!resume) return;
        const hasDirty = Object.values(dirty).some(Boolean);
        if (!hasDirty) {
            setState(toState(resume));
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [resume]);

    // Autosave — 2000ms debounce per dirty section.
    // If resumeId is 'new' and no currentResumeId yet, lazily create the resume
    // on first user edit instead of on mount (avoids creating empty resumes on back-nav).
    useEffect(() => {
        const hasDirty = Object.values(dirty).some(Boolean);
        if (!hasDirty) {
            return () => {
                void 0;
            };
        }

        const sections = [
            ResumeSectionType.BASIC,
            ResumeSectionType.CONTACTS,
            ResumeSectionType.ABOUT,
            ResumeSectionType.EXPERIENCE,
            ResumeSectionType.EDUCATION,
            ResumeSectionType.SKILLS,
            ResumeSectionType.PORTFOLIO,
        ] as const;

        let lazyCreateTimer: ReturnType<typeof setTimeout> | undefined;
        const debounceTimers: ReturnType<typeof setTimeout>[] = [];

        if (!currentResumeId) {
            lazyCreateTimer = setTimeout(() => {
                const desiredPosition = state.BASIC.desired_position ?? null;
                const title = desiredPosition || 'Новое резюме';
                createResume({ title, desired_position: desiredPosition })
                    .then((created) => {
                        setCurrentResumeId(created.resume_id);
                        router.replace(
                            `/resume/builder/${created.resume_id}?step=${currentStep}`
                        );
                        sections.forEach((type, orderIndex) => {
                            if (!dirty[type]) return;
                            const content = state[type] as Record<
                                string,
                                unknown
                            >;
                            updateSection({
                                resume_id: created.resume_id,
                                type,
                                content,
                                order_index: orderIndex,
                                is_visible: true,
                            });
                        });
                        setDirty({});
                    })
                    .catch(() => {
                        router.push('/resume');
                    });
            }, 2000);
        } else {
            sections.forEach((type, orderIndex) => {
                if (!dirty[type]) return;
                const content = state[type] as Record<string, unknown>;
                debounceTimers.push(
                    setTimeout(() => {
                        updateSection({
                            resume_id: currentResumeId,
                            type,
                            content,
                            order_index: orderIndex,
                            is_visible: true,
                        });
                        setDirty((prev) => ({ ...prev, [type]: false }));
                    }, 2000)
                );
            });
        }

        return () => {
            if (lazyCreateTimer) clearTimeout(lazyCreateTimer);
            debounceTimers.forEach(clearTimeout);
        };
    }, [
        currentResumeId,
        dirty,
        state,
        updateSection,
        createResume,
        router,
        currentStep,
    ]);

    const completedSteps = useMemo(() => {
        const result = new Set<number>();
        if (
            state.BASIC.name ||
            state.BASIC.surname ||
            state.BASIC.desired_position
        )
            result.add(1);
        if (state.CONTACTS.email) result.add(2);
        if (state.ABOUT.text) result.add(3);
        if (
            state.EXPERIENCE.items.some(
                (i) => i.company || i.position || i.description
            )
        )
            result.add(4);
        if (state.EDUCATION.items.some((i) => i.institution || i.degree))
            result.add(5);
        if (state.SKILLS.hard.length || state.SKILLS.soft.length) result.add(6);
        if (state.PORTFOLIO.items.some((i) => i.title || i.url)) result.add(7);
        return result;
    }, [state]);

    const setSection = <K extends keyof ResumeFormState>(
        type: K,
        nextValue: ResumeFormState[K]
    ) => {
        setState((prev) => ({ ...prev, [type]: nextValue }));
        setDirty((prev) => ({ ...prev, [type]: true }));
    };

    const goToStep = (next: number): boolean => {
        const safe = normalizeStep(next);
        // Validate before advancing
        if (next > currentStep) {
            const errors = validateStep(currentStep, state);
            if (Object.keys(errors).length > 0) {
                setStepErrors(errors);
                return false;
            }
        }
        setStepErrors({});
        setCurrentStep(safe);
        if (currentResumeId) {
            router.replace(`/resume/builder/${currentResumeId}?step=${safe}`);
        }
        return true;
    };

    const handleTabChange = (tabId: string) => {
        const step = TAB_ID_TO_STEP[tabId];
        if (step) goToStep(step);
    };

    const handleFillFromProfile = () => {
        if (!profile) return;
        setSection('CONTACTS', {
            email: profile.email ?? state.CONTACTS.email,
            phone: profile.phone ?? state.CONTACTS.phone,
            city: state.CONTACTS.city,
            telegram: profile.telegram ?? state.CONTACTS.telegram,
            linkedin: state.CONTACTS.linkedin,
            github: state.CONTACTS.github,
        });
    };

    const handlePublish = () => {
        if (currentResumeId) publishResume({ resume_id: currentResumeId });
    };

    const handleExportPdf = useCallback(() => {
        setIsExporting(true);
        try {
            exportResumeToPdf(state);
        } finally {
            setIsExporting(false);
        }
    }, [state]);

    return {
        currentStep,
        currentResumeId,
        resume: resume ?? null,
        state,
        setSection,
        completedSteps,
        stepErrors,
        isLoading,
        isCreating,
        isSaving,
        isPublishing,
        isExporting,
        activeTabId: STEP_TO_TAB_ID[currentStep] ?? 'basic',
        goToStep,
        handleTabChange,
        handleFillFromProfile,
        handlePublish,
        handleExportPdf,
    };
}
