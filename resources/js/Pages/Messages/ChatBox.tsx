import MessageBoxInput from "./MessageBoxInput";

import { cn } from "@/lib/utils";
import { User } from "@/types";
import { MessagesSquare, UserRound } from "lucide-react";
import { useMessage } from "@/hooks/MessageProvider";
import ChatBoxHeader from "./ChatBoxHeader";
import ConversationBox from "./ConversationBox";
import { formatISO } from "date-fns";
import SearchConversation from "./SearchConversation";
import { useState } from "react";
import DeleteConversationConfirmation from "./DeleteConversationConfirmation";

export default function ChatBox({ auth }: { auth: User }) {
    const { user, setUser, conversation, setConversation, setMessageList, setMessage } =
        useMessage();
    const [searchConversation, setSearchConversation] = useState(false)
    const [deleteConversation, setDeleteConversation] = useState(false)

    return (
        <div
            className={cn(
                "grid border rounded-lg",
                user
                    ? "grid-rows-[auto,1fr,auto]"
                    : "items-center justify-center"
            )}
        >
            {user ? (
                <>
                    <ChatBoxHeader onSearchConvo={() => setSearchConversation(true)} onDeleteConversation={() => setDeleteConversation(true)}/>
                    <ConversationBox auth={auth} />
                    <div className="border-t p -2 overflow-hidden flex items-end gap-3">
                        <MessageBoxInput
                            onMessage={(message) => {
                                if (message) {
                                    let chat = {
                                        id: null,
                                        sender: auth.id,
                                        message: message,
                                        seen_at: null,
                                        created_at: formatISO(new Date()),
                                    };

                                    window.axios
                                        .post(
                                            route("messages.send", [
                                                user.id,
                                                user.messageId,
                                            ]),
                                            chat
                                        )
                                        .then((response) => {
                                            let res = response.data;
                                            let convo = [...conversation];

                                            // if the conversation is new, append user at the beginning of the list
                                            if (res.isNew) {
                                                setMessageList(
                                                    [res.data],
                                                    true
                                                );
                                            } else {
                                                setMessage(
                                                    user.id,
                                                    chat.message,
                                                    chat.sender,
                                                    chat.created_at
                                                );
                                            }

                                            if (!user.messageId)
                                                setUser({
                                                    ...user,
                                                    messageId: res.data.id,
                                                });
                                        })
                                        .catch((error) => console.log(error));

                                    setConversation([chat]);
                                }
                            }}
                        />
                    </div>
                </>
            ) : (
                <div className="text-center">
                    <div className="relative w-fit mx-auto opacity-30">
                        <UserRound className="size-16" strokeWidth={1} />
                        <MessagesSquare
                            className="absolute top-1 -right-0.5 size-5"
                            strokeWidth={2.2}
                        />
                    </div>
                    <div className="text-xs font-medium text-foreground/60">
                        Select user to start conversation
                    </div>
                </div>
            )}

            <SearchConversation show={searchConversation} onClose={setSearchConversation} />
            <DeleteConversationConfirmation show={deleteConversation} onClose={setDeleteConversation} />
        </div>
    );
}
