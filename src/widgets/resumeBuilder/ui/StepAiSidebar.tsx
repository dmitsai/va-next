'use client';

import React, { useMemo } from 'react';
import { clientApi } from 'trpc/client';
import { AiSuggestionPanel } from './AiSuggestionPanel';
import type { ResumeFormState, ExperienceItem } from '../model/types';
import {
    interpolateTemplate,
    pickRandomTips,
    sidebarSuggestions,
    type SidebarTip,
} from '../model/suggestions';

// ─── helpers ───────────────────────────────────────────────────────────────

function calcTotalMonths(items: ExperienceItem[]): number {
    return items.reduce((total, item) => {
        if (!item.period_from) return total;
        const [fromM, fromY] = item.period_from.split('/').map(Number);
        if (!fromM || !fromY) return total;
        const from = new Date(fromY, fromM - 1);
        let to: Date;
        if (item.is_current || !item.period_to) {
            to = new Date();
        } else {
            const [toM, toY] = item.period_to.split('/').map(Number);
            if (!toM || !toY) return total;
            to = new Date(toY, toM - 1);
        }
        const months =
            (to.getFullYear() - from.getFullYear()) * 12 +
            (to.getMonth() - from.getMonth());
        if (months > 0) return total + months;
        return total;
    }, 0);
}

function formatExperience(months: number): string {
    if (months === 0) return '';
    const y = Math.floor(months / 12);
    const m = months % 12;
    const parts: string[] = [];
    if (y > 0) {
        let yLabel: string;
        if (y === 1) yLabel = 'год';
        else if (y < 5) yLabel = 'года';
        else yLabel = 'лет';
        parts.push(`${y} ${yLabel}`);
    }
    if (m > 0) parts.push(`${m} мес.`);
    return parts.join(' ');
}

/** `**жирный**`, затем `{{переменные}}` из vars */
const TipText = ({
    text,
    vars,
}: {
    text: string;
    vars?: Record<string, string | number>;
}) => {
    const withVars = vars ? interpolateTemplate(text, vars) : text;
    const parts = withVars.split(/(\*\*[^*]+\*\*)/g);
    return (
        <>
            {parts.map((part, index) => {
                if (part.length === 0) return null;
                const key = `${index}:${part}`;
                if (part.startsWith('**') && part.endsWith('**')) {
                    return <strong key={key}>{part.slice(2, -2)}</strong>;
                }
                return (
                    <span key={key} className="contents">
                        {part}
                    </span>
                );
            })}
        </>
    );
};

// ─── Tip card ──────────────────────────────────────────────────────────────

const Tip = ({ icon, children }: { icon: string; children: React.ReactNode }) => (
    <div className="flex gap-x-2.5 rounded-8 border border-surface-tertiary bg-surface/30 p-3">
        <span className="mt-0.5 shrink-0 text-15">{icon}</span>
        <p className="text-13 leading-relaxed text-text/70">{children}</p>
    </div>
);

const TipFromModel = ({ tip, vars }: { tip: SidebarTip; vars?: Record<string, string | number> }) => (
    <Tip icon={tip.icon}>
        <TipText text={tip.text} vars={vars} />
    </Tip>
);

const SectionHeader = ({ children }: { children: React.ReactNode }) => (
    <p className="flex items-center gap-x-1.5 text-12 font-600 uppercase tracking-widest text-mauve/80">
        <span>✦</span> {children}
    </p>
);

// ─── Per-step sidebars ─────────────────────────────────────────────────────

const BasicSidebar = ({ state }: { state: ResumeFormState }) => {
    const firstName = state.BASIC.name?.trim();
    const position = state.BASIC.desired_position?.trim() ?? '';
    const hasPhoto = Boolean(state.BASIC.photo_url?.trim());
    const b = sidebarSuggestions.basic;

    const { data: vacancyCount } = clientApi.resume.countByPosition.useQuery(
        { position },
        { enabled: position.length > 2, staleTime: 60_000 }
    );

    const greeting = firstName
        ? interpolateTemplate(b.greeting.withName, { name: firstName })
        : b.greeting.default;

    return (
        <div className="flex flex-col gap-y-4">
            <div className="rounded-8 border border-mauve/20 bg-mauve/5 p-3.5">
                <p className="text-13 leading-relaxed text-text/80">{greeting}</p>
            </div>

            <SectionHeader>Рекомендации</SectionHeader>

            {!hasPhoto && <TipFromModel tip={b.tips.photoMissing} />}
            {hasPhoto && <TipFromModel tip={b.tips.photoPresent} />}

            {position.length > 2 && vacancyCount !== undefined && (
                <TipFromModel
                    tip={b.tips.vacancySearch}
                    vars={{ position, count: vacancyCount }}
                />
            )}

            <TipFromModel tip={b.tips.desiredPosition} />
        </div>
    );
};

const ContactsSidebar = ({ onFillFromProfile }: { onFillFromProfile: () => void }) => {
    const { card, pool } = sidebarSuggestions.contacts;
    const randomTips = useMemo(() => pickRandomTips(pool), []);

    return (
        <div className="flex flex-col gap-y-4">
            <SectionHeader>Рекомендации</SectionHeader>

            <div className="rounded-8 border border-mauve/20 bg-mauve/5 p-3.5">
                <p className="mb-2 text-13 text-text/80">
                    <TipText text={card.hint} />
                </p>
                <button
                    type="button"
                    onClick={onFillFromProfile}
                    className="rounded-6 bg-mauve/15 px-3 py-1.5 text-12 font-500 text-mauve transition-colors hover:bg-mauve/25"
                >
                    {card.fillFromProfileButton}
                </button>
            </div>

            {randomTips.map((t) => (
                <TipFromModel key={t.id} tip={t} />
            ))}
        </div>
    );
};

const AboutSidebar = ({
    state,
    resumeId,
    onSelect,
}: {
    state: ResumeFormState;
    resumeId?: string;
    onSelect: (_text: string) => void;
}) => {
    const textLen = state.ABOUT.text.length;
    const { pool, tooShort, tooLong } = sidebarSuggestions.about;
    const randomTips = useMemo(() => pickRandomTips(pool), []);

    return (
        <div className="flex flex-col gap-y-4">
            <SectionHeader>ИИ-помощник</SectionHeader>

            {resumeId && (
                <AiSuggestionPanel
                    resumeId={resumeId}
                    sectionType="ABOUT"
                    context={{
                        desired_position: state.BASIC.desired_position,
                        experience_items: state.EXPERIENCE.items,
                        hard_skills: state.SKILLS.hard,
                        current_text: state.ABOUT.text,
                    }}
                    onSelect={onSelect}
                />
            )}

            <SectionHeader>Рекомендации</SectionHeader>

            {textLen > 0 && textLen < 100 && <TipFromModel tip={tooShort} />}
            {textLen >= 300 && <TipFromModel tip={tooLong} />}

            {randomTips.map((t) => (
                <TipFromModel key={t.id} tip={t} />
            ))}
        </div>
    );
};

const ExperienceSidebar = ({
    state,
    resumeId,
    activeItemIndex,
    onSelectDescription,
}: {
    state: ResumeFormState;
    resumeId?: string;
    activeItemIndex: number;
    onSelectDescription: (_text: string, _index: number, _mode?: 'replace' | 'append') => void;
}) => {
    const totalMonths = calcTotalMonths(state.EXPERIENCE.items);
    const expStr = formatExperience(totalMonths);
    const position = state.BASIC.desired_position?.trim();
    const vacancyCountStub = null;
    const activeItem = state.EXPERIENCE.items[activeItemIndex];
    const { pool, totalExperienceTitle } = sidebarSuggestions.experience;

    const poolItems = useMemo(
        () =>
            pool.items.filter(
                (t) => !t.text.includes('{{position}}') || Boolean(position)
            ),
        [position]
    );

    const randomTips = useMemo(
        () =>
            pickRandomTips({
                ...pool,
                items: poolItems,
            }),
        [pool, poolItems]
    );

    return (
        <div className="flex flex-col gap-y-4">
            {expStr && (
                <div className="rounded-8 border border-teal/20 bg-teal/5 p-3.5">
                    <p className="text-12 font-600 text-teal">{totalExperienceTitle}</p>
                    <p className="mt-1 text-18 font-700 text-text">{expStr}</p>
                    {vacancyCountStub !== null && (
                        <p className="mt-1 text-12 text-sub/60">Подходит для {vacancyCountStub} вакансий</p>
                    )}
                    {vacancyCountStub === null && (
                        <p className="mt-1 text-12 text-sub/40">
                            {/* TODO: вывести количество вакансий по опыту */}
                        </p>
                    )}
                </div>
            )}

            {resumeId && activeItem && (
                <>
                    <SectionHeader>ИИ-помощник</SectionHeader>
                    <AiSuggestionPanel
                        resumeId={resumeId}
                        sectionType="EXPERIENCE"
                        context={{
                            position: activeItem.position,
                            company: activeItem.company,
                            period: `${activeItem.period_from}–${activeItem.is_current ? 'н.в.' : (activeItem.period_to ?? '')}`,
                            current_text: activeItem.description,
                        }}
                        onSelect={(text, mode) => onSelectDescription(text, activeItemIndex, mode)}
                    />
                </>
            )}

            <SectionHeader>Рекомендации</SectionHeader>
            {randomTips.map((t) => (
                <TipFromModel
                    key={t.id}
                    tip={t}
                    vars={t.text.includes('{{position}}') && position ? { position } : undefined}
                />
            ))}
        </div>
    );
};

const EducationSidebar = () => {
    const randomTips = useMemo(
        () => pickRandomTips(sidebarSuggestions.education.pool),
        []
    );

    return (
        <div className="flex flex-col gap-y-4">
            <SectionHeader>Рекомендации</SectionHeader>
            {randomTips.map((t) => (
                <TipFromModel key={t.id} tip={t} />
            ))}
        </div>
    );
};

const SkillsSidebar = ({
    state,
    onAddSkill,
}: {
    state: ResumeFormState;
    onAddSkill: (_skill: string) => void;
}) => {
    const position = state.BASIC.desired_position?.trim();
    const allSkills = [...state.SKILLS.hard, ...state.SKILLS.soft];
    const sk = sidebarSuggestions.skills;

    const { data: popularSkills } = clientApi.skill.getPopular.useQuery(
        { limit: 15 },
        { staleTime: 60_000 }
    );

    const recommendations = popularSkills?.filter((s) => !allSkills.includes(s.name)) ?? [];

    const randomTips = useMemo(() => pickRandomTips(sk.pool), []);

    return (
        <div className="flex flex-col gap-y-4">
            {position && (
                <>
                    <SectionHeader>
                        {interpolateTemplate(sk.forPositionTitle, { position })}
                    </SectionHeader>
                    {recommendations.length > 0 ? (
                        <>
                            <p className="text-11 text-sub/50">{sk.tapToAdd}</p>
                            <div className="flex flex-wrap gap-1.5">
                                {recommendations.slice(0, 12).map((s) => (
                                    <button
                                        key={s.skill_id}
                                        type="button"
                                        onClick={() => onAddSkill(s.name)}
                                        className="rounded-4 bg-mauve/10 px-2 py-1 text-12 font-500 text-mauve transition-colors hover:bg-mauve/25 hover:text-mauve active:scale-95"
                                    >
                                        + {s.name}
                                    </button>
                                ))}
                            </div>
                        </>
                    ) : (
                        <p className="text-12 text-sub/50">{sk.allPopularAdded}</p>
                    )}
                </>
            )}

            <SectionHeader>Рекомендации</SectionHeader>
            {randomTips.map((t) => (
                <TipFromModel key={t.id} tip={t} />
            ))}
        </div>
    );
};

const PortfolioSidebar = () => {
    const randomTips = useMemo(
        () => pickRandomTips(sidebarSuggestions.portfolio.pool),
        []
    );

    return (
        <div className="flex flex-col gap-y-4">
            <SectionHeader>Рекомендации</SectionHeader>
            {randomTips.map((t) => (
                <TipFromModel key={t.id} tip={t} />
            ))}
        </div>
    );
};

// ─── Main export ───────────────────────────────────────────────────────────

interface StepAiSidebarProps {
    step: number;
    state: ResumeFormState;
    resumeId?: string;
    onFillContactsFromProfile: () => void;
    onSelectAboutText: (_text: string) => void;
    onSelectExperienceDescription: (_text: string, _index: number, _mode?: 'replace' | 'append') => void;
    onAddSkill: (_skill: string) => void;
    activeExperienceIndex?: number;
}

export const StepAiSidebar: React.FC<StepAiSidebarProps> = ({
    step,
    state,
    resumeId,
    onFillContactsFromProfile,
    onSelectAboutText,
    onSelectExperienceDescription,
    onAddSkill,
    activeExperienceIndex = 0,
}) => {
    const content = (() => {
        switch (step) {
            case 1:
                return <BasicSidebar state={state} />;
            case 2:
                return <ContactsSidebar onFillFromProfile={onFillContactsFromProfile} />;
            case 3:
                return (
                    <AboutSidebar
                        state={state}
                        resumeId={resumeId}
                        onSelect={onSelectAboutText}
                    />
                );
            case 4:
                return (
                    <ExperienceSidebar
                        state={state}
                        resumeId={resumeId}
                        activeItemIndex={activeExperienceIndex}
                        onSelectDescription={(text, idx, mode) =>
                            onSelectExperienceDescription(text, idx, mode)
                        }
                    />
                );
            case 5:
                return <EducationSidebar />;
            case 6:
                return <SkillsSidebar state={state} onAddSkill={onAddSkill} />;
            case 7:
                return <PortfolioSidebar />;
            default:
                return null;
        }
    })();

    if (!content) return null;

    return (
        <aside className="flex w-80 shrink-0 flex-col gap-y-5 overflow-y-auto border-l border-surface-tertiary px-5 py-8 xl:w-96">
            {content}
        </aside>
    );
};
