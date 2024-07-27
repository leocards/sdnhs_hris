import { useState } from "react";

export type Tab = { label: string; id: string; icon?: React.ReactNode};

export function useTabs({
    tabs,
    initialTabId,
    onChange,
}: {
    tabs: Tab[];
    initialTabId: string | null;
    onChange?: (id: string) => void;
}) {
    const [[selectedTabIndex, direction], setSelectedTab] = useState(() => {
        const indexOfInitialTab = tabs.findIndex((tab) => tab.id === initialTabId);
        return [indexOfInitialTab, 0];
    });

    return {
        tabProps: {
            tabs,
            selectedTabIndex,
            onChange,
            setSelectedTab,
            initialTabId,
        },
        selectedTab: tabs[selectedTabIndex],
        contentProps: {
            direction,
            selectedTabIndex,
        },
    };
}