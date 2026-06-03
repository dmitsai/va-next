import React from 'react';
import { ReactComponent as IconTelegram } from '~/shared/assets/icons/icon-telegram.svg';
import { ReactComponent as IconPhone } from '~/shared/assets/icons/icon-phone.svg';
import { ReactComponent as IconEmail } from '~/shared/assets/icons/icon-email.svg';
import { ProfileContact } from '~/entities/profileContact';
import { CandidateContactsProps } from '../model/type';

export const CandidateContacts: React.FC<CandidateContactsProps> = (props) => {
    const { telegram, email, phone } = props;

    return (
        <div className={'flex flex-col gap-y-2'}>
            {/* NOTE: temp solution,  rewrite after adding parse contacts logic */}
            {telegram && (
                <ProfileContact
                    placeholder={'Телеграм'}
                    url={''}
                    icon={IconTelegram}
                    value={telegram}
                />
            )}
            {phone && (
                <ProfileContact
                    placeholder={'Телефон'}
                    url={''}
                    icon={IconPhone}
                    value={phone}
                />
            )}
            {email && (
                <ProfileContact
                    placeholder={'Почта'}
                    url={''}
                    icon={IconEmail}
                    value={email}
                />
            )}
        </div>
    );
};
