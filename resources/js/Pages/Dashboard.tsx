import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { PageProps, PaginateData } from "@/types";
import { format } from "date-fns";
import LeaveApplicationsChart from "./Dashboard/LeaveApplicationsChart";
import Notes from "./Dashboard/Notes";
import ActiveLeave from "./Dashboard/ActiveLeave";
import PersonnelList from "./Dashboard/PersonnelList";
import PageListProvider from "@/hooks/pageListProvider";

type Statistics = {
    recent: number;
    recent_deduction?: number;
    total: number;
};

interface DashboardProps extends PageProps {
    totalEmployee?: Statistics;
    approved: Statistics;
    pending: Statistics;
    reject: Statistics;
    leave: Array<{
        id: number;
        leave_type: string;
        inclusive_date_from: string;
        inclusive_date_to: string;
    }>;
    leaveApplications: Array<{
        leave_type: string;
        total: number;
    }>;
    pageData: PaginateData;
}

export default function Index({
    auth,
    pageData,
    totalEmployee,
    approved,
    pending,
    reject,
    leave,
    leaveApplications,
}: DashboardProps) {
    return (
        <PageListProvider initialValue={pageData}>
            <Head title="Dashboard" />

            <Dashboard
                auth={auth}
                pageData={pageData}
                totalEmployee={totalEmployee}
                approved={approved}
                pending={pending}
                reject={reject}
                leave={leave}
                leaveApplications={leaveApplications}
            />
        </PageListProvider>
    );
}

function Dashboard({
    auth,
    totalEmployee,
    approved,
    pending,
    reject,
    leave,
    leaveApplications,
}: DashboardProps) {
    return (
        <AuthenticatedLayout
            userAuth={auth.user}
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

            <div className="min-h-96 mt-12 flex max-md:flex-col gap-4">
                <ActiveLeave leave={leave} />

                <Notes />
            </div>

            {auth.user.role == "HR" && (
                <>
                    <LeaveApplicationsChart
                        leaveApplications={leaveApplications}
                    />
                    <PersonnelList />
                </>
            )}
        </AuthenticatedLayout>
    );
}
