import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";
import { PageProps } from "@/types";
import { AvatarProfile } from "@/Components/ui/avatar";
import {
    Menubar,
    MenubarMenu,
    MenubarTrigger,
    MenubarContent,
    MenubarItem,
} from "@/Components/ui/menubar";
import { EllipsisVertical, Eye, Trash2 } from "lucide-react";
import { Button } from "@/Components/ui/button";
import LeaveStatus from "@/Components/LeaveStatus";
import { format } from "date-fns";

export default function Dashboard({ auth }: PageProps) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Good{" "}
                    {format(new Date(), "bbbb") === "a.m."
                        ? "morning"
                        : format(new Date(), "bbbb") === "p.m."
                        ? "afternoon"
                        : format(new Date(), "bbbb")}
                    , {auth.user.first_name + " " + auth.user.last_name}
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="mt-10 grid gap-8 sm:grid-cols-2 xl:grid-cols-4">
                {["HR", "HOD"].includes(auth.user.role) ? (
                    <div className="border-t pt-4 space-y-1.5">
                        <div className="font-medium">Total staffs</div>
                        <div className="text-xl font-semibold">
                            120 Employees
                        </div>
                        <div className="text-xs font-medium space-x-1">
                            <span className="w-fit font-semibold p-1 px-2 rounded border-transparent bg-lime-400/20 text-lime-700 group-data-[hover]:bg-lime-400/30 dark:bg-lime-400/10 dark:text-lime-300 dark:group-data-[hover]:bg-lime-400/15">
                                + 5
                            </span>
                            <span> from the last 7 days</span>
                        </div>
                    </div>
                ) : (
                    <div className="border-t pt-4 space-y-1.5">
                        <div className="font-medium">Credits remaining</div>
                        <div className="text-xl font-semibold">{auth.user.leave_credits??0} Credit/s</div>
                        <div className="text-xs font-medium space-x-1">
                            <span className="w-fit font-semibold p-1 px-2 rounded border-transparent bg-lime-400/20 text-lime-700 group-data-[hover]:bg-lime-400/30 dark:bg-lime-400/10 dark:text-lime-300 dark:group-data-[hover]:bg-lime-400/15">
                                + 1
                            </span>
                            <span> from the last 7 days</span>
                        </div>
                    </div>
                )}
                <div className="border-t pt-4 space-y-1.5">
                    <div className="font-medium">Approved leave</div>
                    <div className="text-xl font-semibold">10 Approved</div>
                    <div className="text-xs font-medium space-x-1">
                        <span className="w-fit font-semibold p-1 px-2 rounded border-transparent bg-lime-400/20 text-lime-700 group-data-[hover]:bg-lime-400/30 dark:bg-lime-400/10 dark:text-lime-300 dark:group-data-[hover]:bg-lime-400/15">
                            + 5
                        </span>
                        <span> from the last 7 days</span>
                    </div>
                </div>
                <div className="border-t pt-4 space-y-1.5">
                    <div className="font-medium">Pending leave</div>
                    <div className="text-xl font-semibold">3 Pending</div>
                    <div className="text-xs font-medium space-x-1">
                        <span className="w-fit font-semibold p-1 px-2 rounded border-transparent bg-lime-400/20 text-lime-700 group-data-[hover]:bg-lime-400/30 dark:bg-lime-400/10 dark:text-lime-300 dark:group-data-[hover]:bg-lime-400/15">
                            + 2
                        </span>
                        <span> from the last 7 days</span>
                    </div>
                </div>
                <div className="border-t pt-4 space-y-1.5">
                    <div className="font-medium">Rejected leave</div>
                    <div className="text-xl font-semibold">2 Rejected</div>
                    <div className="text-xs font-medium space-x-1">
                        <span className="w-fit font-semibold p-1 px-2 rounded border-transparent bg-lime-400/20 text-lime-700 group-data-[hover]:bg-lime-400/30 dark:bg-lime-400/10 dark:text-lime-300 dark:group-data-[hover]:bg-lime-400/15">
                            + 1
                        </span>
                        <span> from the last 7 days</span>
                    </div>
                </div>
            </div>

            <div className="mt-12">
                <div className="flex items-center mb-5">
                    <div className="font-semibold text-xl">
                        Recent Leave Applications
                    </div>
                    <Button
                        variant="ghost"
                        className="ml-auto"
                        onClick={() => router.get(route("leave"))}
                    >
                        <span>View all</span>
                    </Button>
                </div>
                <div className="divide-y min-h-[22rem]">
                    <div className="grid grid-cols-[repeat(5,1fr),3rem] py-2 [&>div:first-child]:pl-1 [&>div]:font-medium opacity-60">
                        <div className="">Name</div>
                        <div className="">Type</div>
                        <div className="">Date</div>
                        <div className="">Principal status</div>
                        <div className="">HR status</div>
                        <div className=""></div>
                    </div>
                    <RecentLeaveRow />
                    <RecentLeaveRow />
                    <RecentLeaveRow />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

const RecentLeaveRow = () => {
    return (
        <div className="hover:bg-secondary transition-colors">
            <div className="grid grid-cols-[repeat(5,1fr),3rem] [&>div]:py-3 [&>div]:flex [&>div]:items-center [&>div]:pr-3 [&>div:first-child]:pl-1 text-sm font-mediu">
                <div className="">
                    <div className="flex items-center gap-2">
                        <AvatarProfile className="size-8" />
                        <div className="line-clamp-1">John Doe</div>
                    </div>
                </div>
                <div className="">
                    <div className="line-clamp-1">Sick leave</div>
                </div>
                <div className="">
                    <div className="line-clamp-1">June 2, 2024</div>
                </div>
                <div className="">
                    <div className="line-clamp-1">
                        <LeaveStatus status="Approved" />
                    </div>
                </div>
                <div className="">
                    <div className="line-clamp-1">
                        <LeaveStatus status="Pending" />
                    </div>
                </div>
                <div className="">
                    <Menubar className="p-0 border-none group size-8 bg-transparent">
                        <MenubarMenu>
                            <MenubarTrigger className="h-full cursor-pointer p-0 flex grow justify-center before:!bg-zinc-200">
                                <EllipsisVertical className="size-5" />
                            </MenubarTrigger>
                            <MenubarContent className="w-52" align="end">
                                <MenubarItem className="px-4 gap-5" onClick={() => router.get(route('leave.view'))}>
                                    <Eye className="size-5" strokeWidth={1.8} />
                                    <div>View</div>
                                </MenubarItem>
                                <MenubarItem className="px-4 gap-5">
                                    <Trash2
                                        className="size-5"
                                        strokeWidth={1.8}
                                    />
                                    <div>Delete</div>
                                </MenubarItem>
                            </MenubarContent>
                        </MenubarMenu>
                    </Menubar>
                </div>
            </div>
        </div>
    );
};
