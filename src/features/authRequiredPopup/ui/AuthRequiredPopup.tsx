'use client';

import { Popup } from '~/shared/ui/Popup';
import { LinkButton, LinkView } from '~/shared/ui/Button/LinkButtton';
import cn from 'classnames';

export interface AuthRequiredPopupProps {
    isOpen: boolean;
    setIsOpen: (value: boolean) => void;
    callbackUrl?: string;
}

export const AuthRequiredPopup = ({
    isOpen,
    setIsOpen,
    callbackUrl,
}: AuthRequiredPopupProps) => {
    const callback = callbackUrl ? `?callbackUrl=${encodeURIComponent(callbackUrl)}` : '';

    return (
        <Popup
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            title="Войдите в аккаунт"
            panelClassName="max-w-[480px]"
        >
            <div className="flex flex-col gap-y-6 text-left">
                <p className="text-14 leading-6 text-sub">
                    Чтобы откликнуться на вакансию или добавить её в избранное,
                    войдите или зарегистрируйтесь.
                </p>
                <div className="flex flex-row justify-end gap-x-2">
                    <LinkButton
                        href={`/user/auth${callback}`}
                        linkView={LinkView.SMALL}
                        className={cn(
                            'muted bg-mantle hover:bg-text hover:text-base'
                        )}
                        onClick={() => setIsOpen(false)}
                    >
                        Регистрация
                    </LinkButton>
                    <LinkButton
                        href={`/user/login${callback}`}
                        linkView={LinkView.SMALL}
                        className={cn(
                            'muted bg-mauve text-base hover:bg-text hover:text-base'
                        )}
                        onClick={() => setIsOpen(false)}
                    >
                        Войти
                    </LinkButton>
                </div>
            </div>
        </Popup>
    );
};
