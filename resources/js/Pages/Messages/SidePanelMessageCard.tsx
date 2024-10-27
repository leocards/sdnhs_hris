import { AvatarProfile } from "@/Components/ui/avatar";
import { Label } from "@/Components/ui/label";
import { useMessage, USER } from "@/hooks/MessageProvider";
import { cn } from "@/lib/utils";
import { PageProps, User } from "@/types";
import React, { useEffect } from "react";
import { getTimeFromNow } from "./TimeFromNow";

type Props = {
    user: USER & {
        lastMessage: {
            sender: number;
            message: string;
            seen_at: string | null;
            created_at: string;
        };
    };
    active: boolean;
} & PageProps;

const SidePanelMessageCard: React.FC<Props> = ({ auth, user, active }) => {
    const { setUser, setConversation, setLoadingConversation, setAsSeen, unreadmessages, setUnreadMessages } =
        useMessage();

    const setUserConversation = async (id: number, messageId: number) => {
        setLoadingConversation(true);
        let response = await window.axios.get(
            route("messages.conversation", [id, messageId])
        );
        let message = response.data;
        setConversation(message?.data || [], true);
        setLoadingConversation(false);
    };

    const setMessageAsSeen = async (messageId: number) => {
        setAsSeen(messageId);
        await window.axios.post(route("message.seen", [messageId]));
    };

    return (
        <div
            className="hover:bg-secondary p-2 h-14 flex items-center rounded transition gap-2 [&>div>*]:cursor-pointer"
            role="button"
            onClick={() => {
                setUser({
                    id: user.id,
                    name: user.name,
                    avatar: user.avatar,
                    messageId: user.messageId,
                });
                setUserConversation(user.id, user.messageId);

                if (!user.lastMessage.seen_at) {
                    setMessageAsSeen(user.messageId);

                    if(unreadmessages > 0)
                        setUnreadMessages(-1)
                }

            }}
        >
            <AvatarProfile active={active} />
            <div className="grow relative">
                <Label
                    className={cn(
                        "line-clamp-1 text-foreground/90 !leading-5",
                        !user.lastMessage.seen_at &&
                            user.lastMessage.sender !== auth.user.id
                            ? "font-semibold"
                            : "font-normal"
                    )}
                >
                    {user.name}
                </Label>
                <div
                    className={cn(
                        "flex",
                        !user.lastMessage.seen_at &&
                            user.lastMessage.sender !== auth.user.id
                            ? "text-foreground/80"
                            : "text-foreground/45"
                    )}
                >
                    <div className="text-xs font-medium line-clamp-1">
                        {user.lastMessage.sender === auth.user.id
                            ? `You: ${user.lastMessage.message}`
                            : user.lastMessage.message}
                    </div>
                    <div className="text-xs ml-1.5 shrink-0 w-fit">
                        {" "}
                        <span aria-hidden="true"> · </span>{" "}
                        {getTimeFromNow(user.lastMessage.created_at)}
                    </div>

                    {!user.lastMessage.seen_at &&
                        user.lastMessage.sender !== auth.user.id && (
                            <div className="absolute size-2.5 top-1/2 -translate-y-1/2 right-0 bg-green-600 rounded-full" />
                        )}
                </div>
            </div>
        </div>
    );
};

export default SidePanelMessageCard;
