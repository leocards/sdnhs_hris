import Modal from "@/Components/Modal";
import useWindowSize from "@/hooks/useWindowResize";
import { useEffect, useState } from "react";
import { pdfjs } from "react-pdf";
import type { PDFDocumentProxy } from "pdfjs-dist";
import { cn } from "@/lib/utils";
import { Document, Page } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import pdsPDF from "@/pds.pdf"
import { Button } from "@/Components/ui/button";
import { X } from "lucide-react";

type ViewPDSProps = {
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

export default function ViewPDS({ show, onClose }: ViewPDSProps) {
    const { width } = useWindowSize();
    const [size, setSize] = useState<number>(1024);
    const [numPages, setNumPages] = useState<number>();
    const [pages, setPages] = useState<PagesType>(initialPages);

    function onDocumentLoadSuccess({
        numPages: nextNumPages,
    }: PDFDocumentProxy): void {
        setNumPages(nextNumPages);
        if (nextNumPages > 1) {
            setPages((prev) => ({ ...prev, next: 2 }));
        }
    }

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

    return (
        <Modal show={show} onClose={() => onClose(false)} maxWidth="6xl">
            <div className="p-6">
                <div className="h-14 flex items-center mb-4">
                    <Button variant="secondary" size="icon" className="ml-auto" onClick={() => onClose(false)}>
                        <X className="size-5" />
                    </Button>
                </div>

                <div
                    className={cn(
                        "mx-auto w-fit",
                    )}
                >
                    <Document
                        file={pdsPDF}
                        onLoadSuccess={onDocumentLoadSuccess}
                        options={options}
                        className={"flex flex-col space-y-6 h-fit"}
                        loading={
                            <div className="flex items-center gap-3 justify-center p-5">
                                <span className="loading loading-spinner loading-md"></span>
                                Loading
                            </div>
                        }
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