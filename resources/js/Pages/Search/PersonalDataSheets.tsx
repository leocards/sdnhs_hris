import PersonalDataSheetPDF from "./PDSPDF";
import Tabs from "@/Components/framer/Tabs";

import { PDSPDFIsDownloadProvider } from "./PDSPDF/context";
import { useEffect, useState } from "react";
import { router, usePage } from "@inertiajs/react";
import { Margin, usePDF } from "react-to-pdf";
import { useReactToPrint } from "react-to-print";
import { Button } from "@/Components/ui/button";
import { Download } from "lucide-react";

type pds_cs = 'C1' | 'C2' | 'C3' | 'C4'

type Props = {
    data: any;
};

const PersonalDataSheets: React.FC<Props> = ({ data }) => {
    const [processing, setProcessing] = useState(false);
    const { url } = usePage();
    // Get the full URL with query parameters
    const currentUrl = url;
    // Get query parameters
    const queryParams = new URLSearchParams(currentUrl.split("?")[1]);
    // Example: Get a specific query parameter
    const [activeTab, setActiveTab] = useState<pds_cs>(queryParams.get("c") as pds_cs ?? "C1");

    const download_pdf = usePDF({
        method: "open",
        filename: "application-for-leave.pdf",
        page: { format: "A4", margin: Margin.MEDIUM },
    });

    return (
        <div className="">
            <div className="border-b flex items-center">
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
                    navigate={(nav) => setActiveTab(nav as pds_cs)}
                />

                <Button className="h-9 ml-auto" size={'icon'} variant={'secondary'} onClick={() => download_pdf.toPDF()}>
                    <Download className="size-5" />
                </Button>
            </div>

            <PersonalDataSheetPDF data={data} tab={activeTab} ref={download_pdf.targetRef} />
        </div>
    );
};

export default PersonalDataSheets;
