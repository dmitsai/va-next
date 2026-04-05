import axios, { type AxiosInstance } from 'axios';
import type {
    VacancyProvider,
    ProviderSearchResult,
    ProviderSearchParams,
    NormalizedVacancy,
    ProfessionalRole,
} from './contracts';

const HH_API_BASE = 'https://api.hh.ru';

const EXPERIENCE_MAP: Record<string, string> = {
    noExperience: 'noExperience',
    between1And3: 'FromOneToThreeYears',
    between3And6: 'FromThreeToSixYears',
    moreThan6: 'MoreSixYears',
};

const EMPLOYMENT_MAP: Record<string, string> = {
    full: 'full',
    part: 'partTime',
    project: 'project',
    probation: 'internship',
};

const SCHEDULE_MAP: Record<string, string> = {
    fullDay: 'fullday',
    shift: 'shift',
    flexible: 'flexible',
    remote: 'remote',
};

interface HHSalary {
    from?: number | null;
    to?: number | null;
    currency?: string;
    gross?: boolean;
}

interface HHEmployer {
    id?: string;
    name?: string;
    logo_urls?: {
        original?: string;
        '90'?: string;
        '240'?: string;
    } | null;
}

interface HHVacancy {
    id: string;
    name: string;
    salary?: HHSalary | null;
    employer?: HHEmployer;
    area?: { id: string; name: string };
    experience?: { id: string; name: string };
    employment?: { id: string; name: string };
    schedule?: { id: string; name: string };
    snippet?: {
        requirement?: string | null;
        responsibility?: string | null;
    };
    alternate_url?: string;
    published_at?: string;
    archived?: boolean;
    type?: { id: string; name: string };
}

interface HHSearchResponse {
    items: HHVacancy[];
    found: number;
    pages: number;
    page: number;
    per_page: number;
}

function stripHtmlTags(html: string): string {
    return html
        .replace(/<highlighttext>/gi, '')
        .replace(/<\/highlighttext>/gi, '')
        .replace(/<[^>]*>/g, '')
        .trim();
}

function mapHHVacancy(hh: HHVacancy): NormalizedVacancy {
    const exp = hh.experience?.id
        ? EXPERIENCE_MAP[hh.experience.id]
        : undefined;
    const emp = hh.employment?.id
        ? EMPLOYMENT_MAP[hh.employment.id]
        : undefined;
    const sched = hh.schedule?.id
        ? SCHEDULE_MAP[hh.schedule.id]
        : undefined;

    const tags: Record<string, string[]> = {};
    if (exp) tags.experience = [exp];
    if (emp) tags.employmentTypes = [emp];
    if (sched) tags.workSchedule = [sched];

    const parts: string[] = [];
    if (hh.snippet?.requirement)
        parts.push(stripHtmlTags(hh.snippet.requirement));
    if (hh.snippet?.responsibility)
        parts.push(stripHtmlTags(hh.snippet.responsibility));

    return {
        externalId: hh.id,
        title: hh.name,
        description: parts.join('\n') || '',
        companyName: hh.employer?.name ?? 'Неизвестный работодатель',
        companyLogoUrl:
            hh.employer?.logo_urls?.['240'] ??
            hh.employer?.logo_urls?.original ??
            null,
        salaryFrom: hh.salary?.from ?? null,
        salaryTo: hh.salary?.to ?? null,
        currencyCode: hh.salary?.currency ?? null,
        sourceUrl:
            hh.alternate_url ?? `https://hh.ru/vacancy/${hh.id}`,
        publishedAt: hh.published_at
            ? new Date(hh.published_at)
            : null,
        tags: Object.keys(tags).length > 0 ? tags : null,
        areaName: hh.area?.name ?? null,
        areaId: hh.area?.id ?? null,
    };
}

export class HHProvider implements VacancyProvider {
    readonly source = 'hh';
    private client: AxiosInstance;

    constructor() {
        this.client = axios.create({
            baseURL: HH_API_BASE,
            headers: {
                'User-Agent':
                    'VacancyAggregator/1.0 (vacancy-aggregator-web)',
            },
            timeout: 15_000,
        });
    }

    async search(
        params: ProviderSearchParams,
    ): Promise<ProviderSearchResult> {
        const queryParams: Record<string, unknown> = {
            area: params.area,
            experience: params.experience,
            employment: params.employment,
            schedule: params.schedule,
            page: params.page ?? 0,
            per_page: params.perPage ?? 100,
            order_by: 'publication_time',
        };

        if (params.text) {
            queryParams.text = params.text;
        }

        if (
            params.professionalRoles &&
            params.professionalRoles.length > 0
        ) {
            queryParams.professional_role =
                params.professionalRoles;
        }

        const response = await this.client.get<HHSearchResponse>(
            '/vacancies',
            {
                params: queryParams,
                paramsSerializer: {
                    indexes: null,
                },
            },
        );

        const data = response.data;

        return {
            items: data.items
                .filter((v) => !v.archived)
                .map(mapHHVacancy),
            found: data.found,
            pages: data.pages,
            page: data.page,
            perPage: data.per_page,
        };
    }

    async getProfessionalRoles(): Promise<ProfessionalRole[]> {
        interface HHRole {
            id: string;
            name: string;
        }
        interface HHRoleCategory {
            id: string;
            name: string;
            roles: HHRole[];
        }
        interface HHRolesResponse {
            categories: HHRoleCategory[];
        }

        const response = await this.client.get<HHRolesResponse>(
            '/professional_roles',
        );

        return response.data.categories.flatMap((category) =>
            category.roles.map((role) => ({
                id: role.id,
                name: `${role.name} (${category.name})`,
            })),
        );
    }
}
