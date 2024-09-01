import Modal from "@/Components/Modal";
import Processing from "@/Components/Processing";
import { Button } from "@/Components/ui/button";
import { useToast } from "@/Components/ui/use-toast";
import { router } from "@inertiajs/react";
import { useState } from "react";

type Certificate = {
    id: number;
    user_id: number;
    file_name: string;
    file_path: string;
    date_from: string;
    date_to: string;
    updated_at: string;
    credits: number;
} | null;

type Props = {
    certificate: Certificate;
    show: boolean;
    onClose: CallableFunction;
}

const ServiceRecordDeleteConfirmation = ({ certificate, show, onClose }: Props) => {
    const [processing, setProcessing] = useState<boolean>(false)
    const { toast } = useToast()

    const onDelete = () => {
        setProcessing(true)
        router.post(route('service-records.delete', [certificate?.id]), {}, {
            onSuccess: (page) => {
                toast({
                    variant: "success",
                    description: page.props.success?.toString()
                })
            },
            onError: (error) => {
                toast({
                    variant: "destructive",
                    description: error[0]
                })
            },
            onFinish: () => {
                setProcessing(false)
                onClose(false)
            }
        })
    }

    return (
        <Modal show={show} onClose={() => onClose(false)} maxWidth="md">
            {processing ? (
                <Processing is_processing={processing} backdrop={""} />
            ) : (
                <div className="p-6">
                    <div className="font-bold text-xl px-1 text-destructive">
                        Delete certificate
                    </div>

                    <div className="my-8 px-1 text-center">
                        This action will permanently delete the certificate, and deduct your current credits. <br />{" "}
                        Are you sure you want to delete{" "}
                        <span className="font-semibold">{certificate?.file_name}</span> ?
                    </div>

                    <div className="flex justify-between">
                        <Button variant="ghost" onClick={() => onClose(false)}>
                            <span>Cancel</span>
                        </Button>

                        <Button variant="destructive" onClick={onDelete}>
                            <span>Yes, delete</span>
                        </Button>
                    </div>
                </div>
            )}
        </Modal>
    );
};

export default ServiceRecordDeleteConfirmation;
