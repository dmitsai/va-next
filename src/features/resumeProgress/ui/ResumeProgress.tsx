'use client';

import { useMemo } from 'react';
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react';
import { Divider } from '~/entities/divider';
import { ResumeTab } from '../model/types';
import { SectionStatus } from './SectionStatus';
import { StatusBar } from './StatusBar';

interface ResumeProgressProps {
    tabs: ResumeTab[];
    activeTabId: string;
    onTabChange: (tabId: string) => void;
}

export const ResumeProgress = ({
    tabs,
    activeTabId,
    onTabChange,
}: ResumeProgressProps) => {
    const selectedIndex = useMemo(() => {
        const i = tabs.findIndex((t) => t.id === activeTabId);
        return i === -1 ? 0 : i;
    }, [tabs, activeTabId]);

    if (tabs.length === 0) {
        return null;
    }

    return (
        <TabGroup
            as="div"
            className="flex w-full flex-col gap-y-10"
            selectedIndex={selectedIndex}
            onChange={(index) => {
                const id = tabs[index]?.id;
                if (id) onTabChange(id);
            }}
        >
            <div className="flex flex-col gap-y-4">
                <p className="px-5 text-14 text-surface">{'РАЗДЕЛЫ'}</p>
                <TabList className="flex flex-col outline-none">
                    {tabs.map((tab) => (
                        <Tab
                            key={tab.id}
                            className="group w-full text-left outline-none transition-colors"
                        >
                            <SectionStatus
                                {...tab}
                                isActive={activeTabId === tab.id}
                            />
                        </Tab>
                    ))}
                </TabList>
                <TabPanels className="hidden">
                    {tabs.map((tab) => (
                        <TabPanel key={tab.id}>
                            <span className="sr-only">{tab.title}</span>
                        </TabPanel>
                    ))}
                </TabPanels>
            </div>
            <Divider view={'horizontal'} />
            <StatusBar tabs={tabs} />
        </TabGroup>
    );
};
