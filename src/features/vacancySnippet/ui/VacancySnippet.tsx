import React from 'react';
import { CONSTANTS } from '~/shared/lib/strings';
import { isTruncatedDescription } from '../lib/isTruncatedDescription';

export interface VacancySnippetProps {
    description: string;
    sourceUrl: string | null;
}

export const VacancySnippet: React.FC<VacancySnippetProps> = ({
    description,
    sourceUrl,
}) => {
    const trimmed = description.trim();
    if (!trimmed) {
        return null;
    }

    const showExternalLink =
        isTruncatedDescription(trimmed) && Boolean(sourceUrl);

    return (
        <section className={'flex w-full flex-col gap-y-3'}>
            <h2 className={'text-20 font-600 text-text'}>
                {CONSTANTS.employerCandidates.vacancyDescription}
            </h2>
            <p className={'whitespace-pre-wrap text-16 leading-relaxed text-text/90'}>
                {description}
            </p>
            {showExternalLink && sourceUrl ? (
                <a
                    href={sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={
                        'w-fit text-16 font-500 text-mauve underline underline-offset-2 transition-colors hover:text-text'
                    }
                >
                    {CONSTANTS.employerCandidates.viewFullOnSite}
                </a>
            ) : null}
        </section>
    );
};
