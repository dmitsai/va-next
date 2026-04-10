'use client';

import React, { useMemo, useState } from 'react';
import cn from 'classnames';
import { Button, ButtonView } from '~/shared/ui/Button/Button';
import { ResumeProgress } from '~/features/resumeProgress';
import type { ResumeTab } from '~/features/resumeProgress/model/types';
import { useResumeBuilder } from '../model/useResumeBuilder';
import {
    STEP_DEFS,
    STEP_TOTAL,
    type ResumeWithRelations,
} from '../model/types';
import { StepBasic } from './steps/StepBasic';
import { StepContacts } from './steps/StepContacts';
import { StepAbout } from './steps/StepAbout';
import { StepExperience } from './steps/StepExperience';
import { StepEducation } from './steps/StepEducation';
import { StepSkills } from './steps/StepSkills';
import { StepPortfolio } from './steps/StepPortfolio';
import { StepFinal } from './steps/StepFinal';
import { ResumePreview } from './ResumePreview';
import { StepAiSidebar } from './StepAiSidebar';

type ViewMode = 'edit' | 'preview';

interface ResumeBuilderProps {
    resumeId: string;
    initialResume: ResumeWithRelations | null;
    initialStep: number;
}

export const ResumeBuilder: React.FC<ResumeBuilderProps> = ({
    resumeId,
    initialResume,
    initialStep,
}) => {
    const {
        currentStep,
        currentResumeId,
        resume,
        state,
        setSection,
        completedSteps,
        stepErrors,
        isLoading,
        isCreating,
        isSaving,
        isPublishing,
        isExporting,
        activeTabId,
        goToStep,
        handleTabChange,
        handleFillFromProfile,
        handlePublish,
        handleExportPdf,
    } = useResumeBuilder(resumeId, initialResume, initialStep);
    const [view, setView] = useState<ViewMode>('edit');
    // Track which experience item's AI panel is active in the sidebar
    const [activeExpIndex, setActiveExpIndex] = useState(0);

    const tabs = useMemo<ResumeTab[]>(
        () =>
            STEP_DEFS.map((step) => ({
                id: step.tabId,
                title: step.label,
                status: completedSteps.has(step.id)
                    ? 'completed'
                    : 'not_started',
                number: step.id,
            })),
        [completedSteps]
    );

    const isLastStep = currentStep >= STEP_TOTAL;

    const renderStep = () => {
        if (isLoading) {
            return (
                <p className="py-12 text-center text-14 text-sub">
                    Загрузка...
                </p>
            );
        }
        switch (currentStep) {
            case 1:
                return (
                    <StepBasic
                        state={state.BASIC}
                        errors={stepErrors}
                        onChange={(v) => setSection('BASIC', v)}
                    />
                );
            case 2:
                return (
                    <StepContacts
                        state={state.CONTACTS}
                        errors={stepErrors}
                        onChange={(v) => setSection('CONTACTS', v)}
                        onFillFromProfile={handleFillFromProfile}
                    />
                );
            case 3:
                return (
                    <StepAbout
                        state={state.ABOUT}
                        onChange={(v) => setSection('ABOUT', v)}
                    />
                );
            case 4:
                return (
                    <StepExperience
                        state={state.EXPERIENCE}
                        onChange={(v) => setSection('EXPERIENCE', v)}
                        onActiveItemChange={setActiveExpIndex}
                    />
                );
            case 5:
                return (
                    <StepEducation
                        state={state.EDUCATION}
                        onChange={(v) => setSection('EDUCATION', v)}
                    />
                );
            case 6:
                return (
                    <StepSkills
                        state={state.SKILLS}
                        onChange={(v) => setSection('SKILLS', v)}
                    />
                );
            case 7:
                return (
                    <StepPortfolio
                        state={state.PORTFOLIO}
                        onChange={(v) => setSection('PORTFOLIO', v)}
                    />
                );
            case 8:
                return (
                    <StepFinal
                        state={state}
                        resume={resume}
                        resumeId={currentResumeId}
                        isPublishing={isPublishing}
                        isExporting={isExporting}
                        onPublish={handlePublish}
                        onExportPdf={handleExportPdf}
                    />
                );
            default:
                return null;
        }
    };

    const handleNext = (e: React.FormEvent) => {
        e.preventDefault();
        if (currentStep < STEP_TOTAL) {
            goToStep(currentStep + 1);
        }
    };

    if (!currentResumeId && isCreating) {
        return (
            <div className="flex flex-1 items-center justify-center">
                <p className="text-14 text-sub">Создаём черновик резюме...</p>
            </div>
        );
    }

    return (
        <div className="flex min-h-0 flex-1 overflow-hidden bg-base">
            {/* ── Left sidebar (sticky, profile-like) ── */}
            <aside className="flex w-[240px] shrink-0 flex-col overflow-y-auto border-r-2 border-surface-tertiary">
                <div className="px-5 pt-4">
                    <a
                        href="/resume"
                        className="inline-flex items-center gap-x-1 text-12 text-sub transition-colors hover:text-text"
                    >
                        ← Мои резюме
                    </a>
                </div>
                <div className="flex-1 py-3">
                    <ResumeProgress
                        tabs={tabs}
                        activeTabId={activeTabId}
                        onTabChange={handleTabChange}
                    />
                </div>
                {/* Autosave */}
                <div className="flex items-center gap-x-2 px-5 py-3">
                    <span
                        className={cn(
                            'h-1.5 w-1.5 shrink-0 rounded-full transition-colors',
                            isSaving ? 'bg-amber' : 'bg-teal'
                        )}
                    />
                    <span
                        className={cn(
                            'text-12',
                            isSaving ? 'text-amber' : 'text-teal'
                        )}
                    >
                        {isSaving ? 'Сохранение...' : 'Автосохранение'}
                    </span>
                </div>
            </aside>

            {/* ── Main content ── */}
            <div className="flex flex-1 flex-col overflow-hidden">
                {/* Tab bar: edit / preview — hidden on last step */}
                {!isLastStep && (
                    <div className="flex shrink-0 border-b-2 border-surface-tertiary">
                        {(['edit', 'preview'] as const).map((mode) => (
                            <button
                                key={mode}
                                type="button"
                                onClick={() => setView(mode)}
                                className={cn(
                                    'text-13 relative px-6 py-3 font-500 transition-colors',
                                    view === mode
                                        ? 'text-text'
                                        : 'text-sub hover:text-text/70'
                                )}
                            >
                                {mode === 'edit'
                                    ? 'Редактировать'
                                    : 'Предпросмотр'}
                                {view === mode && (
                                    <span className="absolute bottom-0 left-0 h-0.5 w-full bg-mauve" />
                                )}
                            </button>
                        ))}
                    </div>
                )}

                <div className="flex min-h-0 flex-1 overflow-hidden">
                    {/* Preview pane (slides in when view === 'preview') */}
                    {!isLastStep && view === 'preview' && (
                        <div className="flex-1 overflow-y-auto bg-base px-8 py-8">
                            <ResumePreview
                                state={state}
                                isExporting={isExporting}
                                resumeId={currentResumeId}
                                onExportPdf={handleExportPdf}
                            />
                        </div>
                    )}

                    {/* Edit pane: form + AI sidebar */}
                    {(isLastStep || view === 'edit') && (
                        <div className="flex min-h-0 flex-1 overflow-hidden">
                            {/* Form */}
                            <div className="flex-1 overflow-y-auto">
                                <form
                                    className={`mx-auto px-8 py-8 ${isLastStep ? 'max-w-5xl' : 'max-w-2xl'}`}
                                    onSubmit={handleNext}
                                >
                                    <div
                                        key={currentStep}
                                        className="duration-200 animate-in fade-in slide-in-from-right-4"
                                    >
                                        {renderStep()}
                                    </div>

                                    {!isLastStep && (
                                        <div className="mt-10 flex items-center justify-between border-t border-surface-tertiary/50 pt-6">
                                            <Button
                                                type="button"
                                                buttonView={ButtonView.LARGE}
                                                className="size-10 bg-surface/40 text-sub hover:bg-surface disabled:pointer-events-none disabled:opacity-40"
                                                disabled={currentStep <= 1}
                                                onClick={() =>
                                                    goToStep(currentStep - 1)
                                                }
                                            >
                                                {'<'}
                                            </Button>

                                            <span className="text-12 text-sub/50">
                                                {currentStep} / {STEP_TOTAL - 1}
                                            </span>

                                            <Button
                                                type="submit"
                                                buttonView={ButtonView.LARGE}
                                                className="size-10 bg-mauve/15 text-mauve hover:bg-mauve/25"
                                            >
                                                {'>'}
                                            </Button>
                                        </div>
                                    )}
                                </form>
                            </div>

                            {/* AI Sidebar (all steps except last) */}
                            {!isLastStep && (
                                <StepAiSidebar
                                    step={currentStep}
                                    state={state}
                                    resumeId={currentResumeId || undefined}
                                    onFillContactsFromProfile={handleFillFromProfile}
                                    onSelectAboutText={(text) =>
                                        setSection('ABOUT', { text })
                                    }
                                    onSelectExperienceDescription={(text, idx, mode) => {
                                        const items = [...state.EXPERIENCE.items];
                                        const prev = items[idx]!;
                                        const next = mode === 'append' && prev.description
                                            ? `${prev.description}\n\n${text}`
                                            : text;
                                        items[idx] = { ...prev, description: next };
                                        setSection('EXPERIENCE', { items });
                                    }}
                                    onAddSkill={(skill) => {
                                        const allSkills = [...state.SKILLS.hard, ...state.SKILLS.soft];
                                        if (!allSkills.includes(skill) && allSkills.length < 25) {
                                            setSection('SKILLS', { hard: [...allSkills, skill], soft: [] });
                                        }
                                    }}
                                    activeExperienceIndex={activeExpIndex}
                                />
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
