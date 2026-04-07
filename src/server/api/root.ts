import { createTRPCRouter } from '~/server/api/trpc';
import { vacancyRouter } from './routers/vacancy';
import { clientProfileRouter } from './routers/clientProfile';
import { companyProfileRouter } from './routers/companyProfile';
import { currencyRouter } from './routers/currency';
import { applicationRouter } from './routers/application';
import { profileFilesRouter } from './routers/profileFiles';
import { vacancySyncRouter } from './routers/vacancySync';
import { resumeRouter } from './routers/resume';

export const appRouter = createTRPCRouter({
    vacancy: vacancyRouter,
    clientProfile: clientProfileRouter,
    companyProfile: companyProfileRouter,
    currency: currencyRouter,
    application: applicationRouter,
    files: profileFilesRouter,
    vacancySync: vacancySyncRouter,
    resume: resumeRouter,
});

export type AppRouter = typeof appRouter;
