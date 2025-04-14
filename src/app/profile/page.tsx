import { Divider, dividerView } from "~/entities/divider";
import { employmentTypes, salaryCurrency, workSchedule } from "~/entities/preferences";
import { ProfileBio, ProfileBioProps } from "~/widgets/profileBio";
import { ProfileFileUploader } from "~/widgets/profileFileUploader";
import { ProfilePreferences, ProfilePreferencesProps } from "~/widgets/profilePreferences";
import { ProfileAboutMe } from "~/widgets/profileAboutMe";


// NOTE: temp data for profile page
const temp: {
    bio: ProfileBioProps,
    preferences: ProfilePreferencesProps,
    description: string,
} = {
    bio: {
        firstName: 'Иван',
        lastName: "Иванов",
        patronymic: 'Иванович',
        telegram: '@ivanIvan',
        phoneNumber: '+79998887766',
        email: 'ivan@gmail.com',
    },
    preferences: {
        employmentTypes: [employmentTypes.full, employmentTypes.partTime, employmentTypes.internship],
        workSchedule: [workSchedule.flexible, workSchedule.fullday, workSchedule.remote, workSchedule.shift],
        salary: '100 000',
        salaryCurrency: salaryCurrency.ruble,
    },
    description: "Стремлюсь к постоянному профессиональному развитию в *ваша сфера* и ищу возможности для реализации своих навыков в динамичной и инновационной компании. Обладаю высоким уровнем коммуникабельности, аналитическим мышлением и способностью эффективно работать в команде. В прошлом достиг заметных результатов, например *ваше достижение*. Готов к новым вызовам и нестандартным задачам.",
}

const ProfilePage = () => {
    const userData = temp;

    return (
        <main className={'flex w-full min-h-screen  flex-grow flex-col bg-base'}>
            <Divider view={dividerView.horizontal} />
            <div className={'flex flex-row gap-x-8 w-full h-full px-8'}>
                <div className={'flex flex-col gap-y-2 w-2/5 h-full pt-4 pr-8 border-r-2 border-surface-tertiary'}>
                    <ProfileBio {...userData.bio} />
                    <Divider view={dividerView.horizontal} classname={'px-4 mb-1'} />
                    <ProfileAboutMe description={userData.description} />
                    <Divider view={dividerView.horizontal} classname={'px-4 mb-1'} />
                    <ProfilePreferences {...userData.preferences} />
                </div>
                <div className={'flex flex-col justify-center items-center w-full'}>
                    <ProfileFileUploader />
                </div>
            </div>
        </main>
    )
};

export default ProfilePage;
