import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';

export const skillRouter = createTRPCRouter({
  search: publicProcedure
    .input(z.object({ query: z.string().min(1), limit: z.number().default(8) }))
    .query(({ ctx, input }) =>
      ctx.prisma.skill.findMany({
        where: { name: { contains: input.query, mode: 'insensitive' } },
        orderBy: { mentions: 'desc' },
        take: input.limit,
      })
    ),

  getPopular: publicProcedure
    .input(z.object({ category: z.string().optional(), limit: z.number().default(10) }))
    .query(({ ctx, input }) =>
      ctx.prisma.skill.findMany({
        where: input.category ? { category: input.category } : undefined,
        orderBy: { mentions: 'desc' },
        take: input.limit,
      })
    ),
});
