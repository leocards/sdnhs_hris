import { AvatarProfile } from "@/Components/ui/avatar";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { ScrollArea } from "@/Components/ui/scroll-area";
import { Search, X } from "lucide-react";
import {
    ChangeEvent,
    useEffect,
    useRef,
    useState,
} from "react";
import useDebounce from "@/hooks/useDebounce";
import SidePanelMessageCard from "./SidePanelMessageCard";
import { cn } from "@/lib/utils";
import { useMessage, USER } from "@/hooks/MessageProvider";
import { PageProps } from "@/types";

type Props = {
    user_open_message: USER
}

const SidePanel: React.FC<PageProps & Props> = ({ auth, user_open_message }) => {
    const [search, setSearch] = useState<string>("");
    const searchRef = useRef<HTMLInputElement | null>(null);
    const [loading, setLoading] = useState(false);
    const debounceSearch = useDebounce<string>(search, search ? 700 : 0);
    const [searchResult, setSearchResult] = useState<Array<USER>>([]);

    const { setUser, messageList, setConversation, setLoadingConversation, activeUsers } = useMessage();

    const onSearch = (event: ChangeEvent<HTMLInputElement>) => {
        const input = event.target.value.replace(/\s+/g, " ");

        setSearch(input);
        setLoading(true);
    };

    const clearSearch = () => {
        searchRef.current && searchRef.current.focus();
        setSearch("");
    };

    const setUserConversation = (id: number, messageId: number) => {
        setLoadingConversation(true)
        window.axios
            .get(route("messages.conversation", [id, messageId]))
            .then((response) => {
                let message = response.data;
                setConversation(message?.data || [], true);
                setLoadingConversation(false)
            });
    };

    useEffect(() => {
        if (debounceSearch) {
            window.axios
                .get(route("messages.search", [debounceSearch]))
                .then((response) => {
                    setSearchResult(response.data);
                })
                .finally(() => setLoading(false));
        } else {
        }
    }, [debounceSearch]);

    useEffect(() => {
        if(user_open_message) {
            setUser(user_open_message, true);

            setUserConversation(user_open_message.id, user_open_message.messageId)
        }
    }, [])

    return (
        <div className="border rounded-lg grid grid-rows-[auto,1fr] [@media(max-width:720px)]:hidden">
            <div className="h-14 border-b p-2">
                <div className="ml-auto relative max-w-96 w-full">
                    <Input
                        className="w-full px-10"
                        value={search}
                        placeholder="Search user"
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
            <ScrollArea className="">
                <div className="p-1.5">
                    {search ? (
                        loading ? (
                            <div className="w-fit h-fit mx-auto mt-16 flex flex-col items-center gap-2 text-xs">
                                <span className="loading loading-spinner loading-sm"></span>
                                <div>Loading...</div>
                            </div>
                        ) : searchResult.length > 0 ? (
                            searchResult.map((user, index) => (
                                <SearchCard
                                    key={index}
                                    user={user}
                                    active={!!(activeUsers.find((au) => au.id == user?.id))}
                                    onClick={(u: USER) => {
                                        setSearch("");
                                        setUser(u, true);
                                        if(u)
                                            setUserConversation(u.id, u.messageId)
                                    }}
                                />
                            ))
                        ) : (
                            <div className="text-center text-sm">
                                No results found for " {search} "
                            </div>
                        )
                    ) : (
                        messageList.map((list, index) => (
                            <SidePanelMessageCard
                                key={index}
                                auth={auth}
                                active={!!(activeUsers.find((au) => au.id == list.user.id))}
                                user={{
                                    ...list.user,
                                    messageId: list.id,
                                    lastMessage: list.conversations,
                                }}
                            />
                        ))
                    )}
                </div>
            </ScrollArea>
        </div>
    );
};

const SearchCard: React.FC<{
    user: USER;
    active: boolean;
    onClick: CallableFunction;
}> = ({ user, active, onClick }) => {
    return (
        <div
            className="hover:bg-secondary p-2 flex items-center rounded transition gap-2 [&>div>*]:cursor-pointer"
            role="button"
            onClick={() => onClick(user)}
        >
            <div className="relative">
                <AvatarProfile src="/storage/assets/profile.png" />
                {active && <span className="absolute bottom-0 right-px size-2.5 bg-green-500 z-10 rounded-full ring ring-white" />}
            </div>
            <Label
                className={cn(
                    "line-clamp-1 text-foreground/90 pointer-events-none !leading-6"
                )}
            >
                {user?.name}
            </Label>
        </div>
    );
};

export default SidePanel;
