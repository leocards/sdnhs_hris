import Modal from "@/Components/Modal";
import { AspectRatio } from "@/Components/ui/aspect-ratio";
import { Button } from "@/Components/ui/button";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useEffect, useState } from "react";

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
    approved: "approved" | "rejected" | "pending"
} | null;

export default function ViewCertificate(props: {
    certificate: Certificate;
    show: boolean;
    onClose: CallableFunction;
}) {
    const { certificate, show, onClose } = props;
    const [serviceRecord, setServiceRecord] =
        useState<Certificate>(certificate);
    const type = serviceRecord?.file_path.split(".")[1];
    const color_status = {
        "approved": "text-green-600",
        "rejected": "text-red-600",
        "pending": "text-amber-600",
        null: ""
    }[serviceRecord?.approved||"null"]

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

    useEffect(() => {
        if (show) {
            setServiceRecord(certificate);
        }
    }, [show]);

    return (
        <Modal show={show} onClose={() => onClose(false)}>
            <div className="p-6">
                <div className="mb-5 space-y-1">
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
                        <span className="font-semibold">Status:</span>{" "}
                        <span className={cn("capitalize", color_status)}>{serviceRecord?.approved}</span>
                    </div>
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

                <div className="mt-6 flex">
                    <Button
                        variant="secondary"
                        className="px-8 ml-auto"
                        onClick={() => onClose(false)}
                    >
                        Close
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
