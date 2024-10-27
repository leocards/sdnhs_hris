import { PDFViewer } from "@react-pdf/renderer";
import IPCRPDF from "./IPCRPDF";
import Modal from "@/Components/Modal";
import { Button } from "@/Components/ui/button";
import { Check, ChevronDown, X } from "lucide-react";
import useWindowSize from "@/hooks/useWindowResize";
import { useEffect, useRef, useState } from "react";
import { PageSize } from "@react-pdf/types";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/Components/ui/popover";
import { IPCRType } from "./Reports";

export default function IPCRPrint({
    principal,
    hr,
    ipcr,
    show,
    onClose,
}: {
    ipcr: Array<IPCRType>;
    principal: {name: string; position: string};
    hr: {name: string};
    show: boolean;
    onClose: (close: false) => void;
}) {
    const { width } = useWindowSize();
    const [size, setSize] = useState<number>(950);
    const [pageSize, setPageSize] = useState<{
        size: PageSize;
        selectedSize: string;
    }>({ size: "A4", selectedSize: "A4" });
    const [showSelectSize, setShowSelectSize] = useState<boolean>(false);

    useEffect(() => {
        if (width >= 1122) {
            setSize(950);
        } else if (width <= 1122 && width >= 922) {
            setSize(750);
        } else if (width <= 921 && width >= 780) {
            setSize(600);
        } else if (width <= 779 && width >= 639) {
            setSize(450);
        } else if (width <= 640 && width >= 488) {
            setSize(380);
        } else if (width <= 487 && width >= 402) {
            setSize(300);
        } else {
            setSize(250);
        }
    }, [width]);

    return (
        <Modal
            show={show}
            onClose={() => onClose(false)}
            closeable={false}
            maxWidth="fit"
            center="!mx-auto"
        >
            <div className="p-6 relative">
                <div className="mb-6 flex justify-between">
                    <Popover
                        open={showSelectSize}
                        onOpenChange={setShowSelectSize}
                    >
                        <PopoverTrigger asChild>
                            <Button
                                className="w-32 hover:bg-transparent"
                                variant="outline"
                            >
                                <span>{pageSize.selectedSize}</span>
                                <ChevronDown className="size-4 ml-auto" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="p-2 w-40" align="start">
                            <div
                                className="rounded hover:bg-secondary flex items-center p-1"
                                role="button"
                                onClick={() => {
                                    setPageSize({
                                        size: "LETTER",
                                        selectedSize: "LETTER",
                                    });
                                    setShowSelectSize(false);
                                }}
                            >
                                <div className="w-4 shrink-0 mr-2">
                                    {pageSize.size === "LETTER" && (
                                        <Check className="size-4" />
                                    )}
                                </div>
                                <div>Letter</div>
                            </div>
                            <div
                                className="rounded hover:bg-secondary flex items-center p-1"
                                role="button"
                                onClick={() => {
                                    setPageSize({
                                        size: "LEGAL",
                                        selectedSize: "LEGAL",
                                    });
                                    setShowSelectSize(false);
                                }}
                            >
                                <div className="w-4 shrink-0 mr-2">
                                    {pageSize.size === "LEGAL" && (
                                        <Check className="size-4" />
                                    )}
                                </div>
                                <div>Legal</div>
                            </div>
                            <div
                                className="rounded hover:bg-secondary flex items-center p-1"
                                role="button"
                                onClick={() => {
                                    setPageSize({
                                        size: "A4",
                                        selectedSize: "A4",
                                    });
                                    setShowSelectSize(false);
                                }}
                            >
                                <div className="w-4 shrink-0 mr-2">
                                    {pageSize.size === "A4" && (
                                        <Check className="size-4" />
                                    )}
                                </div>
                                <div>A4</div>
                            </div>
                        </PopoverContent>
                    </Popover>
                    <Button
                        size="icon"
                        variant={"ghost"}
                        onClick={() => onClose(false)}
                    >
                        <X className="size-5" />
                    </Button>
                </div>

                <PDFViewer
                    className="h-[100vh] rounded-md"
                    width={size}
                >
                    <IPCRPDF size={pageSize.size} ipcr={ipcr} principal={principal} hr={hr} />
                </PDFViewer>
            </div>
        </Modal>
    );
}
