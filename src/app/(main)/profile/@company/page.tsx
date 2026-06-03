import { Divider, dividerView } from '~/entities/divider';
import { ProfileBio } from '~/widgets/profileBio';
import { ProfileFileUploader } from '~/widgets/profileFileUploader';

import { ProfileAboutMe } from '~/widgets/profileAboutMe';
import { VacancyList } from '~/widgets/VacancyList';
import { CompanyVacancyList } from '~/widgets/companyVacancyList';
import { getServerSession } from '~/shared/lib/auth';
import { createSSRHelpers } from 'trpc/helpers';
import { headers } from 'next/headers';
import { CompanyTabs } from '~/widgets/companyTabs';
import { AboutMeProps } from '~/entities/aboutMe/model/type';
import { ProfileBioProps } from '~/entities/profileBio/model/type';

const CompanyProfilePage = async () => {
    const helpers = await createSSRHelpers(headers());
    const profile = await helpers.companyProfile.getProfile.fetch();

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
            type: 'COMPANY',
            data: {
                title: profile.title,
                email: profile.email,
                phoneNumber: profile.phone,
                website: profile.website,
            },
        },
    };

    const description: {
        discription: AboutMeProps;
    } = {
        discription: {
            type: 'COMPANY',
            data: { description: profile.description },
        },
    };

    return (
        <main className={'flex min-h-screen w-full flex-grow flex-col bg-base'}>
            <Divider view={dividerView.horizontal} />
            <div
                className={
                    'flex h-[calc(100vh-1px)] w-full flex-row gap-x-8 px-8'
                }
            >
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
                </div>
                <div className={'flex h-full w-full flex-col overflow-hidden'}>
                    <CompanyTabs companyId={profile.company_id} />
                </div>
            </div>
        </main>
    );
};

export default CompanyProfilePage;
