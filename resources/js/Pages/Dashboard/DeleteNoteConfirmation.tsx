import Modal, { ModalProps } from "@/Components/Modal";
import { NOTETYPE } from "./NewNotes";
import { useState } from "react";
import { useToast } from "@/Components/ui/use-toast";
import Processing from "@/Components/Processing";
import { Button } from "@/Components/ui/button";

type Props = {
    note: NOTETYPE | null;
    onDelete: (note: NOTETYPE) => void;
} & ModalProps;

const DeleteNoteConfirmation: React.FC<Props> = ({ show, note, onClose, onDelete }) => {
    const [processing, setProcessing] = useState(false);

    const { toast } = useToast();

    const onConfirmDelete = () => {
        setProcessing(true)
        window.axios
            .post(route("notes.delete", [note?.id]))
            .then(() => {
                toast({
                    variant: "success",
                    description: "Note deleted successfully",
                });
                if(note)
                    onDelete(note)
            })
            .catch((error) => {
                console.log(error);
                toast({
                    variant: "destructive",
                    description: "Unable to delete the note.",
                });
            })
            .finally(() => {
                setProcessing(false);
                onClose(false);
            });
    };

    return (
        <Modal show={show} onClose={() => onClose(false)} maxWidth="md">
            {processing ? (
                <Processing is_processing={processing} backdrop={""} />
            ) : (
                <div className="p-6">
                    <div className="font-bold text-xl px-1 text-destructive">
                        Delete Note
                    </div>

                    <div className="my-8 px-1 text-center">
                        Are you sure you want to delete{" "}
                        <span className="font-semibold">{note?.title}</span> ?
                    </div>

                    <div className="flex justify-between">
                        <Button
                            className="px-8"
                            variant="ghost"
                            onClick={() => onClose(false)}
                        >
                            <span>No</span>
                        </Button>

                        <Button variant="destructive" onClick={onConfirmDelete}>
                            <span>Yes, delete</span>
                        </Button>
                    </div>
                </div>
            )}
        </Modal>
    );
};

export default DeleteNoteConfirmation;
