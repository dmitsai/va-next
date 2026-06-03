import { type NextRequest, NextResponse } from 'next/server';
import { prisma } from '~/server/db/db';
import {
    TrudvsemProvider,
    JobicyProvider,
    RemotiveProvider,
    VacancySyncService,
} from '~/server/services/vacancy-sync';

export async function GET(req: NextRequest) {
    const authHeader = req.headers.get('authorization');

    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const trudvsemService = new VacancySyncService(prisma, new TrudvsemProvider());
        const jobicyService = new VacancySyncService(prisma, new JobicyProvider());
        const remotiveService = new VacancySyncService(prisma, new RemotiveProvider());

        const trudvsemQueries = ['программист', 'разработчик'];
        const jobicyTags = ['developer', 'engineer', 'designer'];
        const remotiveCategories = ['software-dev', 'devops-sysadmin', 'data'];

        const formatResults = (
            results: PromiseSettledResult<
                Awaited<ReturnType<VacancySyncService['sync']>>
            >[],
            queries: string[]
        ) =>
            results.map((r, i) => ({
                query: queries[i],
                status: r.status,
                ...(r.status === 'fulfilled'
                    ? {
                          importRunId: r.value.importRunId,
                          found: r.value.totalFound,
                          created: r.value.totalCreated,
                          updated: r.value.totalUpdated,
                      }
                    : {
                          error:
                              r.reason instanceof Error
                                  ? r.reason.message
                                  : String(r.reason),
                      }),
            }));

        const [trudvsemResults, jobicyResults, remotiveResults] = await Promise.all([
            Promise.allSettled(
                trudvsemQueries.map((text) =>
                    trudvsemService.sync({ text, maxPages: 2, triggeredBy: 'cron' })
                )
            ),
            Promise.allSettled(
                jobicyTags.map((text) =>
                    jobicyService.sync({ text, perPage: 50, maxPages: 1, triggeredBy: 'cron' })
                )
            ),
            Promise.allSettled(
                remotiveCategories.map((category) =>
                    remotiveService.sync({ area: category, perPage: 100, maxPages: 1, triggeredBy: 'cron' })
                )
            ),
        ]);

        return NextResponse.json({
            ok: true,
            summary: {
                trudvsem: formatResults(trudvsemResults, trudvsemQueries),
                jobicy: formatResults(jobicyResults, jobicyTags),
                remotive: formatResults(remotiveResults, remotiveCategories),
            },
        });
    } catch (error) {
        console.error('[cron/sync-vacancies]', error);
        return NextResponse.json(
            {
                ok: false,
                error: error instanceof Error ? error.message : String(error),
            },
            { status: 500 }
        );
    }
}
