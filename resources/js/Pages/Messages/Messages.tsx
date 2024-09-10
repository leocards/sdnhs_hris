import { AvatarProfile } from "@/Components/ui/avatar";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { ScrollArea } from "@/Components/ui/scroll-area";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { PageProps } from "@/types";
import { Description } from "@headlessui/react";
import { Search, X } from "lucide-react";
import { ChangeEvent, useRef, useState } from "react";
import ChatBox from "./ChatBox";
import { Head } from "@inertiajs/react";

export default function Messages({ auth }: PageProps) {
    const [search, setSearch] = useState<string>("");
    const searchRef = useRef<HTMLInputElement | null>(null);

    const onSearch = (event: ChangeEvent<HTMLInputElement>) => {
        const input = event.target.value.replace(/\s+/g, " ");

        setSearch(input);
    };

    const clearSearch = () => {
        searchRef.current && searchRef.current.focus();
        setSearch("");
    };

    return (
        <Authenticated
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl leading-tight">
                    Messages
                </h2>
            }
        >
            <Head title="Messages" />

            <div className="mt-8 grid grid-cols-1 grid-rows-1">
                <div className="grid [@media(min-width:720px)]:grid-cols-[20rem,1fr] row-span-1 gap-3 [&>div]:h-[calc(100vh-10.5em)]">
                    <div className="border rounded-lg grid grid-rows-[auto,1fr] [@media(max-width:720px)]:hidden">
                        <div className="h-14 border-b p-2">
                            <div className="ml-auto relative max-w-96 w-full">
                                <Input
                                    className="w-full px-10"
                                    value={search}
                                    placeholder="Search"
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
                                {Array.from({ length: 2 }).map((_, index) => (
                                    <div
                                        key={index}
                                        className="hover:bg-secondary p-2 h-14 flex items-center rounded transition gap-2 [&>div>*]:cursor-pointer"
                                        role="button"
                                    >
                                        <div>
                                            <AvatarProfile src="/storage/assets/profile.png" />
                                        </div>
                                        <div className="grow">
                                            <Label className="line-clamp-1 mb-1.5 font-semibold">
                                                Lorem ipsum dolor est
                                            </Label>
                                            <div className="text-foreground/80 font-medium flex">
                                                <div className="text-xs font-medium line-clamp-1">
                                                    You: Hello
                                                </div>
                                                <div className="text-xs ml-1.5 shrink-0 w-fit">
                                                    {" "}
                                                    <span aria-hidden="true">
                                                        {" "}
                                                        ·{" "}
                                                    </span>{" "}
                                                    9h
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <div
                                    className="hover:bg-secondary p-2 h-14 flex items-center rounded transition gap-2 [&>div>*]:cursor-pointer"
                                    role="button"
                                >
                                    <div>
                                        <AvatarProfile src="/storage/assets/profile.png" />
                                    </div>
                                    <div className="grow">
                                        <Label className="line-clamp-1 mb-1.5 text-foreground/90 font-normal semibold">
                                            Lorem ipsum dolor est
                                        </Label>
                                        <div className="text-foreground/45 flex">
                                            <div className="text-xs font-medium line-clamp-1">
                                                You: Hello
                                            </div>
                                            <div className="text-xs ml-1.5 shrink-0 w-fit">
                                                {" "}
                                                <span aria-hidden="true">
                                                    {" "}
                                                    ·{" "}
                                                </span>{" "}
                                                9h
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </ScrollArea>
                    </div>

                    <ChatBox user={auth.user} />
                </div>
            </div>
        </Authenticated>
    );
}
