import type { PrismaClient } from '@prisma/client';
import type { VacancyProvider, ProviderSearchParams } from './contracts';

export interface SyncOptions extends ProviderSearchParams {
    maxPages?: number;
}

export interface SyncResult {
    importRunId: string;
    totalFound: number;
    totalCreated: number;
    totalUpdated: number;
}

const RATE_LIMIT_DELAY_MS = 300;

export class VacancySyncService {
    constructor(
        private prisma: PrismaClient,
        private provider: VacancyProvider,
    ) {}

    async sync(options: SyncOptions): Promise<SyncResult> {
        const maxPages = options.maxPages ?? 20;

        const platform = await this.prisma.platform.findUnique({
            where: { name: this.provider.source },
        });

        if (!platform) {
            throw new Error(
                `Platform "${this.provider.source}" not found. Run seed first.`,
            );
        }

        const importRun = await this.prisma.importRun.create({
            data: {
                source: this.provider.source,
                query: options.text ?? null,
            },
        });

        let totalFound = 0;
        let totalCreated = 0;
        let totalUpdated = 0;

        try {
            let currentPage = options.page ?? 0;

            while (currentPage < maxPages) {
                const result = await this.provider.search({
                    ...options,
                    page: currentPage,
                });

                totalFound += result.items.length;

                for (const item of result.items) {
                    const locationId = await this.resolveLocation(
                        item.areaName,
                        item.areaId,
                    );
                    const currencyId = await this.resolveCurrency(
                        item.currencyCode,
                    );

                    const data = {
                        title: item.title,
                        description: item.description,
                        companyName: item.companyName,
                        companyLogoUrl: item.companyLogoUrl,
                        salaryFrom: item.salaryFrom,
                        salaryTo: item.salaryTo,
                        currency_id: currencyId,
                        sourceUrl: item.sourceUrl,
                        tags: item.tags ?? undefined,
                        location_id: locationId,
                        published_at: item.publishedAt ?? new Date(),
                    };

                    const before =
                        await this.prisma.vacancy.findFirst({
                            where: {
                                platform_id: platform.platform_id,
                                externalId: item.externalId,
                            },
                            select: { vacancy_id: true },
                        });

                    await this.prisma.vacancy.upsert({
                        where: {
                            platform_id_externalId: {
                                platform_id: platform.platform_id,
                                externalId: item.externalId,
                            },
                        },
                        update: data,
                        create: {
                            ...data,
                            externalId: item.externalId,
                            platform_id: platform.platform_id,
                        },
                    });

                    if (before) {
                        totalUpdated++;
                    } else {
                        totalCreated++;
                    }
                }

                if (
                    currentPage >= result.pages - 1 ||
                    result.items.length === 0
                ) {
                    break;
                }

                currentPage++;
                await delay(RATE_LIMIT_DELAY_MS);
            }

            await this.prisma.importRun.update({
                where: { import_run_id: importRun.import_run_id },
                data: {
                    status: 'COMPLETED',
                    finishedAt: new Date(),
                    itemsFound: totalFound,
                    itemsCreated: totalCreated,
                    itemsUpdated: totalUpdated,
                },
            });

            return {
                importRunId: importRun.import_run_id,
                totalFound,
                totalCreated,
                totalUpdated,
            };
        } catch (error) {
            await this.prisma.importRun.update({
                where: { import_run_id: importRun.import_run_id },
                data: {
                    status: 'FAILED',
                    finishedAt: new Date(),
                    itemsFound: totalFound,
                    itemsCreated: totalCreated,
                    itemsUpdated: totalUpdated,
                    errorMessage:
                        error instanceof Error
                            ? error.message
                            : String(error),
                },
            });

            throw error;
        }
    }

    private async resolveLocation(
        areaName?: string | null,
        areaId?: string | null,
    ): Promise<string | null> {
        if (!areaName) return null;

        const source = this.provider.source;

        if (areaId) {
            const location = await this.prisma.location.upsert({
                where: {
                    source_externalId: { source, externalId: areaId },
                },
                update: { name: areaName },
                create: {
                    name: areaName,
                    externalId: areaId,
                    source,
                },
            });
            return location.location_id;
        }

        const existing = await this.prisma.location.findFirst({
            where: { name: areaName, source },
        });

        if (existing) return existing.location_id;

        const created = await this.prisma.location.create({
            data: { name: areaName, source },
        });
        return created.location_id;
    }

    private async resolveCurrency(
        currencyCode?: string | null,
    ): Promise<string | null> {
        if (!currencyCode) return null;

        const currency = await this.prisma.currency.findUnique({
            where: { code: currencyCode },
        });

        return currency?.currency_id ?? null;
    }
}

function delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
