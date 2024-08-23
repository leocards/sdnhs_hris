import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Square, SquareCheck } from "lucide-react";
import React from "react";

type LeavePDFDetailsOfApplicationProps = {
    isDownload?: boolean;
    detailsOfApplication: {
        leave_type: string;
        leave_type_others: string;
        is_philippines: boolean;
        is_philippines_input: string;
        is_abroad: boolean;
        is_abroad_input: string;
        is_in_hospital: boolean;
        is_in_hospital_input: string;
        is_out_patient: boolean;
        is_out_patient_input: string;
        special_leave_women: boolean;
        is_master_degree: boolean;
        is_review: boolean;
        is_monetization: boolean;
        is_terminal_leave: boolean;
        num_days_applied: string;
        inclusive_date_from: string;
        inclusive_date_to: string;
        is_not_requested: boolean;
        is_requested: boolean;
    };
};

const LeavePDFDetailsOfApplication = (
    props: LeavePDFDetailsOfApplicationProps
) => {
    const {
        isDownload,
        detailsOfApplication: {
            leave_type,
            leave_type_others,
            is_philippines,
            is_philippines_input,
            is_abroad,
            is_abroad_input,
            is_in_hospital,
            is_in_hospital_input,
            is_out_patient,
            is_out_patient_input,
            special_leave_women,
            is_master_degree,
            is_review,
            is_monetization,
            is_terminal_leave,
            num_days_applied,
            inclusive_date_from,
            inclusive_date_to,
            is_not_requested,
            is_requested,
        },
    } = props;

    const formatDateRange = (dateRange: {
        from: string;
        to: string;
    }): string => {
        const { from, to } = dateRange;

        const fromFormatted = format(from, "MMMM d, yyyy");

        if (!to) {
            // Single date
            return fromFormatted;
        } else if (format(from, "yyyy") === format(to, "yyyy")) {
            if (format(from, "MMMM") === format(to, "MMMM")) {
                // Same month and year
                return `${format(from, "MMMM d")} - ${format(to, "d, yyyy")}`;
            } else {
                // Same year, different month
                return `${format(from, "MMMM d")} - ${format(
                    to,
                    "MMMM d, yyyy"
                )}`;
            }
        } else {
            // Different years
            return `${fromFormatted} - ${format(to, "MMMM d, yyyy")}`;
        }
    };

    return (
        <>
            <div
                className={cn(
                    "border-y text-center font-bold uppercase p-[1pt]", isDownload ? "border-black" : "dark:border-border border-black"
                )}
            >
                <div className={cn(isDownload && "-mt-3 py-1.5")}>
                    6. Details of Application
                </div>
            </div>
            <div className={cn("grid grid-cols-2 divide-x h-[19rem] [&>div]:p-[1pt]", isDownload ? "divide-black" : "dark:divide-border divide-black")}>
                <div>
                    <div className={cn("uppercase", isDownload && "-mt-1.5")}>
                        6.A Types of Leave to be availed of:{" "}
                    </div>
                    <div className={cn("pl-2 ", !isDownload ? "pt-1" : "pt-2")}>
                        {leaveTypes.map((type, index) => (
                            <div
                                className="flex gap-1"
                                style={{ alignItems: "center" }}
                                key={index}
                            >
                                <div className="">
                                    {leave_type === type ? (
                                        <SquareCheck className="size-4" />
                                    ) : (
                                        <Square className="size-4" />
                                    )}
                                </div>
                                <div className={cn(isDownload && "-mt-3")}>
                                    {type}
                                </div>
                            </div>
                        ))}
                        <div className="mt-3">Others:</div>
                        <div
                            className={cn(
                                "h-4 w-[70%]",
                                leave_type_others
                                    ? "underline"
                                    : ("border-b " + (isDownload ? "border-black" : "dark:border-border border-black"))
                            )}
                        >
                            {leave_type_others}
                        </div>
                    </div>
                </div>
                <div>
                    <div className={cn("uppercase", isDownload && "-mt-1.5")}>
                        6.B Details of Leave:{" "}
                    </div>
                    <div className="pl-2 pt-0.5">
                        <div className="">
                            <div className="text-[10px] italic ml-2">
                                In case of Vacation/Special Privilege Leave:
                            </div>
                            <div
                                className={cn(
                                    "flex gap-1 relative",
                                    isDownload && "mt-2"
                                )}
                            >
                                {is_philippines ? (
                                    <SquareCheck className="size-4" />
                                ) : (
                                    <Square className="size-4" />
                                )}
                                <div className={cn(isDownload && "-mt-1.5")}>
                                    Within the Philippines
                                    <span className="underline pl-1 font-medium">
                                        {is_philippines_input}
                                    </span>
                                </div>
                            </div>
                            <div className="flex gap-1 relative">
                                {is_abroad ? (
                                    <SquareCheck className="size-4" />
                                ) : (
                                    <Square className="size-4" />
                                )}
                                <div className={cn(isDownload && "-mt-1.5")}>
                                    Abroad (Specify)
                                    <span className="underline pl-1 font-medium">
                                        {is_abroad_input}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="mt-0.5">
                            <div className="text-[10px] italic ml-2">
                                In case of Sick Leave:
                            </div>
                            <div
                                className={cn(
                                    "flex gap-1 relative",
                                    isDownload && "mt-2"
                                )}
                            >
                                {is_in_hospital ? (
                                    <SquareCheck className="size-4" />
                                ) : (
                                    <Square className="size-4" />
                                )}
                                <div className={cn(isDownload && "-mt-1.5")}>
                                    In Hospital (Specify Illness)
                                    <span className="underline pl-1 font-medium">
                                        {is_in_hospital_input}
                                    </span>
                                </div>
                            </div>
                            <div className="flex gap-1 relative">
                                {is_out_patient ? (
                                    <SquareCheck className="size-4" />
                                ) : (
                                    <Square className="size-4" />
                                )}
                                <div className={cn(isDownload && "-mt-1.5")}>
                                    Out Patient (Specify Illness)
                                    <span className="underline pl-1 font-medium">
                                        {is_out_patient_input}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="mt-0.5">
                            <div className="text-[10px] italic ml-2">
                                In case of Special Leave Benefits for Women:
                            </div>
                            <div className="flex">
                                <div>(Specify illness)</div>
                                <span className="underline pl-1 font-medium">
                                    {special_leave_women}
                                </span>
                            </div>
                        </div>
                        <div className="mt-1.5">
                            <div className="text-[10px] italic ml-2">
                                In case of study leave:
                            </div>
                            <div
                                className={cn(
                                    "flex gap-1 relative",
                                    isDownload && "mt-2"
                                )}
                            >
                                {is_master_degree ? (
                                    <SquareCheck className="size-4" />
                                ) : (
                                    <Square className="size-4" />
                                )}
                                <div className={cn(isDownload && "-mt-1.5")}>
                                    Completion of Master's Degree
                                </div>
                            </div>
                            <div className="flex gap-1 relative">
                                {is_review ? (
                                    <SquareCheck className="size-4" />
                                ) : (
                                    <Square className="size-4" />
                                )}
                                <div className={cn(isDownload && "-mt-1.5")}>
                                    BAR/Board Examination Review
                                </div>
                            </div>
                        </div>
                        <div className="mt-0.5">
                            <div className="text-[10px] italic ml-2">
                                Other puspose:
                            </div>
                            <div
                                className={cn(
                                    "flex gap-1 relative",
                                    isDownload && "mt-2"
                                )}
                            >
                                {is_monetization ? (
                                    <SquareCheck className="size-4" />
                                ) : (
                                    <Square className="size-4" />
                                )}
                                <div className={cn(isDownload && "-mt-1.5")}>
                                    Monetization of Leave Credits
                                </div>
                            </div>
                            <div className="flex gap-1 relative">
                                {is_terminal_leave ? (
                                    <SquareCheck className="size-4" />
                                ) : (
                                    <Square className="size-4" />
                                )}
                                <div className={cn(isDownload && "-mt-1.5")}>
                                    Terminal Leave
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className={cn(
                "border-t border-black grid grid-cols-2 divide-x divide-black h-[6.5rem] [&>div]:p-[1pt]",
                isDownload ? "border-black divide-black" : "dark:border-border dark:divide-border border-black divide-black"
            )}>
                <div>
                    <div className={cn("uppercase", isDownload && "-mt-1.5")}>
                        6.C Number of working days applied for
                    </div>
                    <div
                        className={cn(
                            "border-b w-[60%] ml-4 text-center",
                            isDownload ? "border-black" : "dark:border-border border-black"
                        )}
                    >
                        <div className={cn(isDownload && "mb-1.5 mt-1")}>
                            {num_days_applied}{" "}
                            {num_days_applied && "working day/s"}
                        </div>
                    </div>
                    <div className="uppercase ml-4 mt-3"> Inclusive dates</div>
                    <div
                        className={cn(
                            "border-b w-[60%] ml-4 text-center",
                            isDownload ? "border-black" : "dark:border-border border-black"
                        )}
                    >
                        <div className={cn(isDownload && "mb-1.5 mt-1")}>
                            {formatDateRange({
                                from: inclusive_date_from,
                                to: inclusive_date_to,
                            })}
                        </div>
                    </div>
                </div>
                <div className="flex flex-col">
                    <div
                        className={cn(
                            "uppercase",
                            isDownload && "-mt-1.5 mb-2"
                        )}
                    >
                        6.D Commutation
                    </div>
                    <div className="pl-2">
                        <div className="flex gap-1 relative">
                            {is_not_requested ? (
                                <SquareCheck className="size-4" />
                            ) : (
                                <Square className="size-4" />
                            )}
                            <div className={cn(isDownload && "-mt-1.5")}>
                                Not requested
                            </div>
                        </div>
                        <div className="flex gap-1 relative">
                            {is_requested ? (
                                <SquareCheck className="size-4" />
                            ) : (
                                <Square className="size-4" />
                            )}
                            <div className={cn(isDownload && "-mt-1.5")}>
                                Requested
                            </div>
                        </div>
                    </div>
                    <div className="w-[80%] mx-auto mt-auto mb-1">
                        <div
                            className={cn(
                                "h-4 text-center font-bold uppercase"
                            )}
                        >
                            <div className={cn(isDownload && "-mt-3")}></div>
                        </div>
                        <div
                            className={cn(
                                "border-t text-center",
                                isDownload ? "border-black" : "dark:border-border border-black",
                                isDownload ? "mt-2" : "pt-0.5"
                            )}
                        >
                            <div className={cn(isDownload && "-mt-1 mb-2")}>
                                (Signature of Applicant)
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default LeavePDFDetailsOfApplication;

const leaveTypes = [
    "Vacation Leave",
    "Mandatory/Forced Leave",
    "Sick Leave",
    "Maternity Leave",
    "Paternity Leave",
    "Special Privilege Leave",
    "Solo Parent Leave",
    "Study Leave",
    "10-Day VAWC Leave",
    "Rehabilitaion Privilege",
    "Special Leave Benefits for Women",
    "Special Emergency(Calamity) Leave",
    "Adoption Leave",
];
