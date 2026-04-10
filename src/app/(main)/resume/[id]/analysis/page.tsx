import { redirect, notFound } from 'next/navigation';
import { headers } from 'next/headers';
import Link from 'next/link';
import cn from 'classnames';
import { getServerSession } from '~/shared/lib/auth';
import { createSSRHelpers } from 'trpc/helpers';
import { daysAgo } from '~/entities/resume/model/lib';
import { RunAnalysisButton, ExportPdfButton } from './AnalysisActions';
import { TrendingSkillsPanel } from './TrendingSkillsPanel';

// ─── Section helpers ───────────────────────────────────────────────────────

const ALL_SECTION_TYPES = [
    'BASIC',
    'CONTACTS',
    'ABOUT',
    'EXPERIENCE',
    'EDUCATION',
    'SKILLS',
    'PORTFOLIO',
] as const;

const SECTION_LABELS: Record<string, string> = {
    BASIC: 'Основное',
    CONTACTS: 'Контакты',
    ABOUT: 'О себе',
    EXPERIENCE: 'Опыт работы',
    EDUCATION: 'Образование',
    SKILLS: 'Навыки',
    PORTFOLIO: 'Портфолио',
};

function getSectionBadge(type: string, content: unknown): { text: string; cls: string } {
    const empty = { text: 'Не указано', cls: 'bg-surface/40 text-sub' };
    if (!content || typeof content !== 'object') return empty;
    const c = content as Record<string, unknown>;

    switch (type) {
        case 'BASIC':
            if (!(c.name && c.surname)) return empty;
            return { text: 'Заполнено', cls: 'bg-teal/15 text-teal' };
        case 'CONTACTS':
            if (!c.email) return empty;
            return { text: 'Заполнено', cls: 'bg-teal/15 text-teal' };
        case 'ABOUT':
            if (!(typeof c.text === 'string' && c.text.trim())) return empty;
            return { text: 'Заполнено', cls: 'bg-teal/15 text-teal' };
        case 'EXPERIENCE': {
            const items = Array.isArray(c.items) ? c.items : [];
            if (items.length === 0) return empty;
            let word: string;
            if (items.length === 1) {
                word = 'позиция';
            } else if (items.length < 5) {
                word = 'позиции';
            } else {
                word = 'позиций';
            }
            return { text: `${items.length} ${word}`, cls: 'bg-teal/15 text-teal' };
        }
        case 'SKILLS': {
            const hard = Array.isArray(c.hard) ? c.hard.length : 0;
            const soft = Array.isArray(c.soft) ? c.soft.length : 0;
            const total = hard + soft;
            if (total === 0) return empty;
            if (total < 3) return { text: 'Мало навыков', cls: 'bg-amber/15 text-amber' };
            return { text: 'Заполнено', cls: 'bg-teal/15 text-teal' };
        }
        case 'EDUCATION':
        case 'PORTFOLIO': {
            const items = Array.isArray(c.items) ? c.items : [];
            if (items.length === 0) return empty;
            return { text: 'Заполнено', cls: 'bg-teal/15 text-teal' };
        }
        default:
            return empty;
    }
}

// ─── Score level ───────────────────────────────────────────────────────────

function getScoreLevel(score: number) {
    if (score >= 90) return 'Отлично';
    if (score >= 70) return 'Хорошо';
    if (score >= 50) return 'Нужно улучшить';
    return 'Слабое';
}

function getScoreStroke(score: number) {
    if (score >= 70) return '#5DCAA5';
    if (score >= 40) return '#ef9f27';
    return '#e24b4a';
}

function barColor(value: number) {
    if (value > 70) return 'bg-teal';
    if (value >= 40) return 'bg-amber';
    return 'bg-red';
}

// ─── Recommendation dot ────────────────────────────────────────────────────

function recDotColor(text: string) {
    const t = text.toLowerCase();
    if (/добавьте|укажите|отсутствует/.test(t)) return 'bg-red';
    if (/улучшите|расширьте/.test(t)) return 'bg-amber';
    if (/хорошо|отлично/.test(t)) return 'bg-teal';
    return 'bg-amber';
}

// ─── Sub-components ────────────────────────────────────────────────────────

const ScoreRing = ({ score }: { score: number }) => {
    const r = 36;
    const circ = 2 * Math.PI * r;
    const offset = circ - (score / 100) * circ;
    const color = getScoreStroke(score);
    return (
        <div className="relative flex h-[88px] w-[88px] shrink-0 items-center justify-center">
            <svg className="-rotate-90" width="88" height="88" viewBox="0 0 88 88" aria-hidden>
                <circle cx="44" cy="44" r={r} fill="none" strokeWidth="7" stroke="rgba(255,255,255,0.08)" />
                <circle
                    cx="44" cy="44" r={r} fill="none" strokeWidth="7"
                    strokeDasharray={circ} strokeDashoffset={offset}
                    strokeLinecap="round" stroke={color}
                />
            </svg>
            <span className="absolute text-20 font-700" style={{ color }}>{score}</span>
        </div>
    );
};

const ProgressBar = ({ label, value }: { label: string; value: number }) => (
        <div className="flex flex-col gap-y-1.5">
            <div className="flex items-center justify-between">
                <span className="text-13 text-sub">{label}</span>
                <span className="text-13 font-600 text-text">{value}</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface/30">
                <div
                    className={cn('h-full rounded-full transition-all duration-500', barColor(value))}
                    style={{ width: `${value}%` }}
                />
            </div>
        </div>
    );

// ─── Page ──────────────────────────────────────────────────────────────────

interface Props {
    params: { id: string };
}

const ResumeAnalysisPage = async ({ params }: Props) => {
    const session = await getServerSession();
    if (session?.user.role !== 'USER') redirect('/user/login');

    const helpers = await createSSRHelpers(headers());

    const resume = await helpers.resume.getItem.fetch({ resume_id: params.id });
    if (!resume) notFound();

    const [analysisResult, trendingResult] = await Promise.allSettled([
        helpers.resume.getAnalysis.fetch({ resume_id: params.id }),
        helpers.resume.getTrendingSkills.fetch({ resume_id: params.id }),
    ]);

    const analysis = analysisResult.status === 'fulfilled' ? analysisResult.value : null;
    const trending = trendingResult.status === 'fulfilled'
        ? trendingResult.value
        : { skills: [], vacanciesAnalyzed: 0 };

    const sectionMap = new Map(resume.sections.map((s) => [s.type as string, s.content]));
    const skillsContent = sectionMap.get('SKILLS') as { hard?: string[]; soft?: string[] } | undefined;

    const BARS = analysis
        ? [
              { label: 'Полнота', value: analysis.score_completeness },
              { label: 'Структура', value: analysis.score_structure },
              { label: 'Ключевые слова', value: analysis.score_keywords },
              { label: 'Навыки', value: analysis.score_skills },
          ]
        : [];

    const recommendations = analysis
        ? (analysis.recommendations as string[])
        : [];

    return (
        <main className="mx-auto flex w-full max-w-[1200px] flex-grow flex-col gap-y-6 px-20 py-10">
            {/* ── Header ── */}
            <div className="flex items-start justify-between">
                <div className="flex flex-col gap-y-1">
                    <Link
                        href="/resume"
                        className="mb-1 w-fit text-13 text-sub transition-colors hover:text-text"
                    >
                        ← Назад
                    </Link>
                    <h1 className="text-28 font-700 text-text">Анализ резюме</h1>
                    <p className="text-13 text-sub/60">
                        {resume.desired_position ?? resume.title}
                        {' · '}
                        Обновлено {daysAgo(resume.updated_at)}
                    </p>
                </div>
                <div className="flex items-center gap-x-2">
                    <ExportPdfButton resumeId={resume.resume_id} />
                    <Link
                        href={`/resume/builder/${resume.resume_id}`}
                        className="rounded-8 bg-surface/40 px-4 py-2 text-13 font-500 text-sub transition-colors hover:bg-surface hover:text-text"
                    >
                        Редактировать
                    </Link>
                </div>
            </div>

            {/* ── No analysis state ── */}
            {!analysis && (
                <div className="flex flex-col items-center gap-y-4 rounded-12 border border-surface-secondary bg-mantle py-16 text-center">
                    <p className="text-18 font-600 text-text">Анализ ещё не выполнен</p>
                    <p className="text-13 text-sub/60">
                        Запустите анализ, чтобы получить оценку и рекомендации
                    </p>
                    <RunAnalysisButton resumeId={resume.resume_id} />
                </div>
            )}

            {/* ── Two-column grid (only when analysis exists) ── */}
            {analysis && (
                <div className="grid gap-6 lg:grid-cols-[40%_1fr]">

                    {/* ── Left column ── */}
                    <div className="flex flex-col gap-y-5">

                        {/* Card: Общая оценка */}
                        <div className="flex flex-col gap-y-5 rounded-12 border border-surface-secondary bg-mantle p-5">
                            <p className="text-14 font-600 text-text">Общая оценка</p>
                            <div className="flex items-center gap-x-5">
                                <ScoreRing score={analysis.score_total} />
                                <div className="flex flex-col gap-y-0.5">
                                    <span className="text-24 font-700 text-text">
                                        {getScoreLevel(analysis.score_total)}
                                    </span>
                                    <span className="text-13 text-sub">
                                        {analysis.score_total} / 100
                                    </span>
                                </div>
                            </div>
                            <div className="h-px w-full bg-surface/30" />
                            <div className="flex flex-col gap-y-3">
                                {BARS.map((bar) => (
                                    <ProgressBar key={bar.label} {...bar} />
                                ))}
                            </div>
                        </div>

                        {/* Card: Секции резюме */}
                        <div className="flex flex-col gap-y-1 rounded-12 border border-surface-secondary bg-mantle p-5">
                            <p className="mb-3 text-14 font-600 text-text">Секции резюме</p>
                            {ALL_SECTION_TYPES.map((type) => {
                                const content = sectionMap.get(type) ?? null;
                                const badge = getSectionBadge(type, content);
                                return (
                                    <div
                                        key={type}
                                        className="flex items-center justify-between rounded-8 px-2 py-2.5 transition-colors hover:bg-surface/20"
                                    >
                                        <span className="text-13 text-sub">
                                            {SECTION_LABELS[type]}
                                        </span>
                                        <span
                                            className={cn(
                                                'rounded-full px-2.5 py-0.5 text-12 font-500',
                                                badge.cls
                                            )}
                                        >
                                            {badge.text}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* ── Right column ── */}
                    <div className="flex flex-col gap-y-5">
                        <div className="flex flex-col gap-y-5 rounded-12 border border-surface-secondary bg-mantle p-5">
                            <p className="text-14 font-600 text-text">Рекомендации</p>

                            <div className="flex flex-col gap-y-3">
                                {recommendations.map((text, i) => (
                                    // eslint-disable-next-line react/no-array-index-key
                                    <div key={i} className="flex items-start gap-x-3">
                                        <span
                                            className={cn(
                                                'mt-[5px] h-2 w-2 shrink-0 rounded-full',
                                                recDotColor(text)
                                            )}
                                        />
                                        <p className="text-13 leading-[1.55] text-sub">{text}</p>
                                    </div>
                                ))}
                                {recommendations.length === 0 && (
                                    <p className="text-13 text-sub/60">Нет рекомендаций</p>
                                )}
                            </div>

                            {trending.skills.length > 0 && (
                                <>
                                    <div className="h-px w-full bg-surface/30" />
                                    <div className="flex flex-col gap-y-3">
                                        <div className="flex items-center justify-between">
                                            <p className="text-13 text-sub/60">
                                                Трендовые навыки для вашей роли
                                            </p>
                                            {trending.vacanciesAnalyzed > 0 && (
                                                <span className="text-11 text-sub/40">
                                                    {trending.vacanciesAnalyzed} вакансий
                                                </span>
                                            )}
                                        </div>
                                        <TrendingSkillsPanel
                                            skills={trending.skills}
                                            resumeId={resume.resume_id}
                                            currentHardSkills={skillsContent?.hard ?? []}
                                            currentSoftSkills={skillsContent?.soft ?? []}
                                        />
                                    </div>
                                </>
                            )}

                            {!resume.desired_position && trending.skills.length === 0 && (
                                <div className="flex flex-col gap-y-2 border-t border-surface/20 pt-4">
                                    <p className="text-13 text-sub/60">
                                        Трендовые навыки для вашей роли
                                    </p>
                                    <p className="text-12 text-sub/40">
                                        Укажите желаемую должность, чтобы увидеть навыки в тренде
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
};

export default ResumeAnalysisPage;
