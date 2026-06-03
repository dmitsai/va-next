import { OptionalString } from '~/shared/lib/types';
import { AttachedResume } from '~/widgets/detailedCandidate/model/type';

export interface CandidateSpecInfoProps {
    pdfUrl: OptionalString;
    aboutMe: OptionalString;
    attachedResume?: AttachedResume | null;
}
