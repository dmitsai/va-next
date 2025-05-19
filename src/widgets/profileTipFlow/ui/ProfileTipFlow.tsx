'use client';

import React, { useEffect } from 'react';
import { toast } from 'sonner';
import Toaster from '~/shared/ui/sonner';

export interface ProfileTipFlowProps {
    hasAboutMe: boolean;
    hasPreferences: boolean;
    hasResume: boolean;
}

export const ProfileTipFlow: React.FC<ProfileTipFlowProps> = (props) => {
    const { hasAboutMe, hasPreferences, hasResume } = props;
    const toastShownRef = React.useRef({
        bio: false,
        resume: false,
    });

    const triggerBio = () => {
        if (!toastShownRef.current.bio) {
            toastShownRef.current.bio = true;
            toast.info('Расскажите о себе!', {
                duration: 10000,
                description:
                    'Заполните информацию в профиле — это поможет работодателям узнать вас лучше. Укажите информацию о себе и выберите предпочтения по работе.',
                closeButton: true,
            });
        }
    };

    const triggerResume = () => {
        if (!toastShownRef.current.resume) {
            toastShownRef.current.resume = true;
            toast.info('Добавьте резюме', {
                duration: 10000,
                description:
                    'Ваше резюме увеличит шансы найти подходящую работу на 70%. Загрузите его прямо в профиле!',
                closeButton: true,
            });
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            if (!hasAboutMe && !hasPreferences) triggerBio();
            if (!hasResume) triggerResume();
        }, 100);

        return () => clearTimeout(timer);
    }, [hasAboutMe, hasPreferences, hasResume]); // Зависимости эффекта

    return <Toaster expand={false} />;
};
