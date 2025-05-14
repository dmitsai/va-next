export const salaryType = {
    fromTo: 'указать "от" и "до"',
    onlyFrom: 'указать только "от"',
    notSpecified: 'по договоренности',
} as const;

export type SalaryType = (typeof salaryType)[keyof typeof salaryType];
export type SalaryKeys = keyof typeof salaryType;

export type Salary = { name: SalaryKeys; displayValue: SalaryType };
export type Salaries = Array<Salary>;

export const salaries: Salaries = Object.entries(salaryType).map(
    ([key, value]) => ({
        name: key as SalaryKeys,
        displayValue: value as SalaryType,
    })
);

export const displaySalariesState = salaries.map((type) => type.displayValue);
