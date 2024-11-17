import { useMessage } from "@/hooks/MessageProvider";
import { cn } from "@/lib/utils";
import { User } from "@/types";
import { MessagesSquare } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

type Props = {
    auth: User;
};

const ConversationBox: React.FC<Props> = ({ auth }) => {
    const { conversation, loadingConversation, searchConversation, setSearchConversation } =
        useMessage();
    const convoContainerRef = useRef<HTMLDivElement>(null);

    function checkNextEqual(message: any, index: number) {
        return (
            conversation[index + 1] &&
            message.sender == conversation[index + 1].sender
        );
    }

    function checkPrevEqual(message: any, index: number) {
        return index !== 0 && conversation[index - 1].sender == message.sender;
    }

    const formatMessage = (messenger: any, index: number): MessagePosition => {
        if (messenger.sender === auth.id) {
            if (
                checkNextEqual(messenger, index) &&
                checkPrevEqual(messenger, index)
            ) {
                return "sender-m";
            } else if (checkNextEqual(messenger, index)) return "sender-t";
            else if (checkPrevEqual(messenger, index)) return "sender-b";
            else return "sender";
        } else {
            if (
                checkNextEqual(messenger, index) &&
                checkPrevEqual(messenger, index)
            ) {
                return "receiver-m";
            } else if (checkNextEqual(messenger, index)) return "receiver-t";
            else if (checkPrevEqual(messenger, index)) return "receiver-b";
            else return "receiver";
        }
    };

    useEffect(() => {
        if (searchConversation) {
            const element = document.getElementById("conversation_"+searchConversation);
            if (element) {
                element.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                });
                setSearchConversation(null)
            }
        }
    }, [searchConversation]);

    return (
        <div className="flex flex-col-reverse overflow-y-auto py-2 relative">
            <div
                ref={convoContainerRef}
                className={cn(
                    "flex",
                    !loadingConversation ? "flex-col" : "grow"
                )}
            >
                <div
                    className={cn(
                        "flex gap-0.5",
                        !loadingConversation ? "flex-col-reverse" : "grow"
                    )}
                >
                    {loadingConversation ? (
                        <div className="w-fit h-fit mx-auto my-auto flex flex-col items-center gap-2 text-xs">
                            <span className="loading loading-spinner loading-sm"></span>
                            <div>Loading...</div>
                        </div>
                    ) : (
                        conversation.map((convo, index) => (
                            <MessageBox
                                key={index}
                                auth={auth}
                                position={formatMessage(convo, index)}
                                message={{
                                    id: convo?.id,
                                    message: convo.message,
                                    sender: convo.sender,
                                    time: convo.created_at,
                                }}
                            />
                        ))
                    )}

                    {(!loadingConversation && conversation.length === 0) && (
                        <div className="absolute top-1/2 -translate-x-1/2 left-1/2 -translate-y-1/2">
                            <div><MessagesSquare className="size-14 mx-auto mb-3 text-foreground/35" /></div>
                            Start your first conversation
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

interface MessageBoxProps {
    message: string;
    sender: number;
    time: string | null;
    id: number | null;
}

type MessagePosition =
    | "sender-t"
    | "sender-m"
    | "sender-b"
    | "sender"
    | "receiver-b"
    | "receiver-t"
    | "receiver-m"
    | "receiver";

const MessageBox: React.FC<{
    message: MessageBoxProps;
    auth: User;
    position: MessagePosition;
}> = ({ message, auth, position }) => {
    const { searchConversation } = useMessage()

    const [isSearched, setIsSearched] = useState(false)

    const messageBoxVariant = {
        sender: "ml-auto mr-2 bg-blue-600 text-white",
        receiver: "ml-2 bg-accent",
    }[message.sender === auth.id ? "sender" : "receiver"];

    const roundedBox = {
        "sender-t": "rounded-[1.25rem] rounded-tr-md !mb-2",
        "sender-m": "rounded-[1.25rem] rounded-e-md",
        "sender-b": "rounded-[1.25rem] rounded-br-md",
        sender: "rounded-[1.25rem]",
        "receiver-t": "rounded-[1.25rem] rounded-tl-md !mb-2",
        "receiver-m": "rounded-[1.25rem] rounded-s-md",
        "receiver-b": "rounded-[1.25rem] rounded-bl-md",
        receiver: "rounded-[1.25rem]",
    }[position];

    useEffect(() => {
        if(searchConversation && searchConversation == message.id) {
            setIsSearched(true)
        }
    }, [searchConversation])

    return (
        <div
            className={cn(
                "max-w-96 w-fit py-2 px-3",
                messageBoxVariant,
                roundedBox,
                isSearched && "!ring-1 !ring-ring !ring-offset-2 !ring-offset-slate-400"
            )}
            id={"conversation_" + message.id?.toString()}
        >
            <div className="whitespace-pre-line break-words">
                {message.message}
            </div>
        </div>
    );
};

export default ConversationBox;
