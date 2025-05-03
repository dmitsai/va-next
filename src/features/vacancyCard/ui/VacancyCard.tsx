'use client';

import React, { useState } from 'react';
import { CONSTANTS } from '~/shared/lib/strings';
import cn from 'classnames';
import Button, { ButtonView } from '~/shared/ui/Button';
import { ReactComponent as IconStar } from '~/shared/assets/icons/icon-star.svg';
import { ReactComponent as IconArrow } from '~/shared/assets/icons/icon-arrow.svg';
import { Badge } from '~/shared/ui/Badge';
import Link from 'next/link';

// FIXME: temp solution for tags

export interface Tags {
  label: string;
  color: string;
}

export interface VacancyCardProps {
  vacancyId: string;
  title: string;
  isFavorited: boolean;
  tags: Array<Tags>;
  description: string;
  company: {
    imgUrl: string | null;
    title: string;
  };
  salary: number;
  wrapperClassName?: string;
}

const parseSalary = (salary: number) => {
  const thousands = Math.floor(salary / 1000).toString();
  const hundreds = (salary % 1000).toString().padStart(3, '0');
  return `${thousands}.${hundreds} ${CONSTANTS.card.currencyChar}`;
};

export const VacancyCard: React.FC<VacancyCardProps> = (props) => {
  const {
    vacancyId,
    title,
    isFavorited: initialIsFavoritedState,
    tags,
    description,
    company,
    salary: numberSalary,
    wrapperClassName,
  } = props;
  const salary = parseSalary(numberSalary);

  const [isFavorited, setIsFavorited] = useState(initialIsFavoritedState);

  const handleIsFavorited = () => {
    // FIXME: add internship to favorited later
    setIsFavorited(!isFavorited);
  };

  return (
    <Link
      href={`/vacancies/${vacancyId}`}
      className={cn(
        'card group w-full border-2 bg-mantle transition-colors',
        wrapperClassName,
      )}
    >
      <div className={'flex w-full flex-col items-start'}>
        <div
          className={'group flex w-full flex-row items-center justify-between'}
        >
          <p className={'text-14 font-500 leading-6 text-text'}>{title}</p>
          <Button
            buttonView={ButtonView.SMALL}
            className={
              'group/favorite h-6 w-6 !px-1.5 opacity-0 duration-300 hover:bg-mantle group-hover:opacity-100'
            }
            onClick={handleIsFavorited}
          >
            <IconStar
              className={cn(
                'absolute',
                isFavorited
                  ? 'fill-yellow stroke-none'
                  : 'fill-none stroke-text group-hover/favorite:stroke-base',
              )}
            />
          </Button>
        </div>
        <p className={'fot-400 text-14 leading-5 text-text'}>{salary}</p>
      </div>
      <div className={'relative h-full w-full'}>
        {/* FIXME: temp solution for display valid count of tags */}
        <div
          className={
            'flex max-h-card-tags flex-wrap gap-1 overflow-hidden opacity-100 transition-all duration-300 group-hover:opacity-0'
          }
        >
          {tags.map((tag) => (
            <Badge
              key={tag.label.trim()}
              placeholder={tag.label}
              className={cn('h-5 text-base', `${tag.color}`)}
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
        <Button
          buttonView={ButtonView.SMALL}
          className={
            'bg-mauve text-base opacity-0 transition-all duration-300 hover:bg-text group-hover:opacity-100'
          }
        >
          <IconArrow className={'fill-base'} />
          <p className={'text-12 font-500 leading-6'}>{CONSTANTS.card.apply}</p>
        </Button>
      </div>
    </Link>
  );
};
