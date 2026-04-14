'use client';

import React, { Suspense, useState } from 'react';
import { CONSTANTS, getStringifySalary } from '~/shared/lib/strings';
import cn from 'classnames';
import Button, { ButtonView } from '~/shared/ui/Button';
import { ReactComponent as IconStar } from '~/shared/assets/icons/icon-star.svg';
import { ReactComponent as IconArrow } from '~/shared/assets/icons/icon-arrow.svg';
import { ReactComponent as IconEdit } from '~/shared/assets/icons/icon-edit.svg';
import { Badge } from '~/shared/ui/Badge';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { type Tags } from '~/shared/api/model/tags/type';
import { clientApi } from 'trpc/client';
import { ApplyPopup } from '~/features/applyPopup';
import { ResumeSelectPopup } from '~/features/resumeSelectPopup';
import { getTagArrayWithColors } from '../utils/tagsWithColors';

export interface VacancyCardProps {
    vacancyId: string;
    title: string;
    isFavorited: boolean;
    tags: Tags | null;
    description: string;
    company: {
        imgUrl: string | null;
        title: string;
    };
    salaryFrom: number | null;
    salaryTo: number | null;
    wrapperClassName?: string;
    currency: {
        title: string;
        currency_id: string;
        char: string;
    };
    /** Вакансия с площадки vakansiy.net (platform `local`), иначе внешняя агрегация */
    isLocal: boolean;
    sourceUrl: string | null;
    isApplied?: boolean;
    view?: 'company' | 'client';
}

export const VacancyCardComponent: React.FC<VacancyCardProps> = ({
    view = 'client',
    ...other
}) => {
    const {
        vacancyId,
        title,
        isFavorited: initialIsFavoritedState,
        tags,
        description,
        company,
        salaryFrom,
        salaryTo,
        currency,
        wrapperClassName,
        isLocal,
        sourceUrl,
        isApplied: initialIsApplied = false,
    } = other;

    const searchParams = useSearchParams();
    const params = new URLSearchParams(searchParams.toString());
    const pathname = usePathname();

    const router = useRouter();
    const { status } = useSession();

    const [isExternalApplyOpen, setIsExternalApplyOpen] = useState(false);
    const [isResumeSelectOpen, setIsResumeSelectOpen] = useState(false);

    const { data: isFavoritedFromApi } = clientApi.application.checkIsFavorited.useQuery(
        { vacancyId },
        { enabled: status === 'authenticated' && view === 'client' }
    );

    const isFavorited = isFavoritedFromApi ?? initialIsFavoritedState;

    const utils = clientApi.useUtils();

    const { mutate: toggleFavorite } = clientApi.application.toggleFavorite.useMutation({
        onSuccess: async () => {
            await utils.application.checkIsFavorited.invalidate({ vacancyId });
        },
    });

    const { mutate: recordExternalApply } = clientApi.application.createApply.useMutation({
        onSuccess: async () => {
            await Promise.all([
                utils.application.getMyAppliedVacancyIds.invalidate(),
                utils.application.getMyApplications.invalidate(),
            ]);
        },
    });

    const isApplied = initialIsApplied;

    const handleApply = () => {
        if (view !== 'client') return;
        if (status === 'loading') return;
        if (status === 'unauthenticated') {
            const qs = searchParams.toString();
            const callbackUrl = `${pathname}${qs ? `?${qs}` : ''}`;
            router.push(`/user/auth?callbackUrl=${encodeURIComponent(callbackUrl)}`);
            return;
        }
        if (!isLocal) {
            setIsExternalApplyOpen(true);
            return;
        }
        setIsResumeSelectOpen(true);
    };

    const handleToggleFavorite = (e: React.MouseEvent) => {
        e.preventDefault();
        if (status === 'loading') return;
        if (status === 'unauthenticated') {
            const qs = searchParams.toString();
            const callbackUrl = `${pathname}${qs ? `?${qs}` : ''}`;
            router.push(`/user/auth?callbackUrl=${encodeURIComponent(callbackUrl)}`);
            return;
        }
        toggleFavorite({ vacancyId });
    };

    const tagArrayWithColors = getTagArrayWithColors(tags);

    return (
        <>
            {view === 'client' ? (
                <>
                    <ApplyPopup
                        isOpen={isExternalApplyOpen}
                        setIsOpen={setIsExternalApplyOpen}
                        vacancyTitle={title}
                        sourceUrl={sourceUrl}
                        onApplyConfirm={() => {
                            if (status === 'authenticated') {
                                recordExternalApply({ vacancyId });
                            }
                        }}
                    />
                    <ResumeSelectPopup
                        isOpen={isResumeSelectOpen}
                        setIsOpen={setIsResumeSelectOpen}
                        vacancyTitle={title}
                        vacancyId={vacancyId}
                    />
                </>
            ) : null}
            <Link
                href={
                    view === 'client'
                        ? `/vacancies/${vacancyId}?${params.toString()}`
                        : `/vacancy/candidates/${vacancyId}?${params.toString()}`
                }
                className={cn(
                    'card group w-full border-2 border-base bg-mantle transition-colors',
                    wrapperClassName
                )}
            >
            <div className={'flex w-full flex-col items-start'}>
                <div
                    className={
                        'group flex w-full flex-row items-center justify-between'
                    }
                >
                    <p
                        className={
                            'line-clamp-1 max-w-44 text-14 font-500 leading-6 text-text'
                        }
                    >
                        {title}
                    </p>
                    {view === 'client' ? (
                        <Button
                            buttonView={ButtonView.SMALL}
                            className={
                                'group/favorite h-6 w-6 !px-1.5 opacity-0 duration-300 hover:bg-mantle group-hover:opacity-100'
                            }
                            onClick={handleToggleFavorite}
                        >
                            <IconStar
                                className={cn(
                                    'absolute',
                                    isFavorited
                                        ? 'fill-yellow stroke-none'
                                        : 'fill-none stroke-text group-hover/favorite:stroke-yellow'
                                )}
                            />
                        </Button>
                    ) : (
                        <Button
                            buttonView={ButtonView.SMALL}
                            className={
                                'group/favorite h-7 w-7 !px-1.5 opacity-0 duration-300 hover:bg-mantle group-hover:opacity-100'
                            }
                            onClick={(e) => {
                                e.preventDefault();
                                router.replace(
                                    `/vacancy/edit/${vacancyId}?${params.toString()}`
                                );
                            }}
                        >
                            <IconEdit
                                className={
                                    'fill-text group-hover/favorite:fill-mauve'
                                }
                            />
                        </Button>
                    )}
                </div>
                <p className={'fot-400 text-14 leading-5 text-text'}>
                    {getStringifySalary(salaryFrom, salaryTo, currency.char)}
                </p>
            </div>
            <div className={'relative h-full w-full'}>
                {/* FIXME: temp solution for display valid count of tags */}
                <div
                    className={
                        'flex h-12 max-h-card-tags flex-wrap gap-1 overflow-hidden opacity-100 transition-all duration-300 group-hover:opacity-0'
                    }
                >
                    {tagArrayWithColors.map((tag) => (
                        <Badge
                            key={tag.name.trim()}
                            placeholder={tag.name}
                            className={cn('h-5 text-base', `bg-${tag.color}`)}
                        />
                    ))}
                </div>
                <p
                    className={
                        'absolute inset-0 line-clamp-2 max-h-fit w-full text-14 font-400 leading-5 text-text opacity-0 transition-all duration-300 group-hover:opacity-100'
                    }
                >
                    {description}
                </p>
            </div>
            <div
                className={
                    'absolute bottom-3 left-0 right-0 flex w-full flex-row items-end justify-between pl-1 pr-4'
                }
            >
                {/* Add Avatar of company later */}
                <Badge
                    className={
                        'flex max-h-6 max-w-36 flex-wrap rounded-16 py-1.5 text-14 font-500 leading-5 text-sub'
                    }
                    placeholder={company.title}
                />
                {view === 'client' ? (
                    <Button
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            if (!isApplied) handleApply();
                        }}
                        disabled={isApplied}
                        buttonView={ButtonView.SMALL}
                        className={cn(
                            'opacity-0 transition-all duration-300 group-hover:opacity-100',
                            isApplied
                                ? 'bg-surface-tertiary text-sub cursor-default'
                                : 'bg-mauve text-base hover:bg-text'
                        )}
                    >
                        {isApplied ? (
                            <p className={'text-12 font-500 leading-6'}>
                                Откликнулись
                            </p>
                        ) : (
                            <>
                                <IconArrow className={'fill-base'} />
                                <p className={'text-12 font-500 leading-6'}>
                                    {CONSTANTS.card.apply}
                                </p>
                            </>
                        )}
                    </Button>
                ) : null}
            </div>
        </Link>
        </>
    );
};

export const VacancyCard: React.FC<VacancyCardProps> = (props) => (
    <Suspense>
        <VacancyCardComponent {...props} />
    </Suspense>
);
