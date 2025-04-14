import React from "react";
import { VacancyCard } from "~/features/vacancyCard";
import { CONSTANTS } from "~/shared/lib/strings";
import { Badge } from "~/shared/ui/Badge";
import Button, { ButtonView } from "~/shared/ui/Button";
import { vacancies } from "../model/data";


interface VacancyListProps {
    resumeLabel?: string,
}


export const VacancyList: React.FC<VacancyListProps> = (props) => {
    const { resumeLabel } = props;
    return (
        <div className={'flex flex-col h-full items-center justify-center'}>
            <div className={'grid grid-cols-3 xl:grid-cols-4 gap-5 h-full w-fit'}>
                {resumeLabel ?
                    <span className={'mb-5 col-span-3 xl:col-span-4 text-text text-18 w-full  flex flex-row items-center gap-x-4'}>
                        {CONSTANTS.home.vacancies.placeholder.authecated}
                        <Badge className={'bg-mantle text-text text-14 !rounded-6 px-4 py-2 !font-500'} placeholder={resumeLabel} />
                    </span>
                    :
                    <span className={'mb-5 col-span-3 xl:col-span-4 text-text text-18 w-full'}>
                        {CONSTANTS.home.vacancies.placeholder.unauthecated}
                    </span>
                }
                {
                    vacancies.map(vacancy => (
                        <VacancyCard key={vacancy.id} {...vacancy} />
                    ))
                }
                <Button buttonView={ButtonView.LARGE} className={'col-span-3 xl:col-span-4 mt-5 w-full bg-mantle text-text hover:bg-text hover:text-base text-14'}>{CONSTANTS.home.vacancies.viewAll}</Button>
            </div>
        </div>
    )
}