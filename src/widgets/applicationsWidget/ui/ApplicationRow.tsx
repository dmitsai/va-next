'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import cn from 'classnames';
import Button, { ButtonView } from '~/shared/ui/Button';
import { ReactComponent as IconTrash } from '~/shared/assets/icons/icon-trash.svg';
import { ReactComponent as IconFile } from '~/shared/assets/icons/icon-file.svg';
import { Badge } from '~/shared/ui/Badge';
import { clientApi } from 'trpc/client';
import type { RouterOutputs } from 'trpc/shared';
import { getDayWMonth, getStringifySalary } from '~/shared/lib/strings';

type Application =
    RouterOutputs['application']['getMyApplications']['applications'][number];

interface ApplicationRowProps {
    application: Application;
    onDeleted?: () => void;
}

export const ApplicationRow: React.FC<ApplicationRowProps> = ({
    application,
    onDeleted,
}) => {
    const [confirmDelete, setConfirmDelete] = useState(false);

    const utils = clientApi.useUtils();

    const { mutate: deleteApp, isPending } =
        clientApi.application.deleteApplication.useMutation({
            onSuccess: async () => {
                await utils.application.getMyApplications.invalidate();
                onDeleted?.();
            },
        });

    const { vacancy, resume } = application;
    const isExternal = vacancy.platform.name !== 'local';
    const company = vacancy.companyName ?? '—';
    const salary = getStringifySalary(
        vacancy.salaryFrom,
        vacancy.salaryTo,
        vacancy.currency?.char ?? null
    );

    return (
        <div className="group flex w-full flex-col gap-2 rounded-8 border border-surface-secondary bg-mantle p-4 transition-colors duration-200 hover:border-surface-tertiary hover:bg-base sm:flex-row sm:items-start sm:justify-between">
            <Link
                href={`/vacancies/${vacancy.vacancy_id}`}
                className="flex min-w-0 flex-1 flex-col gap-y-1"
            >
                <p className="text-14 font-500 leading-5 text-text transition-colors duration-200 group-hover:text-mauve">
                    {vacancy.title}
                </p>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <span className="text-12 text-sub-secondary/70">{company}</span>
                    {vacancy.location && (
                        <span className="text-12 text-sub-secondary/70">
                            {vacancy.location.name}
                        </span>
                    )}
                    <span className="text-12 text-sub-secondary/70">{salary}</span>
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1">
                    <Badge
                        placeholder={vacancy.platform.title}
                        className={cn(
                            'text-12',
                            isExternal
                                ? 'bg-surface-tertiary text-sub'
                                : 'bg-mauve/20 text-mauve'
                        )}
                    />
                    {resume && (
                        <span className="flex items-center gap-x-1 text-12 text-sub-secondary/70">
                            <IconFile className="h-3 w-3 fill-sub-secondary/70" />
                            {resume.title}
                        </span>
                    )}
                </div>
            </Link>

            <div className="flex shrink-0 flex-row items-center gap-x-2">
                <span className="text-12 text-sub-secondary/70">
                    {getDayWMonth(application.created_at)}
                </span>
                {confirmDelete ? (
                    <>
                        <Button
                            onClick={() =>
                                deleteApp({
                                    applicationId: application.application_id,
                                })
                            }
                            disabled={isPending}
                            buttonView={ButtonView.LARGE}
                            className="bg-red text-base"
                        >
                            <IconTrash className="size-4 fill-base" />
                            <span className="text-12 font-500">Удалить?</span>
                        </Button>
                        <Button
                            onClick={() => setConfirmDelete(false)}
                            buttonView={ButtonView.LARGE}
                            className="bg-surface-tertiary hover:bg-surface"
                        >
                            <span className="text-12 font-500 text-sub">Отмена</span>
                        </Button>
                    </>
                ) : (
                    <Button
                        onClick={() => setConfirmDelete(true)}
                        buttonView={ButtonView.LARGE}
                        className="opacity-0 bg-surface-tertiary transition-all duration-200 group-hover:opacity-100 hover:bg-red"
                    >
                        <IconTrash className="size-4 fill-text group-hover:fill-base" />
                    </Button>
                )}
            </div>
        </div>
    );
};
