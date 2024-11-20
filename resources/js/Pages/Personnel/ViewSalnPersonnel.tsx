import Modal, { ModalProps } from "@/Components/Modal";
import React, { useState, useEffect, Fragment } from "react";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import { Button } from "@/Components/ui/button";
import { Undo2 } from "lucide-react";
import { useToast } from "@/Components/ui/use-toast";
import Processing from "@/Components/Processing";
import { format } from "date-fns";
import { useForm } from "@inertiajs/react";
import SALNPage1 from "./Partials/SALNPage1";
import SALNPage2 from "./Partials/SALNPage2";
import SALNSeparatePage from "./Partials/SALNSeparatePage";
import { SALNTYPE, User } from "@/types";

type SALNLISTTYPE = {
    id: number;
    asof: string;
    isApproved: boolean | null;
    user_id: number;
    isjoint: "joint"|"separate"|"none";
}

type Props = {
    id: number;
    salnList: Array<SALNLISTTYPE>;
    user: User
} & ModalProps;

const ViewSalnPersonnel: React.FC<Props> = ({
    user,
    show,
    salnList,
    onClose,
}) => {
    const [view, setView] = useState(false);
    const [selected, setSelected] = useState<SALNLISTTYPE|null>(null);
    const { toast } = useToast();
    const [isApprovalSubmit, setIsApprovalSubmit] = useState(false)
    const { setData, processing, post, reset } = useForm({
        isApprove: false
    })
    const [saln, setSaln] = useState<SALNTYPE|null>(null)

    const onApprove = (saln: SALNLISTTYPE) => {
        setSelected(saln)
        setData({ isApprove: true })
        setIsApprovalSubmit(true)
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
                    onClose(false)
                },
                onError: (error) => {
                    if("0" in error) {
                        toast({
                            variant: "destructive",
                            description: error[0],
                        });
                    }
                },
                onFinish: () => {
                    reset()
                    setIsApprovalSubmit(false)
                }
            })
        }
    }, [isApprovalSubmit])

    useEffect(() => {
        if(selected) {
            window.axios.get<SALNTYPE>(route('saln.json.view', [selected.id]))
                .then((response) => {
                    setSaln(response.data)
                })
        }
    }, [selected])

    useEffect(() => {
        if(show) {
            setView(false);
            setSelected(null);
        }
    }, [show])

    return (
        <Modal show={show} onClose={() => onClose(false)} maxWidth="5xl" center>
            <Processing is_processing={processing} />

            <div className="p-6">
                <div className="flex items-center mb-4">
                    {view && (
                        <>
                            <Button
                                variant="ghost"
                                size={"icon"}
                                className="px-"
                                onClick={() => {
                                    setView(false);
                                    setSelected(null);
                                }}
                            >
                                <Undo2 className="size-5" />
                            </Button>

                            {selected && !selected.isApproved && (
                                <Button
                                    className="!bg-green-700 ml-3"
                                    onClick={() =>
                                        selected && onApprove(selected)
                                    }
                                >
                                    Approve
                                </Button>
                            )}
                        </>
                    )}
                    <Button
                        variant="secondary"
                        className="ml-auto px-6"
                        onClick={() => onClose(false)}
                    >
                        Close
                    </Button>
                </div>

                {salnList && salnList.length === 0 && (
                    <div>No SALN to approve</div>
                )}

                {salnList &&
                    !view &&
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
                                                    page: 1, totalPage: saln?.pages.length + 1
                                                }}
                                                user={user}
                                                isjoint={selected?.isjoint}
                                                asof={selected?.asof || ""}
                                                spouse={saln?.spouse}
                                                children={children}
                                                real={real}
                                                personal={personal}
                                                saln_totals={saln_totals}
                                            />
                                            <SALNPage2
                                                page={{
                                                    page: 2, totalPage: saln?.pages.length + 1
                                                }}
                                                user={user}
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
                                                page: index + 2, totalPage: saln?.pages.length + 1
                                            }}
                                            user={user}
                                            key={index}
                                            asof={selected?.asof || ""}
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
                )}
            </div>
        </Modal>
    );
};

export default ViewSalnPersonnel;
