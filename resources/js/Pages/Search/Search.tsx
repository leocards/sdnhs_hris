import { AvatarProfile } from "@/Components/ui/avatar";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { ScrollArea } from "@/Components/ui/scroll-area";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { PageProps } from "@/types";
import { Head, router } from "@inertiajs/react";
import { SearchIcon, X } from "lucide-react";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { SeniorHighList } from "../Reports/Reports";
import useDebounce from "@/hooks/useDebounce";
import DataList from "@/Components/DataList";

type Props = {
    personnels: Array<{
        id: number;
        first_name: string;
        middle_name: string;
        last_name: string;
        department: string;
        position: string;
        leave_credits: number;
        avatar: string;
    }>;
} & PageProps;

export default function Search({
    auth,
    personnels,
}: Props ) {
    const [search, setSearch] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [personnelList, setPersonnelList] = useState<typeof personnels>(personnels);
    const searchRef = useRef<HTMLInputElement | null>(null);
    const debounceSearch = useDebounce<string>(search, search?700:0)

    const onSearch = (event: ChangeEvent<HTMLInputElement>) => {
        const input = event.target.value.replace(/\s+/g, " ");

        setSearch(input);
        input && setLoading(true)
    };

    const clearSearch = () => {
        searchRef.current && searchRef.current.focus();
        setSearch("");
    };

    useEffect(() => {
        if(debounceSearch) {
            window.axios.get(route('general-search.json', {
                _query: {
                    search: search
                }
            })).then((response) => {
                let data: typeof personnels = response.data

                setPersonnelList(data)
            }).finally(() => setLoading(false))
        } else {
            setPersonnelList(personnels)
        }
    }, [debounceSearch])

    return (
        <Authenticated
            userAuth={auth.user}
            header={
                <h2 className="font-semibold text-xl leading-tight">Search</h2>
            }
        >
            <Head title="Search" />

            <div className="flex my-6 mt-5 relative">
                <Input
                    className="w-full px-10"
                    value={search}
                    placeholder="Search name, certificate name, etc."
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
                <div className="h-12 flex items-center border-b w-full bg-white dark:bg-zinc-900 px-2">
                    <div className="grid grid-cols-[1fr,12rem,12rem,5rem,4rem] grow relative z-10">
                        <div>Name</div>
                        <div>Position</div>
                        <div>Department</div>
                        <div>Credits</div>
                    </div>
                </div>
                <ScrollArea className="h-[27rem] rounded-md">
                    <DataList empty={personnelList.length === 0} emptyResults={search} loading={loading}>
                        {personnelList.map((emp, index) => (
                            <div className="cursor-default" key={index}>
                                <div className="rounded-md hover:bg-secondary transition">
                                    <div className="grid grid-cols-[1fr,12rem,12rem,5rem,4rem] grow [&>div]:py-2 px-2">
                                        <div className="flex items-center gap-2">
                                            <AvatarProfile src={emp.avatar} className="" />
                                            <div className="line-clamp-1">
                                                {emp.last_name+', '+emp.first_name+' '+(emp.middle_name??'')}
                                            </div>
                                        </div>
                                        <div className="flex items-center">
                                            {emp.position}
                                        </div>
                                        <div className="flex items-center">
                                            {emp.department??'-'}
                                        </div>
                                        <div className="flex items-center">
                                            {emp.leave_credits??'-'}
                                        </div>
                                        <div className="flex items-center">
                                            <Button
                                                className="h-8"
                                                variant="link"
                                                onClick={() =>
                                                    router.get(
                                                        route(
                                                            "general-search.view",
                                                            [emp.id]
                                                        )
                                                    )
                                                }
                                            >
                                                View
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </DataList>
                </ScrollArea>
            </div>
        </Authenticated>
    );
}
