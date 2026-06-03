import { OptionalString } from '~/shared/lib/types';

export interface AttachedResume {
    resume_id: string;
    title: string | null;
    desired_position: string | null;
}

export interface DetailedCandidateProps {
    firstName: OptionalString;
    lastName: OptionalString;
    patronymic: OptionalString;
    telegram: OptionalString;
    phone: OptionalString;
    email: OptionalString;
    aboutMe: OptionalString;
    pdfUrl: OptionalString;
    imgUrl: OptionalString;
    userId: string;
    attachedResume?: AttachedResume | null;
}
