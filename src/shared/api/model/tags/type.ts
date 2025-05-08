import { education, employmentTypes, experience, workSchedule } from './data';

export type EmploymentTypes =
    (typeof employmentTypes)[keyof typeof employmentTypes];
export type EmploymentTypesKey = keyof typeof employmentTypes;

export type WorkSchedule = (typeof workSchedule)[keyof typeof workSchedule];
export type WorkScheduleKey = keyof typeof workSchedule;

export type Education = (typeof education)[keyof typeof education];
export type EducationKey = keyof typeof education;

export type Experience = (typeof experience)[keyof typeof experience];
export type ExperienceKey = keyof typeof experience;

export type Tags = {
    workSchedule?: WorkSchedule[];
    employmentTypes?: EmploymentTypes[];
    education?: Education[];
    experience?: Experience[];
};
