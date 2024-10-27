import Modal, { ModalProps } from "@/Components/Modal";
import Processing from "@/Components/Processing";
import { Button } from "@/Components/ui/button";
import { useToast } from "@/Components/ui/use-toast";
import { useMessage } from "@/hooks/MessageProvider";
import { router } from "@inertiajs/react";
import { useState } from "react";

type Props = {} & ModalProps;

const DeleteConversationConfirmation: React.FC<Props> = ({ show, onClose }) => {
    const [processing, setProcessing] = useState(false)
    const { toast } = useToast()
    const { user, setUser, setConversation, messageList, setMessageList } = useMessage()

    const onDelete = () => {
        setProcessing(true)
        router.post(route('messages.delete', [user?.messageId]), {}, {
            onSuccess: (page) => {
                toast({
                    variant: "success",
                    description: page.props.success?.toString()
                })
                setUser(null)
                setConversation([], true)

                let messages = [...messageList]
                let messageIndex = messages.findIndex((m) => m.id == user?.messageId)
                if(messageIndex !== -1) {
                    messages.splice(messageIndex, 1)

                    setMessageList(messages, false, true)
                }
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
                        Delete Conversation
                    </div>

                    <div className="my-8 px-1 text-center">
                        Are you sure you want to delete your conversation with {" "}
                        <span className="font-semibold">{user?.name}</span> ?
                    </div>

                    <div className="flex justify-between">
                        <Button className="px-8" variant="ghost" onClick={() => onClose(false)}>
                            <span>No</span>
                        </Button>

                        <Button variant="destructive" onClick={onDelete}>
                            <span>Yes, delete</span>
                        </Button>
                    </div>
                </div>
            )}
        </Modal>
    )
}

export default DeleteConversationConfirmation;
