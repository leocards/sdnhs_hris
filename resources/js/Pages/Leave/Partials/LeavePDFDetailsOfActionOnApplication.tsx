import { cn } from "@/lib/utils";
import { Square, SquareCheck } from "lucide-react";
import { Principal } from "../ApplicationForLeavePDF";

type LeavePDFDetailsOfActionOnApplicationProps = {
    isDownload?: boolean;
    hr: string;
    principal: Principal
    detailsOfActionOnApplication: {
        as_of: string;
        total_earned_sick: string;
        total_earned_vacation: string;
        less_application_sick: string;
        less_application_vacation: string;
        balanced_sick: string;
        balanced_vacation: string;
        is_for_approval: boolean;
        is_for_disapproval: boolean;
        is_for_disapproval_input: string;
        approved_for_days_with_out_pay: string;
        approved_for_days_with_pay: string;
        approved_for_others: string;
        disapproved: string;
    };
};
const LeavePDFDetailsOfActionOnApplication = (
    props: LeavePDFDetailsOfActionOnApplicationProps
) => {
    const {
        isDownload,
        hr,
        principal,
        detailsOfActionOnApplication: {
            as_of,
            total_earned_sick,
            total_earned_vacation,
            less_application_sick,
            less_application_vacation,
            balanced_sick,
            balanced_vacation,
            is_for_approval,
            is_for_disapproval,
            is_for_disapproval_input,
            approved_for_days_with_out_pay,
            approved_for_days_with_pay,
            approved_for_others,
            disapproved,
        },
    } = props;

    return (
        <>
            <div
                className={cn(
                    "border-y text-center font-bold uppercase p-[1pt]",
                    isDownload
                        ? "border-black"
                        : "dark:border-border border-black"
                )}
            >
                <div className={cn(isDownload && "-mt-3 py-1.5")}>
                    7. Details of Action on Application
                </div>
            </div>
            <div
                className={cn(
                    "grid grid-cols-[1.25fr,1fr] divide-x h- [&>div]:p-[1pt]",
                    isDownload
                        ? "divide-black"
                        : "dark:divide-border divide-black"
                )}
            >
                <div>
                    <div
                        className={cn(
                            "uppercase",
                            isDownload && "-mt-1.5 mb-1"
                        )}
                    >
                        7.A Certification of Leave credits
                    </div>
                    <div className="flex flex-col">
                        <div className="flex gap-1 mx-auto mb-1">
                            As of{" "}
                            <div
                                className={cn(
                                    "border-b w-32 shrink-0 text-center",
                                    isDownload
                                        ? "border-black"
                                        : "dark:border-border border-black"
                                )}
                            >

                            </div>
                        </div>
                        <div
                            className={cn(
                                "w-[90%] mx-auto",
                                isDownload && "pt-2"
                            )}
                        >
                            <div
                                className={cn(
                                    "grid grid-cols-3 border divide-x text-[10px] h-5",
                                    isDownload
                                        ? "border-black divide-black"
                                        : "dark:border-border dark:divide-border border-black divide-black"
                                )}
                            >
                                <div className=""></div>
                                <div
                                    className={cn(
                                        "text-center",
                                        isDownload && "-mt-0.5"
                                    )}
                                >
                                    Vacation Leave
                                </div>
                                <div
                                    className={cn(
                                        "text-center",
                                        isDownload && "-mt-0.5"
                                    )}
                                >
                                    Sick Leave
                                </div>
                            </div>
                            <div
                                className={cn(
                                    "grid grid-cols-3 border border-t-0 divide-x text-[10px] h-[1.05rem]",
                                    isDownload
                                        ? "border-black divide-black"
                                        : "dark:border-border dark:divide-border border-black divide-black"
                                )}
                            >
                                <div
                                    className={cn(
                                        "italic",
                                        isDownload && "-mt-1.5"
                                    )}
                                >
                                    Total Earned
                                </div>
                                <div
                                    className={cn(
                                        "text-center",
                                        isDownload && "-mt-1.5"
                                    )}
                                >
                                </div>
                                <div
                                    className={cn(
                                        "text-center",
                                        isDownload && "-mt-1.5"
                                    )}
                                >
                                </div>
                            </div>
                            <div
                                className={cn(
                                    "grid grid-cols-3 border border-t-0 divide-x text-[10px] h-[1.05rem]",
                                    isDownload
                                        ? "border-black divide-black"
                                        : "dark:border-border dark:divide-border border-black divide-black"
                                )}
                            >
                                <div
                                    className={cn(
                                        "italic",
                                        isDownload && "-mt-1.5"
                                    )}
                                >
                                    Less this application
                                </div>
                                <div
                                    className={cn(
                                        "text-center",
                                        isDownload && "-mt-1.5"
                                    )}
                                >
                                </div>
                                <div
                                    className={cn(
                                        "text-center",
                                        isDownload && "-mt-1.5"
                                    )}
                                >
                                </div>
                            </div>
                            <div
                                className={cn(
                                    "grid grid-cols-3 border border-t-0 divide-x text-[10px] h-[1.05rem]",
                                    isDownload
                                        ? "border-black divide-black"
                                        : "dark:border-border dark:divide-border border-black divide-black"
                                )}
                            >
                                <div
                                    className={cn(
                                        "italic",
                                        isDownload && "-mt-1.5"
                                    )}
                                >
                                    Balance
                                </div>
                                <div
                                    className={cn(
                                        "text-center",
                                        isDownload && "-mt-1.5"
                                    )}
                                >
                                </div>
                                <div
                                    className={cn(
                                        "text-center",
                                        isDownload && "-mt-1.5"
                                    )}
                                >
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={cn("flex px-2 gap-3", isDownload && "pt-2.5")}>
                        <div className="mt-4 mb-2 w-[60%] mx-auto relative">
                            <div
                                className={cn(
                                    "h-4 text-center font-bold uppercase"
                                )}
                            >
                                <div
                                    className={cn(isDownload && "-mt-3")}
                                >
                                    NEO CARLO R. MAGNO
                                </div>
                            </div>
                            <hr className={cn("border-t border-black", (isDownload && "absolute w-full top-3"))} />
                            <div
                                className={cn(
                                    "text-center",
                                    isDownload ? "mt-2 mb-4" : "pt-0.5"
                                )}
                            >
                                <div className={cn(isDownload && "-mt-1")}>
                                    Administrative Officer IV (HRMO)
                                </div>
                            </div>
                        </div>
                        <div className="mt-4 mb-2 w-[60%] mx-auto relative">
                            <div
                                className={cn(
                                    "h-4 text-center font-bold uppercase"
                                )}
                            >
                                <div
                                    className={cn(isDownload && "-mt-3")}
                                >
                                    RAUL E. GACUS
                                </div>
                            </div>
                            <hr className={cn("border-t border-black", (isDownload && "absolute w-full top-3"))} />
                            <div
                                className={cn(
                                    "text-center",
                                    isDownload ? "mt-2 mb-4" : "pt-0.5"
                                )}
                            >
                                <div className={cn(isDownload && "-mt-1")}>
                                    Administrative Officer
                                </div>
                            </div>
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
                        7.B Recommendation
                    </div>
                    <div className="pl-2 flex flex-col grow">
                        <div className="flex gap-1 relative mt-1">
                            {is_for_approval ? (
                                <SquareCheck className="size-4" />
                            ) : (
                                <Square className="size-4" />
                            )}
                            <div className={cn(isDownload && "-mt-1.5")}>
                                For approval
                            </div>
                        </div>
                        <div className={cn("flex gap-1 relative mt-1")}>
                            {is_for_disapproval ? (
                                <SquareCheck className="size-4" />
                            ) : (
                                <Square className="size-4 shrink-0" />
                            )}
                            <div className={cn(isDownload && "-mt-1.5", !is_for_disapproval_input && "flex w-full")}>
                                For disapproval due to
                                <span className="undeline -mt-2">
                                    {is_for_disapproval_input}
                                </span>
                                {!is_for_disapproval_input && (<div className="border-b border-black grow mx-2"></div>)}
                            </div>

                            {!is_for_disapproval_input && (
                                <div className="absolute -bottom-5 w-[90.5%] right-2 border-b border-black"></div>
                            )}
                        </div>

                        <div className={cn("w-[80%] mx-auto mt-auto", isDownload ? "mb-3.5" : "mb-2")}>
                            <div
                                className={cn(
                                    "h-fit text-center font-bold uppercase"
                                )}
                            >
                                <div className={cn(isDownload && "-mt-5")}>
                                    <div>{principal?.name}</div>
                                    <div className="capitalize font-normal">{principal?.position}</div>
                                </div>
                            </div>
                            <div
                                className={cn(
                                    "border-t text-center",
                                    isDownload
                                        ? "border-black"
                                        : "dark:border-border border-black",
                                    isDownload ? "mt-2 mb-2" : "pt-0.5"
                                )}
                            >
                                <div className={cn(isDownload && "-mt-1")}>
                                    Immediate Supervisor
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div
                className={cn(
                    "grid grid-cols-[1.25fr,1fr] border-t [&>div]:p-[1pt]",
                    isDownload
                        ? "border-black"
                        : "dark:border-border border-black"
                )}
            >
                <div>
                    <div className={cn("uppercase", isDownload && "-mt-1.5")}>
                        7.C Approved for:
                    </div>
                    <div className={cn("flex ml-4", isDownload && "mt-2")}>
                        <div
                            className={cn(
                                "w-14 border-b text-center",
                                isDownload
                                    ? "border-black"
                                    : "dark:border-border border-black",
                                isDownload && "-mt-1.5 pb-1"
                            )}
                        >
                            <div
                                className={cn(
                                    !approved_for_days_with_pay && "opacity-0"
                                )}
                            >
                                /
                            </div>
                        </div>
                        <div className={cn(isDownload && "-mt-1.5")}>
                            days with pay
                        </div>
                    </div>
                    <div className={cn("flex ml-4", isDownload && "mt-2")}>
                        <div
                            className={cn(
                                "w-14 border-b text-center",
                                isDownload
                                    ? "border-black"
                                    : "dark:border-border border-black",
                                isDownload && "-mt-1.5 pb-1"
                            )}
                        >
                            <div
                                className={cn(
                                    !approved_for_days_with_out_pay &&
                                        "opacity-0"
                                )}
                            >
                                /
                            </div>
                        </div>
                        <div className={cn(isDownload && "-mt-1.5")}>
                            days with out pay
                        </div>
                    </div>
                    <div className={cn("flex ml-4", isDownload && "mt-2")}>
                        <div
                            className={cn(
                                "w-14 border-b text-center",
                                isDownload
                                    ? "border-black"
                                    : "dark:border-border border-black",
                                isDownload && "-mt-1.5 pb-1"
                            )}
                        >
                            <div
                                className={cn(
                                    !approved_for_others && "opacity-0"
                                )}
                            >
                                /
                            </div>
                        </div>
                        <div className={cn(isDownload && "-mt-1.5")}>
                            Others (Specify)
                        </div>
                    </div>
                </div>
                <div>
                    <div className={cn("uppercase", isDownload && "-mt-1.5")}>
                        7.D Disapproved due to:
                    </div>
                    <div
                        className={cn(
                            !disapproved &&
                                "border border-x-0 relative " +
                                    (isDownload
                                        ? "border-black"
                                        : "dark:border-border border-black"),
                            !disapproved &&
                                "after:border-b after:border-black after:w-full after:absolute after:-bottom-4 h-4 ml-4 mt-3 w-[95%] " +
                                    (isDownload
                                        ? "after:border-black"
                                        : "after:dark:border-border after:border-black"),
                            isDownload && disapproved && "-mt-px"
                        )}
                    >
                        {disapproved}
                    </div>
                </div>
            </div>
            <div className="pt-10 mb-2">
                <div className="w-[50%] mx-auto">
                    <div className="h-4 text-center font-bold uppercase">
                        Basilio P. Mana-ay, Jr. Ceso VI
                    </div>
                    <div
                        className={cn(
                            "pt-0.5 text-center "
                        )}
                    >
                        <div className={cn(isDownload && "-mt-1 mb-4")}>
                            Assistant Schools Division Superintendent
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default LeavePDFDetailsOfActionOnApplication;
