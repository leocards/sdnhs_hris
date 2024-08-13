import { Button } from "@/Components/ui/button";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { PageProps } from "@/types";
import { Download, EllipsisVertical, Printer } from "lucide-react";
import { useState } from "react";
import { Margin, usePDF } from "react-to-pdf";
import { useReactToPrint } from "react-to-print";
import LeaveRespond from "./LeaveRespond";
import LeaveStatus from "@/Components/LeaveStatus";
import { Breadcrumbs } from "@/Components/ui/breadcrumb";
import LeavePDF from "./LeavePDF";

const ApplicationForLeavePDF = ({ auth, leave, hr }: PageProps<{ leave: any, hr: string }>) => {
    const [showRespond, setShowRespond] = useState<boolean>(false);
    const [respondLeave, setRespondLeave] = useState<
        "rejected" | "approved" | null
    >(null);
    const { toPDF, targetRef } = usePDF({
        method: "open",
        filename: "application-for-leave.pdf",
        page: { format: "A4", margin: Margin.MEDIUM },
    });
    const download_pdf = usePDF({
        method: "open",
        filename: "application-for-leave.pdf",
        page: { format: "A4", margin: Margin.MEDIUM },
    });

    const handlePrint = useReactToPrint({
        content: () => targetRef.current
    });

    console.log(leave)

    return (
        <Authenticated
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Leave
                </h2>
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
                    <Button variant={"ghost"}>
                        <span>View response</span>
                    </Button>
                </div>
                <div className="ml-auto flex gap-2">
                    <Button
                        onClick={handlePrint}
                        className="gap-2"
                        size="icon"
                        variant="ghost"
                    >
                        <Printer className="size-5" />
                    </Button>
                    <Button
                        onClick={() => download_pdf.toPDF()}
                        className="gap-2"
                        size="icon"
                        variant="ghost"
                    >
                        <Download className="size-5" />
                    </Button>
                    <Button
                        className="gap-2"
                        size="icon"
                        variant="ghost"
                    >
                        <EllipsisVertical className="size-5" />
                    </Button>
                </div>
            </div>

            <div className="overflow-hidden overflow-x-auto h-auto py-2">
                <div className="mx-auto border overflow-hidden w-[790px] flex gap-2">
                    <LeavePDF ref={targetRef} leave={leave} hr={hr} />
                    <LeavePDF ref={download_pdf.targetRef} isDownload leave={leave} hr={hr} />
                </div>
            </div>

            <LeaveRespond
                show={showRespond}
                status={respondLeave}
                onClose={setShowRespond}
            />
        </Authenticated>
    );
};

export default ApplicationForLeavePDF;
