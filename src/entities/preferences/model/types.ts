
import { employmentTypes, salaryCurrency, workSchedule } from "./strings"

export type EmploymentTypes = (typeof employmentTypes)[keyof typeof employmentTypes];

export type WorkSchedule = (typeof workSchedule)[keyof typeof workSchedule];

export type SalaryCurrency = (typeof salaryCurrency)[keyof typeof salaryCurrency];

export type EmploymentTypesKeys = keyof typeof employmentTypes

export type WorkScheduleKeys = keyof typeof workSchedule