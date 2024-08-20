import Filter from "@/Components/buttons/FilterButton";
import Tabs from "@/Components/framer/Tabs";
import { AvatarProfile } from "@/Components/ui/avatar";
import { Button } from "@/Components/ui/button";
import {
    Menubar,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarTrigger,
} from "@/Components/ui/menubar";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { PageProps, PaginateData } from "@/types";
import { router } from "@inertiajs/react";
import {
    ChevronRight,
    ClipboardCheck,
    EllipsisVertical,
    PenLine,
    Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";
import TeacherAttendance from "./TeacherAttendance";
import { format, getYear } from "date-fns";
import PageListProvider, { usePageList } from "@/hooks/pageListProvider";
import PaginationButton from "@/Components/PaginationButton";
import DataList from "@/Components/DataList";
import PersonnelTardinessConfirmDelete from "./PersonnelTardinessConfirmDelete";

interface PersonnelTardinessProps extends PageProps {
    attendance: PaginateData;
    personnels: Array<any>;
    years: Array<number>;
}

export type Personnel = {
    id: number;
    name: string;
    present: string;
    absent: string;
    created_at: string;
};

export default function Index({
    auth,
    attendance,
    personnels,
    years,
}: PersonnelTardinessProps) {

    return (
        <PageListProvider initialValue={attendance}>
            <PersonnelTardiness auth={auth} attendance={attendance} personnels={personnels} years={years} />
        </PageListProvider>
    )
}

function PersonnelTardiness({
    auth,
    attendance,
    personnels,
    years
}: PersonnelTardinessProps) {
    const [showAddAttendance, setShowAddAttendance] = useState<boolean>(false);
    const [showDeleteAttendance, setShowDeleteAttendance] = useState<boolean>(false);
    const [selectedPersonnel, setSelectedPersonnel] = useState<Personnel>();
    const { setList, data, pages, loading, setLoading } = usePageList()

    const [filter, setFilter] = useState<string>(getYear(new Date()).toString());

    const navigateTo = (nav: string) => {
        router.get(route(nav));
    };

    const onEditPersonnel = (personnel: Personnel) => {
        setSelectedPersonnel(personnel);
        setShowAddAttendance(true);
    };

    const onDeletePersonnel = (personnel: Personnel) => {
        setSelectedPersonnel(personnel);
        setShowDeleteAttendance(true);
    };

    const getPageData = (page?: number) => {
        setLoading(true)
        window.axios.get(route('personnel.tardiness.json', {
            _query: {
                year: filter,
                page: page
            }
        })).then((response) => {
            let data = response.data
            setList(data)
            setLoading(false)
        })
    }

    useEffect(() => {
        if(attendance) {
            if(filter != getYear(new Date()).toString()) {
                getPageData(1)
            } else {
                setList(attendance)
            }
        }
    }, [attendance, filter]);

    // unset the setSelected personnel on add or delete close
    useEffect(() => {
        if (!showAddAttendance && !showDeleteAttendance) {
            setTimeout(() => setSelectedPersonnel(undefined), 300);
        }
    }, [showAddAttendance, showDeleteAttendance]);

    return (
        <Authenticated
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl leading-tight flex items-center gap-2">
                    Personnel <ChevronRight className="size-5" /> Tardiness
                </h2>
            }
        >
            <div className="divide-x flex mt-5 text-sm border-b-2 mb-7">
                <Tabs
                    id="personnel-tab"
                    active="personnel.tardiness"
                    navigate={navigateTo}
                    tabs={[
                        { id: "personnel", label: "Personnel" },
                        { id: "personnel.tardiness", label: "Tardiness" },
                    ]}
                />
            </div>

            <div className="w-full flex items-center mb-7">
                <Filter
                    size="lg"
                    filter="Filter"
                    position="BOTTOMLEFT"
                    default="All"
                    active={filter}
                    items={[
                        { filter: "All", onClick: setFilter },
                        ...years.map((year) => ({ filter: year.toString(), onClick: setFilter }))
                    ]}
                    onClear={() => setFilter("All")}
                />

                <Button
                    className="ml-auto gap-3"
                    onClick={() => setShowAddAttendance(true)}
                >
                    <ClipboardCheck className="size-5" />
                    Attendance
                </Button>

                <TeacherAttendance
                    show={showAddAttendance}
                    onClose={setShowAddAttendance}
                    user={selectedPersonnel}
                    initialList={personnels}
                />
            </div>

            <div className="divide-y min-h-[22rem] flex flex-col ">
                <div className="grid grid-cols-[repeat(4,1fr),3rem] py-2 [&>div:first-child]:pl-1 [&>div]:font-medium opacity-60">
                    <div className="">Name</div>
                    <div className="">Days present</div>
                    <div className="">Days absent</div>
                    <div className="">Date modified</div>
                    <div className=""></div>
                </div>

                <DataList empty={data.length == 0} loading={loading}>
                    {data.map((personnel, index) => (
                        <PersonnelRow
                            key={index}
                            personnel={personnel}
                            onEdit={onEditPersonnel}
                            onDelete={onDeletePersonnel}
                        />
                    ))}
                </DataList>

                <PaginationButton onPage={getPageData} onNext={getPageData} onPrevious={getPageData} />
                <PersonnelTardinessConfirmDelete personnel={selectedPersonnel} show={showDeleteAttendance} onClose={setShowDeleteAttendance} />
            </div>
        </Authenticated>
    );
}

type PersonnelRowProps = {
    personnel: Personnel;
    onEdit: (personnel: Personnel) => void;
    onDelete: (personnel: Personnel) => void;
};

const PersonnelRow: React.FC<PersonnelRowProps> = ({ personnel, onEdit, onDelete }) => {
    return (
        <div className="hover:bg-secondary transition-colors">
            <div className="grid grid-cols-[repeat(4,1fr),3rem] [&>div]:py-3 [&>div]:flex [&>div]:items-center [&>div]:pr-3 [&>div:first-child]:pl-1">
                <div className="">
                    <div className="flex items-center gap-2">
                        <AvatarProfile className="size-8" />
                        <div className="line-clamp-1">{personnel.name}</div>
                    </div>
                </div>
                <div className="">
                    <div className="line-clamp-1">{personnel.present}</div>
                </div>
                <div className="">
                    <div className="line-clamp-1">{personnel.absent}</div>
                </div>
                <div className="">
                    <div className="line-clamp-1">
                        {format(new Date(personnel.created_at), "PP")}
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
                                    onClick={() => onEdit(personnel)}
                                >
                                    <PenLine
                                        className="size-5"
                                        strokeWidth={1.8}
                                    />
                                    <div>Edit</div>
                                </MenubarItem>
                                <MenubarItem
                                    className="px-4 gap-5"
                                    onClick={() => onDelete(personnel)}
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
