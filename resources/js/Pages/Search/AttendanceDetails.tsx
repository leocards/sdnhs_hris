import DataList from "@/Components/DataList";
import { format } from "date-fns";
import React, { useEffect, useState } from "react";

type Props = {
    userId: number
}

const AttendanceDetails: React.FC<Props> = ({ userId }) => {
    const [attendace, setAttendance] = useState<any[]>([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setLoading(true)
        window.axios
            .get(route('general-search.attendances', [userId]))
            .then((response) => {
                const data = response.data
                setAttendance(data)
            })
            .finally(() => setLoading(false))
    }, [])

    return (
        <div className="border rounded-lg divide-y">
            <div className="grid grid-cols-3 px-2 py-3 bg-secondary font-medium">
                <div>Year</div>
                <div>Days present</div>
                <div>Days absent</div>
            </div>
            <DataList empty={attendace.length === 0} loading={loading}>
                {attendace.map((attend, index) => (
                    <div key={index} className="grid grid-cols-3 px-2 py-3">
                        <div>{format(attend.year, 'Y')}</div>
                        <div>{attend.present} days</div>
                        <div>{attend.absent} days</div>
                    </div>
                ))}
            </DataList>
        </div>
    );
};

export default AttendanceDetails;
