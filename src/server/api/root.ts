import { createTRPCRouter } from '~/server/api/trpc';
import { vacancyRouter } from './routers/vacancy';
import { clientProfileRouter } from './routers/clientProfile';

export const appRouter = createTRPCRouter({
    vacancy: vacancyRouter,
    clientProfile: clientProfileRouter,
});

export type AppRouter = typeof appRouter;
