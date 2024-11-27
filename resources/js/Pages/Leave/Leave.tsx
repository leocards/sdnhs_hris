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
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { cn } from "@/lib/utils";
import { PageProps, PaginateData, ROLES } from "@/types";
import { Head, router, usePage } from "@inertiajs/react";
import { format } from "date-fns";
import { EllipsisVertical, Eye, Search, Trash2, Upload, X } from "lucide-react";
import { ChangeEvent, Fragment, useEffect, useRef, useState } from "react";
import UploadMedical from "./UploadMedical";
import ViewMedical, { MedicalType } from "./ViewMedical";
import useDebounce from "@/hooks/useDebounce";
import PageListProvider, { usePageList } from "@/hooks/pageListProvider";
import PaginationButton from "@/Components/PaginationButton";
import DataList from "@/Components/DataList";
import { useMessage } from "@/hooks/MessageProvider";
import Tabs from "@/Components/framer/Tabs";

export default function Index(props: PageProps & {
    pageData: PaginateData;
    status: string;
    isMyLeave: number;
}) {
    return (
        <PageListProvider initialValue={props.pageData}>
            <Head title="Leave" />

            <Leave {...props} />
        </PageListProvider>
    );
}

function Leave({
    auth,
    status,
    pageData,
    isMyLeave,
}: PageProps & {
    pageData: PaginateData;
    status: string;
    isMyLeave: number;
}) {
    const [search, setSearch] = useState<string>("");
    const [sort, setSort] = useState<{ sort: string; order: string }>({
        sort: "Date created",
        order: "DESC",
    });
    const [showMedicalUpload, setShowMedicalUpload] = useState<boolean>(false);
    const [viewMedical, setViewMedical] = useState<boolean>(false);
    const [selected, setSelected] = useState<{
        leave_id?: number | null;
        medical: MedicalType | null;
        user: { id: number | null; first_name: string; last_name: string };
    }>({
        leave_id: null,
        medical: null,
        user: { id: null, first_name: "", last_name: "" },
    });
    const { setList, data, clearList } = usePageList();
    const debounceSearch = useDebounce<string>(search, search ? 700 : 0);
    const [loading, setLoading] = useState(false);
    const { activeUsers } = useMessage()
    const searchRef = useRef<HTMLInputElement | null>(null);

    const onSearch = (event: ChangeEvent<HTMLInputElement>) => {
        const input = event.target.value.replace(/\s+/g, " ");

        setSearch(input);
        if (!input) {
            setLoading(false);
        } else {
            setLoading(true);
        }
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

    const getPageData = (page?: number) => {
        setLoading(true);
        window.axios
            .get(
                route("leave.json", {
                    _query: {
                        filter: status,
                        sort: sort,
                        search: debounceSearch.trim(),
                        page: page,
                        isMyLeave: isMyLeave
                    },
                })
            )
            .then((response) => {
                let data = response.data;
                setList(data);
                setLoading(false);
            });
    };

    useEffect(() => {
        if (sort.sort != "Date created" ||
            sort.order !== "DESC" ||
            debounceSearch.trim() !== ""
        ) {
            getPageData(1);
        } else {
            setList(pageData);
        }

        return () => {
            clearList();
        };
    }, [sort, debounceSearch]);

    useEffect(() => {
        let onFinishListener = router.on("finish", () => {
            setLoading(false);
        });

        return () => {
            onFinishListener();
        };
    }, [loading]);

    return (
        <Authenticated
            userAuth={auth.user}
            header={
                <h2 className="font-semibold text-xl leading-tight">Leave</h2>
            }
        >
            <div className="divide-x flex items-center mt-5 text-sm border-b-2">
                <Tabs
                    id="personnel-tab"
                    active={status}
                    navigate={(nav) => {
                        let role = auth.user.role

                        if(role == "HR") {
                            router.get(route('myapprovals.leave', {
                                _query: { status: nav }
                            }))
                        } else if(role == "HOD") {
                            if(isMyLeave){
                                router.get(route('leave', {
                                    _query: { status: nav, myleave: isMyLeave }
                                }))
                            } else {
                                router.get(route('myapprovals.leave', {
                                    _query: { status: nav }
                                }))
                            }
                        } else {
                            router.get(route('leave', {
                                _query: { status: nav }
                            }))
                        }
                        setLoading(true)
                    }}
                    tabs={[
                        { id: "pending", label: "Pending" },
                        { id: "approved", label: "Approved" },
                        { id: "rejected", label: "Rejected" },
                    ]}
                />
                {auth.user.role !== "HR" && (
                    <Fragment>
                        {((auth.user.role == "HOD" && isMyLeave) || !(auth.user.role == "HOD")) && (
                            <div className="flex items-center ml-auto">
                                <Button
                                    className="ml-auto"
                                    onClick={() => {
                                        if(auth.user.role == "HOD" && isMyLeave) {
                                            router.get(route("leave.apply", {_query: { myleave: true }}))
                                        } else {
                                            router.get(route("leave.apply"))
                                        }
                                    }}
                                >
                                    Apply for leave
                                </Button>
                            </div>
                        )}
                    </Fragment>
                )}
            </div>

            <div
                className={cn(
                    "w-full flex items-center mb-7",
                    "mt-7"
                )}
            >
                <div className="">
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
                            { sort: "Date created" },
                        ].filter(({ sort }) => {
                            if (sort == "Name") {
                                if (
                                    ["HOD", "Principal", "HR"].includes(
                                        auth.user.role
                                    )
                                ) {
                                    return sort;
                                }

                                return;
                            }
                            return sort;
                        })}
                    />
                </div>

                <div className="ml-auto relative max-w-96 w-full">
                    <Input
                        className="w-full px-10"
                        value={search}
                        placeholder="Search name"
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
                <div className={cn(
                    "grid",
                    (auth.user.role == "HR" || (auth.user.role == "HOD" && !isMyLeave)) ? "grid-cols-[repeat(5,1fr),3rem]" : "grid-cols-[repeat(4,1fr),3rem]",
                    "py-2 [&>div:first-child]:pl-1 [&>div]:font-medium opacity-60"
                )}>
                    {(auth.user.role == "HR" || (auth.user.role == "HOD" && !isMyLeave)) && <div className="">Name</div>}
                    <div className="">Type</div>
                    <div className="">Date</div>
                    <div className="">Principal status</div>
                    <div className="">HR status</div>
                    <div className=""></div>
                </div>

                <DataList
                    empty={data.length === 0}
                    emptyResults={debounceSearch}
                    loading={loading}
                >
                    {data?.map((leave, index) => (
                        <LeaveRow
                            key={index}
                            myleave={!!(isMyLeave)}
                            leave={leave}
                            role={auth.user.role}
                            onMenuAction={onMenuAction}
                            active={!!(activeUsers.find(({ id }) => id === leave.user.id))}
                        />
                    ))}
                </DataList>

                <PaginationButton
                    onPage={getPageData}
                    onNext={getPageData}
                    onPrevious={getPageData}
                />
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
    role: ROLES
    myleave: boolean
    leave: {
        id: number;
        leave_type: string;
        date_of_filing_from: Date;
        date_of_filing_to: Date;
        principal_status: "Approved" | "Rejected" | "Pending";
        hr_status: "Approved" | "Rejected" | "Pending";
        user: {
            id: number;
            first_name: string;
            last_name: string;
            avatar?: string;
        };
        medical_certificate: {
            id: number;
            file_path: string;
            file_name: string;
        };
    };
    active: boolean;
    onMenuAction: (action: string, route?: any) => void;
}> = ({
    role,
    myleave,
    active,
    leave: {
        id,
        leave_type,
        date_of_filing_from,
        date_of_filing_to,
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
            <div className={cn(
                "grid",
                (role == "HR" || (role == "HOD" && !myleave)) ? "grid-cols-[repeat(5,1fr),3rem]" : "grid-cols-[repeat(4,1fr),3rem]",
                "[&>div]:py-3 [&>div]:flex [&>div]:items-center [&>div]:pr-3 [&>div:first-child]:pl-1 text-sm"
            )}>
                {(role == "HR" || (role == "HOD" && !myleave)) && (<div className="">
                    <div className="flex items-center gap-2">
                        <AvatarProfile src={user.avatar} className="size-8" active={active} />
                        <div className="line-clamp-1">
                            {user.first_name + " " + user.last_name}
                        </div>
                    </div>
                </div>)}
                <div className="">
                    <div className="line-clamp-1">{leave_type}</div>
                </div>
                <div className="">
                    <div className="line-clamp-1">
                        {format(date_of_filing_from, "PP")}
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
                                    onClick={() => {
                                        if(role == "HR") {
                                            onMenuAction(
                                                "View",
                                                route("myapprovals.leave.view", [id, user.id])
                                            )
                                        } else if(role == 'HOD') {
                                            if(myleave) {
                                                onMenuAction(
                                                    "View",
                                                    route("leave.view", {
                                                        leave: id, user: user.id,
                                                        _query: {
                                                            myleave: true
                                                        }
                                                    })
                                                )
                                            } else {
                                                onMenuAction(
                                                    "View",
                                                    route("myapprovals.leave.view", [id, user.id])
                                                )
                                            }
                                        } else {
                                            onMenuAction(
                                                "View",
                                                route("leave.view", [id, user.id])
                                            )
                                        }
                                    }}
                                >
                                    <Eye className="size-5" strokeWidth={1.8} />
                                    <div>View</div>
                                </MenubarItem>
                                {leave_type === "Sick Leave" && (
                                    <>
                                        <MenubarItem
                                            className="px-4 gap-5"
                                            onClick={() => {
                                                if (medical_certificate)
                                                    onMenuAction(
                                                        "View medical",
                                                        {
                                                            medical:
                                                                medical_certificate.file_path,
                                                            user: user,
                                                        }
                                                    );
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
                                {auth.user.id === user.id && (
                                    <MenubarItem
                                        className="px-4 gap-5 !text-destructive hover:!bg-destructive/10"
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
                                )}
                            </MenubarContent>
                        </MenubarMenu>
                    </Menubar>
                </div>
            </div>
        </div>
    );
};
