import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { ResumeSectionType } from '@prisma/client';
import { generateAboutMe, generateExperienceDescription } from '~/shared/lib/resumeTextGenerator';
import { createTRPCRouter, protectedProcedure } from '../trpc';

const GENERATION_LIMIT = 3;

export const aiRouter = createTRPCRouter({
  generateSectionText: protectedProcedure
    .input(
      z.object({
        resumeId: z.string(),
        sectionType: z.enum(['ABOUT', 'EXPERIENCE']),
        context: z.object({
          desired_position: z.string().optional(),
          experience_items: z.array(z.any()).optional(),
          hard_skills: z.array(z.string()).optional(),
          position: z.string().optional(),
          company: z.string().optional(),
          period: z.string().optional(),
          current_text: z.string().optional(),
        }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const sectionType = input.sectionType as ResumeSectionType;

      const count = await ctx.prisma.aiGenerationLog.count({
        where: {
          resume_id: input.resumeId,
          section_type: sectionType,
          user_id: userId,
        },
      });

      if (count >= GENERATION_LIMIT) {
        throw new TRPCError({
          code: 'TOO_MANY_REQUESTS',
          message: 'Лимит запросов исчерпан',
        });
      }

      let variants: string[];

      if (input.sectionType === 'ABOUT') {
        const {
          desired_position: desiredPosition,
          experience_items: experienceItems,
          hard_skills: hardSkills,
        } = input.context;
        if (!desiredPosition) {
          throw new TRPCError({ code: 'BAD_REQUEST', message: 'desired_position is required' });
        }
        variants = await generateAboutMe({
          desired_position: desiredPosition,
          experience_items: experienceItems ?? [],
          hard_skills: hardSkills ?? [],
          current_text: input.context.current_text,
        });
      } else {
        const { position, company, period } = input.context;
        if (!position || !company || !period) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'position, company, and period are required',
          });
        }
        variants = await generateExperienceDescription({
          position,
          company,
          period,
          current_text: input.context.current_text,
        });
      }

      await ctx.prisma.aiGenerationLog.create({
        data: {
          resume_id: input.resumeId,
          user_id: userId,
          section_type: sectionType,
          tokens_used: 0,
        },
      });

      return { variants };
    }),

  getRequestsLeft: protectedProcedure
    .input(
      z.object({
        resumeId: z.string(),
        sectionType: z.enum(['ABOUT', 'EXPERIENCE']),
      }),
    )
    .query(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const used = await ctx.prisma.aiGenerationLog.count({
        where: {
          resume_id: input.resumeId,
          section_type: input.sectionType as ResumeSectionType,
          user_id: userId,
        },
      });
      return { used, limit: GENERATION_LIMIT, left: Math.max(0, GENERATION_LIMIT - used) };
    }),
});
