import Modal from "@/Components/Modal";
import Processing from "@/Components/Processing";
import { Button } from "@/Components/ui/button";
import { useToast } from "@/Components/ui/use-toast";
import { router } from "@inertiajs/react";
import { useState } from "react";

type Props = {
    user?: {
        id: number;
        name: string;
    };
    show: boolean;
    onClose: CallableFunction;
};

export default function DeletePersonnelModel({ user, show, onClose }: Props) {
    const [processing, setProcessing] = useState<boolean>(false)
    const { toast } = useToast()

    const onDelete = () => {
        setProcessing(true)
        router.post(route('personnel.delete', [user?.id]), {}, {
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
                        Delete personnel
                    </div>

                    <div className="my-8 px-1 text-center">
                        This action will remove the personnel from the list but keep their other records. <br />{" "}
                        Are you sure you want to delete{" "}
                        <span className="font-semibold">{user?.name}</span> ?
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
}
