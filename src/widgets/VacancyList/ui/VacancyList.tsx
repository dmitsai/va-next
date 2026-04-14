import React from 'react';
import { CONSTANTS } from '~/shared/lib/strings';
import { Badge } from '~/shared/ui/Badge';
import { createSSRHelpers } from 'trpc/helpers';
import { headers } from 'next/headers';
import { LinkButton, LinkView } from '~/shared/ui/Button/LinkButton';
import { VacancyListClient } from './VacancyListClient';
// import { vacancies } from '../model/data';

interface VacancyListProps {
    resumeLabel?: string;
}

export const VacancyList: React.FC<VacancyListProps> = async (props) => {
    const helpers = await createSSRHelpers(headers());

    const vacancies = (
        await helpers.vacancy.infinityVacancy.fetch({ limit: 12 })
    ).vacancyList;

    const { resumeLabel } = props;
    return (
        <div className={'flex h-full flex-col items-center justify-center'}>
            <div
                className={
                    'grid h-full w-full grid-cols-3 gap-5 xl:grid-cols-4'
                }
            >
                {resumeLabel ? (
                    <span
                        className={
                            'col-span-3 mb-5 flex w-full flex-row items-center gap-x-4 text-18 text-text xl:col-span-4'
                        }
                    >
                        {CONSTANTS.home.vacancies.placeholder.authecated}
                        <Badge
                            className={
                                '!rounded-6 bg-mantle px-4 py-2 text-14 !font-500 text-text'
                            }
                            placeholder={resumeLabel}
                        />
                    </span>
                ) : (
                    <span
                        className={
                            'col-span-3 mb-5 w-full text-18 text-text xl:col-span-4'
                        }
                    >
                        {CONSTANTS.home.vacancies.placeholder.unauthecated}
                    </span>
                )}
                <VacancyListClient vacancies={vacancies} />
                <LinkButton
                    href={'/vacancies'}
                    linkView={LinkView.LARGE}
                    className={
                        'col-span-3 mt-5 w-full bg-mantle text-14 text-text hover:bg-text hover:text-base xl:col-span-4'
                    }
                >
                    {CONSTANTS.home.vacancies.viewAll}
                </LinkButton>
            </div>
        </div>
    );
};
