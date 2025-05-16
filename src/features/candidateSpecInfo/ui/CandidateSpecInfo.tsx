import React from 'react';
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react';
import { CandidateSpecInfoProps } from '../model/type';
import { AboutMeTab } from './AboutMeTab';
import { ResumeTab } from './ResumeTab';
import { tabs } from '../model/data';

export const CandidateSpecInfo: React.FC<CandidateSpecInfoProps> = (props) => {
    const { pdfUrl, aboutMe } = props;

    return (
        <TabGroup as={'div'} className={'w-full'}>
            <TabList
                className={
                    'flex w-full flex-row gap-x-8 border-b-2 border-surface-tertiary'
                }
            >
                {tabs.map((tab) => (
                    <Tab
                        className={
                            'border-b-4 border-base pb-2 text-text transition-colors focus:outline-none data-[selected]:border-mauve data-[selected]:text-mauve'
                        }
                        key={tab.id}
                    >
                        {tab.displayValue}
                    </Tab>
                ))}
            </TabList>
            <TabPanels className="mt-4">
                {tabs.map((tab) => (
                    <TabPanel key={tab.id}>
                        {tab.id === 'aboutMe' && (
                            <AboutMeTab aboutMe={aboutMe} />
                        )}
                        {tab.id === 'resume' && <ResumeTab pdfUrl={pdfUrl} />}
                    </TabPanel>
                ))}
            </TabPanels>
        </TabGroup>
    );
};
