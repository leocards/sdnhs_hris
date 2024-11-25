import Modal, { ModalProps } from "@/Components/Modal";
import React, { useState, useEffect, Fragment } from "react";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import { Button } from "@/Components/ui/button";
import { Undo2 } from "lucide-react";
import { useToast } from "@/Components/ui/use-toast";
import Processing from "@/Components/Processing";
import { format } from "date-fns";
import { router, useForm } from "@inertiajs/react";
import SALNPage1 from "./Partials/SALNPage1";
import SALNPage2 from "./Partials/SALNPage2";
import SALNSeparatePage from "./Partials/SALNSeparatePage";
import { SALNTYPE, User } from "@/types";

type SALNLISTTYPE = {

};

type Props = {
    id: number | null;
} & ModalProps;

const ViewSalnPersonnel: React.FC<Props> = ({ id, show, onClose }) => {
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [processing, setProcessing] = useState(false);

    const [saln, setSaln] = useState<SALNTYPE | null>(null);

    const onApproveSaln = () => {
        setProcessing(true)
        router.post(
            route("saln.approve", [id]),
            {
                isApprove: true,
                isjoint: saln?.saln?.isjoint
            },
            {
                onSuccess: () => {
                    toast({
                        variant: "success",
                        description: "SALN has been approved.",
                    });
                    onClose(false);
                },
                onError: (error) => {
                    if ("0" in error) {
                        toast({
                            variant: "destructive",
                            description: error[0],
                        });
                    }
                },
                onFinish: () => {
                    setProcessing(false);
                },
            }
        );
    };

    useEffect(() => {
        if (show) {
            setLoading(true)
            window.axios
                .get<SALNTYPE>(route("saln.json.view", [id]))
                .then((response) => {
                    setSaln(response.data);
                })
                .finally(() => {
                    setLoading(false)
                })
        }
    }, [show]);

    return (
        <Modal show={show} onClose={() => onClose(false)} maxWidth="5xl" center>
            <Processing is_processing={processing} />

            {loading ? (
                <div className="w-fit h-[31rem] mx-auto my-auto flex flex-col justify-center items-center gap-2">
                    <span className="loading loading-spinner loading-md"></span>
                    <div>Loading...</div>
                </div>
            ) : (<div className="p-6">
                <div className="flex items-center mb-4">
                    <Button
                        className="!bg-green-700"
                        onClick={onApproveSaln}
                    >
                        Approve
                    </Button>
                    <Button
                        variant="secondary"
                        className="ml-auto px-6"
                        onClick={() => onClose(false)}
                    >
                        Close
                    </Button>
                </div>

                <div className="h-[31rem] overflow-y-auto rounded-scrollbar flex flex-col items-center p-4 bg-gray-200 rounded-md">
                    <div className="space-y-3 print:space-y-0">
                        {saln?.pages.map(
                            (
                                {
                                    children,
                                    real,
                                    personal,
                                    liabilities,
                                    bifc,
                                    relatives,
                                    saln_totals,
                                },
                                index
                            ) =>
                                index === 0 ? (
                                    <Fragment key={index}>
                                        <SALNPage1
                                            page={{
                                                page: 1,
                                                totalPage:
                                                    saln?.pages.length + 1,
                                            }}
                                            user={saln?.user}
                                            isjoint={saln?.saln?.isjoint}
                                            asof={saln?.saln?.asof || ""}
                                            spouse={saln?.spouse}
                                            children={children}
                                            real={real}
                                            personal={personal}
                                            saln_totals={saln_totals}
                                        />
                                        <SALNPage2
                                            page={{
                                                page: 2,
                                                totalPage:
                                                    saln?.pages.length + 1,
                                            }}
                                            user={saln?.user}
                                            spouse={saln?.spouse}
                                            liabilities={liabilities}
                                            bifc={bifc}
                                            relatives={relatives}
                                            saln_totals={saln_totals}
                                            declarant={saln?.declarant}
                                        />
                                    </Fragment>
                                ) : (
                                    <SALNSeparatePage
                                        page={{
                                            page: index + 2,
                                            totalPage: saln?.pages.length + 1,
                                        }}
                                        user={saln?.user}
                                        key={index}
                                        asof={saln?.saln?.asof || ""}
                                        real={real}
                                        personal={personal}
                                        bifc={bifc}
                                        relatives={relatives}
                                        saln_totals={saln_totals}
                                        liabilities={liabilities}
                                    />
                                )
                        )}
                    </div>
                </div>
            </div>)}
        </Modal>
    );
};

export default ViewSalnPersonnel;
