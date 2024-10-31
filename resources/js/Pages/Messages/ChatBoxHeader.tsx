import { Label } from "@/Components/ui/label";
import {
    Menubar,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarTrigger,
} from "@/Components/ui/menubar";
import { AvatarProfile } from "@/Components/ui/avatar";
import { ArrowLeft, EllipsisVertical, Send } from "lucide-react";
import { Button } from "@/Components/ui/button";
import { useMessage } from "@/hooks/MessageProvider";

type Props = {
    onSearchConvo: () => void;
    onDeleteConversation: CallableFunction;
}

const ChatBoxHeader: React.FC<Props> = ({ onSearchConvo, onDeleteConversation }) => {
    const { user, activeUsers } = useMessage()
    const isActive = !!(activeUsers.find((au) => au.id === user?.id))

    return (
        <div className="h-14 border-b p-2 flex items-center gap-2">
            <div className="[@media(min-width:720px)]:hidden">
                <Button variant={"ghost"} size={"icon"}>
                    <ArrowLeft className="size-4" />
                </Button>
            </div>
            <div className="">
                <AvatarProfile src={user?.avatar} active={isActive} />
            </div>
            <div className="max-w-96 w-full mr-2">
                <Label className="line-clamp-1">{user?.name}</Label>
                {isActive ? <div className="text-xs text-green-600 font-medium">Active</div> : <div className="text-xs text-gray-400 font-medium">Offline</div>}
            </div>

            <Menubar className="p-0 h-fit border-none ml-auto">
                <MenubarMenu>
                    <MenubarTrigger className="size-10 p-0 justify-center !cursor-pointer">
                        <EllipsisVertical className="size-4" />
                    </MenubarTrigger>
                    <MenubarContent align="end">
                        <MenubarItem className="transition duration-200" onClick={onSearchConvo}>
                            Search
                        </MenubarItem>
                        <MenubarItem className="transition duration-200">
                            Export chat
                        </MenubarItem>
                        <MenubarItem className="text-destructive hover:!bg-destructive/10 dark:hover:!bg-destructive/50 hover:!text-destructive dark:!text-red-500 transition duration-200" onClick={() => onDeleteConversation()}>
                            Delete conversation
                        </MenubarItem>
                    </MenubarContent>
                </MenubarMenu>
            </Menubar>
        </div>
    );
};

export default ChatBoxHeader;
