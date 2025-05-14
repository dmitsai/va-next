import { Divider, dividerView } from '~/entities/divider';
import { ProfileBio, ProfileBioProps } from '~/widgets/profileBio';
import { ProfileFileUploader } from '~/widgets/profileFileUploader';
import { ProfileAboutMe, ProfileAboutMeProps } from '~/widgets/profileAboutMe';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';
import { VacancyList } from '~/widgets/VacancyList';
import { CompanyVacancyList } from '~/widgets/companyVacancyList';
import { getServerSession } from '~/shared/lib/auth';
import { createSSRHelpers } from 'trpc/helpers';
import { headers } from 'next/headers';

// NOTE: temp data for profile page
const temp: {
    bio: ProfileBioProps;
    description: ProfileAboutMeProps;
} = {
    bio: {
        type: 'COMPANY',
        data: {
            title: 'Тиньк',
            email: 'тиньк@mail.ru',
            phoneNumber: '+79994446611',
            website: 'tink',
        },
    },
    description: {
        type: 'COMPANY',
        data: {
            description:
                "Тинькофф — это российский финансовый сервис, который изначально был основан как онлайн-банк, но со временем превратился в крупную финтех-компанию с широким спектром услуг. Банк был основан в 2006 году под названием 'Тинькофф Кредитные Системы', а его создателем стал предприниматель Олег Тиньков, который в 2023 году продал свою долю.",
        },
    },
};

const CompanyProfilePage = async () => {
    const userData = temp;
    // const session = await getServerSession();
    const helpers = await createSSRHelpers(headers());
    const profile = await helpers.companyProfile.getProfile.fetch();
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
                    <ProfileBio {...userData.bio} />
                    <Divider
                        view={dividerView.horizontal}
                        classname={'px-4 mb-1'}
                    />
                    <ProfileAboutMe {...userData.description} />
                </div>
                <div className={'flex h-full w-full flex-col overflow-hidden'}>
                    <Tabs
                        defaultValue="vacancy"
                        className="flex h-full flex-col"
                    >
                        <div className="mt-3 flex justify-center">
                            <TabsList className="bg-mantle">
                                <TabsTrigger
                                    value="vacancy"
                                    className="w-56 data-[state=active]:bg-mauve data-[state=active]:text-base"
                                >
                                    Вакансии
                                </TabsTrigger>
                                <TabsTrigger
                                    value="description"
                                    className="w-56 data-[state=active]:bg-mauve data-[state=active]:text-base"
                                >
                                    О компании
                                </TabsTrigger>
                            </TabsList>
                        </div>
                        <TabsContent
                            value="vacancy"
                            className="flex-1 overflow-auto"
                        >
                            <CompanyVacancyList
                                companyId={profile.company_id}
                            />
                        </TabsContent>
                        <TabsContent value="description" className="flex-1">
                            <div className="h-full w-full">
                                <ProfileFileUploader />
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </main>
    );
};

export default CompanyProfilePage;
