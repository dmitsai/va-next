import { OptionalString } from '~/shared/lib/types';

export interface CandidatePersonalInfoProps {
    firstName: OptionalString;
    lastName: OptionalString;
    patronymic: OptionalString;
    imgUrl: OptionalString;
    userId: string;
}
