import React from 'react';
import { CandidatePersonalInfo } from '~/features/candidatePersonalInfo';
import { CandidateContacts } from '~/features/candidateContacts';
import { CandidateSpecInfo } from '~/features/candidateSpecInfo';
import { DetailedCandidateProps } from '../model/type';

export const DetailedCandidate: React.FC<DetailedCandidateProps> = (props) => {
    const {
        userId,
        firstName,
        lastName,
        patronymic,
        telegram,
        phone,
        email,
        aboutMe,
        imgUrl,
        pdfUrl,
    } = props;

    return (
        <div className={'flex flex-col gap-y-8'}>
            <CandidatePersonalInfo
                firstName={firstName}
                lastName={lastName}
                patronymic={patronymic}
                imgUrl={imgUrl}
                userId={userId}
            />
            <CandidateContacts
                email={email}
                telegram={telegram}
                phone={phone}
            />
            <CandidateSpecInfo aboutMe={aboutMe} pdfUrl={pdfUrl} />
        </div>
    );
};
