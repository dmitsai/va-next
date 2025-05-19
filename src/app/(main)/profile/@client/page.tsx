import { Divider, dividerView } from "~/entities/divider";
import { employmentTypes, SalaryCurrency, salaryCurrency, workSchedule } from "~/entities/preferences";
import { ProfileBio } from "~/widgets/profileBio";
import { ProfileFileUploader } from "~/widgets/profileFileUploader";
import { ProfilePreferences, ProfilePreferencesProps } from "~/widgets/profilePreferences";
import { ProfileAboutMe } from "~/widgets/profileAboutMe";
import { createSSRHelpers } from "trpc/helpers";
import { headers } from "next/headers";
import { ProfileBioProps } from "~/entities/profileBio/model/type";
import { AboutMeProps } from "~/entities/aboutMe";


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

const ProfilePage = async () => {

    const helpers = await createSSRHelpers(headers())

    const profile = await helpers.clientProfile.getProfile.fetch()
    
    if (!profile){
        return(
            <div>
                <p>Профиля нет</p>
            </div>
        )
    }

     const bio : {
        bio: ProfileBioProps,
     } = {
        bio: {
            type : "CLIENT",
            data : {
                firstName : profile.name,
                lastName: profile.surname,
                patronymic: profile.patronymic,
                telegram: profile.telegram,
                phoneNumber: profile.phone,
                email: profile.email,
                }
            }
        }

    const description : {
        discription :  AboutMeProps
    } = {
        discription: {
            type : 'CLIENT',
            data : {description : profile.about_me}
        }
    }
    


    


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
            <div className={'flex flex-row gap-x-8 w-full h-full px-8'}>
                <div className={'flex flex-col gap-y-2 w-2/5 h-full pt-4 pr-8 border-r-2 border-surface-tertiary'}>
                    <ProfileBio {...bio.bio} />
                    <Divider view={dividerView.horizontal} classname={'px-4 mb-1'} />
                    <ProfileAboutMe {...description.discription} />
                    <Divider view={dividerView.horizontal} classname={'px-4 mb-1'} />
                    <ProfilePreferences employmentTypes={profile.preferences?.employmentTypes ?? []} workSchedule={profile.preferences?.workSchedule ?? []} salary={profile?.salaryFrom ?? ''} salaryCurrency={profile?.currency?.char as SalaryCurrency ?? '₽'} />
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
