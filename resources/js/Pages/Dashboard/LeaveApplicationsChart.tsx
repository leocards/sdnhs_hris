import { useMemo } from "react";
import { LEAVETYPES } from "../Leave/types";
import Charts from "./Charts";

type Props = {
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
}

type LeaveType = typeof LEAVETYPES[number];

const LeaveApplicationsChart: React.FC<Props> = ({ leaveApplications }) => {
    const Leaves = useMemo(() => {
        const leaveData = LEAVETYPES.map((type, index) => ({
            type: `L${index + 1}`,
            leave: 0,
            rejected: 0,
        }));

        const updateLeaveData = (leaveArray: Props['leaveApplications']['approved'], isRejected: boolean = false) => {
            leaveArray.forEach(({ leave_type, total }) => {
                const index = LEAVETYPES.indexOf(leave_type as LeaveType);
                if (index !== -1) {
                    leaveData[index][isRejected ? 'rejected' : 'leave'] += total;
                } else {
                    leaveData[LEAVETYPES.length - 1][isRejected ? 'rejected' : 'leave'] += total;
                }
            });
        };

        updateLeaveData(leaveApplications.approved);
        updateLeaveData(leaveApplications.rejected, true);

        return leaveData;
    }, [leaveApplications]);

    return (
        <div className="mt-4 md:mt-8 mx-auto">
            <div className="flex [@media(max-width:900px)]:flex-col [@media(max-width:1023px)]:flex-row [@media(min-width:1024px)_and_(max-width:1220px)]:flex-col gap-4 [@media(min-width:1024px)]:justify-between">
                <div className="border rounded-md p-2 shadow">
                    <Charts chartData={Leaves} />
                </div>
                <div className="text-sm grow [@media(min-width:1024px)]:w-full [@media(min-width:510px)_and_(max-width:900px)]:gap-8 [@media(min-width:510px)_and_(max-width:900px)]:mx-auto flex [@media(max-width:510px)]:flex-col [@media(min-width:901px)_and_(max-width:1023px)]:flex-col [@media(min-width:1221px)]:flex-col">
                    <div className="grow flex flex-col justify-between">
                        {[...LEAVETYPES].splice(0, 7).map((leave, index) => (
                            <div key={index} className="flex items-center">
                                <div className="w-10">L{++index} - </div>
                                <div className="">{leave}</div>
                            </div>
                        ))}
                    </div>
                    <div className="grow flex flex-col justify-between">
                        {[...LEAVETYPES].splice(7, 7).map((leave, index) => (
                            <div key={index} className="flex items-center">
                                <div className="w-10">L{8 + index} - </div>
                                <div className="">{leave}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LeaveApplicationsChart;
