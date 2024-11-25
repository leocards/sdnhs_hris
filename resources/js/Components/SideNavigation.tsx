import {
    Sidebar,
    SidebarContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
    SidebarSeparator,
    useSidebar,
} from "@/Components/ui/sidebar";

import sdnhslogo from "@/assets/sdnhs-logo.png";
import {
    ChevronRight,
    ClipboardList,
    ClipboardPaste,
    FilePieChart,
    FileText,
    FolderKanban,
    Home,
    ListCheck,
    ReceiptText,
    Search,
    UserCheck,
    UserRound,
    UserRoundCheck,
    UsersRound,
} from "lucide-react";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "./ui/collapsible";
import { Fragment, useState } from "react";
import { router, usePage } from "@inertiajs/react";
import { ROLES } from "@/types";
import { cn } from "@/lib/utils";
import { ToggleSideBarButton } from "@/Layouts/AuthenticatedLayout";

type Props = {
    role: ROLES;
};

const SideNavigation: React.FC<Props> = ({ role }) => {
    const [activeTab] = useState(window.location.pathname.split("/")[1]);
    const { url } = usePage();
    const queryParams = new URL(window.location.href).searchParams;
    const personnel = queryParams.get("personnel");

    const {
        state,
        isMobile,
        toggleSidebar,
    } = useSidebar();

    const navigateToTab = (nav: string, _query?: Record<string, unknown>) => {
        router.get(
            route(nav, {
                _query,
            })
        );
    };

    return (
        <Sidebar className={cn(state == "expanded" && "bg-background")} collapsible="icon" variant={isMobile ? "floating" : state !== "expanded" ? "floating" : "sidebar"}>
            {isMobile && <ToggleSideBarButton className="absolute -right-[3.215rem] top-2.5" />}

            <SidebarHeader className="mb-5">
                <SidebarMenu>
                    <SidebarMenuItem className={cn("flex items-center font-bold text-lg", state == "expanded" && "px-3")}>
                        <div className={cn("size-11 shrink-0", state == "collapsed" && "size-8")}>
                            <img src={sdnhslogo} />
                        </div>
                        <div className={cn("grow pl-8 text-nowrap overflow-x-hidden", state == "collapsed" && "hidden")}>SDNHS - HRIS</div>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent className={cn(state == "expanded" ? "px-3" : "px-2")}>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            onClick={() => navigateToTab("general-search")}
                            tooltip="General Search"
                            size={"md"}
                            isActive={activeTab == "general-search"}
                        >
                            <Search className={cn(state == "expanded" ? "!size-5" : "stroke-[2.7px]")} />
                            <span className="text-nowrap overflow-x-hidden">General search</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
                <SidebarSeparator />
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            onClick={() => navigateToTab("dashboard")}
                            tooltip="Dashboard"
                            size={"md"}
                            isActive={activeTab == "dashboard"}
                        >
                            <Home className={cn(state == "expanded" ? "!size-5" : "stroke-[2.7px]")} />
                            <span className="text-nowrap overflow-x-hidden">Dashboard</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>

                {(role === "HR" || role === "HOD") && (
                    <SidebarMenu>
                        <Collapsible
                            className="group/collapsible"
                            defaultOpen={url.startsWith("/personnel")}
                        >
                            <SidebarMenuItem>
                                <CollapsibleTrigger asChild>
                                    <SidebarMenuButton
                                        tooltip="Personnel"
                                        size={"md"}
                                        className="group"
                                        isActive={url.startsWith("/personnel")}
                                        onClick={() => {
                                            if(state == "collapsed") {
                                                toggleSidebar()
                                            }
                                        }}
                                    >
                                        <UsersRound className={cn(state == "expanded" ? "!size-5" : "stroke-[2.7px]")} />
                                        <span className="text-nowrap overflow-x-hidden">Personnel</span>

                                        <ChevronRight className="ml-auto group-data-[state=open]:rotate-90 transition-all duration-150 ease-in-out" />
                                    </SidebarMenuButton>
                                </CollapsibleTrigger>
                                <CollapsibleContent>
                                    <SidebarMenuSub>
                                        <SidebarMenuSubItem>
                                            <SidebarMenuSubButton
                                                onClick={() =>
                                                    navigateToTab("personnel", {
                                                        personnel: "teaching",
                                                    })
                                                }
                                                size="lg"
                                                className="cursor-pointer select-none"
                                                isActive={
                                                    personnel === "teaching"
                                                }
                                            >
                                                <UserRound className="!size-[1.15rem]" />
                                                <span>Teaching</span>
                                            </SidebarMenuSubButton>
                                        </SidebarMenuSubItem>
                                        <SidebarMenuSubItem>
                                            <SidebarMenuSubButton
                                                onClick={() =>
                                                    navigateToTab("personnel", {
                                                        personnel:
                                                            "non-teaching",
                                                    })
                                                }
                                                size="lg"
                                                className="cursor-pointer select-none"
                                                isActive={
                                                    personnel === "non-teaching"
                                                }
                                            >
                                                <UserRound className="!size-[1.15rem]" />
                                                <span>Non-teaching</span>
                                            </SidebarMenuSubButton>
                                        </SidebarMenuSubItem>
                                        {role === "HR" && (
                                            <SidebarMenuSubItem>
                                                <SidebarMenuSubButton
                                                    onClick={() =>
                                                        navigateToTab(
                                                            "personnel.tardiness"
                                                        )
                                                    }
                                                    size="lg"
                                                    className="cursor-pointer select-none"
                                                    isActive={url.startsWith(
                                                        "/personnel/tardiness"
                                                    )}
                                                >
                                                    <UserRoundCheck className="!size-[1.15rem]" />
                                                    <span>Tardiness</span>
                                                </SidebarMenuSubButton>
                                            </SidebarMenuSubItem>
                                        )}
                                    </SidebarMenuSub>
                                </CollapsibleContent>
                            </SidebarMenuItem>
                        </Collapsible>
                    </SidebarMenu>
                )}

                {(role === "HR" || role === "HOD") && (<SidebarMenu>
                    <Collapsible
                        className="group/collapsible"
                        defaultOpen={url.startsWith("/myapprovals")}
                    >
                        <SidebarMenuItem>
                            <CollapsibleTrigger asChild>
                                <SidebarMenuButton
                                    tooltip="My Approvals"
                                    size={"md"}
                                    className="group"
                                    isActive={url.startsWith("/myapprovals")}
                                    onClick={() => {
                                        if(state == "collapsed") {
                                            toggleSidebar()
                                        }
                                    }}
                                >
                                    <ListCheck className={cn(state == "expanded" ? "!size-5" : "stroke-[2.7px]")} />
                                    <span className="text-nowrap overflow-x-hidden">My Approvals</span>

                                    <ChevronRight className="ml-auto group-data-[state=open]:rotate-90 transition-all duration-150 ease-in-out" />
                                </SidebarMenuButton>
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                                <SidebarMenuSub>
                                    <SidebarMenuSubItem>
                                        <SidebarMenuSubButton
                                            onClick={() =>
                                                navigateToTab(
                                                    "myapprovals.leave"
                                                )
                                            }
                                            size="lg"
                                            className="cursor-pointer select-none"
                                            isActive={
                                                url.startsWith(
                                                    "/myapprovals/leave"
                                                ) &&
                                                !(
                                                    url ===
                                                    "/myapprovals/leave/apply-for-leave"
                                                )
                                            }
                                        >
                                            <ClipboardPaste className="!size-[1.15rem]" />
                                            <span>Leave</span>
                                        </SidebarMenuSubButton>
                                    </SidebarMenuSubItem>
                                    {role === "HR" && (
                                        <>
                                            <SidebarMenuSubItem>
                                                <SidebarMenuSubButton
                                                    onClick={() =>
                                                        navigateToTab(
                                                            "myapprovals.pds"
                                                        )
                                                    }
                                                    size="lg"
                                                    className="cursor-pointer select-none"
                                                    isActive={url.startsWith(
                                                        "/myapprovals/pds"
                                                    )}
                                                >
                                                    <FileText className="!size-[1.15rem]" />
                                                    <span>PDS</span>
                                                </SidebarMenuSubButton>
                                            </SidebarMenuSubItem>
                                            <SidebarMenuSubItem>
                                                <SidebarMenuSubButton
                                                    onClick={() =>
                                                        navigateToTab(
                                                            "myapprovals.saln"
                                                        )
                                                    }
                                                    size="lg"
                                                    className="cursor-pointer select-none"
                                                    isActive={url.startsWith(
                                                        "/myapprovals/saln"
                                                    )}
                                                >
                                                    <ReceiptText className="!size-[1.15rem]" />
                                                    <span>SALN</span>
                                                </SidebarMenuSubButton>
                                            </SidebarMenuSubItem>
                                            <SidebarMenuSubItem>
                                                <SidebarMenuSubButton
                                                    onClick={() =>
                                                        navigateToTab(
                                                            "myapprovals.service-records"
                                                        )
                                                    }
                                                    size="lg"
                                                    className="cursor-pointer select-none"
                                                    isActive={url.startsWith(
                                                        "/myapprovals/service-records"
                                                    )}
                                                >
                                                    <FolderKanban className="!size-[1.15rem]" />
                                                    <span>Service Records</span>
                                                </SidebarMenuSubButton>
                                            </SidebarMenuSubItem>
                                        </>
                                    )}
                                </SidebarMenuSub>
                            </CollapsibleContent>
                        </SidebarMenuItem>
                    </Collapsible>
                </SidebarMenu>)}

                {role === "HR" && (
                    <SidebarMenu>
                        <Collapsible
                            className="group/collapsible"
                            defaultOpen={url.startsWith("/myreports")}
                        >
                            <SidebarMenuItem>
                                <CollapsibleTrigger asChild>
                                    <SidebarMenuButton
                                        tooltip="My Reports"
                                        size={"md"}
                                        className="group"
                                        isActive={url.startsWith("/myreports")}
                                        onClick={() => {
                                            if(state == "collapsed") {
                                                toggleSidebar()
                                            }
                                        }}
                                    >
                                        <FilePieChart className={cn(state == "expanded" ? "!size-5" : "stroke-[2.7px]")} />
                                        <span className="text-nowrap overflow-x-hidden">My reports</span>

                                        <ChevronRight className="ml-auto group-data-[state=open]:rotate-90 transition-all duration-150 ease-in-out" />
                                    </SidebarMenuButton>
                                </CollapsibleTrigger>
                                <CollapsibleContent>
                                    <SidebarMenuSub>
                                        <SidebarMenuSubItem>
                                            <SidebarMenuSubButton
                                                onClick={() =>
                                                    navigateToTab(
                                                        "reports.personnel"
                                                    )
                                                }
                                                size="lg"
                                                className="cursor-pointer select-none"
                                                isActive={url.startsWith(
                                                    "/myreports/list-of-personnel"
                                                )}
                                            >
                                                <UsersRound className="!size-[1.15rem]" />
                                                <span>List of Personnel</span>
                                            </SidebarMenuSubButton>
                                        </SidebarMenuSubItem>
                                        <SidebarMenuSubItem>
                                            <SidebarMenuSubButton
                                                onClick={() =>
                                                    navigateToTab(
                                                        "reports.ipcr"
                                                    )
                                                }
                                                size="lg"
                                                className="cursor-pointer select-none"
                                                isActive={url.startsWith(
                                                    "/myreports/ipcr"
                                                )}
                                            >
                                                <ClipboardList className="!size-[1.15rem]" />
                                                <span>IPCR</span>
                                            </SidebarMenuSubButton>
                                        </SidebarMenuSubItem>
                                        <SidebarMenuSubItem>
                                            <SidebarMenuSubButton
                                                onClick={() =>
                                                    navigateToTab(
                                                        "reports.saln"
                                                    )
                                                }
                                                size="lg"
                                                className="cursor-pointer select-none"
                                                isActive={url.startsWith(
                                                    "/myreports/saln"
                                                )}
                                            >
                                                <ReceiptText className="!size-[1.15rem]" />
                                                <span>SALN</span>
                                            </SidebarMenuSubButton>
                                        </SidebarMenuSubItem>
                                    </SidebarMenuSub>
                                </CollapsibleContent>
                            </SidebarMenuItem>
                        </Collapsible>
                    </SidebarMenu>
                )}

                {role != "HR" && (
                    <Fragment>
                        {(role !== "HOD") ? (
                            <SidebarMenu>
                                <SidebarMenuItem>
                                    <SidebarMenuButton
                                        onClick={() => navigateToTab("leave")}
                                        tooltip="Leave"
                                        size={"md"}
                                        isActive={url.startsWith(
                                            "/leave"
                                        )}
                                    >
                                        <ClipboardPaste className={cn(state == "expanded" ? "!size-5" : "stroke-[2.7px]")} />
                                        <span className="text-nowrap overflow-x-hidden">Leave</span>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            </SidebarMenu>
                        ) : (
                            <SidebarMenu>
                                <SidebarMenuItem>
                                    <SidebarMenuButton
                                        onClick={() => navigateToTab("leave", { myleave: true })}
                                        tooltip="Leave"
                                        size={"md"}
                                        isActive={url.startsWith(
                                            "/leave"
                                        )}
                                    >
                                        <ClipboardPaste className={cn(state == "expanded" ? "!size-5" : "stroke-[2.7px]")} />
                                        <span className="text-nowrap overflow-x-hidden">My Leave</span>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            </SidebarMenu>
                        )}
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton
                                    onClick={() => navigateToTab("saln")}
                                    tooltip="SALN"
                                    size={"md"}
                                    isActive={url.startsWith(
                                        "/saln"
                                    )}
                                >
                                    <ReceiptText className={cn(state == "expanded" ? "!size-5" : "stroke-[2.7px]")} />
                                    <span className="text-nowrap overflow-x-hidden">SALN</span>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                        {(role != "HOD") && (
                            <Fragment>
                                <SidebarMenu>
                                    <SidebarMenuItem>
                                        <SidebarMenuButton
                                            onClick={() => navigateToTab("service-records")}
                                            tooltip="Service Records"
                                            size={"md"}
                                            isActive={url.startsWith(
                                                "/service-records"
                                            )}
                                        >
                                            <FolderKanban className={cn(state == "expanded" ? "!size-5" : "stroke-[2.7px]")} />
                                            <span className="text-nowrap overflow-x-hidden">Service Records</span>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                </SidebarMenu>
                                <SidebarMenu>
                                    <SidebarMenuItem>
                                        <SidebarMenuButton
                                            onClick={() => navigateToTab("tardiness")}
                                            tooltip="Service Records"
                                            size={"md"}
                                            isActive={url.startsWith(
                                                "/tardiness"
                                            )}
                                        >
                                            <UserCheck className={cn(state == "expanded" ? "!size-5" : "stroke-[2.7px]")} />
                                            <span className="text-nowrap overflow-x-hidden">Tardiness</span>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                </SidebarMenu>
                            </Fragment>
                        )}
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton
                                    onClick={() => navigateToTab("pds")}
                                    tooltip="Personal Data Sheet"
                                    size={"md"}
                                    isActive={activeTab == "pds"}
                                >
                                    <FileText className={cn(state == "expanded" ? "!size-5" : "stroke-[2.7px]")} />
                                    <span className="text-nowrap overflow-x-hidden">Personal Data Sheet</span>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </Fragment>
                )}
            </SidebarContent>
        </Sidebar>
    );
};

export default SideNavigation;
