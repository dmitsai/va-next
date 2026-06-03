import React from 'react';
import Link from 'next/link';
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react';
import { CandidateSpecInfoProps } from '../model/type';
import { AboutMeTab } from './AboutMeTab';
import { ResumeTab } from './ResumeTab';
import { tabs } from '../model/data';

export const CandidateSpecInfo: React.FC<CandidateSpecInfoProps> = (props) => {
    const { pdfUrl, aboutMe, attachedResume } = props;

    return (
        <TabGroup as={'div'} className={'h-full w-full pb-20'}>
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
                    <TabPanel
                        key={tab.id}
                        className={
                            'flex flex-col items-center justify-center focus:outline-none'
                        }
                    >
                        {tab.id === 'aboutMe' && (
                            <AboutMeTab aboutMe={aboutMe} />
                        )}
                        {tab.id === 'resume' && (
                            <div className="flex w-full flex-col gap-y-4">
                                {attachedResume && (
                                    <div className="flex items-center justify-between rounded-8 border border-mauve/30 bg-mauve/10 px-4 py-3">
                                        <div className="flex flex-col gap-y-0.5">
                                            <p className="text-13 font-600 text-text">
                                                {attachedResume.desired_position?.trim() || attachedResume.title || 'Резюме на платформе'}
                                            </p>
                                            <p className="text-12 text-sub">Резюме создано на платформе</p>
                                        </div>
                                        <Link
                                            href={`/resume/analysis/${attachedResume.resume_id}`}
                                            className="rounded-6 bg-mauve px-3 py-1.5 text-12 font-500 text-base transition-colors hover:bg-text"
                                        >
                                            Открыть →
                                        </Link>
                                    </div>
                                )}
                                {pdfUrl && <ResumeTab pdfUrl={pdfUrl} />}
                                {!attachedResume && !pdfUrl && (
                                    <p className="text-14 text-sub-secondary/70">Резюме не прикреплено</p>
                                )}
                            </div>
                        )}
                    </TabPanel>
                ))}
            </TabPanels>
        </TabGroup>
    );
};
