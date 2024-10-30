import Modal, { ModalProps } from "@/Components/Modal";
import React, { useState, useEffect } from "react";
import { Document, Page } from "react-pdf";
import { pdfjs } from "react-pdf";
import type { PDFDocumentProxy } from "pdfjs-dist";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import useWindowSize from "@/hooks/useWindowResize";
import { InView } from "react-intersection-observer";
import { cn } from "@/lib/utils";
import { Button } from "@/Components/ui/button";
import file from "@/assets/2015 SALN Form.pdf";
import { Download, Undo2 } from "lucide-react";
import { useToast } from "@/Components/ui/use-toast";
import Processing from "@/Components/Processing";
import { format } from "date-fns";
import { useForm } from "@inertiajs/react";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.min.mjs",
    import.meta.url
).toString();

const options = {
    cMapUrl: "/cmaps/",
    standardFontDataUrl: "/standard_fonts/",
};

type PDFFile = string | File | null;

type PDFViewerProps = {
    file?: PDFFile;
    isViewDetails?: boolean;
};

type PagesType = { prev: number; current: number; next: number };

const initialPages = {
    prev: 0,
    current: 1,
    next: 0,
};

type Props = {
    id: number;
    salnList: Array<any>;
} & ModalProps;

const ViewSalnPersonnel: React.FC<Props> = ({
    show,
    id,
    salnList,
    onClose,
}) => {
    const { width } = useWindowSize();
    const [size, setSize] = useState<number>(800);
    const [numPages, setNumPages] = useState<number>();
    const [pages, setPages] = useState<PagesType>(initialPages);

    const [view, setView] = useState(false);
    const [selected, setSelected] = useState<any>(null);
    const { toast } = useToast();
    const [isApprovalSubmit, setIsApprovalSubmit] = useState(false)
    const {data, setData, processing, post, reset } = useForm({
        isApprove: false
    })

    useEffect(() => {
        if (width >= 1234) {
            setSize(800);
        } else if (width >= 856) {
            setSize(800);
        } else if (width >= 755) {
            setSize(700);
        } else if (width >= 556) {
            setSize(500);
        } else if (width > 456) {
            setSize(350);
        } else {
            setSize(300);
        }
    }, [width]);

    function onDocumentLoadSuccess({
        numPages: nextNumPages,
    }: PDFDocumentProxy): void {
        setNumPages(nextNumPages);
        if (nextNumPages > 1) {
            setPages((prev) => ({ ...prev, next: 2 }));
        }
    }

    const onApprove = (salnId: any) => {
        setData({ isApprove: true })
        setIsApprovalSubmit(true)
        setSelected(salnId)
    };

    useEffect(() => {
        if(isApprovalSubmit) {
            post(route("saln.approve", [selected?.id]), {
                onSuccess: () => {
                    toast({
                        variant: "success",
                        description: "SALN has been approved.",
                    });
                    setSelected(null)
                    setView(false)
                },
                onFinish: () => {
                    onClose(false)
                    reset()
                    setIsApprovalSubmit(false)
                }
            })
        }
    }, [isApprovalSubmit])

    return (
        <Modal show={show} onClose={() => onClose(false)} maxWidth="5xl" center>
            <Processing is_processing={processing} />

            <div className="p-6">
                <div className="flex items-center mb-4">
                    {
                        view && (<>
                            <Button
                                variant="ghost"
                                size={"icon"}
                                className="px-"
                                onClick={() => {
                                    setView(false)
                                    setSelected(null)
                                }}
                            >
                                <Undo2 className="size-5" />
                            </Button>

                            {(selected && !selected.isApproved) && <Button
                                className="!bg-green-700 ml-3"
                                onClick={() => selected && onApprove(selected.id)}
                            >
                                Approve
                            </Button>}
                        </>)
                    }
                    <Button
                        variant="secondary"
                        className="ml-auto px-6"
                        onClick={() => onClose(false)}
                    >
                        Close
                    </Button>
                </div>
                {(salnList && !view) &&
                    salnList.map((list, index) => (
                        <div className="relative mb-2" key={index}>
                            <div
                                className="h-12 border rounded-md flex items-center px-3 pr-2 hover:underline cursor-pointer hover:bg-secondary"
                                onClick={() => {
                                    setView(true);
                                    setSelected(list);
                                }}
                            >
                                <div>SALN As of {format(list.asof, "PP")}</div>
                            </div>
                            <Button
                                className="!bg-green-700 h-9 ml-auto absolute top-1.5 right-1.5"
                                onClick={() => onApprove(list)}
                            >
                                Approve
                            </Button>
                        </div>
                    ))}
                {view && (
                    <div className="h-[30rem] overflow-y-auto rounded-scrollbar flex justify-center">
                        <Document
                            file={file}
                            onLoadSuccess={onDocumentLoadSuccess}
                            options={options}
                            className={"flex flex-col space-y-4"}
                        >
                            {Array.from(new Array(numPages), (_, index) => (
                                <PDFPages
                                    key={index}
                                    index={index}
                                    size={size}
                                    pdfpages={pages}
                                    totalPages={numPages}
                                    inView={setPages}
                                />
                            ))}
                        </Document>
                    </div>
                )}
            </div>
        </Modal>
    );
};

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
        <div className="relative shadow-md">
            <InView
                threshold={0.4}
                className={cn(
                    "absolute top-0 left-0 w-full h-full pointer-events-none "
                )}
                onChange={setInView}
            />
            <Page
                key={`page_${page}`}
                pageNumber={page}
                width={size}
                onRenderSuccess={() => setIsRendered(true)}
            />
        </div>
    );
};

export default ViewSalnPersonnel;
