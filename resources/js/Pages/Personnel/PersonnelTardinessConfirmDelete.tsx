import Modal from "@/Components/Modal";
import Processing from "@/Components/Processing";
import { Button } from "@/Components/ui/button";
import { useToast } from "@/Components/ui/use-toast";
import { router } from "@inertiajs/react";
import { useState } from "react";

type Props = {
    personnel?: {
        id: number;
        name: string;
    };
    show: boolean;
    onClose: CallableFunction;
};

const PersonnelTardinessConfirmDelete = ({
    personnel,
    show,
    onClose,
}: Props) => {
    const [processing, setProcessing] = useState<boolean>(false)
    const { toast } = useToast()

    const onDelete = () => {
        router.post(route('personnel.tardiness.delete', [personnel?.id]), {}, {
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
                        Delete attendance
                    </div>

                    <div className="my-8 px-1 text-center">
                        This action will permanently delete the attendance. <br />{" "}
                        Are you sure you want to delete the attendance for{" "}
                        <span className="font-semibold">{personnel?.name}</span> ?
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

export default PersonnelTardinessConfirmDelete;
