import { AvatarProfile } from "@/Components/ui/avatar";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarTrigger } from "@/Components/ui/menubar";
import { cn } from "@/lib/utils";
import { User } from "@/types";
import { router } from "@inertiajs/react";
import { EllipsisVertical, Send } from "lucide-react";
import { useEffect } from "react";

export default function ChatBox({ user }: {user: User}) {

    /* useEffect(() => {
        window.Echo.channel(`message.${user.id}`)
            .listen('SendMessageEvent', (e: any) => {
                console.log(e)
            })
    }, []) */

    return (
        <div className="border rounded-lg grid grid-rows-[auto,1fr,auto]">
            <div className="h-14 border-b p-2 flex items-center gap-2">
                <div className="">
                    <AvatarProfile />
                </div>
                <div className="max-w-96 w-full mr-2">
                    <Label className="line-clamp-1">Lorem ipsum dolor</Label>
                    <div className="text-xs text-green-600 font-medium">Active</div>
                </div>

                <Menubar className="p-0 h-fit border-none ml-auto">
                    <MenubarMenu>
                        <MenubarTrigger className="size-10 p-0 justify-center !cursor-pointer">
                            <EllipsisVertical className="size-4" />
                        </MenubarTrigger>
                        <MenubarContent align="end">
                            <MenubarItem className="transition duration-200">
                                Search
                            </MenubarItem>
                            <MenubarItem className="transition duration-200">
                                Export chat
                            </MenubarItem>
                            <MenubarItem className="text-destructive hover:!bg-destructive/10 hover:!text-destructive transition duration-200">
                                Delete conversation
                            </MenubarItem>
                        </MenubarContent>
                    </MenubarMenu>
                </Menubar>
            </div>
            <div className="flex flex-col-reverse py-2">
                <div className="flex flex-col space-y-0.5">

                    <MessageBox auth={user} position="sender-t" message={{id: 1001, message: "Lorem ipsum dolor \n Lorem", from: 1, to: 2, time: new Date().getTime().toString()}} />
                    <MessageBox auth={user} position="sender-m" message={{id: 1001, message: "Lorem ipsum dolor", from: 1, to: 2, time: new Date().getTime().toString()}} />
                    <MessageBox auth={user} position="sender-b" message={{id: 1001, message: "Lorem ipsum dolor", from: 1, to: 2, time: new Date().getTime().toString()}} />

                    <MessageBox auth={user} position="receiver-t" message={{id: 1001, message: "Lorem ipsum dolor", from: 2, to: 1, time: new Date().getTime().toString()}} />
                    <MessageBox auth={user} position="receiver-m" message={{id: 1001, message: "Lorem ipsum dolor", from: 2, to: 1, time: new Date().getTime().toString()}} />
                    <MessageBox auth={user} position="receiver-b" message={{id: 1001, message: "Lorem ipsum dolor", from: 2, to: 1, time: new Date().getTime().toString()}} />

                    <MessageBox auth={user} position="sender" message={{id: 1001, message: "Lorem ipsum dolor", from: 1, to: 2, time: new Date().getTime().toString()}} />
                    
                    <MessageBox auth={user} position="receiver" message={{id: 1001, message: "Lorem ipsum dolor", from: 2, to: 1, time: new Date().getTime().toString()}} />
                    
                    <MessageBox auth={user} position="sender" message={{id: 1001, message: "Lorem ipsum dolor", from: 1, to: 2, time: new Date().getTime().toString()}} />

                </div>
            </div>
            <div className="h-14 border-t p-2 flex gap-3">
                <Input className="" placeholder="Write message" />
                <Button size="icon" onClick={() => {
                    router.post(route('message.send', [2]), {
                        message: "hello there"
                    })
                }}>
                    <Send className="size-5" />
                </Button>
            </div>
        </div>
    );
}

interface MessageBoxProps {
    id: number;
    message: string;
    from: number;
    to: number;
    time: string;
}

type MessagePosition = "sender-t" 
    | "sender-m" 
    | "sender-b" 
    | "sender"
    | "receiver-b"
    | "receiver-t"
    | "receiver-m"
    | "receiver"

const MessageBox: React.FC<{ message: MessageBoxProps, auth: User, position: MessagePosition }> = ({ message, auth, position }) => {

    const messageBoxVariant = {
        "sender": "ml-auto mr-2 bg-blue-600 text-white",
        "receiver": "ml-2 bg-accent"
    }[message.from === auth.id ? "sender" : "receiver"]

    const roundedBox = {
        "sender-t": "rounded-[1.25rem] rounded-br-md",
        "sender-m": "rounded-[1.25rem] rounded-e-md",
        "sender-b": "rounded-[1.25rem] rounded-tr-md",
        "sender": "rounded-[1.25rem]",
        "receiver-t": "rounded-[1.25rem] rounded-bl-md",
        "receiver-m": "rounded-[1.25rem] rounded-s-md",
        "receiver-b": "rounded-[1.25rem] rounded-tl-md",
        "receiver": "rounded-[1.25rem]",
    }[position]

    return (
        <div className={cn("max-w-96 w-fit py-2 px-3", messageBoxVariant, roundedBox)}>
            <div className="whitespace-pre-line break-words">
                {message.message}
            </div>
        </div>
    )
}