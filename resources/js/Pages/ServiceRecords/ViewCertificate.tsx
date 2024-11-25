import Modal from "@/Components/Modal";
import { AspectRatio } from "@/Components/ui/aspect-ratio";
import { Button } from "@/Components/ui/button";
import { useToast } from "@/Components/ui/use-toast";
import { cn } from "@/lib/utils";
import { router } from "@inertiajs/react";
import { format } from "date-fns";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import RespondeServiceSertificate from "../Personnel/RespondeServiceSertificate";
import Processing from "@/Components/Processing";

type Certificate = {
    id: number;
    user_id: number;
    file_name: string;
    file_path: string;
    date_from: string;
    date_to: string;
    credits: number;
    venue: string;
    organizer: string;
    approved: "approved" | "rejected" | "pending";
    remaining_credits: number;
} | null;

export default function ViewCertificate(props: {
    user?: string;
    isHR?: boolean;
    certificate: Certificate;
    show: boolean;
    onClose: CallableFunction;
}) {
    const { certificate, show, isHR, user, onClose } = props;
    const [serviceRecord, setServiceRecord] =
        useState<Certificate>(certificate);
    const type = serviceRecord?.file_path.split(".")[1];
    const color_status = {
        approved: "text-green-600",
        rejected: "text-red-600",
        pending: "text-amber-600",
        null: "",
    }[serviceRecord?.approved || "null"];
    const [processing, setProcessing] = useState(false)
    const [confirm, setConfirm] = useState(false)
    const [action, setAction] = useState<"approve"|"reject"|null>(null)

    const { toast } = useToast()

    const formatDateRange = (dateRange: {
        from: string;
        to?: string;
    }): string => {
        const { from, to } = dateRange;

        const fromFormatted = format(from, "MMMM d, yyyy");

        if (!to) {
            // Single date
            return fromFormatted;
        } else if (format(from, "yyyy") === format(to, "yyyy")) {
            if (format(from, "MMMM") === format(to, "MMMM")) {
                // Same month and year
                return `${format(from, "MMMM d")} - ${format(to, "d, yyyy")}`;
            } else {
                // Same year, different month
                return `${format(from, "MMMM d")} - ${format(
                    to,
                    "MMMM d, yyyy"
                )}`;
            }
        } else {
            // Different years
            return `${fromFormatted} - ${format(to, "MMMM d, yyyy")}`;
        }
    };

    const onRespond = () => {
        router.post(route('service-records.respond.certificate', [certificate?.id]), {
            respond: {approve: "approved", reject: "rejected", pending: "pending"}[action??"pending"]
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
        if (show) {
            setServiceRecord(certificate);
        }
    }, [show]);

    return (
        <Modal show={show} onClose={() => onClose(false)}>
            <div className="p-6">
                <div className="mb-4 flex items-center">
                    {(isHR && serviceRecord?.approved !== "approved") && (
                        <>
                            <Button
                                className="h-8 shadow-sm bg-red-600"
                                onClick={() => {
                                    setAction("reject")
                                    setConfirm(true)
                                }}
                            >
                                <span>Reject</span>
                            </Button>
                            <Button
                                className="h-8 shadow-sm bg-green-600 ml-3"
                                onClick={() => {
                                    setAction("approve")
                                    setConfirm(true)
                                }}
                            >
                                <span>Approve</span>
                            </Button>
                        </>
                    )}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="ml-auto rounded-full"
                        onClick={() => onClose(false)}
                    >
                        <X className="size-5" />
                    </Button>
                </div>
                <div className="mb-5 space-y-1">
                    {isHR && (
                        <div>
                            <span className="font-semibold">
                                Personnel Name:
                            </span>{" "}
                            {user}
                        </div>
                    )}
                    <div>
                        <span className="font-semibold">Certificate Name:</span>{" "}
                        {serviceRecord?.file_name}
                    </div>
                    <div>
                        <span className="font-semibold">Organizer:</span>{" "}
                        {serviceRecord?.organizer}
                    </div>
                    <div>
                        <span className="font-semibold">Venue:</span>{" "}
                        {serviceRecord?.venue}
                    </div>
                    <div>
                        <span className="font-semibold">Date covered:</span>{" "}
                        {formatDateRange({
                            from:
                                serviceRecord?.date_from ||
                                new Date().toDateString(),
                            to: serviceRecord?.date_to,
                        })}
                    </div>
                    <div>
                        <span className="font-semibold">Credits earned:</span>{" "}
                        {serviceRecord?.credits}
                    </div>
                    <div>
                        <span className="font-semibold">
                            Remaining credits:
                        </span>{" "}
                        {serviceRecord?.remaining_credits}
                    </div>
                    {isHR && (
                        <div>
                            <span className="font-semibold">Status:</span>{" "}
                            <span className={cn("capitalize", color_status)}>
                                {serviceRecord?.approved}
                            </span>
                        </div>
                    )}
                </div>

                {type &&
                    (["png", "jpg", "jpeg"].includes(type) ? (
                        <img
                            src={serviceRecord?.file_path.replace(
                                "public",
                                "/storage"
                            )}
                            alt="serviceRecord"
                            className="object-contain w-full max-h-96 mx-auto"
                        />
                    ) : (
                        <iframe
                            src={serviceRecord?.file_path.replace(
                                "public",
                                "/storage"
                            )}
                            className="w-full h-[30rem]"
                        />
                    ))}
            </div>

            <Processing
                    is_processing={processing}
                />

            <RespondeServiceSertificate action={action} show={confirm} onClose={() => {
                setConfirm(false)
                setTimeout(() => setAction(null), 300)
            }} onConfirm={() => {
                setConfirm(false)
                onRespond()
            }} />
        </Modal>
    );
}
