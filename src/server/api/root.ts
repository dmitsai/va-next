import { createTRPCRouter } from '~/server/api/trpc';
import { vacancyRouter } from './routers/vacancy';
import { currencyRouter } from './routers/currency';
import { vacancySyncRouter } from './routers/vacancySync';

export const appRouter = createTRPCRouter({
    vacancy: vacancyRouter,
    currency: currencyRouter,
    vacancySync: vacancySyncRouter,
});

export type AppRouter = typeof appRouter;
