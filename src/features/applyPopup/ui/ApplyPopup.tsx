'use client';

import { Popup } from '~/shared/ui/Popup';
import { CONSTANTS } from '~/shared/lib/strings';
import cn from 'classnames';
import { LinkButton, LinkView } from '~/shared/ui/Button/LinkButtton';
import { ReactComponent as IconArrow } from '~/shared/assets/icons/icon-arrow.svg';

export interface ApplyPopupProps {
    isOpen: boolean;
    setIsOpen: (value: boolean) => void;
    vacancyTitle: string;
    sourceUrl: string | null;
    onApplyConfirm?: () => void;
}

export const ApplyPopup = (props: ApplyPopupProps) => {
    const { isOpen, setIsOpen, vacancyTitle, sourceUrl, onApplyConfirm } = props;

    const handleOpenSource = () => {
        setIsOpen(false);
        onApplyConfirm?.();
    };

    return (
        <Popup
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            title={`Вакансия: ${vacancyTitle}`}
            panelClassName={'max-w-[600px]'}
        >
            <div className={'flex w-full flex-col gap-y-20 text-left'}>
                <div className="flex flex-col gap-y-4">
                    <p className={'text-16 font-600 leading-6 text-text'}>
                        {'Отклик через сайт недоступен'}
                    </p>
                    <p className={'text-14 font-400 leading-6 text-sub'}>
                        {CONSTANTS.applyPopup.explanation}
                    </p>
                </div>
                {sourceUrl ? (
                    <div className={'flex w-full justify-end'}>
                        <LinkButton
                            href={sourceUrl}
                            linkView={LinkView.LARGE}
                            target={'_blank'}
                            rel={'noopener noreferrer'}
                            onClick={handleOpenSource}
                            className={cn(
                                'bg-mauve text-base transition-all hover:bg-text'
                            )}
                        >
                            <IconArrow className={'fill-base'} />
                            <p className={'text-12 font-500 leading-6'}>
                                {CONSTANTS.applyPopup.openVacancyLink}
                            </p>
                        </LinkButton>
                    </div>
                ) : null}
            </div>
        </Popup>
    );
};
