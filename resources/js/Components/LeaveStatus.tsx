import { cn } from "@/lib/utils"

const LeaveStatus: React.FC<{ status: 'Approved' | 'Pending' | 'Rejected', className?: string }> = ({ status, className }) => {
    const state = {
        Approved: "text-green-600 dark:text-green-700",
        Pending: "text-yellow-600 dark:text-yellow-700",
        Rejected: "text-destructive",
    }[status]

    return (
        <div className={cn("", className, state)}>{status}</div>
    )
}

export default LeaveStatus
