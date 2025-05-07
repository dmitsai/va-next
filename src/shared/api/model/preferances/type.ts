import { employmentTypes, workSchedule } from "./data"

export type EmploymentTypes = (typeof employmentTypes)[keyof typeof employmentTypes];

export type WorkSchedule = (typeof workSchedule)[keyof typeof workSchedule];