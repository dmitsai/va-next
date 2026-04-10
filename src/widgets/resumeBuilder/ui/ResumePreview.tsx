import React from 'react';
import { Button, ButtonView } from '~/shared/ui/Button/Button';
import type { ResumeFormState } from '../model/types';

interface ResumePreviewProps {
    state: ResumeFormState;
    isExporting: boolean;
    resumeId: string;
    onExportPdf: () => void;
}

const ContactChip = ({ children }: { children: React.ReactNode }) => (
    <span className="rounded-4 bg-[#f3f4f6] px-2 py-0.5 text-12 text-[#6b7280]">
        {children}
    </span>
);

const ResumeSection = ({
    title,
    children,
}: {
    title: string;
    children: React.ReactNode;
}) => (
    <div className="mb-5">
        <p className="text-11 mb-3 font-700 uppercase tracking-widest text-[#9ca3af]">
            {title}
        </p>
        <div className="border-t border-gray-100 pt-3">{children}</div>
    </div>
);

export const ResumePreview: React.FC<ResumePreviewProps> = ({
    state,
    isExporting,
    resumeId,
    onExportPdf,
}) => {
    const fullName =
        `${state.BASIC.name} ${state.BASIC.surname}`.trim() || 'Ваше имя';

    return (
        <div className="flex flex-col gap-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-12 font-600 uppercase tracking-widest text-sub">
                        Предпросмотр
                    </p>
                    <p className="mt-0.5 text-[11px] text-sub/50">
                        Обновляется в реальном времени
                    </p>
                </div>
                <Button
                    buttonView={ButtonView.SMALL}
                    className="bg-mauve/15 text-12 text-mauve hover:bg-mauve/25 disabled:opacity-40"
                    disabled={!resumeId || isExporting}
                    onClick={onExportPdf}
                >
                    {isExporting ? 'Генерация...' : 'Скачать PDF'}
                </Button>
            </div>

            {/* A4-like card */}
            <div className="rounded-8 bg-white p-8 text-[#1a1a2e] shadow-xl ring-1 ring-black/10">
                {/* Resume header */}
                <div className="mb-6 border-b border-gray-100 pb-5">
                    <h1 className="text-20 font-700 leading-tight text-[#111827]">
                        {fullName}
                    </h1>
                    {state.BASIC.desired_position && (
                        <p className="mt-1 text-14 text-[#6b7280]">
                            {state.BASIC.desired_position}
                        </p>
                    )}

                    {/* Contacts row */}
                    {(state.CONTACTS.email ??
                        state.CONTACTS.phone ??
                        state.CONTACTS.city ??
                        state.CONTACTS.telegram) && (
                        <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1">
                            {state.CONTACTS.email && (
                                <ContactChip>
                                    {state.CONTACTS.email}
                                </ContactChip>
                            )}
                            {state.CONTACTS.phone && (
                                <ContactChip>
                                    {state.CONTACTS.phone}
                                </ContactChip>
                            )}
                            {state.CONTACTS.city && (
                                <ContactChip>{state.CONTACTS.city}</ContactChip>
                            )}
                            {state.CONTACTS.telegram && (
                                <ContactChip>
                                    {state.CONTACTS.telegram}
                                </ContactChip>
                            )}
                            {state.CONTACTS.github && (
                                <ContactChip>
                                    {state.CONTACTS.github}
                                </ContactChip>
                            )}
                            {state.CONTACTS.linkedin && (
                                <ContactChip>
                                    {state.CONTACTS.linkedin}
                                </ContactChip>
                            )}
                        </div>
                    )}
                </div>

                {/* About */}
                {state.ABOUT.text && (
                    <ResumeSection title="О себе">
                        <p className="whitespace-pre-wrap text-13 leading-relaxed text-[#4b5563]">
                            {state.ABOUT.text}
                        </p>
                    </ResumeSection>
                )}

                {/* Experience */}
                {state.EXPERIENCE.items.some(
                    (i) => i.company || i.position
                ) && (
                    <ResumeSection title="Опыт работы">
                        <div className="flex flex-col gap-y-4">
                            {state.EXPERIENCE.items
                                .filter((i) => i.company || i.position)
                                .map((item) => (
                                    <div key={item.company + item.position}>
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <p className="text-14 font-600 text-[#111827]">
                                                    {item.position || '—'}
                                                </p>
                                                {item.company && (
                                                    <p className="text-13 text-[#6b7280]">
                                                        {item.company}
                                                    </p>
                                                )}
                                            </div>
                                            <p className="shrink-0 text-12 text-[#9ca3af]">
                                                {item.period_from}
                                                {item.is_current &&
                                                    ' — наст. время'}
                                                {!item.is_current &&
                                                    item.period_to &&
                                                    ` — ${item.period_to}`}
                                                {!item.is_current &&
                                                    !item.period_to &&
                                                    ''}
                                            </p>
                                        </div>
                                        {item.description && (
                                            <p className="mt-1.5 whitespace-pre-wrap text-12 leading-relaxed text-[#6b7280]">
                                                {item.description}
                                            </p>
                                        )}
                                    </div>
                                ))}
                        </div>
                    </ResumeSection>
                )}

                {/* Education */}
                {state.EDUCATION.items.some((i) => i.institution) && (
                    <ResumeSection title="Образование">
                        <div className="flex flex-col gap-y-3">
                            {state.EDUCATION.items
                                .filter((i) => i.institution)
                                .map((item) => (
                                    <div
                                        key={`${item.institution}+${item.field}`}
                                        className="flex items-start justify-between"
                                    >
                                        <div>
                                            <p className="text-13 font-600 text-[#111827]">
                                                {item.institution}
                                            </p>
                                            <p className="text-12 text-[#6b7280]">
                                                {[item.degree, item.field]
                                                    .filter(Boolean)
                                                    .join(', ')}
                                            </p>
                                        </div>
                                        <p className="shrink-0 text-12 text-[#9ca3af]">
                                            {item.year_from}
                                            {item.year_to
                                                ? ` — ${item.year_to}`
                                                : ''}
                                        </p>
                                    </div>
                                ))}
                        </div>
                    </ResumeSection>
                )}

                {/* Skills */}
                {(state.SKILLS.hard.length > 0 ||
                    state.SKILLS.soft.length > 0) && (
                    <ResumeSection title="Навыки">
                        <div className="flex flex-col gap-y-3">
                            {state.SKILLS.hard.length > 0 && (
                                <div>
                                    <p className="text-11 mb-1.5 font-600 uppercase tracking-wide text-[#9ca3af]">
                                        Hard skills
                                    </p>
                                    <div className="flex flex-wrap gap-1.5">
                                        {state.SKILLS.hard.map((skill) => (
                                            <span
                                                key={skill}
                                                className="rounded-4 bg-[#ede9fe] px-2 py-0.5 text-12 font-500 text-[#6d28d9]"
                                            >
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {state.SKILLS.soft.length > 0 && (
                                <div>
                                    <p className="text-11 mb-1.5 font-600 uppercase tracking-wide text-[#9ca3af]">
                                        Soft skills
                                    </p>
                                    <div className="flex flex-wrap gap-1.5">
                                        {state.SKILLS.soft.map((skill) => (
                                            <span
                                                key={skill}
                                                className="rounded-4 bg-[#d1fae5] px-2 py-0.5 text-12 font-500 text-[#065f46]"
                                            >
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </ResumeSection>
                )}

                {/* Portfolio */}
                {state.PORTFOLIO.items.some((i) => i.title || i.url) && (
                    <ResumeSection title="Портфолио">
                        <div className="flex flex-col gap-y-3">
                            {state.PORTFOLIO.items
                                .filter((i) => i.title || i.url)
                                .map((item) => (
                                    <div key={item.title + item.url}>
                                        <p className="text-13 font-600 text-[#111827]">
                                            {item.title}
                                        </p>
                                        {item.url && (
                                            <p className="text-12 text-[#6b7280] underline">
                                                {item.url}
                                            </p>
                                        )}
                                        {item.description && (
                                            <p className="mt-0.5 text-12 text-[#9ca3af]">
                                                {item.description}
                                            </p>
                                        )}
                                    </div>
                                ))}
                        </div>
                    </ResumeSection>
                )}

                {/* Empty state */}
                {!state.ABOUT.text &&
                    !state.EXPERIENCE.items.some((i) => i.company) &&
                    !state.SKILLS.hard.length && (
                        <p className="text-13 text-center text-[#9ca3af]">
                            Заполните разделы — предпросмотр обновится
                            автоматически
                        </p>
                    )}
            </div>
        </div>
    );
};
