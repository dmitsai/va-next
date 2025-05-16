// TODO: fix after connect profile w backend
import React from 'react';
import { OptionalString } from '~/shared/lib/types';

export interface ResumeTabProps {
    pdfUrl: OptionalString;
}
export const ResumeTab: React.FC<ResumeTabProps> = ({ pdfUrl }) => {
    const h = 'РЕЗЮМЕ';
    return <div className={'h-full w-full'}>{h}</div>;
};
