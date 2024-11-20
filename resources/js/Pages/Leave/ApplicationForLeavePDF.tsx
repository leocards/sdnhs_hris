import { Button } from "@/Components/ui/button";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { PageProps } from "@/types";
import { Download, EllipsisVertical, Printer } from "lucide-react";
import { useEffect, useState } from "react";
import { Margin, usePDF } from "react-to-pdf";
import { useReactToPrint } from "react-to-print";
import LeaveRespond from "./LeaveRespond";
import { Breadcrumbs } from "@/Components/ui/breadcrumb";
import LeavePDF from "./LeavePDF";
import ViewLeaveResponse from "./ViewLeaveResponse";
import {
    Menubar,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarTrigger,
} from "@/Components/ui/menubar";
import UploadMedical from "./UploadMedical";
import ViewMedical from "./ViewMedical";
import { cn } from "@/lib/utils";

export type Principal = {
    name: string
    position: string
}

const ApplicationForLeavePDF = ({
    auth,
    leave,
    hr,
    open,
    principal,
}: PageProps<{ leave: any; hr: string; open: any, principal: Principal }>) => {
    const [showRespond, setShowRespond] = useState<boolean>(false);
    const [showViewResponse, setShowViewResponse] = useState<boolean>(false);
    const [showUploadMedical, setUploadMedical] = useState(false);
    const [showMedical, setShowMedical] = useState(false);
    const [respondLeave, setRespondLeave] = useState<
        "rejected" | "approved" | null
    >(null);
    const { targetRef } = usePDF({
        method: "open",
        filename: "application-for-leave.pdf",
        page: { format: "A4", margin: Margin.MEDIUM },
    });
    const download_pdf = usePDF({
        method: "save",
        filename: "application-for-leave.pdf",
        page: { format: "A4", margin: Margin.MEDIUM },
    });

    const handlePrint = useReactToPrint({
        content: () => targetRef.current,
    });

    useEffect(() => {
        if (open && open === "response") {
            setShowViewResponse(true);
        }
    }, [open]);

    return (
        <Authenticated
            userAuth={auth.user}
            header={
                <h2 className="font-semibold text-xl leading-tight">Leave</h2>
            }
        >
            <div className="mt-3 mb-10">
                <Breadcrumbs
                    home="Leave"
                    homeLink="leave"
                    links={[{ link: "", linkname: "View" }]}
                />
            </div>

            <div className="flex mb-3">
                <div>
                    <Button
                        variant={"ghost"}
                        onClick={() => setShowViewResponse(true)}
                    >
                        <span>View response</span>
                    </Button>
                </div>
                <div className="ml-auto flex gap-2">
                    <Button
                        onClick={() => {
                            if (
                                leave.hr_status !== "Pending" ||
                                leave.principal_status !== "Pending"
                            )
                                handlePrint();
                        }}
                        className="gap-2"
                        size="icon"
                        variant="ghost"
                        disabled={
                            (leave.hr_status === "Pending" ||
                            leave.principal_status === "Pending")
                        }
                    >
                        <Printer className="size-5" />
                    </Button>
                    <Button
                        onClick={() => {
                            if (
                                leave.hr_status !== "Pending" ||
                                leave.principal_status !== "Pending"
                            )
                                download_pdf.toPDF();
                        }}
                        className="gap-2"
                        size="icon"
                        variant="ghost"
                        disabled={
                            (leave.hr_status === "Pending" ||
                            leave.principal_status === "Pending")
                        }
                    >
                        <Download className="size-5" />
                    </Button>

                    {(leave?.leave_type === "Sick Leave" ||
                        auth.user.role === "HR" ||
                        auth.user.role === "HOD") && (
                        <MoreMenu
                            onClick={(event: any) => {
                                if (["rejected", "approved"].includes(event)) {
                                    setShowRespond(true);
                                    setRespondLeave(event);
                                }
                                if (event === "upload") {
                                    setUploadMedical(true);
                                }
                                if (event === "view") {
                                    setShowMedical(true);
                                }
                            }}
                            isSickLeave={leave?.leave_type === "Sick Leave"}
                            isResponded={
                                (auth.user.role === "HR" &&
                                    leave.hr_status !== "Pending") ||
                                (auth.user.role === "HOD" &&
                                    leave.principal_status !== "Pending")
                            }
                            hasMedical={leave.medical_certificate}
                            isOwner={leave.user.id === auth.user.id}
                            withResponse={["HR", "HOD"].includes(
                                auth.user.role
                            )}
                        />
                    )}
                </div>
            </div>

            <div className="overflow-hidden overflow-x-auto h-auto py-2">
                <div className="mx-auto border overflow-hidden w-[790px] flex gap-2">
                    <LeavePDF ref={targetRef} leave={leave} hr={hr} principal={principal} />
                    <LeavePDF
                        ref={download_pdf.targetRef}
                        isDownload
                        leave={leave}
                        hr={hr}
                        principal={principal}
                    />
                </div>
            </div>

            <LeaveRespond
                show={showRespond}
                status={respondLeave}
                onClose={setShowRespond}
            />
            <ViewLeaveResponse
                show={showViewResponse}
                onClose={setShowViewResponse}
                response={{
                    hr: {
                        reponse: leave.hr_status,
                        message: leave.hr_reject_msg,
                    },
                    principal: {
                        reponse: leave.principal_status,
                        message: leave.principal_reject_msg,
                    },
                }}
            />
            <UploadMedical
                show={showUploadMedical}
                data={{
                    leave_id: leave.id,
                    medical: leave.medical_certificate,
                    user: {
                        id: leave.user.id,
                    },
                }}
                onClose={setUploadMedical}
            />
            <ViewMedical
                show={showMedical}
                data={{
                    leave_id: leave.id,
                    medical: leave.medical_certificate,
                    user: {
                        id: leave.user.id,
                        first_name: leave.user.first_name,
                        last_name: leave.user.last_name,
                    },
                }}
                onClose={setShowMedical}
            />
        </Authenticated>
    );
};

const MoreMenu = ({
    isResponded,
    withResponse,
    hasMedical,
    onClick,
    isSickLeave,
    isOwner,
}: {
    onClick: CallableFunction;
    isSickLeave: boolean;
    isResponded: boolean;
    hasMedical: boolean;
    isOwner: boolean;
    withResponse: boolean;
}) => {
    return (
        <Menubar className="p-0 border-none">
            <MenubarMenu>
                <MenubarTrigger className="h-full w-10 cursor-pointer p-0 justify-center">
                    <EllipsisVertical className="size-5" />
                </MenubarTrigger>
                <MenubarContent align="end" className="text-sm divide-y">
                    {isSickLeave && (
                        <>
                            {!isOwner ? (
                                <>
                                    <MenubarItem
                                        onClick={() =>
                                            hasMedical && onClick("view")
                                        }
                                        className={cn(
                                            !hasMedical &&
                                                "opacity-50 pointer-events-none"
                                        )}
                                    >
                                        {" "}
                                        View medical{" "}
                                    </MenubarItem>
                                </>
                            ) : (
                                <>
                                    <MenubarItem
                                        onClick={() => onClick("upload")}
                                    >
                                        {" "}
                                        Upload medical{" "}
                                    </MenubarItem>
                                </>
                            )}
                        </>
                    )}
                    {!isResponded && withResponse ? (
                        <>
                            <MenubarItem
                                onClick={() => onClick("approved")}
                                className="!text-green-600 hover:!bg-green-500/10"
                            >
                                {" "}
                                Approve{" "}
                            </MenubarItem>
                            <MenubarItem
                                onClick={() => onClick("rejected")}
                                className="!text-red-600 hover:!bg-red-500/10 !border-t-0"
                            >
                                {" "}
                                Reject{" "}
                            </MenubarItem>
                        </>
                    ) : (
                        withResponse && (
                            <div className="text-center py-2 text-secondary-foreground/50">
                                You have responded
                            </div>
                        )
                    )}
                </MenubarContent>
            </MenubarMenu>
        </Menubar>
    );
};

export default ApplicationForLeavePDF;
