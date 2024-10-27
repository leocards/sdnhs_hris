import { useEffect, useMemo, useState } from "react";
import { LEAVETYPES } from "../Leave/types";
import Charts from "./Charts";

type Props = {
    leaveApplications: Array<{
        leave_type: string, total: number
    }>
}

type LeaveChart = {

}

const LeaveApplicationsChart: React.FC<Props> = ({ leaveApplications }) => {
    const Leaves = useMemo(() => {
        let leaves = [...leaveApplications]

        let others = leaves.filter(({leave_type}) => !LEAVETYPES.some((leave) => leave_type == leave))

        let leaveData = [
            {type: 'L1', leave: 0},
            {type: 'L2', leave: 0},
            {type: 'L3', leave: 0},
            {type: 'L4', leave: 0},
            {type: 'L5', leave: 0},
            {type: 'L6', leave: 0},
            {type: 'L7', leave: 0},
            {type: 'L8', leave: 0},
            {type: 'L9', leave: 0},
            {type: 'L10', leave: 0},
            {type: 'L11', leave: 0},
            {type: 'L12', leave: 0},
            {type: 'L13', leave: 0},
            {type: 'L14', leave: 0},
        ]

        leaves.forEach((leave) => {
            if(leave.leave_type == "Vacation Leave") {
                leaveData[0].leave = leave.total
            } else if(leave.leave_type == "Mandatory/Forced Leave") {
                leaveData[1].leave = leave.total
            } else if(leave.leave_type == "Sick Leave") {
                leaveData[2].leave = leave.total
            } else if(leave.leave_type == "Maternity Leave") {
                leaveData[3].leave = leave.total
            } else if(leave.leave_type == "Paternity Leave") {
                leaveData[4].leave = leave.total
            } else if(leave.leave_type == "Special Privilege Leave") {
                leaveData[5].leave = leave.total
            } else if(leave.leave_type == "Solo Parent Leave") {
                leaveData[6].leave = leave.total
            } else if(leave.leave_type == "Study Leave") {
                leaveData[7].leave = leave.total
            } else if(leave.leave_type == "10-Day VOWC Leave") {
                leaveData[8].leave = leave.total
            } else if(leave.leave_type == "Rehabilitation Privilege") {
                leaveData[9].leave = leave.total
            } else if(leave.leave_type == "Special Leave Benefits for Women") {
                leaveData[10].leave = leave.total
            } else if(leave.leave_type == "Special Emergency (Calamity) Leave") {
                leaveData[11].leave = leave.total
            } else {
                leaveData[12].leave = leave.total
            }
        })

        leaveData[13].leave = others.reduce((acc, item) => acc + item.total, 0) ?? 0

        return leaveData
    }, [leaveApplications])

    return (
        <div className="mt-4 md:mt-8 mx-auto">
            <div className="flex [@media(max-width:900px)]:flex-col [@media(max-width:1023px)]:flex-row [@media(min-width:1024px)_and_(max-width:1220px)]:flex-col gap-4 [@media(min-width:1024px)]:justify-between">
                <div className="border rounded-md p-2 shadow-sm">
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
