import Modal from "@/Components/Modal";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Page } from "react-pdf";
import { Button } from "@/Components/ui/button";
import { Download } from "lucide-react";
import PersonalDataSheetPDF from "../Search/PDSPDF";
import { Margin, usePDF } from "react-to-pdf";
import Tabs from "@/Components/framer/Tabs";
import { router } from "@inertiajs/react";
import { useToast } from "@/Components/ui/use-toast";
import Processing from "@/Components/Processing";

type ViewPDSProps = {
    authId: number;
    show: boolean;
    onClose: (close: false) => void;
};

type PagesType = { prev: number; current: number; next: number };

export default function ViewPDS({ show, authId, onClose }: ViewPDSProps) {
    const [data, setData] = useState<any>();
    const [activeTab, setActiveTab] = useState<"C1" | "C2" | "C3" | "C4">("C1");
    const [loading, setLoading] = useState(false);
    const [processing, setProcessing] = useState(false);
    const { toast } = useToast()

    const download_pdf = usePDF({
        method: "save",
        filename: "Personal Data Sheet.pdf",
        page: { format: "A4", margin: Margin.MEDIUM },
    });

    const setPdsApprove = () => {
        if(data.personalInformation) {
            setProcessing(true)
            router.post(route('pds.approve', [data.personalInformation.id]), {
                isApprove: true
            }, {
                onSuccess: () => {
                    toast({
                        variant: "success",
                        description: "PDS has been approved."
                    })

                    onClose(false)
                },
                onError: (error) => {
                    toast({
                        variant: "destructive",
                        description: error[0]
                    })
                },
                onFinish: () => {
                    setProcessing(false)
                }
            })
        } else {
            toast({
                variant: "default",
                description: "The personnel has no Personal Data Sheet uploaded or has not yet filled out the form."
            })
        }
    }

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
        <Modal
            show={show}
            onClose={() => onClose(false)}
            maxWidth="5xl"
            closeable={false}
        >
            <div className="p-6">
                <div className="flex items-center mb-4">
                    {(!loading && (!data?.personalInformation ||
                        !data?.personalInformation?.is_approved)) && (
                        <Button
                            className="px-6 !bg-green-600"
                            onClick={setPdsApprove}
                        >
                            Approve
                        </Button>
                    )}

                    <Button
                        variant="secondary"
                        className="ml-auto px-6"
                        onClick={() => onClose(false)}
                    >
                        Close
                    </Button>
                </div>

                {loading ? (
                    <div className="w-fit h-fit mx-auto my-auto flex flex-col items-center gap-2">
                        <span className="loading loading-spinner loading-md"></span>
                        <div>Loading...</div>
                    </div>
                ) : (
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
                                onClick={() => {
                                    if(data?.personalInformation || data?.personalInformation?.is_approved)
                                        download_pdf.toPDF()
                                }}
                                disabled={(!data?.personalInformation ||
                                    !data?.personalInformation?.is_approved)}
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
                )}
            </div>

            <Processing is_processing={processing} />
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
