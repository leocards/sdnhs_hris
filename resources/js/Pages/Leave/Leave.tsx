import Filter from "@/Components/buttons/FilterButton";
import Sort from "@/Components/buttons/SortButton";
import LeaveStatus from "@/Components/LeaveStatus";
import { AvatarProfile } from "@/Components/ui/avatar";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import {
    Menubar,
    MenubarMenu,
    MenubarTrigger,
    MenubarContent,
    MenubarItem,
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
import { PageProps, PaginateData, User } from "@/types";
import { router, usePage } from "@inertiajs/react";
import { format } from "date-fns";
import { EllipsisVertical, Eye, Search, Trash2, Upload, X } from "lucide-react";
import { ChangeEvent, useRef, useState } from "react";
import UploadMedical from "./UploadMedical";
import ViewMedical from "./ViewMedical";

export default function Leave({
    auth,
    leaves,
}: PageProps & {
    leaves: PaginateData;
}) {
    const [search, setSearch] = useState<string>("");
    const [filter, setFilter] = useState<string>("All");
    const [sort, setSort] = useState<{ sort: string; order: string }>({
        sort: "Name",
        order: "ASC",
    });
    const [showMedicalUpload, setShowMedicalUpload] = useState<boolean>(false);
    const [viewMedical, setViewMedical] = useState<boolean>(false);
    const [selected, setSelected] = useState<{
        leave_id?: number | null;
        medical: string;
        user: { id: number | null; first_name: string; last_name: string };
    }>({
        leave_id: null,
        medical: "",
        user: { id: null, first_name: "", last_name: "" },
    });

    const searchRef = useRef<HTMLInputElement | null>(null);

    const onSearch = (event: ChangeEvent<HTMLInputElement>) => {
        const input = event.target.value.replace(/\s+/g, " ");

        setSearch(input);
    };

    const clearSearch = () => {
        searchRef.current && searchRef.current.focus();
        setSearch("");
    };

    const onMenuAction = (action: string, route?: any) => {
        if (action === "View") {
            router.get(route);
        } else if (action === "Medical") {
            setSelected({
                ...selected,
                leave_id: route.leave_id,
                user: route.user,
            });
            setShowMedicalUpload(true);
        } else if (action === "View medical") {
            setViewMedical(true);
            setSelected({ medical: route.medical, user: route.user });
        } else if (action === "Delete") {
        }
    };

    return (
        <Authenticated
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Leave
                </h2>
            }
        >
            {auth.user.role !== "HOD" && (
                <div className="mt-10 mb-7 flex items-center">
                    <Button
                        className="ml-auto"
                        onClick={() => router.get(route("leave.apply"))}
                    >
                        Apply for leave
                    </Button>
                </div>
            )}

            <div
                className={cn(
                    "w-full flex items-center mb-7",
                    auth.user.role === "HOD" && "mt-10"
                )}
            >
                <div>
                    <Filter
                        size="lg"
                        filter="All"
                        position="BOTTOMLEFT"
                        active={filter}
                        items={[
                            { filter: "All", onClick: setFilter },
                            { filter: "Pending", onClick: setFilter },
                            { filter: "Approved", onClick: setFilter },
                        ]}
                        onClear={() => setFilter("All")}
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
                            { sort: "Leave type" },
                            { sort: "Date" },
                        ]}
                    />
                </div>

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

            <div className="divide-y min-h-[22rem]">
                <div className="grid grid-cols-[repeat(5,1fr),3rem] py-2 [&>div:first-child]:pl-1 [&>div]:font-medium opacity-60">
                    <div className="">Name</div>
                    <div className="">Type</div>
                    <div className="">Date</div>
                    <div className="">Principal status</div>
                    <div className="">HR status</div>
                    <div className=""></div>
                </div>

                {leaves.data.length === 0 && (
                    <div className="text-center py-5 text-foreground/60">
                        No record.
                    </div>
                )}

                {leaves.data.map((leave, index) => (
                    <LeaveRow
                        key={index}
                        leave={leave}
                        onMenuAction={onMenuAction}
                    />
                ))}

                {1 >= 50 && (
                    <Pagination className="!mt-auto pt-2">
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious
                                    href="#"
                                    className={cn(
                                        "opacity-60 pointer-events-none"
                                    )}
                                />
                            </PaginationItem>
                            {Array.from({
                                length: 3,
                            }).map((_, index) => (
                                <PaginationItem key={index}>
                                    <PaginationLink
                                        href="#"
                                        isActive={1 === ++index}
                                    >
                                        <span>{index}</span>
                                    </PaginationLink>
                                </PaginationItem>
                            ))}
                            {0 > 3 && (
                                <PaginationItem>
                                    <PaginationEllipsis />
                                </PaginationItem>
                            )}
                            <PaginationItem>
                                <PaginationNext
                                    href="#"
                                    className={cn(
                                        "opacity-60 pointer-events-none"
                                    )}
                                    onClick={() => {}}
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                )}
            </div>

            <UploadMedical
                data={selected}
                show={showMedicalUpload}
                onClose={setShowMedicalUpload}
            />
            <ViewMedical
                data={selected}
                show={viewMedical}
                onClose={setViewMedical}
            />
        </Authenticated>
    );
}

const LeaveRow: React.FC<{
    leave: {
        id: number;
        leave_type: string;
        date_of_filing: Date;
        principal_status: "Approved" | "Rejected" | "Pending";
        hr_status: "Approved" | "Rejected" | "Pending";
        user: {
            id: number;
            first_name: string;
            last_name: string;
            profile?: string;
        };
        medical_certificate: {
            id: number;
            file_path: string;
            file_name: string;
        };
    };
    onMenuAction: (action: string, route?: any) => void;
}> = ({
    leave: {
        id,
        leave_type,
        date_of_filing,
        principal_status,
        hr_status,
        user,
        medical_certificate,
    },
    onMenuAction,
}) => {
    const {
        props: { auth },
    } = usePage<PageProps>();

    return (
        <div className="hover:bg-secondary transition-colors">
            <div className="grid grid-cols-[repeat(5,1fr),3rem] [&>div]:py-3 [&>div]:flex [&>div]:items-center [&>div]:pr-3 [&>div:first-child]:pl-1 text-sm font-mediu">
                <div className="">
                    <div className="flex items-center gap-2">
                        <AvatarProfile className="size-8" />
                        <div className="line-clamp-1">
                            {user.first_name + " " + user.last_name}
                        </div>
                    </div>
                </div>
                <div className="">
                    <div className="line-clamp-1">{leave_type}</div>
                </div>
                <div className="">
                    <div className="line-clamp-1">
                        {format(date_of_filing, "PP")}
                    </div>
                </div>
                <div className="">
                    <div className="line-clamp-1">
                        <LeaveStatus status={principal_status} />
                    </div>
                </div>
                <div className="">
                    <div className="line-clamp-1">
                        <LeaveStatus status={hr_status} />
                    </div>
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
                                    onClick={() =>
                                        onMenuAction(
                                            "View",
                                            route("leave.view", [id, user.id])
                                        )
                                    }
                                >
                                    <Eye className="size-5" strokeWidth={1.8} />
                                    <div>View</div>
                                </MenubarItem>
                                {leave_type === "Sick Leave" && (
                                    <>
                                        <MenubarItem
                                            className="px-4 gap-5"
                                            onClick={() =>{
                                                if(medical_certificate)
                                                    onMenuAction("View medical", {
                                                        medical:
                                                            medical_certificate.file_path,
                                                        user: user,
                                                    })

                                            }}
                                            disabled={!medical_certificate}
                                        >
                                            <Eye
                                                className="size-5"
                                                strokeWidth={1.8}
                                            />
                                            <div>View medical</div>
                                        </MenubarItem>
                                        {auth.user.id === user.id && (
                                            <MenubarItem
                                                className="px-4 gap-5"
                                                onClick={() =>
                                                    onMenuAction("Medical", {
                                                        leave_id: id,
                                                        user: user,
                                                    })
                                                }
                                            >
                                                <Upload
                                                    className="size-5"
                                                    strokeWidth={1.8}
                                                />
                                                <div>Upload medical</div>
                                            </MenubarItem>
                                        )}
                                    </>
                                )}
                                <MenubarItem
                                    className="px-4 gap-5"
                                    onClick={() =>
                                        onMenuAction("Delete", {
                                            leave_id: id,
                                            user_id: user.id,
                                        })
                                    }
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
