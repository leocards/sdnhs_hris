import { cn } from "@/lib/utils"

const LeaveStatus: React.FC<{ status: 'Approved' | 'Pending' | 'Rejected', className?: string }> = ({ status, className }) => {
    const state = {
        Approved: "text-green-600",
        Pending: "text-yellow-600",
        Rejected: "text-red-600",
    }[status]

    return (
        <div className={cn("", className, state)}>{status}</div>
    )
}

export default LeaveStatus