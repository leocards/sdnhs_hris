import Modal, { ModalProps } from "@/Components/Modal";
import { Margin, usePDF } from "react-to-pdf";
import { useReactToPrint } from "react-to-print";
import { Button } from "@/Components/ui/button";
import { Printer, X } from "lucide-react";
import PDFEmployee from "./PDFEmployee";
import { ListType } from "./ListOfEmployees";
import { useState } from "react";
import { Input } from "@/Components/ui/input";
import { format } from "date-fns";
import { SYTYPE } from "@/types";

type Props = {
    list: ListType
    sy: SYTYPE
} & ModalProps;

const PrintEmployee: React.FC<Props> = ({ show, list, sy, onClose, }) => {
    const [schoolYear, setSy] = useState(sy ? `${format(sy.start, 'y')}-${format(sy.end, 'y')}` : "")

    const download_pdf = usePDF({
        method: "open",
        filename: "MASTER LIST OF EMPLOYEES.pdf",
        page: {
            format: "A4",
            margin: Margin.MEDIUM,
            orientation: "portrait",
        }
    });

    const handlePrint = useReactToPrint({
        content: () => download_pdf.targetRef.current,
    });

    return (
        <Modal show={show} onClose={() => onClose(false)} maxWidth="fit">
            <div className="p-6">
                <div className="flex justify-between mb-10">
                    <div className="flex items-center gap-3">
                        <Button
                            variant={"ghost"}
                            onClick={() => handlePrint()}
                            className="gap-2"
                        >
                            <Printer className="size-4" />
                            <span>Print</span>
                        </Button>
                        <div className="flex gap-2 items-center">
                            <div>S.Y.</div>
                            <Input value={schoolYear} className="w-28 h-9 border-black" onInput={(event) => {
                                let value = event.target as HTMLInputElement
                                setSy(value.value)
                            }} />
                        </div>
                    </div>
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

                <div className="overflow-y-auto rounded-scrollbar overflow-x-hidden">
                    <PDFEmployee summary={list} ref={download_pdf.targetRef} sy={schoolYear} />
                </div>
            </div>
        </Modal>
    );
};

export default PrintEmployee;
