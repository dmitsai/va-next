'use client';

import { Popup } from '~/shared/ui/Popup';
import { clientApi } from 'trpc/client';
import Button, { ButtonView } from '~/shared/ui/Button';
import { ReactComponent as IconArrow } from '~/shared/assets/icons/icon-arrow.svg';
import { ReactComponent as IconFile } from '~/shared/assets/icons/icon-file.svg';
import cn from 'classnames';
import { useState } from 'react';

export interface ResumeSelectPopupProps {
    isOpen: boolean;
    setIsOpen: (value: boolean) => void;
    vacancyTitle: string;
    vacancyId: string;
    onSuccess?: () => void;
}

export const ResumeSelectPopup = (props: ResumeSelectPopupProps) => {
    const { isOpen, setIsOpen, vacancyTitle, vacancyId, onSuccess } = props;

    const { data: resumes = [], isLoading } = clientApi.resume.getList.useQuery(undefined, {
        enabled: isOpen,
    });

    const [selectedResumeId, setSelectedResumeId] = useState<string | null>(null);

    const utils = clientApi.useUtils();

    const { mutate: apply, isPending } = clientApi.application.createApply.useMutation({
        onSuccess: async () => {
            await Promise.all([
                utils.application.checkIsApplied.invalidate({ vacancyId }),
                utils.application.getMyAppliedVacancyIds.invalidate(),
                utils.application.getMyApplications.invalidate(),
            ]);
            setIsOpen(false);
            onSuccess?.();
        },
    });

    const handleApply = () => {
        apply({
            vacancyId,
            resumeId: selectedResumeId ?? undefined,
        });
    };

    return (
        <Popup
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            title={`Отклик: ${vacancyTitle}`}
            panelClassName={'max-w-[600px]'}
        >
            <div className={'flex w-full flex-col gap-y-6'}>
                <div className="flex flex-col gap-y-2">
                    <p className={'text-14 font-400 leading-6 text-sub'}>
                        Выберите резюме, которое увидит работодатель. Вы можете откликнуться и без резюме.
                    </p>
                </div>

                {isLoading && (
                    <div className="flex flex-col gap-y-2">
                        {[1, 2].map((i) => (
                            <div
                                key={i}
                                className="h-14 w-full animate-pulse rounded-8 bg-surface-tertiary"
                            />
                        ))}
                    </div>
                )}
                {!isLoading && resumes.length > 0 && (
                    <div className="flex flex-col gap-y-2">
                        {resumes.map((resume) => (
                            <button
                                key={resume.resume_id}
                                type="button"
                                onClick={() =>
                                    setSelectedResumeId(
                                        selectedResumeId === resume.resume_id
                                            ? null
                                            : resume.resume_id
                                    )
                                }
                                className={cn(
                                    'flex w-full flex-row items-center gap-x-3 rounded-8 border px-4 py-3 text-left transition-colors duration-200',
                                    selectedResumeId === resume.resume_id
                                        ? 'border-mauve bg-mantle'
                                        : 'border-surface-tertiary bg-base hover:border-surface-secondary'
                                )}
                            >
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-8 bg-surface-tertiary">
                                    <IconFile
                                        className={cn(
                                            'h-4 w-4 transition-colors duration-200',
                                            selectedResumeId === resume.resume_id
                                                ? 'fill-mauve'
                                                : 'fill-sub-secondary/70'
                                        )}
                                    />
                                </div>
                                <div className="flex flex-col gap-y-0.5">
                                    <p className="text-14 font-500 text-text">
                                        {resume.title}
                                    </p>
                                    {resume.desired_position && (
                                        <p className="text-12 text-sub-secondary/70">
                                            {resume.desired_position}
                                        </p>
                                    )}
                                </div>
                                {selectedResumeId === resume.resume_id && (
                                    <div className="ml-auto h-2 w-2 rounded-full bg-mauve" />
                                )}
                            </button>
                        ))}
                    </div>
                )}
                {!isLoading && resumes.length === 0 && (
                    <p className="text-14 text-sub-secondary/70">
                        У вас нет резюме. Вы можете откликнуться без резюме.
                    </p>
                )}

                <div className="flex w-full flex-row items-center justify-between">
                    <button
                        type="button"
                        onClick={() => apply({ vacancyId })}
                        disabled={isPending}
                        className="text-14 text-sub-secondary/70 underline-offset-2 hover:text-sub"
                    >
                        Откликнуться без резюме
                    </button>
                    <Button
                        onClick={handleApply}
                        buttonView={ButtonView.LARGE}
                        disabled={isPending}
                        className={'bg-mauve text-base transition-all hover:bg-text'}
                    >
                        <IconArrow className={'fill-base'} />
                        <p className={'text-12 font-500 leading-6'}>Отправить отклик</p>
                    </Button>
                </div>
            </div>
        </Popup>
    );
};
