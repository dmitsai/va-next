'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ResumeSectionType, type Prisma } from '@prisma/client';
import { clientApi } from 'trpc/client';
import { Button, ButtonView } from '~/shared/ui/Button/Button';

type ResumeWithRelations = Prisma.ResumeGetPayload<{
    include: { sections: true; analysis: true };
}>;

type BasicSection = {
    name: string;
    surname: string;
    desired_position: string;
    photo_url?: string;
};

type ContactsSection = {
    email: string;
    phone?: string;
    city?: string;
    telegram?: string;
    linkedin?: string;
    github?: string;
};

type AboutSection = { text: string };

type ExperienceItem = {
    company: string;
    position: string;
    period_from: string;
    period_to?: string;
    is_current: boolean;
    description: string;
};
type ExperienceSection = { items: ExperienceItem[] };

type EducationItem = {
    institution: string;
    degree: string;
    field: string;
    year_from: string;
    year_to?: string;
};
type EducationSection = { items: EducationItem[] };

type SkillsSection = { hard: string[]; soft: string[] };

type PortfolioItem = { title: string; url: string; description?: string };
type PortfolioSection = { items: PortfolioItem[] };

type ResumeFormState = {
    BASIC: BasicSection;
    CONTACTS: ContactsSection;
    ABOUT: AboutSection;
    EXPERIENCE: ExperienceSection;
    EDUCATION: EducationSection;
    SKILLS: SkillsSection;
    PORTFOLIO: PortfolioSection;
};

const STEP_DEFS = [
    { id: 1, label: 'Basic', section: 'BASIC' as const },
    { id: 2, label: 'Contacts', section: 'CONTACTS' as const },
    { id: 3, label: 'About', section: 'ABOUT' as const },
    { id: 4, label: 'Experience', section: 'EXPERIENCE' as const },
    { id: 5, label: 'Education', section: 'EDUCATION' as const },
    { id: 6, label: 'Skills', section: 'SKILLS' as const },
    { id: 7, label: 'Portfolio', section: 'PORTFOLIO' as const },
    { id: 8, label: 'Final', section: null },
] as const;

const emptyState: ResumeFormState = {
    BASIC: { name: '', surname: '', desired_position: '', photo_url: '' },
    CONTACTS: {
        email: '',
        phone: '',
        city: '',
        telegram: '',
        linkedin: '',
        github: '',
    },
    ABOUT: { text: '' },
    EXPERIENCE: {
        items: [
            {
                company: '',
                position: '',
                period_from: '',
                period_to: '',
                is_current: false,
                description: '',
            },
        ],
    },
    EDUCATION: {
        items: [
            {
                institution: '',
                degree: '',
                field: '',
                year_from: '',
                year_to: '',
            },
        ],
    },
    SKILLS: { hard: [], soft: [] },
    PORTFOLIO: {
        items: [{ title: '', url: '', description: '' }],
    },
};

interface ResumeBuilderProps {
    resumeId: string;
    initialResume: ResumeWithRelations | null;
    initialStep: number;
}

function toState(resume: ResumeWithRelations | null): ResumeFormState {
    if (!resume) return emptyState;
    const byType = new Map(
        resume.sections.map((section) => [section.type, section])
    );

    const basic = byType.get(ResumeSectionType.BASIC)?.content as
        | BasicSection
        | undefined;
    const contacts = byType.get(ResumeSectionType.CONTACTS)?.content as
        | ContactsSection
        | undefined;
    const about = byType.get(ResumeSectionType.ABOUT)?.content as
        | AboutSection
        | undefined;
    const experience = byType.get(ResumeSectionType.EXPERIENCE)?.content as
        | ExperienceSection
        | undefined;
    const education = byType.get(ResumeSectionType.EDUCATION)?.content as
        | EducationSection
        | undefined;
    const skills = byType.get(ResumeSectionType.SKILLS)?.content as
        | SkillsSection
        | undefined;
    const portfolio = byType.get(ResumeSectionType.PORTFOLIO)?.content as
        | PortfolioSection
        | undefined;

    return {
        BASIC: { ...emptyState.BASIC, ...(basic ?? {}) },
        CONTACTS: { ...emptyState.CONTACTS, ...(contacts ?? {}) },
        ABOUT: { ...emptyState.ABOUT, ...(about ?? {}) },
        EXPERIENCE: experience?.items?.length
            ? experience
            : {
                  items: [...emptyState.EXPERIENCE.items],
              },
        EDUCATION: education?.items?.length
            ? education
            : {
                  items: [...emptyState.EDUCATION.items],
              },
        SKILLS: { ...emptyState.SKILLS, ...(skills ?? {}) },
        PORTFOLIO: portfolio?.items?.length
            ? portfolio
            : {
                  items: [...emptyState.PORTFOLIO.items],
              },
    };
}

function normalizeStep(step: number) {
    if (Number.isNaN(step)) return 1;
    return Math.max(1, Math.min(8, step));
}

export const ResumeBuilder: React.FC<ResumeBuilderProps> = ({
    resumeId,
    initialResume,
    initialStep,
}) => {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(normalizeStep(initialStep));
    const [state, setState] = useState<ResumeFormState>(toState(initialResume));
    const [dirty, setDirty] = useState<
        Partial<Record<ResumeSectionType, boolean>>
    >({});
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
            onSuccess: async () => {
                await refetch();
            },
        });
    const { mutate: exportPdf, isPending: isExporting } =
        clientApi.resume.exportPdf.useMutation();

    const { data: profile } = clientApi.clientProfile.getProfile.useQuery(
        undefined,
        {
            enabled: currentStep === 2,
        }
    );

    useEffect(() => {
        if (!resume) return;
        setState(toState(resume));
    }, [resume]);

    useEffect(() => {
        if (resumeId !== 'new') return;
        let mounted = true;

        createResume({
            title: 'Новое резюме',
            desired_position: null,
        })
            .then((created) => {
                if (!mounted) return;
                setCurrentResumeId(created.resume_id);
                router.replace(`/resume/builder/${created.resume_id}?step=1`);
            })
            .catch(() => {
                router.push('/resume');
            });

        return () => {
            mounted = false;
        };
    }, [createResume, resumeId, router]);

    useEffect(() => {
        if (!currentResumeId) return;
        const timers: Array<ReturnType<typeof setTimeout>> = [];

        (
            [
                ResumeSectionType.BASIC,
                ResumeSectionType.CONTACTS,
                ResumeSectionType.ABOUT,
                ResumeSectionType.EXPERIENCE,
                ResumeSectionType.EDUCATION,
                ResumeSectionType.SKILLS,
                ResumeSectionType.PORTFOLIO,
            ] as const
        ).forEach((type, orderIndex) => {
            if (!dirty[type]) return;
            const content = state[type] as Record<string, unknown>;
            const timer = setTimeout(() => {
                updateSection({
                    resume_id: currentResumeId,
                    type,
                    content,
                    order_index: orderIndex,
                    is_visible: true,
                });
            }, 2000);
            timers.push(timer);
        });

        return () => {
            timers.forEach((timer) => clearTimeout(timer));
        };
    }, [currentResumeId, dirty, state, updateSection]);

    const completedSteps = useMemo(() => {
        const result = new Set<number>();
        if (
            state.BASIC.name ||
            state.BASIC.surname ||
            state.BASIC.desired_position
        ) {
            result.add(1);
        }
        if (state.CONTACTS.email) result.add(2);
        if (state.ABOUT.text) result.add(3);
        if (
            state.EXPERIENCE.items.some(
                (item) => item.company || item.position || item.description
            )
        ) {
            result.add(4);
        }
        if (
            state.EDUCATION.items.some(
                (item) => item.institution || item.degree
            )
        ) {
            result.add(5);
        }
        if (state.SKILLS.hard.length || state.SKILLS.soft.length) result.add(6);
        if (state.PORTFOLIO.items.some((item) => item.title || item.url))
            result.add(7);
        return result;
    }, [state]);

    const setSection = <K extends keyof ResumeFormState>(
        type: K,
        nextValue: ResumeFormState[K]
    ) => {
        setState((prev) => ({ ...prev, [type]: nextValue }));
        setDirty((prev) => ({ ...prev, [type]: true }));
    };

    const stepChange = (next: number) => {
        const safe = normalizeStep(next);
        setCurrentStep(safe);
        if (currentResumeId) {
            router.replace(`/resume/builder/${currentResumeId}?step=${safe}`);
        }
    };

    const handleFillFromProfile = () => {
        if (!profile) return;
        setSection('CONTACTS', {
            email: profile.user?.email ?? state.CONTACTS.email,
            phone: profile.phone ?? state.CONTACTS.phone,
            city: profile.preferences?.locations?.[0] ?? state.CONTACTS.city,
            telegram: profile.telegram ?? state.CONTACTS.telegram,
            linkedin: state.CONTACTS.linkedin,
            github: state.CONTACTS.github,
        });
    };

    const renderStepForm = () => {
        if (currentStep === 1) {
            return (
                <div className="flex flex-col gap-y-3">
                    <h2 className="text-20 font-600 text-text">Basic</h2>
                    <input
                        className="rounded-6 border-2 border-base bg-mantle px-4 py-2 text-text outline-none focus:border-mauve"
                        placeholder="Name"
                        value={state.BASIC.name}
                        onChange={(e) =>
                            setSection('BASIC', {
                                ...state.BASIC,
                                name: e.target.value,
                            })
                        }
                    />
                    <input
                        className="rounded-6 border-2 border-base bg-mantle px-4 py-2 text-text outline-none focus:border-mauve"
                        placeholder="Surname"
                        value={state.BASIC.surname}
                        onChange={(e) =>
                            setSection('BASIC', {
                                ...state.BASIC,
                                surname: e.target.value,
                            })
                        }
                    />
                    <input
                        className="rounded-6 border-2 border-base bg-mantle px-4 py-2 text-text outline-none focus:border-mauve"
                        placeholder="Desired position"
                        value={state.BASIC.desired_position}
                        onChange={(e) =>
                            setSection('BASIC', {
                                ...state.BASIC,
                                desired_position: e.target.value,
                            })
                        }
                    />
                    <input
                        className="rounded-6 border-2 border-base bg-mantle px-4 py-2 text-text outline-none focus:border-mauve"
                        placeholder="Photo URL (optional)"
                        value={state.BASIC.photo_url ?? ''}
                        onChange={(e) =>
                            setSection('BASIC', {
                                ...state.BASIC,
                                photo_url: e.target.value,
                            })
                        }
                    />
                </div>
            );
        }

        if (currentStep === 2) {
            return (
                <div className="flex flex-col gap-y-3">
                    <div className="flex items-center justify-between">
                        <h2 className="text-20 font-600 text-text">Contacts</h2>
                        <Button
                            buttonView={ButtonView.SMALL}
                            className="bg-mauve text-base hover:bg-mauve/80"
                            onClick={handleFillFromProfile}
                        >
                            Fill from profile
                        </Button>
                    </div>
                    {[
                        { key: 'email', label: 'Email *' },
                        { key: 'phone', label: 'Phone' },
                        { key: 'city', label: 'City' },
                        { key: 'telegram', label: 'Telegram' },
                        { key: 'linkedin', label: 'LinkedIn' },
                        { key: 'github', label: 'GitHub' },
                    ].map(({ key, label }) => (
                        <input
                            key={key}
                            className="rounded-6 border-2 border-base bg-mantle px-4 py-2 text-text outline-none focus:border-mauve"
                            placeholder={label}
                            value={
                                state.CONTACTS[key as keyof ContactsSection] ??
                                ''
                            }
                            onChange={(e) =>
                                setSection('CONTACTS', {
                                    ...state.CONTACTS,
                                    [key]: e.target.value,
                                })
                            }
                        />
                    ))}
                </div>
            );
        }

        if (currentStep === 3) {
            return (
                <div className="flex flex-col gap-y-3">
                    <h2 className="text-20 font-600 text-text">About</h2>
                    <textarea
                        className="min-h-48 rounded-6 border-2 border-base bg-mantle px-4 py-2 text-text outline-none focus:border-mauve"
                        placeholder="Tell about yourself"
                        value={state.ABOUT.text}
                        onChange={(e) =>
                            setSection('ABOUT', {
                                text: e.target.value,
                            })
                        }
                    />
                </div>
            );
        }

        if (currentStep === 4) {
            return (
                <div className="flex flex-col gap-y-4">
                    <h2 className="text-20 font-600 text-text">Experience</h2>
                    {state.EXPERIENCE.items.map((item, index) => (
                        <div
                            key={`exp-${index}`}
                            className="flex flex-col gap-y-2 rounded-8 border border-base bg-mantle/50 p-3"
                        >
                            <input
                                className="rounded-6 border border-base bg-mantle px-3 py-2 text-text outline-none focus:border-mauve"
                                placeholder="Company"
                                value={item.company}
                                onChange={(e) => {
                                    const items = [...state.EXPERIENCE.items];
                                    items[index] = {
                                        ...items[index],
                                        company: e.target.value,
                                    };
                                    setSection('EXPERIENCE', { items });
                                }}
                            />
                            <input
                                className="rounded-6 border border-base bg-mantle px-3 py-2 text-text outline-none focus:border-mauve"
                                placeholder="Position"
                                value={item.position}
                                onChange={(e) => {
                                    const items = [...state.EXPERIENCE.items];
                                    items[index] = {
                                        ...items[index],
                                        position: e.target.value,
                                    };
                                    setSection('EXPERIENCE', { items });
                                }}
                            />
                            <div className="grid grid-cols-2 gap-2">
                                <input
                                    className="rounded-6 border border-base bg-mantle px-3 py-2 text-text outline-none focus:border-mauve"
                                    placeholder="From"
                                    value={item.period_from}
                                    onChange={(e) => {
                                        const items = [
                                            ...state.EXPERIENCE.items,
                                        ];
                                        items[index] = {
                                            ...items[index],
                                            period_from: e.target.value,
                                        };
                                        setSection('EXPERIENCE', { items });
                                    }}
                                />
                                <input
                                    className="rounded-6 border border-base bg-mantle px-3 py-2 text-text outline-none focus:border-mauve"
                                    placeholder="To"
                                    value={item.period_to ?? ''}
                                    onChange={(e) => {
                                        const items = [
                                            ...state.EXPERIENCE.items,
                                        ];
                                        items[index] = {
                                            ...items[index],
                                            period_to: e.target.value,
                                        };
                                        setSection('EXPERIENCE', { items });
                                    }}
                                />
                            </div>
                            <textarea
                                className="min-h-24 rounded-6 border border-base bg-mantle px-3 py-2 text-text outline-none focus:border-mauve"
                                placeholder="Description"
                                value={item.description}
                                onChange={(e) => {
                                    const items = [...state.EXPERIENCE.items];
                                    items[index] = {
                                        ...items[index],
                                        description: e.target.value,
                                    };
                                    setSection('EXPERIENCE', { items });
                                }}
                            />
                        </div>
                    ))}
                    <Button
                        buttonView={ButtonView.SMALL}
                        className="w-fit bg-surface text-sub hover:bg-surface-tertiary"
                        onClick={() =>
                            setSection('EXPERIENCE', {
                                items: [
                                    ...state.EXPERIENCE.items,
                                    {
                                        company: '',
                                        position: '',
                                        period_from: '',
                                        period_to: '',
                                        is_current: false,
                                        description: '',
                                    },
                                ],
                            })
                        }
                    >
                        Add experience
                    </Button>
                </div>
            );
        }

        if (currentStep === 5) {
            return (
                <div className="flex flex-col gap-y-4">
                    <h2 className="text-20 font-600 text-text">Education</h2>
                    {state.EDUCATION.items.map((item, index) => (
                        <div
                            key={`edu-${index}`}
                            className="flex flex-col gap-y-2 rounded-8 border border-base bg-mantle/50 p-3"
                        >
                            <input
                                className="rounded-6 border border-base bg-mantle px-3 py-2 text-text outline-none focus:border-mauve"
                                placeholder="Institution"
                                value={item.institution}
                                onChange={(e) => {
                                    const items = [...state.EDUCATION.items];
                                    items[index] = {
                                        ...items[index],
                                        institution: e.target.value,
                                    };
                                    setSection('EDUCATION', { items });
                                }}
                            />
                            <input
                                className="rounded-6 border border-base bg-mantle px-3 py-2 text-text outline-none focus:border-mauve"
                                placeholder="Degree"
                                value={item.degree}
                                onChange={(e) => {
                                    const items = [...state.EDUCATION.items];
                                    items[index] = {
                                        ...items[index],
                                        degree: e.target.value,
                                    };
                                    setSection('EDUCATION', { items });
                                }}
                            />
                            <input
                                className="rounded-6 border border-base bg-mantle px-3 py-2 text-text outline-none focus:border-mauve"
                                placeholder="Field"
                                value={item.field}
                                onChange={(e) => {
                                    const items = [...state.EDUCATION.items];
                                    items[index] = {
                                        ...items[index],
                                        field: e.target.value,
                                    };
                                    setSection('EDUCATION', { items });
                                }}
                            />
                            <div className="grid grid-cols-2 gap-2">
                                <input
                                    className="rounded-6 border border-base bg-mantle px-3 py-2 text-text outline-none focus:border-mauve"
                                    placeholder="From year"
                                    value={item.year_from}
                                    onChange={(e) => {
                                        const items = [
                                            ...state.EDUCATION.items,
                                        ];
                                        items[index] = {
                                            ...items[index],
                                            year_from: e.target.value,
                                        };
                                        setSection('EDUCATION', { items });
                                    }}
                                />
                                <input
                                    className="rounded-6 border border-base bg-mantle px-3 py-2 text-text outline-none focus:border-mauve"
                                    placeholder="To year"
                                    value={item.year_to ?? ''}
                                    onChange={(e) => {
                                        const items = [
                                            ...state.EDUCATION.items,
                                        ];
                                        items[index] = {
                                            ...items[index],
                                            year_to: e.target.value,
                                        };
                                        setSection('EDUCATION', { items });
                                    }}
                                />
                            </div>
                        </div>
                    ))}
                    <Button
                        buttonView={ButtonView.SMALL}
                        className="w-fit bg-surface text-sub hover:bg-surface-tertiary"
                        onClick={() =>
                            setSection('EDUCATION', {
                                items: [
                                    ...state.EDUCATION.items,
                                    {
                                        institution: '',
                                        degree: '',
                                        field: '',
                                        year_from: '',
                                        year_to: '',
                                    },
                                ],
                            })
                        }
                    >
                        Add education
                    </Button>
                </div>
            );
        }

        if (currentStep === 6) {
            return (
                <div className="flex flex-col gap-y-4">
                    <h2 className="text-20 font-600 text-text">Skills</h2>
                    <input
                        className="rounded-6 border-2 border-base bg-mantle px-4 py-2 text-text outline-none focus:border-mauve"
                        placeholder="Hard skills (comma separated)"
                        value={state.SKILLS.hard.join(', ')}
                        onChange={(e) =>
                            setSection('SKILLS', {
                                ...state.SKILLS,
                                hard: e.target.value
                                    .split(',')
                                    .map((v) => v.trim())
                                    .filter(Boolean),
                            })
                        }
                    />
                    <input
                        className="rounded-6 border-2 border-base bg-mantle px-4 py-2 text-text outline-none focus:border-mauve"
                        placeholder="Soft skills (comma separated)"
                        value={state.SKILLS.soft.join(', ')}
                        onChange={(e) =>
                            setSection('SKILLS', {
                                ...state.SKILLS,
                                soft: e.target.value
                                    .split(',')
                                    .map((v) => v.trim())
                                    .filter(Boolean),
                            })
                        }
                    />
                </div>
            );
        }

        if (currentStep === 7) {
            return (
                <div className="flex flex-col gap-y-4">
                    <h2 className="text-20 font-600 text-text">Portfolio</h2>
                    {state.PORTFOLIO.items.map((item, index) => (
                        <div
                            key={`portfolio-${index}`}
                            className="flex flex-col gap-y-2 rounded-8 border border-base bg-mantle/50 p-3"
                        >
                            <input
                                className="rounded-6 border border-base bg-mantle px-3 py-2 text-text outline-none focus:border-mauve"
                                placeholder="Title"
                                value={item.title}
                                onChange={(e) => {
                                    const items = [...state.PORTFOLIO.items];
                                    items[index] = {
                                        ...items[index],
                                        title: e.target.value,
                                    };
                                    setSection('PORTFOLIO', { items });
                                }}
                            />
                            <input
                                className="rounded-6 border border-base bg-mantle px-3 py-2 text-text outline-none focus:border-mauve"
                                placeholder="URL"
                                value={item.url}
                                onChange={(e) => {
                                    const items = [...state.PORTFOLIO.items];
                                    items[index] = {
                                        ...items[index],
                                        url: e.target.value,
                                    };
                                    setSection('PORTFOLIO', { items });
                                }}
                            />
                            <textarea
                                className="min-h-20 rounded-6 border border-base bg-mantle px-3 py-2 text-text outline-none focus:border-mauve"
                                placeholder="Description"
                                value={item.description ?? ''}
                                onChange={(e) => {
                                    const items = [...state.PORTFOLIO.items];
                                    items[index] = {
                                        ...items[index],
                                        description: e.target.value,
                                    };
                                    setSection('PORTFOLIO', { items });
                                }}
                            />
                        </div>
                    ))}
                    <Button
                        buttonView={ButtonView.SMALL}
                        className="w-fit bg-surface text-sub hover:bg-surface-tertiary"
                        onClick={() =>
                            setSection('PORTFOLIO', {
                                items: [
                                    ...state.PORTFOLIO.items,
                                    { title: '', url: '', description: '' },
                                ],
                            })
                        }
                    >
                        Add project
                    </Button>
                </div>
            );
        }

        return (
            <div className="flex flex-col gap-y-4">
                <h2 className="text-20 font-600 text-text">Final</h2>
                <p className="text-14 text-sub">
                    Review your resume, publish when ready, or export PDF.
                </p>
                <div className="flex gap-2">
                    <Button
                        buttonView={ButtonView.LARGE}
                        className="bg-mauve text-base hover:bg-mauve/80"
                        disabled={!currentResumeId || isPublishing}
                        onClick={() =>
                            currentResumeId &&
                            publishResume({ resume_id: currentResumeId })
                        }
                    >
                        {isPublishing ? 'Publishing...' : 'Publish'}
                    </Button>
                    <Button
                        buttonView={ButtonView.LARGE}
                        className="bg-surface text-sub hover:bg-surface-tertiary"
                        disabled={!currentResumeId || isExporting}
                        onClick={() =>
                            currentResumeId &&
                            exportPdf({ resume_id: currentResumeId })
                        }
                    >
                        {isExporting ? 'Generating...' : 'Download PDF'}
                    </Button>
                </div>
            </div>
        );
    };

    if (!currentResumeId && (isCreating || resumeId === 'new')) {
        return (
            <div className="px-20 py-10 text-14 text-sub">
                Creating resume draft...
            </div>
        );
    }

    return (
        <main className="flex w-full flex-grow flex-col gap-y-6 px-20 py-8">
            <div className="flex items-center justify-between">
                <Link
                    href="/resume"
                    className="text-14 text-mauve hover:underline"
                >
                    ← Back to resumes
                </Link>
                <div className="flex items-center gap-2 text-12 text-teal">
                    <span className="h-2 w-2 rounded-full bg-teal" />
                    {isSaving ? 'Autosaving...' : 'Autosave on'}
                </div>
            </div>

            <div className="grid grid-cols-[220px_1fr_260px] gap-4">
                <aside className="rounded-8 bg-mantle p-4">
                    <p className="mb-3 text-12 text-sub">Progress</p>
                    <div className="mb-4 text-14 text-text">
                        {completedSteps.size} of 8 steps
                    </div>
                    <div className="flex flex-col gap-y-2">
                        {STEP_DEFS.map((step) => {
                            const isActive = step.id === currentStep;
                            const isDone = completedSteps.has(step.id);
                            return (
                                <button
                                    key={step.id}
                                    type="button"
                                    onClick={() => stepChange(step.id)}
                                    className="flex items-center gap-x-3 rounded-6 px-2 py-1.5 text-left hover:bg-surface"
                                >
                                    <span
                                        className={`flex h-6 w-6 items-center justify-center rounded-full text-12 ${
                                            isDone
                                                ? 'bg-teal/20 text-teal'
                                                : isActive
                                                  ? 'bg-mauve/20 text-mauve'
                                                  : 'bg-surface text-sub'
                                        }`}
                                    >
                                        {isDone ? '✓' : step.id}
                                    </span>
                                    <span
                                        className={
                                            isActive
                                                ? 'text-14 text-mauve'
                                                : 'text-14 text-sub'
                                        }
                                    >
                                        {step.label}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </aside>

                <section className="rounded-8 bg-mantle p-5">
                    {isLoading ? (
                        <p className="text-14 text-sub">Loading resume...</p>
                    ) : (
                        <>
                            {renderStepForm()}
                            <div className="mt-6 flex justify-between">
                                <Button
                                    buttonView={ButtonView.SMALL}
                                    className="bg-surface text-sub hover:bg-surface-tertiary"
                                    disabled={currentStep <= 1}
                                    onClick={() => stepChange(currentStep - 1)}
                                >
                                    Previous
                                </Button>
                                <Button
                                    buttonView={ButtonView.SMALL}
                                    className="bg-mauve text-base hover:bg-mauve/80"
                                    disabled={currentStep >= 8}
                                    onClick={() => stepChange(currentStep + 1)}
                                >
                                    Next
                                </Button>
                            </div>
                        </>
                    )}
                </section>

                <aside className="rounded-8 bg-mantle p-4">
                    <div className="mb-3 flex items-center justify-between">
                        <p className="text-14 font-600 text-text">
                            Live preview
                        </p>
                        <Button
                            buttonView={ButtonView.SMALL}
                            className="bg-surface text-sub hover:bg-surface-tertiary"
                            disabled={!currentResumeId || isExporting}
                            onClick={() =>
                                currentResumeId &&
                                exportPdf({ resume_id: currentResumeId })
                            }
                        >
                            PDF
                        </Button>
                    </div>
                    <div className="space-y-2 text-12 text-sub">
                        <p className="text-14 font-600 text-text">
                            {`${state.BASIC.name} ${state.BASIC.surname}`.trim() ||
                                'Your Name'}
                        </p>
                        <p>
                            {state.BASIC.desired_position || 'Desired position'}
                        </p>
                        <p>{state.CONTACTS.email || 'email@example.com'}</p>
                        <p>{state.CONTACTS.phone || 'Phone'}</p>
                        <p>{state.CONTACTS.city || 'City'}</p>
                        <hr className="border-base" />
                        <p className="text-text">About</p>
                        <p className="line-clamp-6">
                            {state.ABOUT.text || 'About text...'}
                        </p>
                        <p className="text-text">Skills</p>
                        <p>{state.SKILLS.hard.join(', ') || 'Hard skills'}</p>
                        <p>{state.SKILLS.soft.join(', ') || 'Soft skills'}</p>
                    </div>
                </aside>
            </div>
        </main>
    );
};
