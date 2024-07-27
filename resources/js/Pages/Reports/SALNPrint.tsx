import Authenticated from "@/Layouts/AuthenticatedLayout";
import { PageProps } from "@/types";
import SALNPDF from "./SALNPDF";
import { Button } from "@/Components/ui/button";
import { Download, Printer, Undo2 } from "lucide-react";
import { router } from "@inertiajs/react";
import {
    PDFViewer,
    BlobProvider,
    PDFDownloadLink,
    pdf,
} from "@react-pdf/renderer";
import { Document, Page } from "react-pdf";
import { pdfjs } from "react-pdf";
import type { PDFDocumentProxy } from "pdfjs-dist";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import useWindowSize from "@/hooks/useWindowResize";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
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

export default function SALNPriint({ auth }: PageProps) {
    const { width } = useWindowSize();
    const [size, setSize] = useState<number>(1000);
    const [numPages, setNumPages] = useState<number>();
    const [pages, setPages] = useState<PagesType>(initialPages);
    const [PDFLoaded, setPDFLoaded] = useState<boolean>(false);

    function onDocumentLoadSuccess({
        numPages: nextNumPages,
    }: PDFDocumentProxy): void {
        setNumPages(nextNumPages);
        setPDFLoaded(true);
        if (nextNumPages > 1) {
            setPages((prev) => ({ ...prev, next: 2 }));
        }
    }

    /* useEffect(() => {
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
    }, [width]); */

    return (
        <Authenticated user={auth.user}>
            <div className="mb-10 flex justify-between">
                <Button
                    className="gap-2"
                    onClick={() => router.get(route("reports"))}
                >
                    <Undo2 className="size-4" />
                    <span>Back</span>
                </Button>
                <PDFDownloadLink
                    document={<SALNPDF />}
                    fileName="Application for Leave.pdf"
                >
                    {({ loading }) =>
                        loading ? (
                            ""
                        ) : (
                            <Button className="gap-3" variant="ghost">
                                <Download className="size-5" />
                                <span>Download</span>
                            </Button>
                        )
                    }
                </PDFDownloadLink>
            </div>
            <div className="w-fit mx-auto">
                <BlobProvider document={<SALNPDF />}>
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
                                    className={"flex flex-col space-y-4"}
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
