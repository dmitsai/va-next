'use client';

import React, { useState } from 'react';
import { CONSTANTS } from '~/shared/lib/strings';
import Button, { ButtonView } from '~/shared/ui/Button';
import { ReactComponent as IconStar } from '~/shared/assets/icons/icon-star.svg';
import { ReactComponent as IconArrow } from '~/shared/assets/icons/icon-arrow.svg';
import { ReactComponent as IconInfo } from '~/shared/assets/icons/icon-sonner-error.svg';
import cn from 'classnames';
import { Tags } from '~/shared/api/model/tags/type';
import { ServerAvatar } from '~/widgets/avatar/ui/ServerAvatar';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { clientApi } from 'trpc/client';
import { ApplyPopup } from '~/features/applyPopup';
import { ResumeSelectPopup } from '~/features/resumeSelectPopup';

export interface VacancyHeaderProps {
    vacancyId: string;
    isLocal: boolean;
    sourceUrl: string | null;
    company: {
        imgUrl: string | null;
        title: string;
    };
    avatar: string | null;
    title: string;
    tags: Tags | null;
    isFavorited: boolean;
    isApplied: boolean;
}

export const VacancyHeader: React.FC<VacancyHeaderProps> = (props) => {
    const {
        vacancyId,
        isLocal,
        sourceUrl,
        company,
        title,
        tags: objectTags,
        isFavorited: initialIsFavorited,
        isApplied: initialIsApplied,
        avatar,
    } = props;

    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const { status } = useSession();

    const [isExternalApplyOpen, setIsExternalApplyOpen] = useState(false);
    const [isResumeSelectOpen, setIsResumeSelectOpen] = useState(false);

    const utils = clientApi.useUtils();

    // Включён для всех вакансий — и локальных, и внешних
    const { data: isAppliedFromApi } = clientApi.application.checkIsApplied.useQuery(
        { vacancyId },
        { enabled: status === 'authenticated' }
    );

    const { data: isFavoritedFromApi } = clientApi.application.checkIsFavorited.useQuery(
        { vacancyId },
        { enabled: status === 'authenticated' }
    );

    const isApplied = isAppliedFromApi ?? initialIsApplied;
    const isFavorited = isFavoritedFromApi ?? initialIsFavorited;

    // Мутация живёт здесь — VacancyHeader не размонтируется при закрытии попапа
    const { mutate: recordExternalApply } = clientApi.application.createApply.useMutation({
        onSuccess: async () => {
            await Promise.all([
                utils.application.checkIsApplied.invalidate({ vacancyId }),
                utils.application.getMyAppliedVacancyIds.invalidate(),
                utils.application.getMyApplications.invalidate(),
            ]);
        },
    });

    const { mutate: toggleFavorite } = clientApi.application.toggleFavorite.useMutation({
        onSuccess: async () => {
            await utils.application.checkIsFavorited.invalidate({ vacancyId });
        },
    });

    const tags = Object.values(objectTags ?? {}).flatMap((tag) => tag);

    const handleApply = () => {
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

    const handleToggleFavorite = () => {
        if (status === 'loading') return;
        if (status === 'unauthenticated') {
            const qs = searchParams.toString();
            const callbackUrl = `${pathname}${qs ? `?${qs}` : ''}`;
            router.push(`/user/auth?callbackUrl=${encodeURIComponent(callbackUrl)}`);
            return;
        }
        toggleFavorite({ vacancyId });
    };

    // Вызывается из ApplyPopup при клике на "Открыть на источнике"
    const handleExternalApplyConfirm = () => {
        if (status === 'authenticated') {
            recordExternalApply({ vacancyId });
        }
    };

    return (
        <div className={'flex w-full flex-col gap-y-5'}>
            <ApplyPopup
                isOpen={isExternalApplyOpen}
                setIsOpen={setIsExternalApplyOpen}
                vacancyTitle={title}
                sourceUrl={sourceUrl}
                onApplyConfirm={handleExternalApplyConfirm}
            />
            <ResumeSelectPopup
                isOpen={isResumeSelectOpen}
                setIsOpen={setIsResumeSelectOpen}
                vacancyTitle={title}
                vacancyId={vacancyId}
            />
            <div className={'flex w-full flex-row gap-x-5'}>
                {!avatar ? (
                    <div
                        className={
                            'flex h-20 w-20 items-center justify-center rounded-full bg-peach text-base'
                        }
                    >
                        {'AVATAR'}
                    </div>
                ) : (
                    <ServerAvatar userAvatarUrl={avatar} />
                )}
                <div className={'flex w-fit flex-col items-start gap-y-2 font-600 text-text'}>
                    <span className={'text-20'}>{title}</span>
                    <div className={'flex flex-wrap items-center gap-x-4 gap-y-2 text-18'}>
                        <span>{company.title}</span>
                        <ul className={'flex flex-wrap items-center gap-x-4 gap-y-2 pl-0'}>
                            {tags.map((tag) => (
                                <li
                                    key={`vacancy-header-tag-${tag}`}
                                    className={'ml-4 list-disc first:ml-0 first:list-none'}
                                >
                                    {tag}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
            <div className={'flex w-full flex-row items-start gap-x-5'}>
                <Button
                    disabled={isApplied}
                    onClick={handleApply}
                    buttonView={ButtonView.LARGE}
                    className={cn('bg-mauve text-base transition-all hover:bg-text')}
                >
                    {isApplied ? (
                        <IconInfo className={'fill-sub-secondary/70'} />
                    ) : (
                        <IconArrow className={'fill-base'} />
                    )}
                    <p className={'text-12 font-500 leading-6'}>
                        {isApplied
                            ? CONSTANTS.detailedVacancy.apply.exist
                            : CONSTANTS.detailedVacancy.apply.add}
                    </p>
                </Button>
                <Button
                    onClick={handleToggleFavorite}
                    buttonView={ButtonView.LARGE}
                    className={cn(
                        'bg-mantle text-text transition-all hover:bg-text hover:text-base'
                    )}
                >
                    <IconStar
                        className={cn(
                            isFavorited
                                ? 'fill-yellow stroke-yellow'
                                : 'fill-base stroke-text group-hover:stroke-base'
                        )}
                    />
                    <p className={'text-12 font-500 leading-6'}>
                        {isFavorited
                            ? CONSTANTS.detailedVacancy.favorite.remove
                            : CONSTANTS.detailedVacancy.favorite.add}
                    </p>
                </Button>
                {!isLocal && sourceUrl && (
                    <Button
                        onClick={() => window.open(sourceUrl, '_blank', 'noopener,noreferrer')}
                        buttonView={ButtonView.LARGE}
                        className={'bg-mantle text-text transition-all hover:bg-text hover:text-base'}
                    >
                        <p className={'text-12 font-500 leading-6'}>
                            {CONSTANTS.employerCandidates.viewFullOnSite}
                        </p>
                    </Button>
                )}
            </div>
        </div>
    );
};
