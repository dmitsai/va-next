import React from "react";
import { CONSTANTS } from "~/shared/lib/strings";
import Badge from "~/shared/ui/Badge";


interface VacancyListProps {
    resumeLabel?: string,
}


export const VacancyList: React.FC<VacancyListProps> = (props) => {
    const { resumeLabel } = props;
    return (
        <div className={'flex flex-col gap-y-10'}>
            {resumeLabel ?
                <span className={'text-text text-18'}>
                    {CONSTANTS.home.vacancies.placeholder.authecated}
                    <Badge className={'bg-mantle text-text text-14'} placeholder={resumeLabel} />
                </span>
                :
                <span className={'text-text text-14'}>
                    {CONSTANTS.home.vacancies.placeholder.unauthecated}
                </span>
            }
        </div>
    )
}