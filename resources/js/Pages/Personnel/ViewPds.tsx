import Modal from "@/Components/Modal";
import useWindowSize from "@/hooks/useWindowResize";
import { useEffect, useState } from "react";
import { pdfjs } from "react-pdf";
import { cn } from "@/lib/utils";
import { Page } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import { Button } from "@/Components/ui/button";
import { Download, X } from "lucide-react";
import PersonalDataSheetPDF from "../Search/PDSPDF";
import { Margin, usePDF } from "react-to-pdf";
import Tabs from "@/Components/framer/Tabs";

type ViewPDSProps = {
    authId: number;
    show: boolean;
    onClose: (close: false) => void;
};

type PagesType = { prev: number; current: number; next: number };

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.min.mjs",
    import.meta.url
).toString();

const options = {
    cMapUrl: "/cmaps/",
    standardFontDataUrl: "/standard_fonts/",
};

const initialPages = {
    prev: 0,
    current: 1,
    next: 0,
};

export default function ViewPDS({ show, authId, onClose }: ViewPDSProps) {
    const { width } = useWindowSize();
    const [size, setSize] = useState<number>(1024);
    const [data, setData] = useState<any>();
    const [activeTab, setActiveTab] = useState<"C1" | "C2" | "C3" | "C4">("C1");
    const [loading, setLoading] = useState(false);

    const download_pdf = usePDF({
        method: "save",
        filename: "application-for-leave.pdf",
        page: { format: "A4", margin: Margin.MEDIUM },
    });

    useEffect(() => {
        if (width >= 1125) {
            setSize(1024);
        } else if (width <= 1124 && width >= 1024) {
            setSize(850);
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
    }, [width]);

    useEffect(() => {
        if (show) {
            setLoading(true);
            const pds = window.axios.get(route("general-search.pds", [authId]));
            const authUser = window.axios.get(
                route("personnel.view-pds.user", [authId])
            );

            Promise.all([pds, authUser])
                .then((responses) => {
                    const [pds, authUser] = responses;

                    console.log(pds);

                    setData({ ...pds.data, ...authUser.data });
                })
                .finally(() => setLoading(false));
        } else {
            setTimeout(() => setData(null), 250);
        }
    }, [show]);

    return (
        <Modal show={show} onClose={() => onClose(false)} maxWidth="5xl" closeable={false}>
            <div className="p-6">
                <div className="flex items-center mb-4">
                    <Button
                        variant="secondary"
                        className="ml-auto px-6"
                        onClick={() => onClose(false)}
                    >
                        Close
                    </Button>
                </div>

                { loading ? (
                    <div className="w-fit h-fit mx-auto my-auto flex flex-col items-center gap-2">
                        <span className="loading loading-spinner loading-md"></span>
                        <div>Loading...</div>
                    </div>
                ) :
                    <>
                        <div className="border-b w-[calc(900px-20pt)] mx-auto flex items-center justify-between">
                            <Tabs
                                id="pds"
                                active={activeTab}
                                tabs={[
                                    { id: "C1", label: "C1" },
                                    { id: "C2", label: "C2" },
                                    { id: "C3", label: "C3" },
                                    { id: "C4", label: "C4" },
                                ]}
                                className="w-fit"
                                tabWidth="w-14 h-9"
                                navigate={(nav) =>
                                    setActiveTab(
                                        nav as "C1" | "C2" | "C3" | "C4"
                                    )
                                }
                            />

                            <Button
                                className="h-9 ml-auto"
                                size={"icon"}
                                variant={"secondary"}
                                onClick={() => download_pdf.toPDF()}
                            >
                                <Download className="size-5" />
                            </Button>
                        </div>

                        <div className={cn("mx-auto w-fit")}>
                            {data && (
                                <PersonalDataSheetPDF
                                    data={data}
                                    tab={activeTab}
                                    ref={download_pdf.targetRef}
                                />
                            )}
                        </div>
                    </>
                }
            </div>
        </Modal>
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
        <div className="relative shadow-[0px_1px_2px_0px_rgba(60,64,67,0.3),0px_2px_6px_2px_rgba(60,64,67,0.15)]">
            <Page
                key={`page_${page}`}
                pageNumber={page}
                width={size}
                onRenderSuccess={() => setIsRendered(true)}
            />
        </div>
    );
};
