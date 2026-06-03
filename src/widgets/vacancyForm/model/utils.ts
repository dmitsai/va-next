export const parseSalary = (salary: string) =>
    salary
        .split('')
        .filter((e) => e.trim().length)
        .join('');
