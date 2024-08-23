import { cn } from "@/lib/utils";
import { format } from "date-fns";

type LeavePDFApplicantProps = {
    department: string;
    first: string;
    last: string;
    middle: string;
    dateOfFiling: string;
    position: string;
    salary?: string;
};

const LeavePDFApplicant = ({
    applicant: {
        department,
        first,
        last,
        middle,
        dateOfFiling,
        position,
        salary,
    },
    isDownload
}: {
    isDownload?: boolean;
    applicant: LeavePDFApplicantProps;
}) => {
    return (
        <>
            <div className="grid grid-cols-[15rem,auto] uppercase p-[1pt] pb-1.5">
                <div className="">
                    <div className={cn(isDownload && "print:mt-auto -mt-1.5")}>
                        1. Office/department
                    </div>
                    <div className="mt-0.5 pl-3">{department}</div>
                </div>
                <div className="flex flex-col">
                    <div className="grid grid-cols-4">
                        <div className={cn(isDownload && "-mt-1.5")}>
                            2. Name:
                        </div>
                        <div
                            className={cn(
                                "capitalize",
                                isDownload && "-mt-1.5"
                            )}
                        >
                            (Last)
                        </div>
                        <div
                            className={cn(
                                "capitalize",
                                isDownload && "-mt-1.5"
                            )}
                        >
                            (First)
                        </div>
                        <div
                            className={cn(
                                "capitalize",
                                isDownload && "-mt-1.5"
                            )}
                        >
                            (Middle)
                        </div>
                    </div>
                    <div className="mt-0.5 mx-auto flex gap-5">
                        <div className="">{last},</div>
                        <div className="">{first}</div>
                        <div className="">{middle}</div>
                    </div>
                </div>
            </div>
            <div className={cn("border-t uppercase h-9 grid grid-cols-3 p-[1pt] pb-2", isDownload ? "border-black" : "dark:border-border border-black")}>
                <div className="">
                    <div className={cn(isDownload && "-mt-1.5")}>
                        3. Date of filing
                    </div>
                    <div className="pl-3">{format(dateOfFiling, "PPP")}</div>
                </div>
                <div className="">
                    <div className={cn(isDownload && "-mt-1.5")}>
                        4. Position
                    </div>
                    <div className="pl-3">{position}</div>
                </div>
                <div className="">
                    <div className={cn(isDownload && "-mt-1.5")}>5. Salary</div>
                </div>
            </div>
        </>
    );
};

export default LeavePDFApplicant;
