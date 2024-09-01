import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router, usePage } from "@inertiajs/react";
import { PageProps, PaginateData } from "@/types";
import { AvatarProfile } from "@/Components/ui/avatar";
import {
    Menubar,
    MenubarMenu,
    MenubarTrigger,
    MenubarContent,
    MenubarItem,
} from "@/Components/ui/menubar";
import { EllipsisVertical, Eye, Trash2, Upload } from "lucide-react";
import { Button } from "@/Components/ui/button";
import LeaveStatus from "@/Components/LeaveStatus";
import { format } from "date-fns";
import { useEffect } from "react";

type Statistics = {
    recent: number;
    recent_deduction?: number;
    total: number;
};

export default function Dashboard({
    auth,
    leaves,
    totalEmployee,
    approved,
    pending,
    reject,
}: PageProps<{
    leaves: PaginateData;
    totalEmployee?: Statistics;
    approved: Statistics;
    pending: Statistics;
    reject: Statistics;
}>) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl leading-tight">
                    Good{" "}
                    {parseInt(format(new Date(), "kk")) >= 17
                        ? "evening"
                        : format(new Date(), "bbbb") === "a.m."
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
                        <div className="font-medium">Total personnel</div>
                        <div className="text-xl font-semibold">
                            {totalEmployee?.total} Personnel
                        </div>
                        {totalEmployee?.recent && totalEmployee?.recent > 0 ? (
                            <div className="text-xs font-medium space-x-1">
                                <span className="w-fit font-semibold p-1 px-2 rounded border-transparent bg-lime-400/20 text-lime-700 group-data-[hover]:bg-lime-400/30 dark:bg-lime-400/10 dark:text-lime-300 dark:group-data-[hover]:bg-lime-400/15">
                                    + {totalEmployee?.recent}
                                </span>
                                <span> from the last 7 days</span>
                            </div>
                        ) : (
                            ""
                        )}
                    </div>
                ) : (
                    <div className="border-t pt-4 space-y-1.5">
                        <div className="font-medium">Credits remaining</div>
                        <div className="text-xl font-semibold">
                            {auth.user.leave_credits ?? 0} Credit/s
                        </div>
                        {totalEmployee?.recent && totalEmployee?.recent > 0 ? (
                            <div className="text-xs font-medium space-x-1">
                                <span className="w-fit font-semibold p-1 px-2 rounded border-transparent bg-lime-400/20 text-lime-700 group-data-[hover]:bg-lime-400/30 dark:bg-lime-400/10 dark:text-lime-300 dark:group-data-[hover]:bg-lime-400/15">
                                    + {totalEmployee?.recent}
                                </span>
                                {totalEmployee?.recent_deduction ? (
                                    <span className="w-fit font-semibold p-1 px-2 rounded border-transparent bg-pink-400/15 text-pink-700 group-data-[hover]:bg-lime-400/30 dark:bg-lime-400/10 dark:text-lime-300 dark:group-data-[hover]:bg-lime-400/15">
                                        - {totalEmployee?.recent_deduction}
                                    </span>
                                ) : (
                                    ""
                                )}
                                <span> from the last 7 days</span>
                            </div>
                        ) : (
                            ""
                        )}
                    </div>
                )}
                <div className="border-t pt-4 space-y-1.5">
                    <div className="font-medium">Approved leave</div>
                    <div className="text-xl font-semibold">
                        {approved.total} Approved
                    </div>
                    {approved.recent > 0 && (
                        <div className="text-xs font-medium space-x-1">
                            <span className="w-fit font-semibold p-1 px-2 rounded border-transparent bg-lime-400/20 text-lime-700 group-data-[hover]:bg-lime-400/30 dark:bg-lime-400/10 dark:text-lime-300 dark:group-data-[hover]:bg-lime-400/15">
                                + {approved.recent}
                            </span>
                            <span> from the last 7 days</span>
                        </div>
                    )}
                </div>
                <div className="border-t pt-4 space-y-1.5">
                    <div className="font-medium">Pending leave</div>
                    <div className="text-xl font-semibold">
                        {pending.total} Pending
                    </div>
                    {pending.recent > 0 && (
                        <div className="text-xs font-medium space-x-1">
                            <span className="w-fit font-semibold p-1 px-2 rounded border-transparent bg-lime-400/20 text-lime-700 group-data-[hover]:bg-lime-400/30 dark:bg-lime-400/10 dark:text-lime-300 dark:group-data-[hover]:bg-lime-400/15">
                                + {pending.recent}
                            </span>
                            <span> from the last 7 days</span>
                        </div>
                    )}
                </div>
                <div className="border-t pt-4 space-y-1.5">
                    <div className="font-medium">Rejected leave</div>
                    <div className="text-xl font-semibold">
                        {reject.total} Rejected
                    </div>
                    {reject.recent > 0 && (
                        <div className="text-xs font-medium space-x-1">
                            <span className="w-fit font-semibold p-1 px-2 rounded border-transparent bg-lime-400/20 text-lime-700 group-data-[hover]:bg-lime-400/30 dark:bg-lime-400/10 dark:text-lime-300 dark:group-data-[hover]:bg-lime-400/15">
                                + {reject.recent}
                            </span>
                            <span> from the last 7 days</span>
                        </div>
                    )}
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

                    {leaves.data.length === 0 && (
                        <div className="text-center py-5 text-foreground/60">
                            No record.
                        </div>
                    )}

                    {leaves.data.map((list, index) => (
                        <RecentLeaveRow key={index} leave={list} />
                    ))}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

type LeaveType = {
    id: number;
    leave_type: string;
    date_of_filing: Date;
    principal_status: "Approved" | "Rejected" | "Pending";
    hr_status: "Approved" | "Rejected" | "Pending";
    user: {
        id: number;
        first_name: string;
        last_name: string;
        avatar?: string;
    };
    medical_certificate: {
        id: number;
        file_path: string;
        file_name: string;
    };
};

const RecentLeaveRow: React.FC<{ leave: LeaveType }> = ({
    leave: {
        id,
        leave_type,
        date_of_filing,
        principal_status,
        hr_status,
        user,
        medical_certificate,
    },
}) => {
    const {
        props: { auth },
    } = usePage<PageProps>();

    useEffect(() => {}, []);

    return (
        <div className="hover:bg-secondary transition-colors">
            <div className="grid grid-cols-[repeat(5,1fr),3rem] [&>div]:py-3 [&>div]:flex [&>div]:items-center [&>div]:pr-3 [&>div:first-child]:pl-1 text-sm font-mediu">
                <div className="">
                    <div className="flex items-center gap-2">
                        <AvatarProfile src={user.avatar} className="size-8" />
                        <div className="line-clamp-1">
                            {user.first_name + " " + user.last_name}
                        </div>
                    </div>
                </div>
                <div className="">
                    <div className="line-clamp-1">{leave_type}</div>
                </div>
                <div className="">
                    <div className="line-clamp-1">
                        {format(date_of_filing, "PP")}
                    </div>
                </div>
                <div className="">
                    <div className="line-clamp-1">
                        <LeaveStatus status={principal_status} />
                    </div>
                </div>
                <div className="">
                    <div className="line-clamp-1">
                        <LeaveStatus status={hr_status} />
                    </div>
                </div>
                <div className="">
                    <Menubar className="p-0 border-none group size-8 bg-transparent">
                        <MenubarMenu>
                            <MenubarTrigger className="h-full cursor-pointer p-0 flex grow justify-center before:!bg-zinc-200">
                                <EllipsisVertical className="size-5" />
                            </MenubarTrigger>
                            <MenubarContent className="w-52" align="end">
                                <MenubarItem
                                    className="px-4 gap-5"
                                    onClick={() =>
                                        router.get(
                                            route("leave.view", [id, user.id])
                                        )
                                    }
                                >
                                    <Eye className="size-5" strokeWidth={1.8} />
                                    <div>View</div>
                                </MenubarItem>
                            </MenubarContent>
                        </MenubarMenu>
                    </Menubar>
                </div>
            </div>
        </div>
    );
};
