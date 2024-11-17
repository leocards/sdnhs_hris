import Modal, { ModalProps } from "@/Components/Modal";
import { Margin, usePDF } from "react-to-pdf";
import { useReactToPrint } from "react-to-print";
import { Button } from "@/Components/ui/button";
import { Printer, X } from "lucide-react";
import PDFConversation from "./PDFConversation";

type Props = {

} & ModalProps;

const PrintMessage: React.FC<Props> = ({ show, onClose }) => {
    const download_pdf = usePDF({
        method: "open",
        filename: `Conversation-.pdf`,
        page: {
            format: "A4",
            margin: Margin.MEDIUM,
            orientation: "portrait",
        },
    });

    const handlePrint = useReactToPrint({
        content: () => download_pdf.targetRef.current,
        onBeforeGetContent: () => console.log('printing')
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
                <div className="overflow-y-auto rounded-scrollbar overflow-x-hidden">
                    <PDFConversation ref={download_pdf.targetRef} />
                </div>
            </div>
        </Modal>
    );
};

export default PrintMessage;
