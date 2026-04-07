import { useState } from 'react';
import { RESUME_TABS } from './data';

export const useResumeTabs = () => {
    const [activeTab, setActiveTab] = useState<string>(RESUME_TABS.basic.id);

    const handleTabClick = (tabId: string) => {
        setActiveTab(tabId);
    };

    return { activeTab, handleTabClick };
};
