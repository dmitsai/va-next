'use client';

import type { ResumeFormState } from '~/widgets/resumeBuilder/model/types';

function formatExpPeriod(
    i: ResumeFormState['EXPERIENCE']['items'][number],
    esc: (_s: string) => string,
): string {
    const from = esc(i.period_from);
    if (i.is_current) return `${from} — наст. время`;
    if (i.period_to) return `${from} — ${esc(i.period_to)}`;
    return from;
}

export function exportResumeToPdf(state: ResumeFormState): void {
    const fullName =
        `${state.BASIC.name} ${state.BASIC.surname}`.trim() || 'Резюме';

    const esc = (s: string) =>
        s
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');

    const section = (title: string, content: string) => `
        <div class="section">
            <p class="section-title">${esc(title)}</p>
            <div class="section-body">${content}</div>
        </div>`;

    const chip = (text: string) =>
        `<span class="chip">${esc(text)}</span>`;

    const contactChips = [
        state.CONTACTS.email    && chip(`Email: ${state.CONTACTS.email}`),
        state.CONTACTS.phone    && chip(`Телефон: ${state.CONTACTS.phone}`),
        state.CONTACTS.city     && chip(state.CONTACTS.city),
        state.CONTACTS.telegram && chip(`Telegram: ${state.CONTACTS.telegram}`),
        state.CONTACTS.github   && chip(`GitHub: ${state.CONTACTS.github}`),
        state.CONTACTS.linkedin && chip(`LinkedIn: ${state.CONTACTS.linkedin}`),
    ]
        .filter(Boolean)
        .join('');

    const experienceHtml = state.EXPERIENCE.items
        .filter((i) => i.company || i.position)
        .map(
            (i) => `
            <div class="exp-item">
                <div class="exp-header">
                    <div>
                        <p class="exp-position">${esc(i.position || '—')}</p>
                        ${i.company ? `<p class="exp-company">${esc(i.company)}</p>` : ''}
                    </div>
                    <p class="exp-period">${formatExpPeriod(i, esc)}</p>
                </div>
                ${i.description ? `<p class="exp-desc">${esc(i.description)}</p>` : ''}
            </div>`,
        )
        .join('');

    const educationHtml = state.EDUCATION.items
        .filter((i) => i.institution)
        .map(
            (i) => `
            <div class="edu-item">
                <div class="exp-header">
                    <div>
                        <p class="edu-inst">${esc(i.institution)}</p>
                        <p class="edu-field">${[i.degree, i.field].filter(Boolean).map(esc).join(', ')}</p>
                    </div>
                    <p class="exp-period">${esc(i.year_from)}${i.year_to ? ` — ${esc(i.year_to)}` : ''}</p>
                </div>
            </div>`,
        )
        .join('');

    const hardSkills = state.SKILLS.hard
        .map((s) => `<span class="skill skill-hard">${esc(s)}</span>`)
        .join('');
    const softSkills = state.SKILLS.soft
        .map((s) => `<span class="skill skill-soft">${esc(s)}</span>`)
        .join('');

    const portfolioHtml = state.PORTFOLIO.items
        .filter((i) => i.title || i.url)
        .map(
            (i) => `
            <div class="port-item">
                ${i.title ? `<p class="port-title">${esc(i.title)}</p>` : ''}
                ${i.url ? `<p class="port-url">${esc(i.url)}</p>` : ''}
                ${i.description ? `<p class="port-desc">${esc(i.description)}</p>` : ''}
            </div>`,
        )
        .join('');

    const hasBoth = state.SKILLS.hard.length > 0 && state.SKILLS.soft.length > 0;
    const skillsContent =
        state.SKILLS.hard.length || state.SKILLS.soft.length
            ? `
            ${hardSkills ? `${hasBoth ? '<p class="skills-label">Технические навыки</p>' : ''}<div class="skills-row">${hardSkills}</div>` : ''}
            ${softSkills ? `<p class="skills-label">Дополнительные навыки</p><div class="skills-row">${softSkills}</div>` : ''}
        `
            : '';

    const html = `<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8" />
    <title>${esc(fullName)}</title>
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @page { size: A4; margin: 0; }
        body { font-family: 'Segoe UI', Arial, sans-serif; font-size: 13px; color: #1a1a2e; line-height: 1.5; padding: 20mm 18mm; }

        .header { border-bottom: 1px solid #e5e7eb; padding-bottom: 16px; margin-bottom: 20px; }
        .name { font-size: 22px; font-weight: 700; color: #111827; }
        .position { font-size: 14px; color: #6b7280; margin-top: 4px; }
        .contacts { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 10px; }
        .chip { background: #f3f4f6; border-radius: 4px; padding: 2px 8px; font-size: 11px; color: #6b7280; }

        .section { margin-bottom: 18px; }
        .section-title { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #9ca3af; margin-bottom: 8px; }
        .section-body { border-top: 1px solid #f3f4f6; padding-top: 10px; }

        .about-text { font-size: 13px; color: #4b5563; line-height: 1.6; }

        .exp-item + .exp-item { margin-top: 14px; }
        .exp-header { display: flex; justify-content: space-between; align-items: flex-start; }
        .exp-position { font-size: 14px; font-weight: 600; color: #111827; }
        .exp-company { font-size: 13px; color: #6b7280; margin-top: 2px; }
        .exp-period { font-size: 12px; color: #9ca3af; white-space: nowrap; }
        .exp-desc { font-size: 12px; color: #6b7280; margin-top: 6px; line-height: 1.55; }

        .edu-item + .edu-item { margin-top: 10px; }
        .edu-inst { font-size: 13px; font-weight: 600; color: #111827; }
        .edu-field { font-size: 12px; color: #6b7280; margin-top: 2px; }

        .skills-label { font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin-bottom: 6px; margin-top: 10px; }
        .skills-label:first-child { margin-top: 0; }
        .skills-row { display: flex; flex-wrap: wrap; gap: 6px; }
        .skill { border-radius: 4px; padding: 2px 8px; font-size: 12px; font-weight: 500; }
        .skill-hard { background: #ede9fe; color: #6d28d9; }
        .skill-soft { background: #d1fae5; color: #065f46; }

        .port-item + .port-item { margin-top: 10px; }
        .port-title { font-size: 13px; font-weight: 600; color: #111827; }
        .port-url { font-size: 12px; color: #6b7280; text-decoration: underline; margin-top: 2px; }
        .port-desc { font-size: 12px; color: #9ca3af; margin-top: 2px; }
    </style>
</head>
<body>
    <div class="header">
        <p class="name">${esc(fullName)}</p>
        ${state.BASIC.desired_position ? `<p class="position">${esc(state.BASIC.desired_position)}</p>` : ''}
        ${contactChips ? `<div class="contacts">${contactChips}</div>` : ''}
    </div>

    ${state.ABOUT.text ? section('О себе', `<p class="about-text">${esc(state.ABOUT.text)}</p>`) : ''}
    ${experienceHtml ? section('Опыт работы', experienceHtml) : ''}
    ${educationHtml ? section('Образование', educationHtml) : ''}
    ${skillsContent ? section('Навыки', skillsContent) : ''}
    ${portfolioHtml ? section('Портфолио', portfolioHtml) : ''}
</body>
</html>`;

    const win = window.open('', '_blank', 'width=794,height=1123');
    if (!win) return;

    win.document.write(html);
    win.document.close();

    // Give browser time to render before print dialog
    win.onload = () => {
        win.focus();
        win.print();
        win.close();
    };

    // Fallback if onload already fired
    setTimeout(() => {
        try {
            win.focus();
            win.print();
            win.close();
        } catch {
            // window might already be closed or blocked
        }
    }, 500);
}
