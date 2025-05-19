'use client';

import { Divider, dividerView } from '~/entities/divider';
import {
    employmentTypes,
    salaryCurrency,
    workSchedule,
} from '~/entities/preferences';
import { ProfileBio, ProfileBioProps } from '~/widgets/profileBio';
import { ProfileFileUploader } from '~/widgets/profileFileUploader';
import {
    ProfilePreferences,
    ProfilePreferencesProps,
} from '~/widgets/profilePreferences';
import { ProfileAboutMe, ProfileAboutMeProps } from '~/widgets/profileAboutMe';
import { ProfileTipFlow } from '~/widgets/profileTipFlow';
import { useEffect } from 'react';

// NOTE: temp data for profile page
const temp: {
    bio: ProfileBioProps;
    preferences: ProfilePreferencesProps;
    description: ProfileAboutMeProps;
} = {
    bio: {
        type: 'CLIENT',
        data: {
            firstName: 'Иван',
            lastName: 'Иванов',
            patronymic: 'Иванович',
            telegram: '@ivanIvan',
            phoneNumber: '+79998887766',
            email: 'ivan@gmail.com',
        },
    },
    preferences: {
        employmentTypes: [
            employmentTypes.full,
            employmentTypes.partTime,
            employmentTypes.internship,
        ],
        workSchedule: [
            workSchedule.flexible,
            workSchedule.fullday,
            workSchedule.remote,
            workSchedule.shift,
        ],
        salary: '100 000',
        salaryCurrency: salaryCurrency.ruble,
    },
    description: {
        type: 'CLIENT',
        data: {
            description:
                'Стремлюсь к постоянному профессиональному развитию в *ваша сфера* и ищу возможности для реализации своих навыков в динамичной и инновационной компании. Обладаю высоким уровнем коммуникабельности, аналитическим мышлением и способностью эффективно работать в команде. В прошлом достиг заметных результатов, например *ваше достижение*. Готов к новым вызовам и нестандартным задачам.',
        },
    },
};

const ProfilePage = () => {
    const userData = temp;
    return (
        <main className={'flex min-h-screen w-full flex-grow flex-col bg-base'}>
            <ProfileTipFlow
                hasAboutMe={false}
                hasPreferences={false}
                hasResume={false}
            />
            <Divider view={dividerView.horizontal} />
            <div className={'flex h-full w-full flex-row gap-x-8 px-8'}>
                <div
                    className={
                        'flex h-full w-2/5 flex-col gap-y-2 border-r-2 border-surface-tertiary pr-8 pt-4'
                    }
                >
                    <ProfileBio {...userData.bio} />
                    <Divider
                        view={dividerView.horizontal}
                        classname={'px-4 mb-1'}
                    />
                    <ProfileAboutMe {...userData.description} />
                    <Divider
                        view={dividerView.horizontal}
                        classname={'px-4 mb-1'}
                    />
                    <ProfilePreferences {...userData.preferences} />
                </div>
                <div
                    className={
                        'flex w-full flex-col items-center justify-center'
                    }
                >
                    <ProfileFileUploader />
                </div>
            </div>
        </main>
    );
};

export default ProfilePage;
