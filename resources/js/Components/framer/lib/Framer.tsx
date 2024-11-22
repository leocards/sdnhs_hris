import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { ReactNode, useEffect, useState } from "react";

import { Tab } from "@/Components/framer/hooks/useTabs";
import { cn } from "../../../lib/utils";

const transition = {
    type: "miscellaneous",
    ease: "easeOut",
    duration: 0.15,
};

export type AlignNavigation = 'center' | 'left' | 'right'
type Props = {
    id: string
    selectedTabIndex: number;
    tabs: Tab[];
    setSelectedTab: (input: [number, number]) => void;
    alignNav?: AlignNavigation,
    navigate?: (route: string) => void
    expand?: boolean
    isAutoUpdate?: boolean
    initialTabId: string | null
    axis?: "horizontal" | "vertical"
    withActive?: boolean
    active?: string | null
    tabWidth?: string
};

export const Tabs = ({
    id,
    tabs,
    active,
    axis = "horizontal",
    alignNav = 'left',
    selectedTabIndex,
    setSelectedTab,
    navigate,
    withActive = true,
    expand = false,
    isAutoUpdate,
    initialTabId,
    tabWidth,
}: Props): JSX.Element => {
    const [hoveredTab, setHoveredTab] = useState<number | null>(null);

    useEffect(() => {
        if(isAutoUpdate) {
            const indexOfInitialTab = tabs.findIndex((tab) => tab.id === initialTabId)
            const [result, res] = [indexOfInitialTab, 0]
            setSelectedTab([result, res])
        }
    }, [initialTabId, active])

    return (
        <motion.nav
            className={cn(
                "flex flex-shrink-0 relative z-0 py-2 ignore",
                (alignNav === "left" ? "justify-start" : ""),
                (alignNav === "right" ? "justify-end" : ""),
                (alignNav === "center" ? "justify-center" : ""),
                (axis === "horizontal" ? "items-center" : "flex-col [&>button>span]:text-left")
            )}
            onHoverEnd={() => setHoveredTab(null)}
        >
            <LayoutGroup id={id}>
                {tabs.map((item, i) => {
                    return (
                        <motion.button
                            key={i}
                            className={cn(
                                "font-medium relative rounded-md flex items-center gap-3 p-2.5 text-secondary-foreground/60 dark:text-white/50 cursor-pointer select-none transition-colors group",
                                (hoveredTab === i || selectedTabIndex === i ? 'text-black dark:text-white/90 [#FCF3AB]' : !withActive && 'text-black/60'),
                                "ignore",
                                axis === "horizontal" && "justify-center",
                                (expand?"w-full":""),
                                tabWidth
                            )}
                            onHoverStart={() => setHoveredTab(i)}
                            onFocus={() => setHoveredTab(i)}
                            onClick={() => {
                                setSelectedTab([i, i > selectedTabIndex ? 1 : -1]);
                                navigate && navigate(item.id)
                            }}
                        >
                            {item.icon}
                            <span className="z-20 line-clamp-1">{item.label}</span>
                            {i === selectedTabIndex && withActive ? (
                                <motion.div
                                    transition={transition}
                                    layoutId="underline"
                                    className={cn(
                                        "absolute z-30 rounded-full bg-black dark:bg-white/50 white/50",
                                        axis === "horizontal" ? "h-[3px] w-full -bottom-[7px]" : "h-[75%] w-1 -left-[15px]"
                                    )}
                                />
                            ) : null}
                            <AnimatePresence>
                                {i === hoveredTab ? (
                                    <motion.div
                                        className={cn("absolute h-full bottom-0 left-0 right-0 top-0 z-10 rounded-md bg-black/10 dark:bg-white/10 dark:!shadow-highlight", tabWidth)}
                                        initial={{
                                            opacity: 0
                                        }}
                                        animate={{
                                            opacity: 1
                                        }}
                                        exit={{
                                            opacity: 0,
                                        }}
                                        transition={transition}
                                        layoutId="hover"
                                    />
                                ) : null}
                            </AnimatePresence>
                        </motion.button>
                    );
                })}
            </LayoutGroup>
        </motion.nav >
    );
};

const Content = ({
    children,
    className,
    selectedTabIndex,
    direction,
}: {
    direction: number;
    selectedTabIndex: number;
    children: ReactNode;
    className?: string;
}): JSX.Element => {
    return (
        <AnimatePresence exitBeforeEnter={false} custom={direction}>
            <motion.div
                key={selectedTabIndex}
                variants={{
                    enter: (direction) => ({
                        opacity: 1,
                        x: direction > 0 ? 100 : -100,
                    }),
                    center: { opacity: 1, x: 0, rotate: 0 },
                    exit: (direction) => ({
                        opacity: 0,
                        x: direction > 1 ? -100 : 100,
                        position: "absolute",
                        zIndex: -1
                    }),
                }}
                transition={{ duration: 0.15 }}
                initial={"enter"}
                animate={"center"}
                exit={"exit"}
                custom={direction}
                className={cn("w-full", className)}
            >
                {children}
            </motion.div>
        </AnimatePresence>
    );
};

export const FramerLayout = { Tabs, Content };
