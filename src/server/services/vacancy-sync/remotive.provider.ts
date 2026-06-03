import axios, { type AxiosInstance } from 'axios';
import type {
    VacancyProvider,
    ProviderSearchResult,
    ProviderSearchParams,
    NormalizedVacancy,
} from './contracts';

const REMOTIVE_API_BASE = 'https://remotive.com/api';

const JOB_TYPE_MAP: Record<string, string> = {
    full_time: 'Полная занятость',
    part_time: 'Частичная занятость',
    contract: 'Проектная работа',
    freelance: 'Проектная работа',
    internship: 'Стажировка',
    other: 'Другое',
};

interface RemotiveJob {
    id: number;
    url: string;
    title: string;
    company_name: string;
    company_logo?: string | null;
    category?: string | null;
    job_type?: string | null;
    publication_date?: string | null;
    candidate_required_location?: string | null;
    salary?: string | null;
    description?: string | null;
    tags?: string[];
}

interface RemotiveResponse {
    'job-count': number;
    jobs: RemotiveJob[];
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

function mapRemotiveJob(job: RemotiveJob): NormalizedVacancy {
    const tags: Record<string, string[]> = {};

    const jobType = job.job_type?.toLowerCase().replace('-', '_');
    const empLabel = jobType ? JOB_TYPE_MAP[jobType] : undefined;
    if (empLabel) tags.employmentTypes = [empLabel];

    tags.workSchedule = ['Удалённая работа'];

    if (job.tags && job.tags.length > 0) {
        tags.skills = job.tags.slice(0, 10);
    }

    return {
        externalId: String(job.id),
        title: job.title,
        description: job.description ? stripHtml(job.description) : '',
        companyName: job.company_name,
        companyLogoUrl: job.company_logo ?? null,
        salaryFrom: null,
        salaryTo: null,
        currencyCode: null,
        sourceUrl: job.url,
        publishedAt: job.publication_date ? new Date(job.publication_date) : null,
        tags: Object.keys(tags).length > 0 ? tags : null,
        areaName: job.candidate_required_location ?? 'Worldwide',
        areaId: null,
    };
}

export class RemotiveProvider implements VacancyProvider {
    readonly source = 'remotive';

    private client: AxiosInstance;

    constructor() {
        this.client = axios.create({
            baseURL: REMOTIVE_API_BASE,
            timeout: 15_000,
        });
    }

    async search(params: ProviderSearchParams): Promise<ProviderSearchResult> {
        const limit = Math.min(params.perPage ?? 100, 100);

        const queryParams: Record<string, unknown> = { limit };

        if (params.text) queryParams.search = params.text;
        if (params.area) queryParams.category = params.area;

        const response = await this.client.get<RemotiveResponse>(
            '/remote-jobs',
            { params: queryParams },
        );

        const jobs = response.data?.jobs ?? [];

        return {
            items: jobs.map(mapRemotiveJob),
            found: response.data['job-count'] ?? jobs.length,
            pages: 1,
            page: 0,
            perPage: limit,
        };
    }
}

export const REMOTIVE_CATEGORIES: [string, string][] = [
    ['', 'Все категории'],
    ['software-dev', 'Software Development'],
    ['devops-sysadmin', 'DevOps / SysAdmin'],
    ['design', 'Design'],
    ['product', 'Product'],
    ['data', 'Data Science / AI'],
    ['qa', 'QA'],
    ['backend', 'Backend'],
    ['frontend', 'Frontend'],
    ['fullstack', 'Fullstack'],
    ['mobile', 'Mobile'],
    ['marketing', 'Marketing'],
    ['customer-support', 'Customer Support'],
    ['hr', 'HR'],
    ['finance-legal', 'Finance / Legal'],
];
