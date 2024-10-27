import Modal, { ModalProps } from "@/Components/Modal";
import { SALNType } from "./Reports";
import { Margin, usePDF } from "react-to-pdf";
import PDFSALN from "./PDFSALN";
import { useReactToPrint } from "react-to-print";
import { Button } from "@/Components/ui/button";
import { Printer, X } from "lucide-react";
import { IPCRType } from "./Reports";
import PDFIPCR from "./PDFIPCR";

type Props = {
    ipcr: Array<IPCRType>;
    principal: {name: string; position: string};
    hr: {name: string};
} & ModalProps;

const PrintIPCR: React.FC<Props> = ({ ipcr, show, principal, hr, onClose }) => {
    const download_pdf = usePDF({
        method: "open",
        filename: "SALN.pdf",
        page: {
            format: "A4",
            margin: Margin.MEDIUM,
            orientation: "portrait",
        },
    });

    const handlePrint = useReactToPrint({
        content: () => download_pdf.targetRef.current,
    });

    return (
        <Modal show={show} onClose={() => onClose(false)} maxWidth="fit">
            <div className="p-6">
                <div className="flex justify-between">
                    <Button
                        variant={"ghost"}
                        onClick={() => handlePrint()}
                        className="gap-2"
                    >
                        <Printer className="size-4" />
                        <span>Print</span>
                    </Button>
                    <Button
                        variant={"ghost"}
                        size="icon"
                        onClick={() => onClose(false)}
                        className="gap-2"
                    >
                        <X className="size-4" />
                    </Button>
                </div>
                <style>
                    {`
                        @media print {
                            body {
                                overflow: hidden;
                                height: fit-content;
                            }
                        }

                        @page {
                            size: portrait;
                        }
                    `}
                </style>
                <div className=" overflow-y-auto rounded-scrollbar overflow-x-hidden">
                    <PDFIPCR ipcr={ipcr} ref={download_pdf.targetRef}  principal={principal} hr={hr} />
                </div>
            </div>
        </Modal>
    );
};

export default PrintIPCR;
