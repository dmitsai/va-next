'use client';

import React from 'react';
import cn from 'classnames';
import Button, { ButtonView } from '~/shared/ui/Button';
import { Badge } from '~/shared/ui/Badge';
import { ReactComponent as IconFile } from '~/shared/assets/icons/icon-file.svg';
import { ReactComponent as IconDownload } from '~/shared/assets/icons/icon-download.svg';
import { ReactComponent as IconEdit } from '~/shared/assets/icons/icon-edit.svg';
import { ReactComponent as IconTrash } from '~/shared/assets/icons/icon-trash.svg';
import Link from 'next/link';
import { ResumeWithRelations } from '../model/types';
import { daysAgo, getSectionWord, getScoreClassName } from '../model/lib';
import { useResumeActions } from '../model/useResumeActions';

interface ResumeCardProps {
    resume: ResumeWithRelations;
    displayTitle?: string;
}

export const ResumeCard: React.FC<ResumeCardProps> = ({ resume, displayTitle }) => {
    const {
        handleEdit,
        handleExportPdf,
        handleDeleteClick,
        scoreTotal,
        sectionsCount,
        confirmDelete,
        setConfirmDelete,
    } = useResumeActions(resume);

    return (
        <div
            className={
                'group flex w-full flex-col gap-3 rounded-8 border border-surface-secondary bg-mantle p-4 transition-colors duration-300 hover:border-mauve hover:bg-base sm:flex-row sm:flex-wrap sm:items-start sm:justify-between sm:gap-x-4'
            }
        >
            <Link
                href={`/resume/analysis/${resume.resume_id}`}
                className={
                    'flex w-full min-w-0 flex-row items-center gap-x-4 sm:flex-1'
                }
            >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-8 bg-surface-tertiary">
                    <IconFile className="h-4 w-4 fill-surface duration-300 group-hover:fill-mauve" />
                </div>
                <div className={'flex min-w-0 flex-col gap-y-1'}>
                    <p
                        className={
                            'text-14 font-500 leading-6 text-text duration-300 group-hover:text-mauve sm:whitespace-nowrap'
                        }
                    >
                        {displayTitle ?? resume.title}
                    </p>
                    <ul
                        className={
                            'flex flex-row items-center gap-x-2 whitespace-nowrap'
                        }
                    >
                        <li
                            className={
                                'text-12 font-400 leading-4 text-sub-secondary/70'
                            }
                        >
                            {`Обновлено ${daysAgo(resume.created_at)}`}
                        </li>
                        <li
                            aria-hidden="true"
                            className={
                                'text-12 leading-4 text-sub-secondary/70'
                            }
                        >
                            &bull;
                        </li>
                        <li
                            className={
                                'text-12 font-400 leading-4 text-sub-secondary/70'
                            }
                        >
                            {`${sectionsCount} ${getSectionWord(sectionsCount)}`}
                        </li>
                    </ul>
                </div>
            </Link>
            <div
                className={
                    'flex w-full flex-row flex-wrap items-center gap-2 sm:w-auto sm:gap-x-4'
                }
            >
                <Badge
                    placeholder={`Оценка: ${scoreTotal}`}
                    className={cn(getScoreClassName(scoreTotal))}
                />
                <Button
                    onClick={handleEdit}
                    buttonView={ButtonView.LARGE}
                    className={
                        'group/btn bg-surface-tertiary text-base transition-all duration-300 hover:bg-mauve'
                    }
                >
                    <IconEdit
                        className={'size-4 fill-text group-hover/btn:fill-base'}
                    />
                    <p
                        className={
                            'text-14 font-500 leading-6 text-text group-hover/btn:text-base'
                        }
                    >
                        Редактировать
                    </p>
                </Button>
                <Button
                    onClick={handleExportPdf}
                    buttonView={ButtonView.LARGE}
                    className={
                        'group/btn bg-surface-tertiary text-base transition-all duration-300 hover:bg-mauve'
                    }
                >
                    <IconDownload
                        className={'size-5 fill-text group-hover/btn:fill-base'}
                    />
                </Button>
                {confirmDelete ? (
                    <div className="flex items-center gap-x-1">
                        <Button
                            onClick={handleDeleteClick}
                            buttonView={ButtonView.LARGE}
                            className="bg-red text-base"
                        >
                            <IconTrash className="size-4 fill-base" />
                            <span className="text-12 font-500">Удалить?</span>
                        </Button>
                        <Button
                            onClick={() => setConfirmDelete(false)}
                            buttonView={ButtonView.LARGE}
                            className="bg-surface-tertiary text-sub hover:bg-surface"
                        >
                            <span className="text-12 font-500">Отмена</span>
                        </Button>
                    </div>
                ) : (
                    <Button
                        onClick={handleDeleteClick}
                        buttonView={ButtonView.LARGE}
                        className={
                            'group/btn bg-surface-tertiary transition-all duration-300 hover:bg-red'
                        }
                    >
                        <IconTrash
                            className={'size-4 fill-text group-hover/btn:fill-base'}
                        />
                    </Button>
                )}
            </div>
        </div>
    );
};
