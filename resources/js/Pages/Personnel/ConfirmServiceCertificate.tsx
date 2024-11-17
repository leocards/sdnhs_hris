import Modal, { ModalProps } from "@/Components/Modal";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/Components/ui/accordion";
import { Button } from "@/Components/ui/button";
import { Label } from "@/Components/ui/label";
import React, { useEffect, useState } from "react";
import { formatDateRange } from "../types";
import Processing from "@/Components/Processing";
import { router } from "@inertiajs/react";
import { cn } from "@/lib/utils";
import RespondeServiceSertificate from "./RespondeServiceSertificate";
import { useToast } from "@/Components/ui/use-toast";

type Props = {
    user: any
} & ModalProps

type CertificatesType = {
    id: number
    user_id: number
    file_name: string
    venue: string
    organizer: string
    file_path: string
    date_from: string
    date_to: string
    credits: string
    approved: "approved" | "rejected" | "pending"
    created_at: string
}

const ConfirmServiceCertificate: React.FC<Props> = ({ show, user, onClose }) => {
    const [certificates, setCertificates] = useState<Array<CertificatesType>>([]);
    const [loading, setLoading] = useState(false)
    const [processing, setProcessing] = useState(false)
    const [isRespond, setIsRespond] = useState(false)
    const [action, setAction] = useState<{id:number|null,action: "approve" | "reject" | null}>({
        id: null,
        action: null
    })

    const { toast } = useToast()

    const onSetRespond = (id: number, action: "approve" | "reject") => {
        setIsRespond(true)
        setAction({id, action})
    }

    const onSubmitRespond = () => {
        setProcessing(true)
        setIsRespond(false)
        router.post(route('service-records.respond.certificate', [action.id]), {
            respond: {approve: "approved", reject: "rejected", pending: "pending"}[action.action??"pending"]
        }, {
            onSuccess: (page) => {
                toast({
                    variant: "success",
                    description: page.props.success?.toString(),
                });
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
                setProcessing(false)
            }
        })
    }

    useEffect(() => {
        if(user && show) {
            setLoading(true)
            window.axios
                .get(route('service-records.certificates', [user.id]))
                .then((response) => {
                    let data = response.data

                    setCertificates(data)
                })
                .finally(() => setLoading(false))
        }
    }, [show])

    return (
        <Modal show={show} onClose={() => onClose(false)}>
            <div className="p-6">
                <Label className="text-lg">Certificates to approve</Label>

                <Accordion type="multiple" className="mt-4">

                    {!loading && (<div className="space-y-1">
                        {certificates.map((cert, index) => (
                                <AccordionItem key={index} value={"certificate"+index} className="rounded-md border overflow-hidden">
                                    <AccordionTrigger className="data-[state=open]:bg-yellow-600 p-3 data-[state=open]:text-yellow-100 font-normal data-[state=closed]:hover:!bg-secondary">
                                        {cert.file_name}
                                    </AccordionTrigger>
                                    <AccordionContent>
                                        <div className="p-2">
                                            <div className="flex items-center">
                                                {cert.approved === "approved" ? (
                                                    <div className={cn(cert.approved === "approved" ? "text-green-600" : "text-red-600", "ml-auto")}>Certificate {cert.approved}.</div>
                                                ) : (
                                                    <>
                                                        <Button className="h-8 shadow-sm !text-red-600 ml-auto" variant="outline" onClick={() => onSetRespond(cert.id, "reject")}>
                                                            <span>Reject</span>
                                                        </Button>
                                                        <Button className="h-8 shadow-sm !text-green-600 ml-3" variant="outline" onClick={() => onSetRespond(cert.id, "approve")}>
                                                            <span>Approve</span>
                                                        </Button>
                                                    </>
                                                )}
                                            </div>

                                            <div className="text-sm">
                                                <div className="flex">
                                                    <div className="font-semibold w-32">Organizer:</div>{" "}
                                                    {cert?.organizer}
                                                </div>
                                                <div className="flex">
                                                    <div className="font-semibold w-32">Venue:</div>{" "}
                                                    {cert?.venue}
                                                </div>
                                                <div className="flex">
                                                    <div className="font-semibold w-32">Date covered:</div>{" "}
                                                    {formatDateRange({
                                                        from:
                                                            cert?.date_from ||
                                                            new Date().toDateString(),
                                                        to: cert?.date_to,
                                                    })}
                                                </div>
                                                <div className="flex">
                                                    <div className="font-semibold w-32">Credits earned:</div>{" "}
                                                    {cert?.credits}
                                                </div>
                                            </div>

                                            {cert.file_path.split(".")[1] &&
                                                (["png", "jpg", "jpeg"].includes(cert.file_path.split(".")[1]) ? (
                                                    <img
                                                        src={cert?.file_path.replace(
                                                            "public",
                                                            "/storage"
                                                        )}
                                                        alt="certificate"
                                                        className="object-contain w-full max-h-40 mx-auto"
                                                    />
                                                ) : (
                                                    <iframe
                                                        src={cert?.file_path.replace(
                                                            "public",
                                                            "/storage"
                                                        )}
                                                        className="w-full h-[30rem]"
                                                    />
                                                ))}
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                        ))}
                    </div>)}

                    {loading && (
                        <div className="flex items-center justify-center py-4">
                            <span className="loading loading-dots loading-sm"></span>
                        </div>
                    )}

                    {(!loading && certificates.length == 0) && (
                        <div className="text-center">No pending certificates.</div>
                    )}

                </Accordion>

                <div className="mt-5 flex">
                    <Button className="px-8 ml-auto" variant={"ghost"} onClick={() => onClose(false)}>
                        <span>Close</span>
                    </Button>
                </div>

                <Processing
                    is_processing={processing}
                />

                <RespondeServiceSertificate show={isRespond} onClose={setIsRespond} action={action.action} onConfirm={onSubmitRespond} />
            </div>
        </Modal>
    );
};

export default ConfirmServiceCertificate;
