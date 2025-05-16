import React from 'react';
import { CandidateSpecInfoProps } from '../model/type';

export const CandidateSpecInfo: React.FC<CandidateSpecInfoProps> = (props) => {
    const { pdfUrl, aboutMe } = props;

    return <div className="flex flex-col gap-y-2">{aboutMe}</div>;
};
