import { createTRPCRouter } from '~/server/api/trpc';
import { vacancyRouter } from './routers/vacancy';
import { currencyRouter } from './routers/currency';

export const appRouter = createTRPCRouter({
    vacancy: vacancyRouter,
    currency: currencyRouter,
});

export type AppRouter = typeof appRouter;
