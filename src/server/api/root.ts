import { createTRPCRouter } from '~/server/api/trpc';
import { adminRouter } from './routers/admin';
import { vacancyRouter } from './routers/vacancy';
import { clientProfileRouter } from './routers/clientProfile';
import { companyProfileRouter } from './routers/companyProfile';
import { currencyRouter } from './routers/currency';
import { applicationRouter } from './routers/application';
import { profileFilesRouter } from './routers/profileFiles';
import { vacancySyncRouter } from './routers/vacancySync';
import { resumeRouter } from './routers/resume';
import { skillRouter } from './routers/skill';
import { aiRouter } from './routers/ai';
import { positionsRouter } from './routers/positions';

export const appRouter = createTRPCRouter({
    admin: adminRouter,
    vacancy: vacancyRouter,
    clientProfile: clientProfileRouter,
    companyProfile: companyProfileRouter,
    currency: currencyRouter,
    application: applicationRouter,
    files: profileFilesRouter,
    vacancySync: vacancySyncRouter,
    resume: resumeRouter,
    skill: skillRouter,
    ai: aiRouter,
    positions: positionsRouter,
});

export type AppRouter = typeof appRouter;
