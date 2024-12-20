import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { PageProps, PaginateData, SYTYPE } from "@/types";
import { format } from "date-fns";
import LeaveApplicationsChart from "./Dashboard/LeaveApplicationsChart";
import Notes from "./Dashboard/Notes";
import ActiveLeave from "./Dashboard/ActiveLeave";
import PersonnelList from "./Dashboard/PersonnelList";
import PageListProvider from "@/hooks/pageListProvider";
import NewSchoolYear from "./Dashboard/NewSchoolYear";
import { useEffect, useState } from "react";
import { Button } from "@/Components/ui/button";
import { PencilLine, Plus } from "lucide-react";
import GenderProportion from "./Dashboard/GenderProportion";
import PerformanceChart from "./Dashboard/PerformanceChart";

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
        user: {
            id: number
            name: string
        }
    }>;
    leaveApplications: {
        approved: Array<{
            leave_type: string;
            total: number;
        }>
        rejected: Array<{
            leave_type: string;
            total: number;
        }>
    }
    pageData: PaginateData;
    sy: SYTYPE;
    appliedLeavesOfPersonnel: Array<{
        leave_type: string
    }>
    syList: Array<{ sy: string }>
    ratings: {
        outstanding: Array<{
            id: number
            first_name: string
            middle_name: string
            last_name: string
            avatar: string
            ratings: number
        }>
        least_performing: Array<{
            id: number
            first_name: string
            middle_name: string
            last_name: string
            avatar: string
            ratings: number
        }>
    }
    genderProportion: {
        Male?: number
        Female?: number
    }
    sy_ratings?: Array<{
        rating: number
        sy: string
    }>
}

export default function Index(props: DashboardProps) {
    return (
        <PageListProvider initialValue={props.pageData}>
            <Head title="Dashboard" />

            <Dashboard
                {...props}
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
    sy,
    appliedLeavesOfPersonnel,
    syList,
    ratings,
    genderProportion,
    sy_ratings
}: DashboardProps) {
    const [applications, setApplications] = useState(leaveApplications)
    const [appliedLeaves, setAppliedLeaves] = useState(appliedLeavesOfPersonnel)
    const [loading, setLoading] = useState(false)
    const [dateTime, setDateTime] = useState({
        date: format(new Date(), 'LLLL d, y'),
        time: format(new Date(), 'hh:mm aaa')
    })

    const getLeaveApplications = (sy: string) => {
        setLoading(true)
        window.axios.get(route('dashboard.leave.applications', [sy]))
            .then((response) => {
                const { leaveApplications, appliedLeavesOfPersonnel } = response.data
                setApplications(leaveApplications)
                setAppliedLeaves(appliedLeavesOfPersonnel)
            }).finally(() => setLoading(false))
    }

    useEffect(() => {
        let timeInterval = Math.abs((new Date().getSeconds() - 60) * 1000)

        const setTimePerMinute = () => {
            setDateTime({
                date: format(new Date(), 'LLLL d, y'),
                time: format(new Date(), 'hh:mm aaa')
            })
        }

        const setIntervalDateTime = setInterval(setTimePerMinute, timeInterval)

        return () => clearInterval(setIntervalDateTime)
    }, [dateTime])

    return (
        <AuthenticatedLayout
            userAuth={auth.user}
            header={
                <h2 className="font-semibold text-xl leading-tight">
                    Welcome, {auth.user.first_name + " " + auth.user.last_name}
                    <div className="text-sm font-medium">{dateTime.date}</div>
                    <div className="text-sm font-medium">{dateTime.time}</div>
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="mt-4 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                {["HR"].includes(auth.user.role) ? (
                    <div className="border-t border-teal-600 bg-teal-100 dark:bg-teal-800/50 pt-4 space-y-1.5 p-2">
                        <div className="font-medium text-teal-700 dark:text-teal-400">Total Personnel</div>
                        <div className="text-xl font-semibold text-teal-700 dark:text-teal-400">
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
                    <div className="border-t border-teal-600 bg-teal-100 dark:bg-teal-800/50 pt-4 space-y-1.5 p-2">
                        <div className="font-medium text-teal-700 dark:text-teal-400">Credits Remaining</div>
                        <div className="text-xl font-semibold text-teal-700 dark:text-teal-400">
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
                <div className="border-t border-blue-600 bg-blue-100 dark:bg-blue-800/50 pt-4 space-y-1.5 p-2">
                    <div className="font-medium text-blue-700 dark:text-blue-400">Approved Leave</div>
                    <div className="text-xl font-semibold text-blue-700 dark:text-blue-400">
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
                <div className="border-t border-purple-600 bg-purple-100 dark:bg-purple-800/50 pt-4 space-y-1.5 p-2">
                    <div className="font-medium text-purple-700 dark:text-purple-400">Pending Leave</div>
                    <div className="text-xl font-semibold text-purple-700 dark:text-purple-400">
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
                <div className="border-t border-yellow-600 bg-yellow-100 dark:bg-yellow-800/50 pt-4 space-y-1.5 p-2">
                    <div className="font-medium text-yellow-700 dark:text-yellow-400">Rejected Leave</div>
                    <div className="text-xl font-semibold text-yellow-700 dark:text-yellow-400">
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

            <div className="min-h-96 mt-12 flex max-lg:flex-col gap-4">
                <ActiveLeave leave={leave} />

                <Notes />
            </div>

            {auth.user.role == "HR" ? (
                <>
                    <LeaveApplicationsChart
                        syList={syList}
                        onSelectSy={getLeaveApplications}
                        leaveApplications={applications}
                        appliedLeavesOfPersonnel={appliedLeaves}
                        loading={loading}
                        sy={sy?.sy}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-[20rem,1fr] gap-4 mt-8">
                        <GenderProportion genderProportion={genderProportion} />
                        <PersonnelList ratings={ratings} />
                    </div>
                </>
            ) : (
                auth.user.role != "HOD" && <PerformanceChart sy_ratings={sy_ratings} />
            )}

        </AuthenticatedLayout>
    );
}
