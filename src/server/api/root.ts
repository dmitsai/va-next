import { createTRPCRouter } from '~/server/api/trpc';
import { vacancyRouter } from './routers/vacancy';
import { clientProfileRouter } from './routers/clientProfile';
import { companyProfileRouter } from './routers/companyProfile';

export const appRouter = createTRPCRouter({
    vacancy: vacancyRouter,
    clientProfile: clientProfileRouter,
    companyProfile: companyProfileRouter
});

export type AppRouter = typeof appRouter;
