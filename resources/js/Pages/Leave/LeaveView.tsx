import { Breadcrumbs } from "@/Components/ui/breadcrumb";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { PageProps } from "@/types";
import PDFLeave from "./PDFLeave";
import { PDFViewer, BlobProvider, PDFDownloadLink } from "@react-pdf/renderer";
import { useEffect, useRef, useState } from "react";
import { Document, Page } from "react-pdf";
import { pdfjs } from "react-pdf";
import type { PDFDocumentProxy } from "pdfjs-dist";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import useWindowSize from "@/hooks/useWindowResize";
import { Button } from "@/Components/ui/button";
import { Ban, Check, Download } from "lucide-react";
import { cn } from "@/lib/utils";
import LeaveRespond from "./LeaveRespond";
import LeaveStatus from "@/Components/LeaveStatus";
import { Label } from "@/Components/ui/label";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.min.mjs",
    import.meta.url
).toString();

const options = {
    cMapUrl: "/cmaps/",
    standardFontDataUrl: "/standard_fonts/",
};

type PagesType = { prev: number; current: number; next: number };
const initialPages = {
    prev: 0,
    current: 1,
    next: 0,
};

const PRINCIPAL = "HOD";

export default function LeaveView({ auth, leave }: PageProps<{ leave: any }>) {
    const { width } = useWindowSize();
    const [blobs, setBlobs] = useState<any>();
    const [size, setSize] = useState<number>(800);
    const [numPages, setNumPages] = useState<number>();
    const [pages, setPages] = useState<PagesType>(initialPages);
    const [PDFLoaded, setPDFLoaded] = useState<boolean>(false);
    const [showRespond, setShowRespond] = useState<boolean>(false);
    const [respondLeave, setRespondLeave] = useState<
        "rejected" | "approved" | null
    >(null);
    const [viewMedical, setViewMedical] = useState<boolean>(false)

    function onDocumentLoadSuccess({
        numPages: nextNumPages,
    }: PDFDocumentProxy): void {
        setNumPages(nextNumPages);
        setPDFLoaded(true);
        if (nextNumPages > 1) {
            setPages((prev) => ({ ...prev, next: 2 }));
        }
    }

    useEffect(() => {
        if (width >= 1196) {
            setSize(800);
        } else if (width <= 1195 && width >= 1024) {
            setSize(600);
        } else if (width <= 1023 && width >= 866) {
            setSize(800);
        } else if (width <= 865 && width >= 668) {
            setSize(600);
        } else if (width <= 667 && width >= 562) {
            setSize(500);
        } else if (width <= 561 && width >= 466) {
            setSize(400);
        } else {
            setSize(350);
        }
        console.log(leave)
    }, [width]);

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
            <div className="mb-5">
                <div className="shadow p-3 px-3.5 rounded-lg">
                    <div className="flex">
                        <div>
                            <Label>Application of Leave status:</Label>
                            <div className="flex items-center gap-3">
                                <Label className="w-28 flex justify-between">
                                    HR <span>:</span>
                                </Label>
                                <LeaveStatus status={leave.hr_status} />
                            </div>
                            <div className="flex items-center gap-3">
                                <Label className="w-28 flex justify-between">
                                    Principal <span>:</span>
                                </Label>
                                <LeaveStatus status={leave.principal_status} />
                            </div>
                            {leave.medical_certificate && <Button variant="link" onClick={() => setViewMedical(!viewMedical)} className="px-0">
                                View medical
                            </Button>}
                        </div>
                        <div className="ml-auto flex h-fit space-x-4">
                            {PDFLoaded &&
                                (auth.user.role === PRINCIPAL ||
                                    auth.user.role === "HR") && (
                                    <>
                                        {auth.user.role === "HR" &&
                                            leave.hr_status !== "Pending" && (
                                                <LeaveStatus
                                                    className="my-auto ml-auto"
                                                    status={leave.hr_status}
                                                />
                                            )}
                                        {auth.user.role === PRINCIPAL &&
                                            leave.principal_status !==
                                                "Pending" && (
                                                <LeaveStatus
                                                    className="my-auto ml-auto"
                                                    status={
                                                        leave.principal_status
                                                    }
                                                />
                                            )}
                                        {((leave.hr_status === "Pending" &&
                                            auth.user.role === "HR") ||
                                            (leave.principal_status ===
                                                "Pending" &&
                                                auth.user.role ===
                                                    PRINCIPAL)) && (
                                            <>
                                                <Button
                                                    variant="destructive"
                                                    className="gap-3 hover:bg-destructive ml-auto"
                                                    onClick={() => {
                                                        setShowRespond(true);
                                                        setRespondLeave(
                                                            "rejected"
                                                        );
                                                    }}
                                                >
                                                    <Ban className="size-5" />
                                                    <span>Reject</span>
                                                </Button>
                                                <Button
                                                    className="gap-3 bg-green-700"
                                                    onClick={() => {
                                                        setShowRespond(true);
                                                        setRespondLeave(
                                                            "approved"
                                                        );
                                                    }}
                                                >
                                                    <Check className="size-5" />
                                                    <span>Approved</span>
                                                </Button>
                                            </>
                                        )}
                                    </>
                                )}

                            <PDFDownloadLink
                                document={<PDFLeave />}
                                fileName="Application for Leave.pdf"
                            >
                                {({ loading }) =>
                                    loading ? (
                                        ""
                                    ) : (
                                        <Button
                                            className="gap-3"
                                            variant="ghost"
                                        >
                                            <Download className="size-5" />
                                            <span>Download</span>
                                        </Button>
                                    )
                                }
                            </PDFDownloadLink>
                        </div>
                    </div>

                    {viewMedical && (
                        <div className="mt-5">
                            <img src={leave.medical_certificate?.file_path?.replace('public/', '/storage/')} className="h-96" />
                        </div>
                    )}
                    
                    {(leave.hr_reject_msg || leave.principal_reject_msg) && (
                        <div className="space-y-3 mt-5">
                            <Label>Response for rejection:</Label>
                            {leave.hr_reject_msg && (
                                <div className="flex sm:flex-row flex-col sm:gap-3 gap-1 ml-2 items-start">
                                    <Label className="shrink-0 w-40 flex leading-5">
                                        HR's response{" "}
                                        <span className="ml-auto">:</span>
                                    </Label>
                                    <div>
                                        {leave.hr_reject_msg}
                                    </div>
                                </div>
                            )}
                            {leave.principal_reject_msg && (
                                <div className="flex sm:flex-row flex-col sm:gap-3 gap-1 ml-2 items-start">
                                    <Label className="shrink-0 w-40 flex leading-5">
                                        Principal's response{" "}
                                        <span className="ml-auto">:</span>
                                    </Label>
                                    <div>
                                        {leave.principal_reject_msg}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
            <div className="flex h-fit">
                <BlobProvider document={<PDFLeave />}>
                    {({ blob, url, loading, error }) => {
                        // Do whatever you need with blob here
                        if (loading)
                            return (
                                <div className="flex items-center gap-3 justify-center p-5 w-fit mx-auto">
                                    <span className="loading loading-spinner loading-md"></span>
                                    Loading
                                </div>
                            );

                        return (
                            <div
                                className={cn(
                                    "mx-auto",
                                    PDFLoaded &&
                                        "shadow-[0px_1px_2px_0px_rgba(60,64,67,0.3),0px_2px_6px_2px_rgba(60,64,67,0.15)]"
                                )}
                            >
                                <Document
                                    file={blob}
                                    onLoadSuccess={onDocumentLoadSuccess}
                                    options={options}
                                    className={"flex flex-col space-y-"}
                                    loading={
                                        <div className="flex items-center gap-3 justify-center p-5">
                                            <span className="loading loading-spinner loading-md"></span>
                                            Loading
                                        </div>
                                    }
                                >
                                    {Array.from(
                                        new Array(numPages),
                                        (_, index) => (
                                            <PDFPages
                                                key={index}
                                                index={index}
                                                size={size}
                                                pdfpages={pages}
                                                totalPages={numPages}
                                                inView={setPages}
                                            />
                                        )
                                    )}
                                </Document>
                            </div>
                        );
                    }}
                </BlobProvider>
            </div>

            <LeaveRespond
                show={showRespond}
                status={respondLeave}
                onClose={setShowRespond}
            />
        </Authenticated>
    );
}

const PDFPages = ({
    size,
    index,
    inView,
    pdfpages,
    totalPages,
}: {
    totalPages?: number;
    pdfpages: PagesType;
    index: number;
    size: number;
    inView?: (pageview: PagesType) => void;
}) => {
    const [isRendered, setIsRendered] = useState<boolean>(false);
    const page = index + 1;

    const setInView = (isView: boolean) => {
        // when page has been rendred and viewed in the screen
        if (isRendered && inView) {
            // check if there are more than 1 page
            if (totalPages && totalPages > 1) {
                // initialize next page number
                const next = totalPages > page + 1 ? page + 1 : 0;
                // check if the page is viewed on the screen
                if (isView) {
                    // check if the user scroll up by checking if the viewed page is equal to previous page
                    if (pdfpages.prev == page) {
                        inView({ current: page, prev: page - 1, next: next });
                    } else {
                        inView({ ...pdfpages, current: page });
                    }
                } else {
                    inView({ ...pdfpages, prev: page, next: next });
                }
            }
        }
    };

    return (
        <div className="relative">
            <Page
                key={`page_${page}`}
                pageNumber={page}
                width={size}
                onRenderSuccess={() => setIsRendered(true)}
            />
        </div>
    );
};
