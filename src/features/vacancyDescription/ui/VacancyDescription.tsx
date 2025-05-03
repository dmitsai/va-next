'use client';

import React, { useState } from 'react';
import { CONSTANTS } from '~/shared/lib/strings';
import Button, { ButtonView } from '~/shared/ui/Button';
import cn from 'classnames';

export interface VacancyDescriptionProps {
  description: string;
}

export const VacancyDescription: React.FC<VacancyDescriptionProps> = ({
  description,
}) => {
  const [isShowMore, setIsShowMore] = useState(false);

  return (
    <div
      className={cn('flex w-full flex-col gap-y-5 overflow-hidden text-text')}
    >
      <p
        className={cn(
          'whitespace-pre-line text-16 font-400',
          !isShowMore && 'line-clamp-[14]',
        )}
      >
        {description}
      </p>
      <Button
        onClick={() => {
          setIsShowMore(!isShowMore);
        }}
        buttonView={ButtonView.LARGE}
        className={
          'bg-mantle text-text transition-colors hover:bg-text hover:text-base'
        }
      >
        {isShowMore ? CONSTANTS.showButton.less : CONSTANTS.showButton.more}
      </Button>
    </div>
  );
};
