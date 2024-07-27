import { Tab, useTabs } from '@/Components/framer/hooks/useTabs';
import { AlignNavigation, FramerLayout } from "./lib/Framer";
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface TabsProps {
    id: string
    tabs: Tab[]
    className?: string
    position?: AlignNavigation
    active: string | null
    expand?: boolean
    navigate?: (route: string) => void
    children?: React.ReactNode
    contentClass?: string
    isAutoUpdate?: boolean
    axis?: "horizontal" | "vertical"
    withActive?: boolean
}

const Tabs = ({ id, tabs, axis = "horizontal", withActive = true, className, position = 'left', navigate, active = '', expand = false, children, contentClass = '', isAutoUpdate }: TabsProps) => {
    const [hookProps, setHookProps] = useState({
        tabs: tabs,
        initialTabId: active,
    });
    const framer = useTabs(hookProps);

    useEffect(() => {
        setHookProps({
            tabs: tabs,
            initialTabId: active,
        })
    }, [tabs, active])
    
    return (
        <>
            <div className={className}>
                <FramerLayout.Tabs id={id} axis={axis} active={active} withActive={withActive} expand={expand} navigate={navigate} alignNav={position} {...framer.tabProps} isAutoUpdate={isAutoUpdate} initialTabId={active} />
            </div>
            {children && <div className="grow overflow-y-auto overflow-x-hidden transparent-scrollbar">
                <FramerLayout.Content 
                    {...framer.contentProps}
                    className={cn("ignore", contentClass)}
                >
                    {children}
                </FramerLayout.Content>
            </div>}
        </>
    );
};


export default Tabs;