import Modal from "@/Components/Modal";
import Processing from "@/Components/Processing";
import { Button } from "@/Components/ui/button";
import { useToast } from "@/Components/ui/use-toast";
import { router } from "@inertiajs/react";
import { useState } from "react";

type Props = {
    leave?: {
        id: number;
        name: string;
    };
    show: boolean;
    onClose: CallableFunction;
};

export default function LeaveConfirmDelete({ leave, show, onClose }: Props) {
    const [processing, setProcessing] = useState<boolean>(false)
    const { toast } = useToast()

    const onDelete = () => {
        router.post(route('personnel.tardiness.delete', [leave?.id]), {}, {
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
        <Modal show={show} onClose={() => onClose(false)}>
            {processing ? (
                <Processing is_processing={processing} backdrop={""} />
            ) : (
                <div className="p-6">
                    <div className="font-bold text-xl px-1 text-destructive">
                        Delete attendance
                    </div>
                </div>
            )}
        </Modal>
    );
}
