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
    },
    appliedLeavesOfPersonnel: Array<{
        leave_type: string
    }>,
    syList: Array<{ sy: string }>
    onSelectSy: (sy: string) => void
    sy: string
    loading: boolean
}

const LeaveApplicationsChart: React.FC<Props> = ({ leaveApplications, appliedLeavesOfPersonnel, syList, onSelectSy, loading, sy }) => {
    const Leaves = useMemo(() => {
        if(appliedLeavesOfPersonnel) {
            const appliedLeaves = LEAVETYPES.filter((l) => appliedLeavesOfPersonnel.some(ap => ap.leave_type == l))

            const leaveData = appliedLeaves.map((type, index) => ({
                type: `L${index + 1}`,
                approved: 0,
                rejected: 0,
            }));

            const updateLeaveData = (leaveArray: Props['leaveApplications']['approved'], isRejected: boolean = false) => {
                leaveArray.forEach(({ total }, index) => {
                    if (index !== -1) {
                        leaveData[index][isRejected ? 'rejected' : 'approved'] += total;
                    } else {
                        leaveData[LEAVETYPES.length - 1][isRejected ? 'rejected' : 'approved'] += total;
                    }
                });
            };

            updateLeaveData(leaveApplications.approved);
            updateLeaveData(leaveApplications.rejected, true);

            return leaveData;
        } else {
            return []
        }
    }, [leaveApplications]);

    return (
        <div className="mt-4 md:mt-8 mx-auto w-full">
            <Charts chartData={Leaves} appliedLeavesOfPersonnel={appliedLeavesOfPersonnel} syList={syList} onSelectSy={onSelectSy} loading={loading} sy={sy} />
        </div>
    );
};

export default LeaveApplicationsChart;
