import { AvatarProfile } from "@/Components/ui/avatar";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { ScrollArea } from "@/Components/ui/scroll-area";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { PageProps } from "@/types";
import { router } from "@inertiajs/react";
import { SearchIcon, X } from "lucide-react";
import { ChangeEvent, useRef, useState } from "react";
import { SeniorHighList } from "../Reports/Reports";

export default function Search({ auth }: PageProps) {
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

    const employees = SeniorHighList.map((list) => {
        return {
            name: list,
            position: "Teacher I",
            department: "Senior High School",
            credits: 10
        }
    })

    return (
        <Authenticated
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Search
                </h2>
            }
        >
            <div className="flex my-6 mt-5 relative">
                <Input
                    className="w-full px-10"
                    value={search}
                    placeholder="Search"
                    ref={searchRef}
                    onInput={onSearch}
                />
                <SearchIcon className="size-5 absolute top-1/2 -translate-y-1/2 left-2.5 opacity-45" />
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

            <div className="border rounded-lg overflow-hidden p-1">
                <div className="h-12 flex items-center border-b w-full bg-white px-2">
                    <div className="grid grid-cols-[repeat(3,1fr),5rem,4rem] grow bg-white relative z-10">
                        <div>Name</div>
                        <div>Position</div>
                        <div>Department</div>
                        <div>Credits</div>
                    </div>
                </div>
                <ScrollArea className="h-[27rem] rounded-md">
                    {employees.map((emp, index) => (
                        <div className="cursor-default" key={index}>
                            <div className="rounded-md hover:bg-secondary transition">
                                <div className="grid grid-cols-[repeat(3,1fr),5rem,4rem] grow [&>div]:py-2 px-2">
                                    <div className="flex items-center gap-2">
                                        <AvatarProfile className="" />
                                        <div className="line-clamp-1">{emp.name}</div>
                                    </div>
                                    <div className="flex items-center">
                                        {emp.position}
                                    </div>
                                    <div className="flex items-center">
                                        {emp.department}
                                    </div>
                                    <div className="flex items-center">
                                        {emp.credits}
                                    </div>
                                    <div className="flex items-center">
                                        <Button className="h-8" variant="link" onClick={() => router.get(route('general-search.view', [2]))}>
                                            View
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </ScrollArea>
            </div>
        </Authenticated>
    );
}
