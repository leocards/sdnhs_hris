import Filter from "@/Components/buttons/FilterButton";
import Sort from "@/Components/buttons/SortButton";
import Tabs from "@/Components/framer/Tabs";
import { AvatarProfile } from "@/Components/ui/avatar";
import { Button } from "@/Components/ui/button";
import {
    Menubar,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarSeparator,
    MenubarTrigger,
} from "@/Components/ui/menubar";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/Components/ui/pagination";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { cn } from "@/lib/utils";
import { PaginateData, PageProps } from "@/types";
import { router, usePage } from "@inertiajs/react";
import axios from "axios";
import {
    EllipsisVertical,
    Eye,
    MessageCircle,
    PenLine,
    Trash2,
    Upload,
    UserRoundPlus,
} from "lucide-react";
import { Fragment, useEffect, useState } from "react";
import { PersonnelListProps } from "./types";
import UploadPDS from "./UploadPDS";
import ViewPDS from "./ViewPds";
import PersonnelDetails from "./PersonnelDetails";

interface PersonnelProps extends PageProps {
    personnel: PaginateData;
}

export default function Personnel({ auth, personnel }: PersonnelProps) {
    const [personnelList, setPersonnelList] = useState<PaginateData>(personnel);
    const [filter, setFilter] = useState<string>("");
    const [sort, setSort] = useState<{ sort: string; order: string }>({
        sort: "Name",
        order: "ASC",
    });
    const [showUploadPDS, setShowUploadPDS] = useState<boolean>(false);
    const [showPDS, setShowPDS] = useState<boolean>(false)
    const [showPersonnelDetails, setShowPersonnelDetails] = useState<boolean>(false)
    const [selectedPersonnel, setSelectedPersonnel] = useState<any>(null)

    const navigateTo = (nav: string) => {
        router.get(route(nav));
    };

    const processData = (response: any) => {
        const { data } = response;
        setPersonnelList(data);
    };

    const getNextPage = () => {
        if (personnelList.next_page_url)
            axios.get(personnelList.next_page_url).then(processData);
    };

    const onClickMenu = (action: string, id: any) => {
        if (action === "upload_pds") {
            setShowUploadPDS(true);
        } else if (action === "edit") {
            router.get(route('personnel.edit', [id]))
        } else if (action === "view") {
            setSelectedPersonnel(id)
            setShowPersonnelDetails(true)
        } else if(action === "messages") {
            router.get(route('messages') + `?user=${id}`)
        }
    };

    const tabs = {
        HR: ["personnel", "personnel.tardiness"],
        HOD: ["personnel"],
    }[auth.user.role];

    useEffect(() => {
        axios.get(route("personnel.list")).then(processData);
    }, []);

    return (
        <Authenticated
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Personnel
                </h2>
            }
        >
            <div className="divide-x flex mt-5 text-sm border-b-2">
                <Tabs
                    id="personnel-tab"
                    active="personnel"
                    navigate={navigateTo}
                    tabs={[
                        { id: "personnel", label: "Personnel" },
                        { id: "personnel.tardiness", label: "Tardiness" },
                    ].filter(({ id }) => tabs?.includes(id))}
                />
            </div>

            <div className="my-7 grid gap-8 sm:grid-cols-2 xl:grid-cols-4">
                <div className="border-t pt-4 space-y-1.5">
                    <div className="font-medium">Total employees</div>
                    <div className="text-xl font-semibold">120 Employees</div>
                </div>
                <div className="border-t pt-4 space-y-1.5">
                    <div className="font-medium">Total personnel</div>
                    <div className="text-xl font-semibold">120 Personnel</div>
                </div>
                <div className="border-t pt-4 space-y-1.5">
                    <div className="font-medium">Department heads</div>
                    <div className="text-xl font-semibold">3 Heads</div>
                </div>
                <div className="border-t pt-4 space-y-1.5">
                    <div className="font-medium">Administrators</div>
                    <div className="text-xl font-semibold">2 Admins</div>
                </div>
            </div>

            <div className="w-full flex items-center mb-7">
                <div>
                    <Filter
                        size="lg"
                        filter="Filter"
                        position="BOTTOMLEFT"
                        active={filter}
                        items={[
                            { filter: "Department", onClick: setFilter },
                            { filter: "Position", onClick: setFilter },
                            { filter: "Teaching", onClick: setFilter },
                            { filter: "Non-teaching", onClick: setFilter },
                        ]}
                        onClear={() => setFilter("")}
                    />
                </div>
                <div className="ml-3">
                    <Sort
                        size="lg"
                        sort={sort.sort}
                        order={sort.order}
                        position="BOTTOMLEFT"
                        onSort={(sort) =>
                            setSort((prev) => ({
                                ...prev,
                                sort: sort,
                            }))
                        }
                        onOrderBy={(order) =>
                            setSort((prev) => ({
                                ...prev,
                                order: order,
                            }))
                        }
                        sorts={[
                            { sort: "Name" },
                            { sort: "Email" },
                            { sort: "Position" },
                            { sort: "Department" },
                        ]}
                    />
                </div>
                {auth.user.role === "HR" && (
                    <Button
                        className="ml-auto gap-3"
                        onClick={() => router.get(route("personnel.new"))}
                    >
                        <UserRoundPlus className="size-5" />
                        New personnel
                    </Button>
                )}
            </div>

            <div className="divide-y min-h-[22rem] flex flex-col ">
                <div className="grid grid-cols-[repeat(4,minmax(6rem,1fr)),8rem,3rem] py-2 [&>div:first-child]:pl-1 [&>div]:font-medium opacity-60">
                    <div className="">Name</div>
                    <div className="">Email</div>
                    <div className="">Department</div>
                    <div className="">Position</div>
                    <div className="">Leave Credits</div>
                    <div className=""></div>
                </div>
                {personnelList.data.length === 0 && (
                    <div className="text-center py-4 opacity-65">
                        No records
                    </div>
                )}
                <div className="text-center py-4 opacity-65 hidden">
                    No results found for "lorem ipsum"
                </div>

                {personnelList.data.map((data, index) => (
                    <PersonnelRow
                        key={index}
                        user={data}
                        onClick={onClickMenu}
                        auth={auth.user.role}
                    />
                ))}

                {personnelList.total > 50 && (
                    <Pagination className="!mt-auto pt-2">
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious
                                    href="#"
                                    className={cn(
                                        personnelList.current_page === 1 &&
                                            "opacity-60 pointer-events-none"
                                    )}
                                />
                            </PaginationItem>
                            {Array.from({
                                length:
                                    personnelList.last_page <= 3
                                        ? personnelList.last_page
                                        : personnelList.last_page - 3,
                            }).map((_, index) => (
                                <PaginationItem key={index}>
                                    <PaginationLink
                                        href="#"
                                        isActive={
                                            personnelList.current_page === ++index
                                        }
                                    >
                                        <span>{index}</span>
                                    </PaginationLink>
                                </PaginationItem>
                            ))}
                            {personnelList.last_page > 3 && (
                                <PaginationItem>
                                    <PaginationEllipsis />
                                </PaginationItem>
                            )}
                            <PaginationItem>
                                <PaginationNext
                                    href="#"
                                    className={cn(
                                        !personnelList.next_page_url &&
                                            "opacity-60 pointer-events-none"
                                    )}
                                    onClick={getNextPage}
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                )}
            </div>

            <UploadPDS show={showUploadPDS} onClose={setShowUploadPDS} />
            <ViewPDS show={showPDS} onClose={setShowPDS} />
            <PersonnelDetails user={selectedPersonnel} show={showPersonnelDetails} onClose={setShowPersonnelDetails} onViewPDS={setShowPDS} />
        </Authenticated>
    );
}

const PersonnelRow: React.FC<PersonnelListProps & { auth: string }> = ({
    user,
    auth,
    onClick,
}) => {
    return (
        <div className="hover:bg-secondary transition-colors">
            <div className="grid grid-cols-[repeat(4,minmax(6rem,1fr)),8rem,3rem] [&>div]:py-3 [&>div]:flex [&>div]:items-center [&>div]:pr-3 [&>div:first-child]:pl-1">
                <div className="">
                    <div className="flex items-center gap-2">
                        <AvatarProfile className="size-8" />
                        <div className="line-clamp-1 break-words">
                            {user.first_name + " " + user.last_name}
                        </div>
                    </div>
                </div>
                <div className="">
                    <div className="line-clamp-1 break-words">{user.email}</div>
                </div>
                <div className="shrink-0">
                    <div className="line-clamp-1 break-words">
                        {user.department}
                    </div>
                </div>
                <div className="">
                    <div className="line-clamp-1">{user.position}</div>
                </div>
                <div className="">
                    <div className="line-clamp-1">{user.leave_credits}</div>
                </div>
                <div className="">
                    <Menubar className="p-0 border-none group size-8 bg-transparent">
                        <MenubarMenu>
                            <MenubarTrigger className="h-full cursor-pointer p-0 flex grow justify-center before:!bg-zinc-200">
                                <EllipsisVertical className="size-5" />
                            </MenubarTrigger>
                            <MenubarContent className="w-52" align="end">
                                <MenubarItem
                                    className="px-4 gap-5"
                                    onClick={() => onClick && onClick("view", user)}
                                >
                                    <Eye className="size-5" strokeWidth={1.8} />
                                    <div>View details</div>
                                </MenubarItem>
                                <MenubarItem
                                    className="px-4 gap-5"
                                    onClick={() =>
                                        onClick && onClick("messages", user.id)
                                    }
                                >
                                    <MessageCircle
                                        className="size-5"
                                        strokeWidth={1.8}
                                    />
                                    <div>Message</div>
                                </MenubarItem>
                                {auth === "HR" && (
                                    <Fragment>
                                        <MenubarItem
                                            className="px-4 gap-5"
                                            onClick={() =>
                                                onClick && onClick("edit", user.id)
                                            }
                                        >
                                            <PenLine
                                                className="size-5"
                                                strokeWidth={1.8}
                                            />
                                            <div>Edit</div>
                                        </MenubarItem>
                                        <MenubarItem
                                            className="px-4 gap-5"
                                            onClick={() =>
                                                onClick && onClick("upload_pds", user.id)
                                            }
                                        >
                                            <Upload
                                                className="size-5"
                                                strokeWidth={1.8}
                                            />
                                            <div>Upload PDS</div>
                                        </MenubarItem>
                                    </Fragment>
                                )}
                                <MenubarSeparator />
                                <MenubarItem
                                    className="px-4 gap-5 !text-destructive hover:!bg-destructive/10"
                                    onClick={() => onClick && onClick("delete", user.id)}
                                >
                                    <Trash2
                                        className="size-5"
                                        strokeWidth={1.8}
                                    />
                                    <div>Delete</div>
                                </MenubarItem>
                            </MenubarContent>
                        </MenubarMenu>
                    </Menubar>
                </div>
            </div>
        </div>
    );
};
