import { OptionalString } from "~/shared/lib/types";

export interface CompanyAboutMe {
 description: OptionalString,
}

export interface ClientAboutMe {
 description: OptionalString,
}

export type AboutMeProps =
    | {
          type: 'CLIENT';
          data: ClientAboutMe;
      }
    | {
          type: 'COMPANY';
          data: CompanyAboutMe;
      };
