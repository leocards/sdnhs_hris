import Tabs from "@/Components/framer/Tabs";
import { AvatarProfile } from "@/Components/ui/avatar";
import { Button } from "@/Components/ui/button";
import { Label } from "@/Components/ui/label";
import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarTrigger } from "@/Components/ui/menubar";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { PageProps } from "@/types";
import { Ellipsis } from "lucide-react";

export default function Notification({ auth }: PageProps) {
    return (
        <Authenticated
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Notification
                </h2>
            }
        >
            <div className="mx-auto max-w-2xl mt-10">
                <div>
                    <Tabs
                        id="notifications"
                        active="all"
                        className="w-fit"
                        tabs={[
                            { id: "all", label: "All" },
                            { id: "unread", label: "Unread" },
                        ]}
                    />
                </div>

                <div className="mt-5 space-y-1">
                    {Array.from({ length: 25 }).map((_, index) => (
                        <div className="relative group" key={index}>
                            <div className="notification" role="button">
                                <div>
                                    <AvatarProfile />
                                </div>
                                <div>
                                    <Label>
                                        <span className="text-base font-semibold">
                                            Anna doe
                                        </span>{" "}
                                        has submitted an Application for leave
                                    </Label>
                                    <div className="text-xs text-foreground font-medium">
                                        6h
                                    </div>
                                </div>
                            </div>
                            <Menubar className="p-0 h-fit border-none ml-auto rounded-full absolute top-1/2 -translate-y-1/2 right-3 shadow">
                                <MenubarMenu>
                                    <MenubarTrigger className="size-10 p-0 justify-center !cursor-pointer data-[state=open]:flex data-[state=close]:hidden group-hover:flex hidden">
                                        <Ellipsis className="size-5" />
                                    </MenubarTrigger>
                                    <MenubarContent align="end">
                                        <MenubarItem className="transition duration-200">
                                            Mark as read
                                        </MenubarItem>
                                        <MenubarItem className="transition duration-200">
                                            Delete notification
                                        </MenubarItem>
                                    </MenubarContent>
                                </MenubarMenu>
                            </Menubar>
                        </div>
                    ))}
                </div>
            </div>
        </Authenticated>
    );
}

/* 
<Button
                                variant="secondary"
                                size="icon"
                                className="rounded-full absolute group-hover:flex hidden top-1/2 -translate-y-1/2 right-3 bg-zinc-200 before:!bg-zinc-300/80 before:!duration-500 shadow"
                            >
                                <Ellipsis className="size-5" />
                            </Button>
*/
