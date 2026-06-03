import axios, { type AxiosInstance } from 'axios';
import type {
    VacancyProvider,
    ProviderSearchResult,
    ProviderSearchParams,
    NormalizedVacancy,
} from './contracts';

/**
 * Jobicy Remote Jobs API — полностью открытое, без ключа.
 * Docs: https://jobicy.com/remote-jobs-rss-api
 * Endpoint: GET https://jobicy.com/api/v2/remote-jobs
 *
 * Особенности:
 *  - Максимум 50 вакансий за запрос (параметр count)
 *  - Нет классической пагинации страниц → один "пакет" на sync
 *  - Фильтр по тегу (tag=) и гео (geo=)
 *  - Возвращает зарплату annualSalaryMin / annualSalaryMax + salaryCurrency
 */

const JOBICY_API_BASE = 'https://jobicy.com/api/v2';

// jobType → наш стандарт
const JOB_TYPE_MAP: Record<string, string> = {
    'full-time': 'Полная занятость',
    'part-time': 'Частичная занятость',
    'contract': 'Проектная работа',
    'freelance': 'Проектная работа',
    'internship': 'Стажировка',
    'temporary': 'Временная работа',
};

// jobLevel → опыт
const JOB_LEVEL_MAP: Record<string, string> = {
    'entry-level': 'Нет опыта',
    'junior': 'Нет опыта',
    'mid-level': 'От 1 года до 3 лет',
    'mid': 'От 1 года до 3 лет',
    'senior': 'От 3 до 6 лет',
    'lead': 'Более 6 лет',
    'manager': 'Более 6 лет',
    'executive': 'Более 6 лет',
    'director': 'Более 6 лет',
};

interface JobicyJob {
    id: number;
    url: string;
    jobTitle: string;
    companyName: string;
    companyLogo?: string | null;
    jobIndustry?: string[];
    jobType?: string[];
    jobGeo?: string | null;
    jobLevel?: string | null;
    jobExcerpt?: string | null;
    jobDescription?: string | null;
    pubDate?: string | null;
    annualSalaryMin?: number | null;
    annualSalaryMax?: number | null;
    salaryCurrency?: string | null;
}

interface JobicyResponse {
    jobs: JobicyJob[];
}

function stripHtml(html: string): string {
    return html
        .replace(/<br\s*\/?>/gi, '\n')
        .replace(/<\/p>/gi, '\n')
        .replace(/<\/li>/gi, '\n')
        .replace(/<[^>]+>/g, '')
        .replace(/&nbsp;/gi, ' ')
        .replace(/&amp;/gi, '&')
        .replace(/&lt;/gi, '<')
        .replace(/&gt;/gi, '>')
        .replace(/&quot;/gi, '"')
        .replace(/\n{3,}/g, '\n\n')
        .trim();
}

function mapJobicyJob(job: JobicyJob): NormalizedVacancy {
    const tags: Record<string, string[]> = {};

    const jobTypes = (job.jobType ?? [])
        .map((t) => JOB_TYPE_MAP[t.toLowerCase()] ?? t)
        .filter(Boolean);
    if (jobTypes.length > 0) tags.employmentTypes = jobTypes;

    const level = job.jobLevel?.toLowerCase().trim();
    const expLabel = level ? JOB_LEVEL_MAP[level] : undefined;
    if (expLabel) tags.experience = [expLabel];

    const industries = job.jobIndustry ?? [];
    if (industries.length > 0) tags.industries = industries;

    const description = job.jobDescription
        ? stripHtml(job.jobDescription)
        : (job.jobExcerpt ?? '');

    return {
        externalId: String(job.id),
        title: job.jobTitle,
        description,
        companyName: job.companyName,
        companyLogoUrl: job.companyLogo ?? null,
        salaryFrom: job.annualSalaryMin ?? null,
        salaryTo: job.annualSalaryMax ?? null,
        currencyCode: job.salaryCurrency ?? null,
        sourceUrl: job.url,
        publishedAt: job.pubDate ? new Date(job.pubDate) : null,
        tags: Object.keys(tags).length > 0 ? tags : null,
        areaName: job.jobGeo ?? null,
        areaId: null,
    };
}

export class JobicyProvider implements VacancyProvider {
    readonly source = 'jobicy';

    private client: AxiosInstance;

    constructor() {
        this.client = axios.create({
            baseURL: JOBICY_API_BASE,
            timeout: 15_000,
        });
    }

    async search(params: ProviderSearchParams): Promise<ProviderSearchResult> {
        // Jobicy не имеет постраничной пагинации — только count (max 50)
        // Один запрос на страницу, но pages всегда 1
        const count = Math.min(params.perPage ?? 50, 50);

        const queryParams: Record<string, unknown> = { count };

        if (params.text) {
            queryParams.tag = params.text;
        }

        // area используется как geo-фильтр (например "usa", "uk", "anywhere")
        if (params.area) {
            queryParams.geo = params.area;
        }

        const response = await this.client.get<JobicyResponse>(
            '/remote-jobs',
            { params: queryParams },
        );

        const jobs = response.data?.jobs ?? [];

        return {
            items: jobs.map(mapJobicyJob),
            found: jobs.length,
            pages: 1,
            page: 0,
            perPage: count,
        };
    }
}

export const JOBICY_GEO: [string, string][] = [
    ['', 'Весь мир'],
    ['anywhere', 'Remote (any)'],
    ['usa', 'США'],
    ['uk', 'Великобритания'],
    ['canada', 'Канада'],
    ['germany', 'Германия'],
    ['australia', 'Австралия'],
    ['india', 'Индия'],
    ['netherlands', 'Нидерланды'],
    ['france', 'Франция'],
];
