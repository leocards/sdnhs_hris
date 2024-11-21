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
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { PaginateData, PageProps } from "@/types";
import { Head, router } from "@inertiajs/react";
import {
    EllipsisVertical,
    Eye,
    MessageCircle,
    PenLine,
    ReceiptText,
    Upload,
    UserRoundPlus,
    FolderKanban,
} from "lucide-react";
import { Fragment, useEffect, useState } from "react";
import { PersonnelListProps } from "./types";
import UploadPDS from "./UploadPDS";
import ViewPDS from "./ViewPds";
import PersonnelDetails from "./PersonnelDetails";
import PaginationButton from "@/Components/PaginationButton";
import PageListProvider, { usePageList } from "@/hooks/pageListProvider";
import DataList from "@/Components/DataList";
import DeletePersonnelModel from "./DeletePersonnelModel";
import { useMessage } from "@/hooks/MessageProvider";
import ViewSalnPersonnel from "./ViewSalnPersonnel";
import ConfirmServiceCertificate from "./ConfirmServiceCertificate";

interface PersonnelProps extends PageProps {
    pageData: PaginateData;
    statistics: {
        jhs: number;
        shs: number;
        accounting: number;
        admin: number;
    };
    pds_uploads: Array<number>;
}

export default function Index(props: PersonnelProps) {
    return (
        <PageListProvider initialValue={props.pageData}>
            <Head title="Personnel" />

            <Personnel {...props} />
        </PageListProvider>
    );
}

function Personnel({
    auth,
    pageData,
    statistics,
    pds_uploads,
}: PersonnelProps) {
    const [filter, setFilter] = useState<string>("");
    const [sort, setSort] = useState<{ sort: string; order: string }>({
        sort: "Name",
        order: "ASC",
    });
    const [showUploadPDS, setShowUploadPDS] = useState<boolean>(false);
    const [showPDS, setShowPDS] = useState<boolean>(false);
    const [showPersonnelDetails, setShowPersonnelDetails] =
        useState<boolean>(false);
    const [showDeletePersonnel, setShowDeletePersonnel] =
        useState<boolean>(false);
    const [selectedPersonnel, setSelectedPersonnel] = useState<any>(null);
    const { data, setList, clearList, setLoading, loading } =
        usePageList();
    const { activeUsers } = useMessage();
    const [viewSaln, setViewSaln] = useState(false)
    const [showCertificates, setShowCertificates] = useState(false)

    const navigateTo = (nav: string) => {
        router.get(route(nav));
    };

    // retrieves the personnel data in paginated format
    const getPageData = (page?: number) => {
        setLoading(true);
        window.axios
            .get(
                route("personnel.json", {
                    _query: {
                        filter: filter,
                        sort: sort,
                        page: page,
                    },
                })
            )
            .then((response) => {
                const data = response.data;
                setList(data);
                setLoading(false);
            });
    };

    // selects which to open
    const onClickMenu = (action: string, id: any) => {
        if (action === "upload_pds") {
            // opens the modal to upload PDS excel file
            setSelectedPersonnel(id);
            setShowUploadPDS(true);
        } else if (action === "edit") {
            // navigate to the edit of personnel
            // (go to routes/web.php and find the route name "personnel.edit")
            //  for the php code
            router.get(route("personnel.edit", [id]));
        } else if (action === "view") {
            // opens the modal for viewing the personnel details
            setSelectedPersonnel(id);
            setShowPersonnelDetails(true);
        } else if (action === "messages") {
            // navigate to messages page, and opens the a conversation with the user of the given "id"
            router.get(route("messages") + `?user=${id}`);
        } else if(action === "saln") {
            // open the modal for viewing SALN
            setViewSaln(true)
            setSelectedPersonnel(id)
        } else if(action === "certificate") {
            setSelectedPersonnel(id)
            setShowCertificates(true)
        }
    };

    const tabs = {
        HR: ["personnel", "personnel.tardiness"],
        HOD: ["personnel"],
        "Non-teaching": [""],
        "Teaching": [""],
    }[auth.user.role];

    useEffect(() => {
        if (filter != "" || sort.sort != "Name" || sort.order != "ASC") {
            getPageData(1);
        } else {
            setList(pageData);
        }

        return () => {
            clearList();
        };
    }, [filter, sort, pageData]);

    return (
        <Authenticated
            userAuth={auth.user}
            header={
                <h2 className="font-semibold text-xl leading-tight">
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

            <div className="my-7 grid gap-3 [@media(min-width:428px)]:gap-5 [@media(min-width:428px)]:grid-cols-2 [@media(min-width:1280px)]:!grid-cols-4">
                <div className="border-t md:pt-4 pt-2 md:space-y-1.5 space-y-1 border-rose-600 bg-rose-100 dark:bg-rose-800/50 p-2">
                    <div className="font-medium text-rose-700 dark:text-rose-400">Junior HS personnel</div>
                    <div className="md:text-xl text-lg font-semibold text-rose-700 dark:text-rose-400">
                        {statistics.jhs} Personnel
                    </div>
                </div>
                <div className="border-t md:pt-4 pt-2 md:space-y-1.5 space-y-1 border-teal-600 bg-teal-100 dark:bg-teal-800/50 p-2">
                    <div className="font-medium text-teal-700 dark:text-teal-400">Senior HS personnel</div>
                    <div className="md:text-xl text-lg font-semibold text-teal-700 dark:text-teal-400">
                        {statistics.shs} Personnel
                    </div>
                </div>
                <div className="border-t md:pt-4 pt-2 md:space-y-1.5 space-y-1 border-indigo-600 bg-indigo-100 dark:bg-indigo-800/50 p-2">
                    <div className="font-medium text-indigo-700 dark:text-indigo-400">Accounting personnel</div>
                    <div className="md:text-xl text-lg font-semibold text-indigo-700 dark:text-indigo-400">
                        {statistics.accounting} Personnel
                    </div>
                </div>
                <div className="border-t md:pt-4 pt-2 md:space-y-1.5 space-y-1 border-purple-600 bg-purple-100 dark:bg-purple-800/50 p-2">
                    <div className="font-medium text-purple-700 dark:text-purple-400">Administrator</div>
                    <div className="md:text-xl text-lg font-semibold text-purple-700 dark:text-purple-400">
                        {statistics.admin} Administrator/s
                    </div>
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
                            {
                                filter: "Junior High School",
                                onClick: setFilter,
                            },
                            {
                                filter: "Senior High School",
                                onClick: setFilter,
                            },
                            { filter: "Accounting", onClick: setFilter },
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
                        <span className="sm:block hidden">New personnel</span>
                    </Button>
                )}
            </div>

            <div className="divide-y min-h-[22rem]">
                <div className="grid grid-cols-[1fr,1fr,3rem] [@media(min-width:642px)]:grid-cols-[repeat(4,minmax(6rem,1fr)),8rem,3rem] py-2 [&>div:first-child]:pl-1 [&>div]:font-medium opacity-60">
                    <div className="">Name</div>
                    <div className="[@media(max-width:642px)]:hidden">
                        Email
                    </div>
                    <div className="[@media(max-width:642px)]:hidden">
                        Department
                    </div>
                    <div className="[@media(max-width:642px)]:hidden">
                        Position
                    </div>
                    <div className="">Leave Credits</div>
                    <div className=""></div>
                </div>

                <DataList empty={data.length === 0} loading={loading}>
                    {data.map((data, index) => (
                        <PersonnelRow
                            key={index}
                            user={data}
                            active={
                                !!activeUsers.find((au) => au.id === data.id)
                            }
                            onClick={onClickMenu}
                            auth={auth.user.role}
                            hasPds={pds_uploads.includes(data.id)}
                        />
                    ))}
                </DataList>

                <PaginationButton
                    onPage={getPageData}
                    onNext={getPageData}
                    onPrevious={getPageData}
                />
            </div>

            <UploadPDS
                show={showUploadPDS}
                onClose={setShowUploadPDS}
                user={selectedPersonnel}
            />
            <ViewPDS
                show={showPDS}
                onClose={setShowPDS}
                authId={selectedPersonnel?.id}
            />
            <PersonnelDetails
                user={selectedPersonnel}
                show={showPersonnelDetails}
                onClose={setShowPersonnelDetails}
                onViewPDS={setShowPDS}
            />
            <DeletePersonnelModel
                user={selectedPersonnel}
                show={showDeletePersonnel}
                onClose={setShowDeletePersonnel}
            />

            <ViewSalnPersonnel
                show={viewSaln}
                onClose={setViewSaln}
                id={selectedPersonnel?.id}
                salnList={selectedPersonnel?.statement_of_assest_liabilities}
                user={auth.user}
            />

            <ConfirmServiceCertificate show={showCertificates} onClose={setShowCertificates} user={selectedPersonnel} />
        </Authenticated>
    );
}

const PersonnelRow: React.FC<
    PersonnelListProps & { auth: string; active: boolean; hasPds?: boolean }
> = ({ user, auth, active, onClick, hasPds }) => {
    return (
        <div className="hover:bg-secondary transition-colors">
            <div className="grid grid-cols-[1fr,1fr,3rem] [@media(min-width:642px)]:grid-cols-[repeat(4,minmax(6rem,1fr)),8rem,3rem] [&>div]:py-3 [&>div]:flex [&>div]:items-center [&>div]:pr-3 [&>div:first-child]:pl-1">
                <div className="">
                    <div className="flex items-center gap-2">
                        <AvatarProfile
                            src={user.avatar}
                            className="size-8"
                            active={active}
                        />
                        <div className="line-clamp-1 break-words">
                            {user.last_name + ", " + user.first_name}
                        </div>
                    </div>
                </div>
                <div className="[@media(max-width:642px)]:!hidden">
                    <div className="line-clamp-1 break-words">{user.email}</div>
                </div>
                <div className="shrink-0 [@media(max-width:642px)]:!hidden">
                    <div className="line-clamp-1 break-words">
                        {(user.role != "HOD" && user.role != "HR") ? user.department : "-"}
                    </div>
                </div>
                <div className="[@media(max-width:642px)]:!hidden">
                    <div className="line-clamp-1">{user.role != "HR" ? user.position : user.role}</div>
                </div>
                <div className="">
                    <div className="line-clamp-1">
                        {(user.role != "HOD" && user.role != "HR") ? user.leave_credits : "-"}
                    </div>
                </div>
                <div className="">
                    <Menubar className="p-0 border-none group size-8 bg-transparent">
                        <MenubarMenu>
                            <MenubarTrigger className="h-full cursor-pointer p-0 flex grow justify-center before:!bg-zinc-200">
                                <EllipsisVertical className="size-5" />
                            </MenubarTrigger>
                            <MenubarContent className="w-64" align="end">
                                <MenubarItem
                                    className="px-4 gap-5"
                                    onClick={() =>
                                        onClick && onClick("view", user)
                                    }
                                >
                                    <Eye className="size-5" strokeWidth={1.8} />
                                    <div>View details</div>
                                </MenubarItem>
                                {auth === "HR" && (<MenubarItem
                                    className="px-4 gap-5"
                                    onClick={() =>
                                        onClick && onClick("saln", user)
                                    }
                                >
                                    <ReceiptText
                                        className="size-5"
                                        strokeWidth={1.8}
                                    />
                                    <div>SALN</div>
                                </MenubarItem>)}
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
                                                onClick &&
                                                onClick("certificate", user)
                                            }
                                        >
                                            <FolderKanban
                                                className="size-5"
                                                strokeWidth={1.8}
                                            />
                                            <div>Service certificate</div>
                                        </MenubarItem>
                                        <MenubarItem
                                            className="px-4 gap-5"
                                            onClick={() =>
                                                onClick &&
                                                onClick("edit", user.id)
                                            }
                                        >
                                            <PenLine
                                                className="size-5"
                                                strokeWidth={1.8}
                                            />
                                            <div>Edit</div>
                                        </MenubarItem>
                                        <MenubarSeparator />
                                        <MenubarItem
                                            className="px-4 gap-5"
                                            onClick={() =>
                                                !hasPds &&
                                                onClick &&
                                                onClick("upload_pds", user)
                                            }
                                            disabled={hasPds}
                                        >
                                            <Upload
                                                className="size-5"
                                                strokeWidth={1.8}
                                            />
                                            <div>Upload PDS</div>
                                        </MenubarItem>
                                    </Fragment>
                                )}
                            </MenubarContent>
                        </MenubarMenu>
                    </Menubar>
                </div>
            </div>
        </div>
    );
};
