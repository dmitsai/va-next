import axios, { type AxiosInstance } from 'axios';
import type {
    VacancyProvider,
    ProviderSearchResult,
    ProviderSearchParams,
    NormalizedVacancy,
} from './contracts';

const TRUDVSEM_API_BASE = 'https://opendata.trudvsem.ru/api/v1';

// Коды регионов Роструда → название
const REGION_NAMES: Record<string, string> = {
    '77': 'Москва',
    '78': 'Санкт-Петербург',
    '66': 'Свердловская область',
    '54': 'Новосибирская область',
    '16': 'Республика Татарстан',
    '23': 'Краснодарский край',
    '74': 'Челябинская область',
    '61': 'Ростовская область',
    '63': 'Самарская область',
    '52': 'Нижегородская область',
};

export interface TrudvsemSearchParams {
    text?: string;
    regionCode?: string;
    page?: number;
    perPage?: number;
}

interface TrudvsemRegion {
    region_code?: string;
    name?: string;
}

interface TrudvsemCompany {
    companycode?: string;
    name?: string;
    url?: string;
    hr_agency?: boolean;
    inn?: string;
}

interface TrudvsemRequirement {
    education?: string;
    experience?: string | number;
    qualification?: string;
}

interface TrudvsemAddress {
    location?: string;
    lng?: number;
    lat?: number;
}

interface TrudvsemVacancyItem {
    id: string;
    source?: string;
    region?: TrudvsemRegion;
    company?: TrudvsemCompany;
    requirement?: TrudvsemRequirement;
    salary?: string | number | null;
    salaryTo?: string | number | null;
    currency?: string | null;
    duty?: string | null;
    employment?: string | null;
    schedule?: string | null;
    name?: string | null;
    addresses?: { address?: TrudvsemAddress[] };
    create_date?: string;
    modify_date?: string;
    vac_url?: string;
}

interface TrudvsemResponse {
    status: string;
    meta: {
        total: number;
        limit: number;
        offset: number;
    };
    results: {
        vacancies: Array<{ vacancy: TrudvsemVacancyItem }>;
    };
}

function parseSalary(value: string | number | null | undefined): number | null {
    if (value == null) return null;
    if (typeof value === 'number') return Math.round(value);
    const match = /\d+/.exec(value.replace(/\s/g, ''));
    return match ? parseInt(match[0], 10) : null;
}

function parseExperience(
    value: string | number | null | undefined
): string | null {
    if (value == null) return null;
    const years = typeof value === 'number' ? value : parseFloat(value);
    if (Number.isNaN(years)) return null;
    if (years <= 0) return 'Нет опыта';
    if (years < 3) return 'От 1 года до 3 лет';
    if (years < 6) return 'От 3 до 6 лет';
    return 'Более 6 лет';
}

function resolveTitle(item: TrudvsemVacancyItem): string {
    if (item.name?.trim()) return item.name.trim();
    if (item.duty?.trim()) {
        const firstLine =
            item.duty
                .trim()
                .split(/[\n.!?]/)[0]
                ?.trim() ?? '';
        if (firstLine.length > 0) {
            return firstLine.length <= 80
                ? firstLine
                : `${firstLine.slice(0, 80)}…`;
        }
    }
    return 'Без названия';
}

// "Полный рабочий день" → "Полный день" и т.п.
const SCHEDULE_NORMALIZE: Record<string, string> = {
    'полный рабочий день': 'Полный день',
    'сменный график работы': 'Сменный график',
    'сменный график': 'Сменный график',
    'гибкий график': 'Гибкий график',
    'гибкий режим': 'Гибкий график',
    'удалённая работа': 'Удалённая работа',
    'удаленная работа': 'Удалённая работа',
    'дистанционная работа': 'Удалённая работа',
    'неполный рабочий день': 'Неполный день',
};

function normalizeSchedule(value: string | null | undefined): string | null {
    if (!value?.trim()) return null;
    return SCHEDULE_NORMALIZE[value.trim().toLowerCase()] ?? value.trim();
}

// "Высшее образование — бакалавриат" → "Высшее (бакалавриат)" и т.п.
function normalizeEducation(value: string | null | undefined): string | null {
    if (!value?.trim()) return null;
    const v = value.trim().toLowerCase();
    if (v.includes('среднее профессиональное') || v.includes('среднее специальное'))
        return 'Среднее профессиональное';
    if (v === 'среднее' || v === 'среднее общее')
        return 'Среднее';
    if (v.includes('неполное высшее') || v.includes('незаконченное высшее'))
        return 'Неоконченное высшее';
    if (v.includes('бакалавр')) return 'Высшее (бакалавриат)';
    if (v.includes('магистр')) return 'Высшее (магистратура)';
    if (v.includes('специалитет') || (v.includes('специалист') && v.includes('высш')))
        return 'Высшее (специалитет)';
    if (v.includes('высшее')) return 'Высшее';
    if (v.includes('аспирантура') || v.includes('учёная степень') || v.includes('ученая степень'))
        return 'Учёная степень';
    return value.trim();
}

// "«руб.»", "руб.", "RUB" → "RUR"
function normalizeCurrency(value: string | null | undefined): string {
    if (!value?.trim()) return 'RUR';
    const v = value.replace(/[«»]/g, '').trim().toLowerCase();
    if (v === 'руб.' || v === 'руб' || v === 'rub' || v === 'rur' || v === '₽') return 'RUB';
    if (v === 'usd' || v === '$' || v === 'долл.' || v === 'долл') return 'USD';
    if (v === 'eur' || v === '€') return 'EUR';
    return 'RUB';
}

function mapTrudvsemVacancy(item: TrudvsemVacancyItem): NormalizedVacancy {
    const tags: Record<string, string[]> = {};
    if (item.employment) tags.employmentTypes = [item.employment];
    const schedule = normalizeSchedule(item.schedule);
    if (schedule) tags.workSchedule = [schedule];
    const exp = parseExperience(item.requirement?.experience);
    if (exp) tags.experience = [exp];
    const edu = normalizeEducation(item.requirement?.education);
    if (edu) tags.education = [edu];

    const regionCode = item.region?.region_code ?? null;
    const regionName =
        item.region?.name ??
        (regionCode ? REGION_NAMES[regionCode] : null) ??
        null;

    const currencyCode = normalizeCurrency(item.currency);

    return {
        externalId: item.id,
        title: resolveTitle(item),
        description: item.duty ?? '',
        companyName: item.company?.name ?? 'Неизвестный работодатель',
        companyLogoUrl: null,
        salaryFrom: parseSalary(item.salary),
        salaryTo: parseSalary(item.salaryTo),
        currencyCode,
        sourceUrl:
            item.vac_url ?? `https://trudvsem.ru/vacancy/card/${item.id}`,
        publishedAt: item.create_date ? new Date(item.create_date) : null,
        tags: Object.keys(tags).length > 0 ? tags : null,
        areaName: regionName,
        areaId: regionCode,
    };
}

export class TrudvsemProvider implements VacancyProvider {
    readonly source = 'trudvsem';

    private client: AxiosInstance;

    constructor() {
        this.client = axios.create({
            baseURL: TRUDVSEM_API_BASE,
            timeout: 20_000,
        });
    }

    async search(params: ProviderSearchParams): Promise<ProviderSearchResult> {
        const limit = params.perPage ?? 100;
        const offset = (params.page ?? 0) * limit;

        const queryParams: Record<string, unknown> = {
            limit,
            offset,
        };

        if (params.text) {
            queryParams.text = params.text;
        }

        // area используется как код региона для Роструда
        if (params.area) {
            queryParams.region_code = params.area;
        }

        const response = await this.client.get<TrudvsemResponse>('/vacancies', {
            params: queryParams,
        });

        const { data } = response;
        const vacancies = data.results?.vacancies ?? [];

        const total = data.meta?.total ?? 0;
        const perPage = data.meta?.limit ?? limit;
        const currentOffset = data.meta?.offset ?? offset;
        const pages = perPage > 0 ? Math.ceil(total / perPage) : 0;
        const currentPage =
            perPage > 0 ? Math.floor(currentOffset / perPage) : 0;

        return {
            items: vacancies.map((v) => mapTrudvsemVacancy(v.vacancy)),
            found: total,
            pages,
            page: currentPage,
            perPage,
        };
    }
}

export const TRUDVSEM_REGIONS: [string, string][] = [
    ['', 'Все регионы'],
    ['77', 'Москва'],
    ['78', 'Санкт-Петербург'],
    ['66', 'Свердловская область'],
    ['54', 'Новосибирская область'],
    ['16', 'Республика Татарстан'],
    ['23', 'Краснодарский край'],
    ['74', 'Челябинская область'],
    ['61', 'Ростовская область'],
    ['63', 'Самарская область'],
    ['52', 'Нижегородская область'],
];
