'use client';

import { useMemo, useState } from 'react';
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react';
import { ResumeTab } from '../model/types';
import { SectionStatus } from './SectionStatus';
import { StatusBar } from './StatusBar';

interface ResumeProgressProps {
    tabs: ResumeTab[];
    defaultActiveTabId?: string;
}

export const ResumeProgress = ({
    tabs,
    defaultActiveTabId,
}: ResumeProgressProps) => {
    const fallbackId = tabs[0]?.id ?? '';

    const [activeTabId, setActiveTabId] = useState(() => {
        const id = defaultActiveTabId ?? fallbackId;
        return tabs.some((t) => t.id === id) ? id : fallbackId;
    });

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
            className="flex w-[400px] flex-col gap-y-2"
            selectedIndex={selectedIndex}
            onChange={(index) => {
                const id = tabs[index]?.id;
                if (id) setActiveTabId(id);
            }}
        >
            <p className="text-14 font-600 text-text">{'Разделы'}</p>
            <TabList className="flex flex-col gap-y-2 outline-none">
                {tabs.map((tab) => (
                    <Tab
                        key={tab.id}
                        className="group w-full rounded-8 text-left outline-none transition-colors"
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
            <StatusBar tabs={tabs} />
        </TabGroup>
    );
};
