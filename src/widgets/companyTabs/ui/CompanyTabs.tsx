import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react';
import { CompanyVacancyList } from '~/widgets/companyVacancyList';
import { ProfileFileUploader } from '~/widgets/profileFileUploader';
import React from 'react';
import cn from 'classnames';
import { tabs } from '../model/data';

export const CompanyTabs: React.FC<{ companyId: string }> = ({ companyId }) => (
    <TabGroup
        as={'div'}
        className={'flex h-full w-full flex-col items-center gap-y-10 pt-10'}
    >
        <TabList
            className={
                'relative flex h-10 w-full max-w-card flex-row items-center justify-center gap-x-4 rounded-16 bg-mantle px-4 py-6'
            }
        >
            {tabs.map((tab) => (
                <Tab
                    className={
                        'w-1/2 rounded-16 bg-mantle px-4 py-2 text-text focus:outline-none data-[selected]:bg-mauve data-[selected]:text-base'
                    }
                >
                    {tab.displayValue}
                </Tab>
            ))}
        </TabList>
        <TabPanels className={'h-full w-full'}>
            {tabs.map((tab) => (
                <TabPanel key={tab.id} className={'h-full w-full'}>
                    {tab.id === 'vacancies' && (
                        <CompanyVacancyList companyId={companyId} />
                    )}

                    {tab.id === 'pdfPreview' && (
                        <div className="h-full w-full">
                            <ProfileFileUploader />
                        </div>
                    )}
                </TabPanel>
            ))}
        </TabPanels>
    </TabGroup>
);
