import Modal, { ModalProps } from "@/Components/Modal";
import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Search, X } from "lucide-react";
import useDebounce from "@/hooks/useDebounce";
import { ScrollArea } from "@/Components/ui/scroll-area";
import { AvatarProfile } from "@/Components/ui/avatar";
import { Label } from "@/Components/ui/label";
import { format } from "date-fns";
import DataList from "@/Components/DataList";
import { useMessage } from "@/hooks/MessageProvider";
import { router } from "@inertiajs/react";
import Processing from "@/Components/Processing";

type Props = {} & ModalProps;

type MessageType = {
    id: number;
    sender: number;
    message: string;
    message_id: number;
    seen_at: string;
    created_at: string;
    message_sender: {
        id: number;
        name: string;
        avatar: string;
    };
};

const SearchConversation: React.FC<Props> = ({ show, onClose }) => {
    const [search, setSearch] = useState<string>("");
    const searchRef = useRef<HTMLInputElement | null>(null);
    const [loading, setLoading] = useState(false);
    const debounceSearch = useDebounce<string>(search, search ? 700 : 0);
    const [conversationList, setConversationList] = useState<
        Array<MessageType>
    >([]);
    const [processing, setProcessing] = useState(false);

    const { user, setSearchConversation, setConversation } = useMessage();

    const onSearch = (event: ChangeEvent<HTMLInputElement>) => {
        const input = event.target.value.replace(/\s+/g, " ");

        setSearch(input);
        setLoading(true);
    };

    const clearSearch = () => {
        searchRef.current && searchRef.current.focus();
        setSearch("");
    };

    const selectConversation = (messageId: number, convoId: number) => {
        setProcessing(true)
        window.axios
            .get(route("messages.searched_convo", [messageId, convoId]))
            .then((response) => {
                let result = response.data

                setConversation(result.data, true)
                setProcessing(false)
                onClose(false)
                setSearchConversation(convoId)
            })
    };

    useEffect(() => {
        if (debounceSearch) {
            window.axios
                .get(
                    route("messages.search_conversation", [
                        user?.messageId,
                        search,
                    ])
                )
                .then((response) => {
                    let result = response.data;

                    setConversationList(result);
                    setLoading(false);
                });
        } else {
            setConversationList([]);
        }
    }, [debounceSearch]);

    useEffect(() => {
        if(show) {
            setSearch("")
            setConversationList([])
        }
    }, [show])

    return (
        <Modal show={show} onClose={() => onClose(false)} center>
            {processing ? (
                <Processing is_processing={processing} backdrop={""} />
            ) : (
                <div className="p-6">
                    <div className="h-14 border-b">
                        <div className="ml-auto relative w-full">
                            <Input
                                className="w-full px-10"
                                value={search}
                                placeholder="Search conversation"
                                ref={searchRef}
                                onInput={onSearch}
                            />
                            <Search className="size-5 absolute top-1/2 -translate-y-1/2 left-2.5 opacity-45" />
                            {search !== "" && (
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    className="absolute top-1/2 -translate-y-1/2 right-1 size-8"
                                    onClick={clearSearch}
                                >
                                    <X className="size-5" />
                                </Button>
                            )}
                        </div>
                    </div>

                    <ScrollArea className="h-[26rem] mb-1 border-b">
                        <DataList
                            empty={conversationList.length === 0}
                            emptyResults={search}
                            loading={loading}
                            customEmpty={"Start searching for conversation"}
                        >
                            <div className="divide-y">
                                {conversationList.map((convo, index) => (
                                    <div
                                        key={index}
                                        onClick={() =>
                                            selectConversation(
                                                convo.message_id,
                                                convo.id
                                            )
                                        }
                                        className="hover:bg-secondary/70 p-2.5 min-h-12 flex items-center"
                                        role="button"
                                    >
                                        <div className="self-start">
                                            <AvatarProfile
                                                className="size-8"
                                                src={
                                                    convo.message_sender.avatar
                                                }
                                            />
                                        </div>
                                        <div className="ml-2">
                                            <div className="flex items-center mb-1 pt-">
                                                <Label>
                                                    {convo.sender !== user?.id
                                                        ? "You"
                                                        : convo.message_sender
                                                              .name}
                                                </Label>
                                                <div
                                                    aria-hidden="true"
                                                    className="mx-1 leading-3"
                                                >
                                                    {" "}
                                                    ·{" "}
                                                </div>
                                                <div className="text-xs">
                                                    {format(
                                                        convo.created_at,
                                                        "PP"
                                                    )}
                                                </div>
                                            </div>
                                            <div className="text-sm line-clamp-3 whitespace-pre-line break-words">
                                                {convo.message}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </DataList>
                    </ScrollArea>

                    {conversationList.length > 0 && (
                        <div className="mb-3 text-sm">
                            {conversationList.length} found results
                        </div>
                    )}

                    <div className="flex">
                        <Button
                            className="px-10 ml-auto"
                            variant="secondary"
                            onClick={() => onClose(false)}
                        >
                            Close
                        </Button>
                    </div>
                </div>
            )}
        </Modal>
    );
};

export default SearchConversation;
