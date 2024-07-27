import { AvatarProfile } from "@/Components/ui/avatar";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarTrigger } from "@/Components/ui/menubar";
import { ScrollArea } from "@/Components/ui/scroll-area";
import { EllipsisVertical, Send } from "lucide-react";

export default function ChatBox() {
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
                <div className="flex flex-col">

                    <div className="max-w-96 rounded-3xl bg-blue-600 py-2 px-4 ml-auto mr-2">
                        <div className="whitespace-pre-wrap break-words text-white">
                            Hi how are you?
                        </div>
                    </div>

                    <div className="max-w-96 w-fit rounded-3xl bg-accent py-2 px-4 ml-2">
                        <div className="whitespace-pre-wrap break-words">
                            I'm fine thank you.
                        </div>
                    </div>

                </div>
            </div>
            <div className="h-14 border-t p-2 flex gap-3">
                <Input className="" placeholder="Write message" />
                <Button size="icon">
                    <Send className="size-5" />
                </Button>
            </div>
        </div>
    );
}
