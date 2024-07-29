import Modal from "@/Components/Modal";
import { AspectRatio } from "@/Components/ui/aspect-ratio"
import { Button } from "@/Components/ui/button";
import { useEffect, useState } from "react";

export default function ViewCertificate(props: {
    img: string|null;
    show: boolean;
    onClose: CallableFunction;
}) {
    const { img, show, onClose } = props;
    const [certificate, steCertificate] = useState<string|null>(null)

    useEffect(() => {
        if(show) {
            steCertificate(img)
        }
    }, [show])

    return (
        <Modal show={show} onClose={() => onClose()}>   
            <div className="p-6">
                <AspectRatio
                    ratio={15 / 10}
                    className="bg-muted rounded-md overflow-hidden"
                >
                    <img
                        src={certificate?.replace("public", "/storage")}
                        alt="certificate"
                        className="object-contain h-full w-full"
                    />
                </AspectRatio>

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
