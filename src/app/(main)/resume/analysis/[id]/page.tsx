import { redirect, notFound } from 'next/navigation';
import { headers } from 'next/headers';
import Link from 'next/link';
import cn from 'classnames';
import { getServerSession } from '~/shared/lib/auth';
import { createSSRHelpers } from 'trpc/helpers';
import { type ResumeSection } from '@prisma/client';
import { daysAgo } from '~/entities/resume/model/lib';
import { TrendingSkillsPanel } from './TrendingSkillsPanel';

// ─── Section fill helpers ──────────────────────────────────────────────────

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

type Priority = 'critical' | 'improve' | 'ok';

const SECTION_RECOMMENDATIONS: Record<
    string,
    { text: string; priority: Priority }
> = {
    BASIC: {
        text: 'Заполните ФИО и желаемую должность — работодатель должен знать, кто вы',
        priority: 'critical',
    },
    CONTACTS: {
        text: 'Добавьте контактные данные, чтобы работодатель мог с вами связаться',
        priority: 'critical',
    },
    ABOUT: {
        text: 'Раздел «О себе» слишком короткий. Рекомендуется 3–5 предложений с указанием специализации',
        priority: 'improve',
    },
    EXPERIENCE: {
        text: 'В описании опыта используйте конкретные метрики: «увеличил производительность на X%» вместо «улучшил»',
        priority: 'improve',
    },
    EDUCATION: {
        text: 'Укажите образование для полноты резюме',
        priority: 'improve',
    },
    SKILLS: {
        text: 'Добавьте больше навыков — рекомендуется 8–12 технологий, релевантных вашей специальности',
        priority: 'improve',
    },
    PORTFOLIO: {
        text: 'Добавьте ссылку на портфолио или GitHub — это важно для IT-специалистов',
        priority: 'critical',
    },
};

function isSectionFilled(type: string, content: unknown): boolean {
    if (!content || typeof content !== 'object') return false;
    const c = content as Record<string, unknown>;
    switch (type) {
        case 'BASIC':
            return !!(c.name && c.surname);
        case 'CONTACTS':
            return !!c.email;
        case 'ABOUT':
            return typeof c.text === 'string' && c.text.trim().length > 0;
        case 'EXPERIENCE':
        case 'EDUCATION':
            return Array.isArray(c.items) && c.items.length > 0;
        case 'PORTFOLIO': {
            if (Array.isArray(c.items) && c.items.length > 0) return true;
            return false;
        }
        case 'SKILLS': {
            const hard = Array.isArray(c.hard) ? c.hard.length : 0;
            const soft = Array.isArray(c.soft) ? c.soft.length : 0;
            return (hard + soft) >= 4;
        }
        default:
            return false;
    }
}

function getSectionBadge(
    type: string,
    content: unknown
): { text: string; cls: string } {
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
            if (!(typeof c.text === 'string' && c.text.trim()))
                return empty;
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
            return {
                text: `${items.length} ${word}`,
                cls: 'bg-teal/15 text-teal',
            };
        }
        case 'SKILLS': {
            const hard = Array.isArray(c.hard) ? c.hard.length : 0;
            const soft = Array.isArray(c.soft) ? c.soft.length : 0;
            const total = hard + soft;
            if (total === 0) return empty;
            if (total < 4)
                return {
                    text: 'Мало навыков',
                    cls: 'bg-amber/15 text-amber',
                };
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

// ─── Score calculation ─────────────────────────────────────────────────────

function hasPortfolioOrCodeLinks(sections: Map<string, unknown>): boolean {
    const portfolio = sections.get('PORTFOLIO');
    if (
        portfolio &&
        typeof portfolio === 'object' &&
        Array.isArray((portfolio as { items?: unknown[] }).items) &&
        (portfolio as { items: unknown[] }).items.length > 0
    ) {
        return true;
    }
    const contacts = sections.get('CONTACTS');
    if (contacts && typeof contacts === 'object') {
        const c = contacts as { github?: string; linkedin?: string };
        if (c.github?.trim() || c.linkedin?.trim()) return true;
    }
    return false;
}

function computeAnalysis(sections: ResumeSection[]) {
    const map = new Map(sections.map((s) => [s.type as string, s.content]));

    const statuses = ALL_SECTION_TYPES.map((type) => ({
        type,
        label: SECTION_LABELS[type]!,
        content: map.get(type) ?? null,
        filled:
            type === 'PORTFOLIO'
                ? hasPortfolioOrCodeLinks(map)
                : isSectionFilled(type, map.get(type) ?? null),
    }));

    const pct = (types: readonly string[]) =>
        Math.round(
            (statuses.filter((s) => types.includes(s.type) && s.filled)
                .length /
                types.length) *
                100
        );

    const scoreCompleteness = pct(ALL_SECTION_TYPES);
    const scoreStructure = pct(['BASIC', 'CONTACTS', 'ABOUT']);
    const scoreSkills = pct(['SKILLS', 'EXPERIENCE']);
    const scoreKeywords = pct(['ABOUT', 'EXPERIENCE', 'SKILLS']);
    const scoreTotal = Math.round(
        (scoreCompleteness + scoreStructure + scoreSkills + scoreKeywords) / 4
    );

    const recommendations = statuses
        .filter((s) => !s.filled && SECTION_RECOMMENDATIONS[s.type])
        .map((s) => SECTION_RECOMMENDATIONS[s.type]!);

    // Add a positive note if structure is good
    if (
        statuses.filter((s) => ['BASIC', 'CONTACTS', 'ABOUT'].includes(s.type) && s.filled)
            .length === 3
    ) {
        recommendations.splice(2, 0, {
            text: 'Хорошая структура разделов и логичный порядок информации — соответствует современным стандартам',
            priority: 'ok',
        });
    }

    if (recommendations.length === 0) {
        recommendations.push({
            text: 'Резюме заполнено полностью. Отличная работа!',
            priority: 'ok',
        });
    }

    return {
        scoreTotal,
        scoreCompleteness,
        scoreStructure,
        scoreSkills,
        scoreKeywords,
        statuses,
        recommendations,
    };
}

// ─── UI helpers ────────────────────────────────────────────────────────────

function getScoreLevel(score: number) {
    if (score >= 90) return 'Отлично';
    if (score >= 70) return 'Хорошо';
    if (score >= 50) return 'Удовлетворительно';
    return 'Слабо';
}

function getScoreSub(score: number) {
    if (score >= 90) return 'Лучше большинства кандидатов';
    if (score >= 70) return 'Выше среднего по рынку';
    if (score >= 50) return 'Есть над чем работать';
    return 'Требует серьёзной доработки';
}

function getScoreStroke(score: number) {
    if (score >= 70) return '#5DCAA5'; // teal
    if (score >= 50) return '#ef9f27'; // amber
    return '#e24b4a'; // red
}

const ScoreRing = ({ score }: { score: number }) => {
    const r = 36;
    const circ = 2 * Math.PI * r;
    const offset = circ - (score / 100) * circ;
    const color = getScoreStroke(score);

    return (
        <div className="relative flex h-[88px] w-[88px] shrink-0 items-center justify-center">
            <svg
                className="-rotate-90"
                width="88"
                height="88"
                viewBox="0 0 88 88"
                aria-hidden
            >
                <circle
                    cx="44"
                    cy="44"
                    r={r}
                    fill="none"
                    strokeWidth="7"
                    stroke="rgba(255,255,255,0.08)"
                />
                <circle
                    cx="44"
                    cy="44"
                    r={r}
                    fill="none"
                    strokeWidth="7"
                    strokeDasharray={circ}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    stroke={color}
                />
            </svg>
            <span
                className="absolute text-20 font-700 text-text"
                style={{ color }}
            >
                {score}
            </span>
        </div>
    );
};

const PROGRESS_COLORS = [
    'bg-teal',
    'bg-mauve',
    'bg-yellow',
    'bg-blue',
] as const;

const ProgressBar = ({
    label,
    value,
    colorClass,
}: {
    label: string;
    value: number;
    colorClass: string;
}) => (
        <div className="flex flex-col gap-y-1.5">
            <div className="flex items-center justify-between">
                <span className="text-13 text-sub">{label}</span>
                <span className="text-13 font-600 text-text">{value}</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface/30">
                <div
                    className={cn(
                        'h-full rounded-full transition-all duration-500',
                        colorClass
                    )}
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
    if (session?.user.role !== 'USER') {
        redirect('/user/login');
    }

    const helpers = await createSSRHelpers(headers());

    const resume = await helpers.resume.getItem.fetch({
        resume_id: params.id,
    });

    if (!resume) notFound();

    const [trendingResult] = await Promise.allSettled([
        helpers.resume.getTrendingSkills.fetch({ resume_id: params.id }),
    ]);
    const trending =
        trendingResult.status === 'fulfilled'
            ? trendingResult.value
            : { skills: [], vacanciesAnalyzed: 0 };

    const {
        scoreTotal,
        scoreCompleteness,
        scoreStructure,
        scoreSkills,
        scoreKeywords,
        statuses,
        recommendations,
    } = computeAnalysis(resume.sections);

    const skillsContent = resume.sections.find((s) => s.type === 'SKILLS')
        ?.content as { hard?: string[]; soft?: string[] } | undefined;

    const BARS = [
        { label: 'Полнота', value: scoreCompleteness, colorClass: PROGRESS_COLORS[0] },
        { label: 'Структура', value: scoreStructure, colorClass: PROGRESS_COLORS[1] },
        { label: 'Навыки', value: scoreSkills, colorClass: PROGRESS_COLORS[2] },
        { label: 'Ключевые слова', value: scoreKeywords, colorClass: PROGRESS_COLORS[3] },
    ];

    return (
        <main className="flex w-full flex-grow flex-col gap-y-6 px-20 py-10">
            {/* ── Header ── */}
            <div className="flex items-start justify-between">
                <div className="flex flex-col gap-y-1">
                    <Link
                        href="/resume"
                        className="mb-1 w-fit text-13 text-sub transition-colors hover:text-text"
                    >
                        ← Назад
                    </Link>
                    <h1 className="text-28 font-700 text-text">
                        Анализ резюме
                    </h1>
                    <p className="text-13 text-sub/60">
                        {resume.desired_position ?? resume.title}
                        {' · '}
                        Обновлено {daysAgo(resume.updated_at)}
                    </p>
                </div>
                <Link
                    href={`/resume/builder/${resume.resume_id}`}
                    className="rounded-8 bg-surface/40 px-4 py-2 text-13 font-500 text-sub transition-colors hover:bg-surface hover:text-text"
                >
                    Редактировать
                </Link>
            </div>

            {/* ── Two-column grid ── */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

                {/* ── Left column ── */}
                <div className="flex flex-col gap-y-5">

                    {/* Card: Общая оценка */}
                    <div className="flex flex-col gap-y-5 rounded-12 border border-surface-secondary bg-mantle p-5">
                        <p className="text-14 font-600 text-text">
                            Общая оценка
                        </p>

                        {/* Ring + level side by side */}
                        <div className="flex items-center gap-x-5">
                            <ScoreRing score={scoreTotal} />
                            <div className="flex flex-col gap-y-0.5">
                                <span className="text-24 font-700 text-text">
                                    {getScoreLevel(scoreTotal)}
                                </span>
                                <span className="text-13 text-sub">
                                    {getScoreSub(scoreTotal)}
                                </span>
                            </div>
                        </div>

                        {/* Divider */}
                        <div className="h-px w-full bg-surface/30" />

                        {/* Progress bars */}
                        <div className="flex flex-col gap-y-3">
                            {BARS.map((bar) => (
                                <ProgressBar key={bar.label} {...bar} />
                            ))}
                        </div>
                    </div>

                    {/* Card: Распознанные секции */}
                    <div className="flex flex-col gap-y-1 rounded-12 border border-surface-secondary bg-mantle p-5">
                        <p className="mb-3 text-14 font-600 text-text">
                            Распознанные секции
                        </p>
                        {statuses.map(({ type, label, content }) => {
                            const badge = getSectionBadge(type, content);
                            return (
                                <div
                                    key={type}
                                    className="flex items-center justify-between rounded-8 px-2 py-2.5 transition-colors hover:bg-surface/20"
                                >
                                    <span className="text-13 text-sub">
                                        {label}
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

                    {/* Card: Рекомендации + Трендовые навыки */}
                    <div className="flex flex-col gap-y-5 rounded-12 border border-surface-secondary bg-mantle p-5">
                        <p className="text-14 font-600 text-text">
                            Рекомендации
                        </p>

                        {/* Recommendations list */}
                        <div className="flex flex-col gap-y-3">
                            {recommendations.map((rec, i) => (
                                <div
                                    // eslint-disable-next-line react/no-array-index-key
                                    key={i}
                                    className="flex items-start gap-x-3"
                                >
                                    <span
                                        className={cn(
                                            'mt-[5px] h-2 w-2 shrink-0 rounded-full',
                                            rec.priority === 'critical' &&
                                                'bg-red',
                                            rec.priority === 'improve' &&
                                                'bg-amber',
                                            rec.priority === 'ok' && 'bg-teal'
                                        )}
                                    />
                                    <p className="text-13 leading-[1.55] text-sub">
                                        {rec.text}
                                    </p>
                                </div>
                            ))}
                        </div>

                        {/* Divider + Trending skills */}
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
                                                {trending.vacanciesAnalyzed}{' '}
                                                вакансий
                                            </span>
                                        )}
                                    </div>
                                    <TrendingSkillsPanel
                                        skills={trending.skills}
                                        resumeId={resume.resume_id}
                                        currentHardSkills={
                                            skillsContent?.hard ?? []
                                        }
                                        currentSoftSkills={
                                            skillsContent?.soft ?? []
                                        }
                                    />
                                </div>
                            </>
                        )}

                        {!resume.desired_position &&
                            trending.skills.length === 0 && (
                                <div className="flex flex-col gap-y-2 border-t border-surface/20 pt-4">
                                    <p className="text-13 text-sub/60">
                                        Трендовые навыки для вашей роли
                                    </p>
                                    <p className="text-12 text-sub/40">
                                        Укажите желаемую должность, чтобы
                                        увидеть навыки в тренде
                                    </p>
                                </div>
                            )}
                    </div>
                </div>
            </div>
        </main>
    );
};

export default ResumeAnalysisPage;
