import { createTRPCRouter } from '~/server/api/trpc';
import { testRouter } from './routers/test';

export const appRouter = createTRPCRouter({ 
    test: testRouter,
});

export type AppRouter = typeof appRouter;