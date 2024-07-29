import { useState, PropsWithChildren, ReactNode, useEffect } from "react";
import {
    ChevronUp,
    Home,
    LogOut,
    MessageCircle,
    Search,
    Settings,
    UserRound,
    UsersRound,
    ClipboardPaste,
    FilePieChart,
    Bell,
    FolderKanban,
    Menu,
    X,
} from "lucide-react";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import { Scrollbars } from "react-custom-scrollbars-2";
import Tabs from "@/Components/framer/Tabs";
import { User } from "@/types";
import { cn } from "@/lib/utils";
import { AvatarProfile } from "@/Components/ui/avatar";
import { router, usePage } from "@inertiajs/react";
import { Toaster } from "@/Components/ui/toaster";
import { useToast } from "@/Components/ui/use-toast";
import { createPortal } from "react-dom";
import { Button } from "@/Components/ui/button";
import { useDebouncedFunction } from "@/hooks/useDebounce";
import useWindowSize from "@/hooks/useWindowResize";
import NavigationModal from "@/Components/NavigationModal";

export default function Authenticated({
    user,
    header,
    children,
}: PropsWithChildren<{ user: User; header?: ReactNode }>) {
    const {
        props: { auth, message },
    } = usePage<any>();
    const [openNavigation, setOpenNavigation] = useState<boolean>(false);
    const { width } = useWindowSize();

    const { toast } = useToast();

    const [showScrollUp, setShowScrollUp] = useState<boolean>(false);

    const scrollToTop = () => {
        document.body.scrollTo({
            top: 0,
            behavior: "smooth",
        });
        setShowScrollUp(false);
    };

    const onScroll = useDebouncedFunction(() => {
        if (document.body.scrollTop >= 769) {
            setShowScrollUp(true);
        } else {
            setShowScrollUp(false);
        }
    }, 500);

    useEffect(() => {
        document.body.addEventListener("scroll", onScroll);

        return () => {
            document.removeEventListener("scroll", onScroll);
        };
    }, []);

    useEffect(() => {
        if (message) {
            toast({
                description: message?.toString(),
            });
        }
    }, [message]);

    return (
        <div className="relative isolate flex min-h-svh w-full bg-white max-lg:flex-col lg:bg-zinc-100 dark:bg-zinc-900 dark:lg:bg-zinc-950">
            {width > 1024 && (
                <Navigation
                    user={user}
                    openNavigation={openNavigation}
                    setOpenNavigation={setOpenNavigation}
                />
            )}

            <NavigationModal show={openNavigation} onClose={setOpenNavigation}>
                <Navigation
                    user={user}
                    openNavigation={openNavigation}
                    setOpenNavigation={setOpenNavigation}
                />
            </NavigationModal>

            <header className="flex items-center px-4 lg:hidden sticky top-0 bg-white z-50">
                <div className="py-2.5">
                    <span className="relative">
                        <Button
                            aria-label="Open navigation"
                            size="icon"
                            variant="ghost"
                            onClick={() => setOpenNavigation(true)}
                        >
                            <Menu className="size-5" />
                        </Button>
                    </span>
                </div>
                <div className="min-w-0 flex-1">
                    <nav className="flex flex-1 items-center gap-4 py-2.5">
                        <div aria-hidden="true" className="-ml-4 flex-1"></div>
                        <div className="flex items-center gap-3"></div>
                    </nav>
                </div>
            </header>

            <main className="flex flex-1 flex-col pb-2 lg:min-w-0 lg:pl-72 lg:pr-2 lg:pt-2">
                <div className="grow p-6 lg:rounded-lg lg:bg-white lg:p-10 lg:shadow-sm lg:ring-1 lg:ring-zinc-950/5 dark:lg:bg-zinc-900 dark:lg:ring-white/10">
                    <div className="mx-auto max-w-6xl">
                        <header className="">{header}</header>
                        {children}
                    </div>
                </div>
            </main>

            {createPortal(<Toaster />, document.body)}

            {showScrollUp && (
                <div className="fixed z-[100] bottom-4 right-5">
                    <Button size="icon" onClick={scrollToTop}>
                        <ChevronUp className="size-6" />
                    </Button>
                </div>
            )}
        </div>
    );
}

const Navigation: React.FC<{
    user: User;
    openNavigation: boolean;
    setOpenNavigation: (state: boolean) => void;
}> = ({ user, openNavigation, setOpenNavigation }) => {
    const { width } = useWindowSize();
    const [activeTab] = useState(window.location.pathname.split("/")[1]);
    const navigationTabs = [
        {
            id: "dashboard",
            label: "Dashboard",
            icon: <Home className="size-5" />,
        },
        {
            id: "staff",
            label: "Staffs",
            icon: <UsersRound className="size-5" />,
        },
        {
            id: "service-records",
            label: "Service records",
            icon: <FolderKanban className="size-5" />,
        },
        {
            id: "leave",
            label: "Leave",
            icon: <ClipboardPaste className="size-5" />,
        },
        {
            id: "reports",
            label: "Reports",
            icon: <FilePieChart className="size-5" />,
        },
    ];

    const roles = {
        HR: [
            "dashboard",
            "staff",
            "leave",
            "reports",
            "general-search",
            "notification",
            "messages",
        ],
        HOD: ["dashboard", "staff", "leave", "notification", "messages"],
        Teaching: [
            "dashboard",
            "service-records",
            "leave",
            "notification",
            "messages",
        ],
        "Non-Teaching": [
            "dashboard",
            "service-records",
            "leave",
            "notification",
            "messages",
        ],
    }[user.role];

    const navigateToTab = (nav: string) => {
        router.get(route(nav));
    };

    useEffect(() => {
        if (width > 1024) {
            setOpenNavigation(false);
        }
    }, [width]);
    return (
        <div
            className={cn(
                "lg:fixed inset-y-0 left-0 w-72 overflow-hidden max-lg:rounded-lg max-lg:ring-1 max-lg:ring-ring/5"
            )}
        >
            <nav
                className={cn(
                    "h-screen w-72 max-lg:bg-white grid grid-rows-[auto,auto,auto,1fr,auto] lg:grid-rows-[auto,auto,1fr,auto]",
                    "max-lg:h-[calc(100vh-1rem)]"
                )}
            >
                <div className="p-2 h-fit max-lg:block hidden">
                    <Button
                        size="icon"
                        variant="secondary"
                        onClick={() => setOpenNavigation(false)}
                    >
                        <X className="size-5" />
                    </Button>
                </div>

                <div className="flex items-center px-4 max-lg:h-fit">
                    <img
                        src="/storage/assets/sdnhs-logo.png"
                        alt="sdnhs logo"
                        className="size-12"
                    />
                    <div className="p-4 font-bold text-xl flex items-center gap-3">
                        SDNHS HRIS
                    </div>
                </div>

                <div className="p-4 pt-0 border-b">
                    <Tabs
                        id="general-nav"
                        active={activeTab}
                        axis={"vertical"}
                        navigate={navigateToTab}
                        isAutoUpdate
                        tabs={[
                            {
                                id: "general-search",
                                label: "Search",
                                icon: <Search className="size-5" />,
                            },
                            {
                                id: "notification",
                                label: "Notification",
                                icon: <Bell className="size-5" />,
                            },
                            {
                                id: "messages",
                                label: "Messages",
                                icon: <MessageCircle className="size-5" />,
                            },
                        ].filter(({ id }) => roles?.includes(id))}
                    />
                </div>

                <Scrollbars>
                    <div className="p-4 space-y-2">
                        <Tabs
                            id="navigation"
                            active={activeTab}
                            axis={"vertical"}
                            navigate={navigateToTab}
                            isAutoUpdate
                            tabs={navigationTabs.filter(({ id }) =>
                                roles?.includes(id)
                            )}
                        />
                    </div>
                </Scrollbars>

                <div className="py-4 px-2 border-t relative max-lg:hidden">
                    <Popover className="group">
                        <PopoverButton
                            className={cn(
                                "grid grid-cols-[auto,1fr,auto] items-center p-2 w-full rounded-md gap-2 relative focus:outline-none",
                                "transition duration-150 [&>*]:z-10",
                                "before:w-full before:h-full before:absolute before:left-0 before:rounded-[inherit] before:bg-zinc-200",
                                "before:scale-[.45] before:hover:scale-100 before:trasition before:duration-200 before:opacity-0 before:hover:opacity-100",
                                "group-data-[open]:before:scale-100 group-data-[open]:before:opacity-100"
                            )}
                        >
                            <AvatarProfile />
                            <div className="text-left font-medium">
                                <div className="line-clamp-1">{`${user.first_name} ${user.last_name}`}</div>
                                <div className="text-xs line-clamp-1 opacity-75">
                                    {user.email}
                                </div>
                            </div>
                            <div className="shrink-0">
                                <ChevronUp className="size-4" />
                            </div>
                        </PopoverButton>
                        <PopoverPanel
                            anchor="top"
                            className="border w-64 rounded-lg bg-background [--anchor-gap:var(--spacing-5)] z-30 shadow-md dark:shadow-3xl min-w-[11rem] -mt-2"
                        >
                            <ul className="p-1 [&>li]:flex [&>li]:items-center [&>li]:gap-4 [&>li]:pl-3 [&>li]:py-2 [&>li]:cursor-default [&>li]:rounded-md space-y-1">
                                <li
                                    className="hover:bg-primary hover:text-primary-foreground"
                                    onClick={() =>
                                        router.get(route("profile.edit"))
                                    }
                                >
                                    <UserRound className="size-5" /> My account
                                </li>
                                <li
                                    className="hover:bg-primary hover:text-primary-foreground"
                                    onClick={() =>
                                        router.get(route("profile.settings"))
                                    }
                                >
                                    <Settings className="size-5" /> Settings
                                </li>
                                <hr />
                                <li
                                    className="hover:bg-primary hover:text-primary-foreground"
                                    onClick={() => router.post(route("logout"))}
                                >
                                    <LogOut className="size-5" /> Sign out
                                </li>
                            </ul>
                        </PopoverPanel>
                    </Popover>
                </div>
            </nav>
        </div>
    );
};
