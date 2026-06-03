import { createRequire } from 'node:module';
import { ResumeSectionType } from '@prisma/client';
import { generateJSON } from './aiService';

const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse/lib/pdf-parse') as (
    _buffer: Buffer
) => Promise<{ text: string }>;

// ─── Types ────────────────────────────────────────────────────────────────────

interface ParsedResume {
    basic?: { name?: string; surname?: string; desired_position?: string };
    contacts?: { email?: string; phone?: string; city?: string; telegram?: string; linkedin?: string; github?: string };
    about?: { text?: string };
    experience?: { items?: { company: string; position: string; period_from: string; period_to?: string; is_current: boolean; description: string }[] };
    education?: { items?: { institution: string; degree: string; field: string; year_from: number; year_to?: number }[] };
    skills?: { hard?: string[]; soft?: string[] };
    portfolio?: { items?: { title: string; url: string; description?: string }[] };
}

const KEY_TO_SECTION: Record<keyof ParsedResume, ResumeSectionType> = {
    basic: 'BASIC',
    contacts: 'CONTACTS',
    about: 'ABOUT',
    experience: 'EXPERIENCE',
    education: 'EDUCATION',
    skills: 'SKILLS',
    portfolio: 'PORTFOLIO',
};

// ─── Date normalization helpers ───────────────────────────────────────────────

const RU_MONTHS: Record<string, string> = {
    'янв': '01', 'январь': '01', 'января': '01',
    'фев': '02', 'февраль': '02', 'февраля': '02',
    'мар': '03', 'март': '03', 'марта': '03',
    'апр': '04', 'апрель': '04', 'апреля': '04',
    'май': '05', 'мая': '05',
    'июн': '06', 'июнь': '06', 'июня': '06',
    'июл': '07', 'июль': '07', 'июля': '07',
    'авг': '08', 'август': '08', 'августа': '08',
    'сен': '09', 'сент': '09', 'сентябрь': '09', 'сентября': '09',
    'окт': '10', 'октябрь': '10', 'октября': '10',
    'ноя': '11', 'нояб': '11', 'ноябрь': '11', 'ноября': '11',
    'дек': '12', 'декабрь': '12', 'декабря': '12',
};

/** Normalize a raw date string to mm/yyyy format, or return '' */
function normalizePeriod(raw: string | undefined | null): string {
    if (!raw) return '';
    const s = raw.trim().toLowerCase();

    // Already mm/yyyy
    if (/^\d{2}\/\d{4}$/.test(s)) return s;

    // "месяц гггг" or "месяц гггг" — Russian month name + year
    const ruMatch = /^([а-яё]+)\.?\s+(\d{4})$/i.exec(s);
    if (ruMatch) {
        const month = RU_MONTHS[ruMatch[1]!.toLowerCase()];
        if (month) return `${month}/${ruMatch[2]}`;
    }

    // Only a year: "2020"
    if (/^\d{4}$/.test(s)) return `01/${s}`;

    // "2020-01" or "2020/01"
    const isoMatch = /^(\d{4})[-/](\d{2})$/.exec(s);
    if (isoMatch) return `${isoMatch[2]}/${isoMatch[1]}`;

    return '';
}

/** Detect if a string means "current job" */
function isCurrent(raw: string | undefined | null): boolean {
    if (!raw) return false;
    const s = raw.trim().toLowerCase();
    return /настоящ|по сей|present|current|н\.в\.|н\.вр\./.test(s);
}

// ─── Algorithmic contact extraction (regex — reliable) ────────────────────────

function extractContacts(text: string): ParsedResume['contacts'] {
    const emailRe = /[\w.+-]+@[\w-]+\.[a-z]{2,}/i;
    const emailMatch = emailRe.exec(text);
    const email = emailMatch?.[0];

    const phoneRe = /\+?[\d][\d\s().-]{7,}[\d]/;
    const phoneMatch = phoneRe.exec(text);
    const phone = phoneMatch?.[0]?.trim();

    const tgNamed = /(?:tg:|t\.me\/)([^\s,\n]+)/i.exec(text);
    const atNamed = /@([\w]{4,})/.exec(text);
    const telegram = tgNamed?.[1] ?? atNamed?.[1];

    const linkedin = /linkedin\.com\/in\/[\w%-]+/i.exec(text)?.[0];
    const github = /github\.com\/[\w-]+/i.exec(text)?.[0];

    const cityNamed = /Проживает:\s*([^\n,]+)/i.exec(text)?.[1]?.trim();
    const cityKnown =
        /\b(Москва|Санкт-Петербург|Екатеринбург|Новосибирск|Казань|Минск|Алматы|Киев|Берлин|Лондон|Ташкент)\b/i.exec(
            text
        )?.[0];
    const city = cityNamed ?? cityKnown;

    const contacts: ParsedResume['contacts'] = {};
    if (email) contacts.email = email;
    if (phone) contacts.phone = phone;
    if (telegram)
        contacts.telegram = `https://t.me/${telegram.replace(/^https?:\/\/t\.me\//, '')}`;
    if (linkedin) contacts.linkedin = linkedin;
    if (github) contacts.github = github;
    if (city) contacts.city = city;

    return Object.keys(contacts).length > 0 ? contacts : undefined;
}

// ─── Main export ──────────────────────────────────────────────────────────────

export async function parsePdfToSections(
    pdfBuffer: Buffer,
): Promise<Partial<Record<ResumeSectionType, object>>> {

    const { text } = await pdfParse(pdfBuffer);
    if (text.length < 100) throw new Error('PDF_EMPTY');

    // Algorithmic contacts — regex is more reliable than AI for structured fields
    const algorithmicContacts = extractContacts(text);

    // Send up to 8000 chars so experience / about at the end of HH.ru PDFs is included
    const resumeText = text.slice(0, 8000);

    const prompt = `You are an expert resume parser. Parse the resume text below into structured JSON.

IMPORTANT RULES:
- "skills" must contain ONLY skill/technology names (e.g. "TypeScript", "React", "Docker").
  Do NOT include achievement sentences, project descriptions, or any text longer than 4 words.
  The skills section in HH.ru resumes is a flat list near the bottom — use that, not stacks from job descriptions.
- "education.items[].degree" must be the academic degree (e.g. "Бакалавр", "Магистр", "Bachelor").
  "Высшее" means higher education level, not a degree — infer "Бакалавр" if no specific degree is stated.
- "education.items[].year_from" is the enrollment year (start), "year_to" is graduation year (end).
  The resume may show "Резюме обновлено 25 марта 2026" — that is NOT an education year, ignore it.
- "about.text" is the personal summary / "О себе" block. It may appear at the bottom under "Дополнительная информация" in HH.ru format — find it regardless of position.
- "experience.items[].description" MUST preserve the original structure: keep each bullet point or achievement on its own line, separated by \\n. If the PDF uses "•", "-", or "–" as list markers, keep them at the start of each line. Do NOT merge multiple achievements into one paragraph. Do not truncate.
- Each experience.items[] entry MUST correspond to exactly ONE job/company from the PDF. Do NOT merge multiple companies into one item.
- "about.text" should preserve paragraph breaks as \\n. Do NOT mix content from different sections.
- Omit any key you cannot confidently extract.

Return ONLY valid JSON matching this shape (no markdown, no backticks):
{
  "basic": { "name": string, "surname": string, "desired_position": string },
  "contacts": { "email": string, "phone": string, "city": string, "telegram": string, "linkedin": string, "github": string },
  "about": { "text": string },
  "experience": {
    "items": [{
      "company": string,
      "position": string,
      "period_from": string,
      "period_to": string,
      "is_current": boolean,
      "description": string
    }]
  },
  "education": {
    "items": [{
      "institution": string,
      "degree": string,
      "field": string,
      "year_from": number,
      "year_to": number
    }]
  },
  "skills": { "hard": string[], "soft": string[] },
  "portfolio": { "items": [{ "title": string, "url": string, "description": string }] }
}

Resume text:
${resumeText}`;

    const parsed = await generateJSON<ParsedResume>(prompt);

    // Contacts from regex override AI (regex is more precise for structured fields)
    if (algorithmicContacts) {
        parsed.contacts = { ...parsed.contacts, ...algorithmicContacts };
    }

    // Normalize experience dates to mm/yyyy format
    if (parsed.experience?.items) {
        parsed.experience.items = parsed.experience.items.map((item) => {
            const periodTo = item.period_to ?? '';
            const isCurrentJob = item.is_current || isCurrent(periodTo);
            return {
                ...item,
                period_from: normalizePeriod(item.period_from),
                period_to: isCurrentJob ? '' : normalizePeriod(periodTo),
                is_current: isCurrentJob,
            };
        });
    }

    // Normalize education years: AI returns numbers; the form expects strings
    if (parsed.education?.items) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (parsed.education as any).items = parsed.education.items.map((item) => ({
            ...item,
            year_from: item.year_from ? String(item.year_from) : '',
            year_to: item.year_to ? String(item.year_to) : undefined,
        }));
    }

    // Limit skills to MAX_SKILLS to match form constraints
    const MAX_SKILLS = 25;
    if (parsed.skills) {
        const hard = (parsed.skills.hard ?? []).slice(0, MAX_SKILLS);
        const soft = (parsed.skills.soft ?? []).slice(0, MAX_SKILLS - hard.length);
        parsed.skills = { hard, soft };
    }

    // Map to ResumeSectionType
    const result: Partial<Record<ResumeSectionType, object>> = {};
    (Object.entries(KEY_TO_SECTION) as [keyof ParsedResume, ResumeSectionType][]).forEach(
        ([key, sectionType]) => {
            const value = parsed[key];
            if (value !== undefined && value !== null) {
                result[sectionType] = value as object;
            }
        },
    );

    return result;
}
