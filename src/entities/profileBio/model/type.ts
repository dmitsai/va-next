import { OptionalString } from "~/shared/lib/types";

export interface CompanyBio {
    title: OptionalString,
    email: OptionalString,
    phoneNumber: OptionalString,
    website: OptionalString
}

export interface ClientBio {
    firstName: OptionalString,
    lastName: OptionalString,
    patronymic?: OptionalString ,
    
    telegram?: OptionalString,
    phoneNumber?: OptionalString,
    email?: OptionalString,
}

export type ProfileBioProps =
    | {
          type: 'CLIENT';
          data: ClientBio;
      }
    | {
          type: 'COMPANY';
          data: CompanyBio;
      };
