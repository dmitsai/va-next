type Tab = {
    id: 'vacancies' | 'pdfPreview';
    displayValue: string;
};

export const tabs: Tab[] = [
    {
        id: 'vacancies',
        displayValue: 'Вакансии',
    },
    {
        id: 'pdfPreview',
        displayValue: 'О компании',
    },
];
