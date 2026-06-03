import { z } from 'zod';
import { Prisma, ResumeStatus } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import {
    inputCreateResumeSchema,
    inputGetResumeItemSchema,
    inputUpdateSectionSchema,
    inputPublishResumeSchema,
    inputArchiveResumeSchema,
    inputGetAnalysisSchema,
    inputExportPdfSchema,
    inputImportFromPdfSchema,
    inputGetTrendingSkillsSchema,
} from '~/shared/api/schema/resume';
import { analyzeResume } from '~/shared/lib/resumeAnalyzer';
import { parsePdfToSections } from '~/shared/lib/resumeParser';
import { createTRPCRouter, clientProcedure, publicProcedure } from '../trpc';

const ACTIVE_RESUME_LIMIT = 2;

const RESUME_INCLUDE = {
    sections: true,
    analysis: true,
} as const;

export const resumeRouter = createTRPCRouter({
    getList: clientProcedure.query(async ({ ctx }) => {
        const userId = ctx.session.user.id;

        const clientProfile = await ctx.prisma.clientProfile.findUnique({
            where: { user_id: userId },
        });

        if (!clientProfile) {
            throw new TRPCError({
                code: 'NOT_FOUND',
                message: 'Client profile not found',
            });
        }

        return ctx.prisma.resume.findMany({
            where: {
                client_profile_id: clientProfile.client_profile_id,
                status: { not: ResumeStatus.ARCHIVED },
            },
            include: RESUME_INCLUDE,
            orderBy: { updated_at: 'desc' },
        });
    }),

    getItem: clientProcedure
        .input(inputGetResumeItemSchema)
        .query(async ({ ctx, input }) => {
            const userId = ctx.session.user.id;

            const clientProfile = await ctx.prisma.clientProfile.findUnique({
                where: { user_id: userId },
            });

            if (!clientProfile) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: 'Client profile not found',
                });
            }

            const resume = await ctx.prisma.resume.findUnique({
                where: { resume_id: input.resume_id },
                include: RESUME_INCLUDE,
            });

            if (!resume) return null;

            if (resume.client_profile_id !== clientProfile.client_profile_id) {
                throw new TRPCError({ code: 'FORBIDDEN' });
            }

            return resume;
        }),

    create: clientProcedure
        .input(inputCreateResumeSchema)
        .mutation(async ({ ctx, input }) => {
            const userId = ctx.session.user.id;

            const clientProfile = await ctx.prisma.clientProfile.findUnique({
                where: { user_id: userId },
            });

            if (!clientProfile) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: 'Client profile not found',
                });
            }

            const activeCount = await ctx.prisma.resume.count({
                where: {
                    client_profile_id: clientProfile.client_profile_id,
                    status: { not: ResumeStatus.ARCHIVED },
                },
            });

            if (activeCount >= ACTIVE_RESUME_LIMIT) {
                throw new TRPCError({
                    code: 'FORBIDDEN',
                    message: `Resume limit reached (max ${ACTIVE_RESUME_LIMIT} active resumes)`,
                });
            }

            return ctx.prisma.resume.create({
                data: {
                    client_profile_id: clientProfile.client_profile_id,
                    title: input.title,
                    desired_position: input.desired_position,
                },
                include: RESUME_INCLUDE,
            });
        }),

    updateSection: clientProcedure
        .input(inputUpdateSectionSchema)
        .mutation(async ({ ctx, input }) => {
            const userId = ctx.session.user.id;

            const clientProfile = await ctx.prisma.clientProfile.findUnique({
                where: { user_id: userId },
            });

            if (!clientProfile) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: 'Client profile not found',
                });
            }

            const resume = await ctx.prisma.resume.findUnique({
                where: { resume_id: input.resume_id },
            });

            if (!resume) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: 'Resume not found',
                });
            }

            if (resume.client_profile_id !== clientProfile.client_profile_id) {
                throw new TRPCError({ code: 'FORBIDDEN' });
            }

            const section = await ctx.prisma.resumeSection.upsert({
                where: {
                    resume_id_type: {
                        resume_id: input.resume_id,
                        type: input.type,
                    },
                },
                create: {
                    resume_id: input.resume_id,
                    type: input.type,
                    content: input.content as Prisma.InputJsonValue,
                    is_visible: input.is_visible ?? true,
                    order_index: input.order_index ?? 0,
                },
                update: {
                    content: input.content as Prisma.InputJsonValue,
                    ...(input.is_visible !== undefined && {
                        is_visible: input.is_visible,
                    }),
                    ...(input.order_index !== undefined && {
                        order_index: input.order_index,
                    }),
                },
            });

            // Keep resume.desired_position and title in sync with BASIC section
            if (input.type === 'BASIC') {
                const basic = input.content as { desired_position?: string; name?: string; surname?: string };
                const desiredPosition = basic.desired_position?.trim() ?? null;
                const nameParts = [basic.name, basic.surname].filter(Boolean);
                const title = desiredPosition || (nameParts.length > 0 ? nameParts.join(' ') : null);
                await ctx.prisma.resume.update({
                    where: { resume_id: input.resume_id },
                    data: {
                        ...(desiredPosition !== null && { desired_position: desiredPosition }),
                        ...(title && { title }),
                    },
                });
            }

            return section;
        }),

    publish: clientProcedure
        .input(inputPublishResumeSchema)
        .mutation(async ({ ctx, input }) => {
            const userId = ctx.session.user.id;

            const clientProfile = await ctx.prisma.clientProfile.findUnique({
                where: { user_id: userId },
            });

            if (!clientProfile) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: 'Client profile not found',
                });
            }

            const resume = await ctx.prisma.resume.findUnique({
                where: { resume_id: input.resume_id },
            });

            if (!resume) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: 'Resume not found',
                });
            }

            if (resume.client_profile_id !== clientProfile.client_profile_id) {
                throw new TRPCError({ code: 'FORBIDDEN' });
            }

            const published = await ctx.prisma.resume.update({
                where: { resume_id: input.resume_id },
                data: { status: ResumeStatus.PUBLISHED },
                include: RESUME_INCLUDE,
            });

            const sections = await ctx.prisma.resumeSection.findMany({
                where: { resume_id: input.resume_id },
            });

            try {
                const analysis = await analyzeResume(
                    ctx.prisma,
                    sections,
                    resume.desired_position ?? '',
                );
                await ctx.prisma.resumeAnalysis.upsert({
                    where: { resume_id: input.resume_id },
                    create: {
                        resume_id: input.resume_id,
                        score_total: analysis.score_total,
                        score_completeness: analysis.score_completeness,
                        score_structure: analysis.score_structure,
                        score_keywords: analysis.score_keywords,
                        score_skills: analysis.score_skills,
                        recommendations: analysis.recommendations,
                        trending_skills: analysis.trending_skills,
                    },
                    update: {
                        score_total: analysis.score_total,
                        score_completeness: analysis.score_completeness,
                        score_structure: analysis.score_structure,
                        score_keywords: analysis.score_keywords,
                        score_skills: analysis.score_skills,
                        recommendations: analysis.recommendations,
                        trending_skills: analysis.trending_skills,
                        analyzed_at: new Date(),
                    },
                });
            } catch (err) {
                console.error('[publish] analyzeResume failed:', err);
            }

            return published;
        }),

    archive: clientProcedure
        .input(inputArchiveResumeSchema)
        .mutation(async ({ ctx, input }) => {
            const userId = ctx.session.user.id;

            const clientProfile = await ctx.prisma.clientProfile.findUnique({
                where: { user_id: userId },
            });

            if (!clientProfile) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: 'Client profile not found',
                });
            }

            const resume = await ctx.prisma.resume.findUnique({
                where: { resume_id: input.resume_id },
            });

            if (!resume) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: 'Resume not found',
                });
            }

            if (resume.client_profile_id !== clientProfile.client_profile_id) {
                throw new TRPCError({ code: 'FORBIDDEN' });
            }

            return ctx.prisma.resume.update({
                where: { resume_id: input.resume_id },
                data: { status: ResumeStatus.ARCHIVED },
                include: RESUME_INCLUDE,
            });
        }),

    getAnalysis: clientProcedure
        .input(inputGetAnalysisSchema)
        .query(async ({ ctx, input }) => {
            const userId = ctx.session.user.id;

            const clientProfile = await ctx.prisma.clientProfile.findUnique({
                where: { user_id: userId },
            });

            if (!clientProfile) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: 'Client profile not found',
                });
            }

            const resume = await ctx.prisma.resume.findUnique({
                where: { resume_id: input.resume_id },
            });

            if (!resume) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: 'Resume not found',
                });
            }

            if (resume.client_profile_id !== clientProfile.client_profile_id) {
                throw new TRPCError({ code: 'FORBIDDEN' });
            }

            return ctx.prisma.resumeAnalysis.findUnique({
                where: { resume_id: input.resume_id },
            });
        }),

    exportPdf: clientProcedure
        .input(inputExportPdfSchema)
        .mutation(async () =>
            // PDF export is handled client-side via browser print API
            ({ ok: true })
        ),

    getTrendingSkills: clientProcedure
        .input(inputGetTrendingSkillsSchema)
        .query(async ({ ctx, input }) => {
            const userId = ctx.session.user.id;

            const clientProfile = await ctx.prisma.clientProfile.findUnique({
                where: { user_id: userId },
            });

            if (!clientProfile) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: 'Client profile not found',
                });
            }

            const resume = await ctx.prisma.resume.findUnique({
                where: { resume_id: input.resume_id },
                include: { sections: true },
            });

            if (!resume) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: 'Resume not found',
                });
            }

            if (resume.client_profile_id !== clientProfile.client_profile_id) {
                throw new TRPCError({ code: 'FORBIDDEN' });
            }

            // Extract user's current skills
            const skillsSection = resume.sections.find(
                (s) => s.type === 'SKILLS'
            );
            const userSkills: string[] = [];
            if (skillsSection) {
                const c = skillsSection.content as {
                    hard?: string[];
                    soft?: string[];
                };
                userSkills.push(...(c.hard ?? []), ...(c.soft ?? []));
            }
            const userSkillsLower = new Set(
                userSkills.map((s) => s.toLowerCase())
            );

            if (!resume.desired_position?.trim()) {
                return { skills: [], vacanciesAnalyzed: 0 };
            }

            const searchWord = resume.desired_position.trim().split(/\s+/)[0]!;

            const vacancies = await ctx.prisma.vacancy.findMany({
                where: {
                    title: { contains: searchWord, mode: 'insensitive' },
                },
                select: { description: true },
                orderBy: { published_at: 'desc' },
                take: 100,
            });

            const SKILL_LIST = [
                'React', 'Vue', 'Angular', 'TypeScript', 'JavaScript',
                'Python', 'Java', 'Node.js', 'Next.js', 'Docker',
                'Kubernetes', 'AWS', 'Git', 'SQL', 'PostgreSQL', 'MongoDB',
                'Redis', 'GraphQL', 'REST API', 'CSS', 'HTML', 'Tailwind',
                'Sass', 'Webpack', 'Vite', 'Jest', 'Playwright', 'CI/CD',
                'Linux', 'Figma', 'Agile', 'Scrum', 'PHP', 'Laravel',
                'Django', 'FastAPI', 'Spring Boot', 'Kotlin', 'Swift',
                'Flutter', 'React Native', 'C#', '.NET', 'Go', 'Rust',
                'C++', 'Ruby on Rails', 'Elasticsearch', 'Kafka',
            ];

            const skillCounts = new Map<string, number>();
            vacancies.forEach((vacancy) => {
                const descLower = vacancy.description.toLowerCase();
                SKILL_LIST.forEach((skill) => {
                    if (descLower.includes(skill.toLowerCase())) {
                        skillCounts.set(
                            skill,
                            (skillCounts.get(skill) ?? 0) + 1
                        );
                    }
                });
            });

            const skills = [...skillCounts.entries()]
                .sort((a, b) => b[1] - a[1])
                .slice(0, 10)
                .map(([name, count]) => ({
                    name,
                    count,
                    inResume: userSkillsLower.has(name.toLowerCase()),
                }));

            return { skills, vacanciesAnalyzed: vacancies.length };
        }),

    importFromPdf: clientProcedure
        .input(inputImportFromPdfSchema)
        .mutation(async ({ ctx, input }) => {
            const userId = ctx.session.user.id;

            const clientProfile = await ctx.prisma.clientProfile.findUnique({
                where: { user_id: userId },
            });

            if (!clientProfile) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: 'Client profile not found',
                });
            }

            const activeCount = await ctx.prisma.resume.count({
                where: {
                    client_profile_id: clientProfile.client_profile_id,
                    status: { not: ResumeStatus.ARCHIVED },
                },
            });

            if (activeCount >= ACTIVE_RESUME_LIMIT) {
                throw new TRPCError({
                    code: 'FORBIDDEN',
                    message: `Resume limit reached (max ${ACTIVE_RESUME_LIMIT} active resumes)`,
                });
            }

            const buffer = Buffer.from(input.fileBase64, 'base64');

            let sections: Partial<Record<string, object>> = {};
            let warning: string | undefined;

            try {
                sections = await parsePdfToSections(buffer);
            } catch (err) {
                const message = err instanceof Error ? err.message : String(err);
                console.error('[importFromPdf] parsePdfToSections failed:', message, err);
                if (message === 'PDF_EMPTY') {
                    warning = 'PDF_EMPTY';
                } else if (message === 'AI_INVALID_JSON') {
                    throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'AI вернул некорректный JSON' });
                } else {
                    throw new TRPCError({ code: 'BAD_REQUEST', message: `Ошибка парсинга PDF: ${message}` });
                }
            }

            const basicSection = sections.BASIC as
                | { name?: string; surname?: string; desired_position?: string }
                | undefined;
            const title = [basicSection?.name, basicSection?.surname].filter(Boolean).join(' ') || 'Импорт из PDF';
            const desiredPosition = basicSection?.desired_position ?? null;

            const resume = await ctx.prisma.resume.create({
                data: { client_profile_id: clientProfile.client_profile_id, title, desired_position: desiredPosition },
            });

            if (!warning && Object.keys(sections).length > 0) {
                await ctx.prisma.resumeSection.createMany({
                    data: Object.entries(sections).map(([type, content], index) => ({
                        resume_id: resume.resume_id,
                        type: type as import('@prisma/client').ResumeSectionType,
                        content: content as Prisma.InputJsonValue,
                        order_index: index,
                    })),
                    skipDuplicates: true,
                });
            }

            return { resume_id: resume.resume_id, ...(warning ? { warning } : {}) };
        }),

    searchPositions: publicProcedure
        .input(z.object({ query: z.string().min(1), limit: z.number().default(8) }))
        .query(({ ctx, input }) =>
            ctx.prisma.vacancy.findMany({
                where: { title: { contains: input.query, mode: 'insensitive' } },
                select: { title: true },
                distinct: ['title'],
                take: input.limit,
                orderBy: { vacancy_id: 'desc' },
            })
        ),

    countByPosition: publicProcedure
        .input(z.object({ position: z.string().min(1) }))
        .query(({ ctx, input }) =>
            ctx.prisma.vacancy.count({
                where: { title: { contains: input.position, mode: 'insensitive' } },
            })
        ),
});
