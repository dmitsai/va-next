'use client';

import React, { useState } from 'react';
import { Tags } from '~/features/vacancyCard';
import { CONSTANTS } from '~/shared/lib/strings';
import Button, { ButtonView } from '~/shared/ui/Button';
import { ReactComponent as IconStar } from '~/shared/assets/icons/icon-star.svg';
import { ReactComponent as IconArrow } from '~/shared/assets/icons/icon-arrow.svg';
import { ReactComponent as IconInfo } from '~/shared/assets/icons/icon-sonner-error.svg';
import cn from 'classnames';

export interface VacancyHeaderProps {
  company: {
    imgUrl: string | null;
    title: string;
  };

  title: string;
  tags: {
    title: string;
    tag_id: string;
    localTitle: string;
  }[];
  isFavorited: boolean;
  isApplied: boolean;
}
export const VacancyHeader: React.FC<VacancyHeaderProps> = (props) => {
  const {
    company,
    title,
    tags,
    isFavorited: initialIsFavorited,
    isApplied: initialIsApplied,
  } = props;

  const [isFavorited, setIsFavorited] = useState(initialIsFavorited);

  const [isApplied, setIsApplied] = useState(initialIsApplied);

  return (
    <div className={'flex w-full flex-col gap-y-5'}>
      <div className={'flex w-full flex-row gap-x-5'}>
        {/* TODO: add avatar */}
        <div
          className={
            'flex h-20 w-20 items-center justify-center rounded-full bg-peach text-base'
          }
        >
          {'AVATAR'}
        </div>
        <div className={'flex flex-col gap-y-1 font-600 text-text'}>
          <span className={'text-20'}>{title}</span>
          <div className={'relative flex flex-row gap-x-0.5 text-18'}>
            <span>{company.title}</span>
            {tags.map((tag) => (
              <>
                <li key={tag.title} className={'ml-4'}>
                  {tag.localTitle}
                </li>
              </>
            ))}
          </div>
        </div>
      </div>
      <div className={'flex w-full flex-row items-start gap-x-5'}>
        <Button
          disabled={isApplied}
          onClick={() => {
            setIsApplied(true);
          }}
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
          onClick={() => {
            setIsFavorited(!isFavorited);
          }}
          buttonView={ButtonView.LARGE}
          className={cn(
            'bg-mantle text-text transition-all hover:bg-text hover:text-base',
            isFavorited ? '' : '',
          )}
        >
          <IconStar
            className={cn(
              '',
              isFavorited
                ? 'fill-yellow stroke-yellow'
                : 'fill-base stroke-text group-hover:stroke-base',
            )}
          />
          <p className={'text-12 font-500 leading-6'}>
            {isFavorited
              ? CONSTANTS.detailedVacancy.favorite.remove
              : CONSTANTS.detailedVacancy.favorite.add}
          </p>
        </Button>
      </div>
    </div>
  );
};
