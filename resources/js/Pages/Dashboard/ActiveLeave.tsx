import React, { useState } from "react";
import CalendarView from "../Dashboard/CalendarView";

import { Label } from "@/Components/ui/label";
import { getRemainingTime } from "../Dashboard/type";
import { Button } from "@/Components/ui/button";
import { CalendarDays, ChevronLeft } from "lucide-react";
import { formatDateRange } from "../types";

type LeaveType = {
    id: number;
    leave_type: string;
    inclusive_date_from: string;
    inclusive_date_to: string;
    user: {
        id: number;
        name: string;
    };
};

type Props = {
    leave: Array<LeaveType>;
};
// ring

const getTimeRemains = ({ from, to }: { from: Date; to?: Date }) => {
    let { days, hours, minutes, seconds } = getRemainingTime(from);
    let endDate = to ? getRemainingTime(to) : null;

    if (days > 0) {
        return `${days}d and ${hours}hr${hours > 1 && "s"} `;
    } else if (hours > 0) {
        return `${hours}hr${hours > 1 && "s"} and ${minutes}min`;
    } else if (minutes > 0) {
        return `${minutes} min `;
    } else if (seconds > 0) {
        return `a minute `;
    } else {
        if (endDate && endDate.seconds > 0) return `active`;
    }
};

const ActiveLeave: React.FC<Props> = ({ leave }) => {
    const [selectedLeave, setSelectedLeave] = useState<LeaveType | null>(
        leave.length === 1 ? leave[0] : null
    );

    return (
        <div className="border rounded-md grow shadow-sm">
            {leave.length === 0 && (
                <div className="flex flex-col h-full items-center justify-center">
                    <CalendarDays className="size-12 text-gray-400" />
                    <div className="opacity-60 font-medium">
                        You have no active or upcoming leave.
                    </div>
                </div>
            )}

            {!selectedLeave && leave.length > 1 && (
                <div className="h-full p-3 space-y-1">
                    {leave.map((leave, index) => (
                        <div
                            className="border h-fit rounded-md p-2 px-3 flex items-center hover:shadow-md transition duration-150 shadow-sm"
                            onClick={() => setSelectedLeave(leave)}
                            role="button"
                            key={index}
                        >
                            <div>
                                <div className="font-medium">
                                    {leave.leave_type}
                                </div>

                                <div className="text-sm">
                                    {leave.user?.name}
                                </div>
                            </div>
                            <div className="text-sm ml-auto text-right">
                                {formatDateRange({
                                    from: leave?.inclusive_date_from ?? "",
                                    to: leave?.inclusive_date_to ?? "",
                                })}
                                {getTimeRemains({
                                    from: new Date(
                                        leave?.inclusive_date_from ?? ""
                                    ),
                                    to: new Date(
                                        leave?.inclusive_date_to ?? ""
                                    ),
                                }) == "active" ? (
                                    <div className="text-green-600 text-xs capitalize">
                                        {getTimeRemains({
                                            from: new Date(
                                                leave?.inclusive_date_from ?? ""
                                            ),
                                            to: new Date(
                                                leave?.inclusive_date_to ?? ""
                                            ),
                                        })}
                                    </div>
                                ) : (
                                    <div className="leading-4 text-xs text-foreground/60">
                                        Time remaining:{" "}
                                        {getTimeRemains({
                                            from: new Date(
                                                leave?.inclusive_date_from ?? ""
                                            ),
                                            to: new Date(
                                                leave?.inclusive_date_to ?? ""
                                            ),
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {selectedLeave && (
                <ViewLeave
                    leave={selectedLeave}
                    more={leave.length > 1}
                    onBack={() => setSelectedLeave(null)}
                />
            )}
        </div>
    );
};

const ViewLeave: React.FC<{
    leave: LeaveType;
    more: boolean;
    onBack?: () => void;
}> = ({ leave, more, onBack }) => {
    const leaveStatus = getTimeRemains({
        from: new Date(leave?.inclusive_date_from ?? ""),
        to: new Date(leave?.inclusive_date_to ?? ""),
    });

    return (
        <div>
            <div className="h-14 p-1 px-3 border-b flex items-center">
                {more && (
                    <Button
                        variant={"outline"}
                        size={"icon"}
                        className="size-8 mr-4 shrink-0"
                        onClick={onBack}
                    >
                        <ChevronLeft className="size-5" />
                    </Button>
                )}
                <div className="mr-auto">
                    <Label className="text-lg leading-5 line-clamp-1">
                        {leave?.leave_type}
                    </Label>

                    <div className="text-sm">{leave.user?.name}</div>
                </div>

                <div className="shrink-0 ml-3 text-right">
                    {formatDateRange({
                        from: leave?.inclusive_date_from ?? "",
                        to: leave?.inclusive_date_to ?? "",
                    })}
                    {leaveStatus == "active" ? (
                        <div className="text-green-600 text-xs capitalize">
                            {leaveStatus}
                        </div>
                    ) : (
                        <div className="leading-4 text-xs text-foreground/60">
                            Time remaining: {leaveStatus}
                        </div>
                    )}
                </div>
            </div>

            <CalendarView
                date={{
                    from: new Date(leave?.inclusive_date_from ?? ""),
                    to: new Date(leave?.inclusive_date_to ?? ""),
                }}
            />
        </div>
    );
};

export default ActiveLeave;
