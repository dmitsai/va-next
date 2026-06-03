import axios, { type AxiosInstance } from 'axios';
import { env } from '~/env';
import type {
    VacancyProvider,
    ProviderSearchResult,
    ProviderSearchParams,
    NormalizedVacancy,
    ProfessionalRole,
} from './contracts';

const HH_API_BASE = 'https://api.hh.ru';

const EXPERIENCE_MAP: Record<string, string> = {
    noExperience: 'Нет опыта',
    between1And3: 'От 1 года до 3 лет',
    between3And6: 'От 3 до 6 лет',
    moreThan6: 'Более 6 лет',
};

const EMPLOYMENT_MAP: Record<string, string> = {
    full: 'Полная занятость',
    part: 'Частичная занятость',
    project: 'Проектная работа',
    probation: 'Стажировка',
};

const SCHEDULE_MAP: Record<string, string> = {
    fullDay: 'Полный день',
    shift: 'Сменный график',
    flexible: 'Гибкий график',
    remote: 'Удалённая работа',
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
        currencyCode: hh.salary?.currency === 'RUR' ? 'RUB' : (hh.salary?.currency ?? null),
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
                'User-Agent': env.HH_USER_AGENT,
            },
            timeout: 15_000,
        });
    }

    async search(
        params: ProviderSearchParams,
    ): Promise<ProviderSearchResult> {
        const perPage = Math.min(params.perPage ?? 20, 20);
        const page = Math.min(params.page ?? 0, 19);

        const queryParams: Record<string, unknown> = {
            page,
            per_page: perPage,
            order_by: 'publication_time',
        };

        if (params.area) queryParams.area = params.area;
        if (params.experience) queryParams.experience = params.experience;
        if (params.employment) queryParams.employment = params.employment;
        if (params.schedule) queryParams.schedule = params.schedule;

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

        const { data } = response;

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
