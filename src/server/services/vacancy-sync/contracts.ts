export interface NormalizedVacancy {
    externalId: string;
    title: string;
    description: string;
    companyName: string;
    companyLogoUrl?: string | null;
    salaryFrom?: number | null;
    salaryTo?: number | null;
    currencyCode?: string | null;
    sourceUrl: string;
    publishedAt?: Date | null;
    tags?: Record<string, string[]> | null;
    areaName?: string | null;
    areaId?: string | null;
}

export interface ProviderSearchParams {
    text?: string;
    area?: string;
    experience?: string;
    employment?: string;
    schedule?: string;
    professionalRoles?: string[];
    page?: number;
    perPage?: number;
}

export interface ProfessionalRole {
    id: string;
    name: string;
}

export interface ProviderSearchResult {
    items: NormalizedVacancy[];
    found: number;
    pages: number;
    page: number;
    perPage: number;
}

export interface VacancyProvider {
    readonly source: string;
    search(params: ProviderSearchParams): Promise<ProviderSearchResult>;
}
