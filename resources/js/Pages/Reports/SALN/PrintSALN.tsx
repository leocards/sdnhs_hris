import Modal, { ModalProps } from "@/Components/Modal";
import { HrType, PrincipalType, SALNType } from "./Index";
import { Margin, usePDF } from "react-to-pdf";
import PDFSALN from "./PDFSALN";
import { useReactToPrint } from "react-to-print";
import { Button } from "@/Components/ui/button";
import { Printer, X } from "lucide-react";

type Props = {
    saln: Array<SALNType>;
    principal?: PrincipalType;
    hr?: HrType;
    year: string
} & ModalProps;

const PrintSALN: React.FC<Props> = ({ saln, show, principal, hr, year, onClose }) => {
    const download_pdf = usePDF({
        method: "open",
        filename: "SALN.pdf",
        page: { format: "LEGAL", margin: Margin.MEDIUM, orientation: "landscape" },
    });

    const handlePrint = useReactToPrint({
        content: () => download_pdf.targetRef.current,
    });

    return (
        <Modal show={show} onClose={() => onClose(false)} maxWidth="fit" isFullScreen>
            <div className="p-4">
                <div className="flex justify-between">
                    <Button variant={"ghost"} onClick={() => handlePrint()} className="gap-2">
                        <Printer className="size-4" />
                        <span>Print</span>
                    </Button>
                    <Button variant={"ghost"} size="icon" onClick={() => onClose(false)} className="gap-2">
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
                            size: landscape;
                        }
                    `}
                </style>
                <div className="max-h-[36.5rem] overflow-y-auto rounded-scrollbar overflow-x-hidden">
                    <PDFSALN ref={download_pdf.targetRef} saln={saln}  principal={principal} hr={hr} year={year} />
                </div>
            </div>
        </Modal>
    );
};

export default PrintSALN;
