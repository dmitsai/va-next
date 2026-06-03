import { Divider, dividerView } from '~/entities/divider';
import { SalaryCurrency } from '~/entities/preferences';
import { ProfileBio } from '~/widgets/profileBio';
import { ResumeWidget } from '~/widgets/resumeWidget';
import { ProfilePreferences } from '~/widgets/profilePreferences';
import { ProfileAboutMe } from '~/widgets/profileAboutMe';
import { createSSRHelpers } from 'trpc/helpers';
import { headers } from 'next/headers';
import { ProfileBioProps } from '~/entities/profileBio/model/type';
import { AboutMeProps } from '~/entities/aboutMe';
import { ProfileTipFlow } from '~/widgets/profileTipFlow';
import { ApplicationsWidget } from '~/widgets/applicationsWidget';
import { FavoritesWidget } from '~/widgets/favoritesWidget';

const ProfilePage = async () => {
    const helpers = await createSSRHelpers(headers());

    const [profile, resumes] = await Promise.all([
        helpers.clientProfile.getProfile.fetch(),
        helpers.resume.getList.fetch(),
    ]);

    if (!profile) {
        return (
            <div>
                <p>Профиля нет</p>
            </div>
        );
    }

    const bio: {
        bio: ProfileBioProps;
    } = {
        bio: {
            type: 'CLIENT',
            data: {
                firstName: profile.name,
                lastName: profile.surname,
                patronymic: profile.patronymic,
                telegram: profile.telegram,
                phoneNumber: profile.phone,
                email: profile.email,
            },
        },
    };

    const description: {
        discription: AboutMeProps;
    } = {
        discription: {
            type: 'CLIENT',
            data: { description: profile.about_me },
        },
    };

    return (
        <main className={'flex min-h-screen w-full flex-grow flex-col bg-base'}>
            <ProfileTipFlow
                hasAboutMe={!!profile.about_me}
                hasPreferences={!!profile.preferences}
                hasResume={resumes.length > 0}
            />
            <Divider view={dividerView.horizontal} />
            <div className={'flex h-full w-full flex-row gap-x-8 px-8'}>
                <div
                    className={
                        'flex h-full w-2/5 flex-col gap-y-2 border-r-2 border-surface-tertiary pr-8 pt-4'
                    }
                >
                    <ProfileBio {...bio.bio} />
                    <Divider
                        view={dividerView.horizontal}
                        classname={'px-4 mb-1'}
                    />
                    <ProfileAboutMe {...description.discription} />
                    <Divider
                        view={dividerView.horizontal}
                        classname={'px-4 mb-1'}
                    />
                    <ProfilePreferences
                        employmentTypes={
                            profile.preferences?.employmentTypes ?? []
                        }
                        workSchedule={profile.preferences?.workSchedule ?? []}
                        salary={profile?.salaryFrom ?? ''}
                        salaryCurrency={
                            (profile?.currency?.char as SalaryCurrency) ?? '₽'
                        }
                    />
                </div>
                <div className={'flex w-full flex-col items-start gap-y-8 pt-4'}>
                    <ResumeWidget />
                    <Divider view={dividerView.horizontal} />
                    <ApplicationsWidget />
                    <Divider view={dividerView.horizontal} />
                    <FavoritesWidget />
                </div>
            </div>
        </main>
    );
};

export default ProfilePage;
