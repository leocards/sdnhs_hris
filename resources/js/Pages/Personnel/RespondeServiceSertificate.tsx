import Modal, { ModalProps } from "@/Components/Modal";
import { Button } from "@/Components/ui/button";
import { cn } from "@/lib/utils";
import React from "react";

type Props = ModalProps & {
    onConfirm: () => void
    action: "approve" | "reject" | null
}

const RespondeServiceSertificate: React.FC<Props> = ({ show, action, onClose, onConfirm }) => {
    return (
        <Modal show={show} onClose={() => onClose(false)} maxWidth="sm" center>
            <div className="p-6">
                <div className="text-center pb-10 pt-3 text-lg">
                    <span className={cn("capitalize", action === "approve" ? "text-green-600" : "text-red-600")}>{action}</span> this certificate?
                </div>
                <div className="flex items-center justify-between">
                    <Button className="px-8" variant="ghost" onClick={() => onClose(false)}>
                        <span>No</span>
                    </Button>

                    <Button onClick={onConfirm}>
                        Yes, {action}
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default RespondeServiceSertificate;
