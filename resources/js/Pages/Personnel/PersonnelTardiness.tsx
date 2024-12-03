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
import { PageProps, PaginateData, SYTYPE } from "@/types";
import { router } from "@inertiajs/react";
import {
    ChevronRight,
    ClipboardCheck,
    EllipsisVertical,
    PenLine,
} from "lucide-react";
import { useEffect, useState } from "react";
import { format, getYear } from "date-fns";
import PageListProvider, { usePageList } from "@/hooks/pageListProvider";
import PaginationButton from "@/Components/PaginationButton";
import DataList from "@/Components/DataList";
import AddPersonnelTardiness from "./AddPersonnelTardiness";
import { useMessage } from "@/hooks/MessageProvider";

interface PersonnelTardinessProps extends PageProps {
    attendance: PaginateData;
    personnels: Array<any>;
    sy: SYTYPE
    syList: Array<SYTYPE>
}

export type Personnel = {
    id: number;
    name: string;
    present: string;
    absent: string;
    created_at: string;
    avatar: string;
    users: {
        id: number;
        first_name: string;
        last_name: string;
        middle_name: string;
        avatar: string;
    };
    sy: string;
};

export default function Index(props: PersonnelTardinessProps) {
    return (
        <PageListProvider initialValue={props.attendance}>
            <PersonnelTardiness
                {...props}
            />
        </PageListProvider>
    );
}

function PersonnelTardiness({
    auth,
    attendance,
    personnels,
    sy,
    syList
}: PersonnelTardinessProps) {
    const [showAddAttendance, setShowAddAttendance] = useState<boolean>(false);
    const [selectedPersonnel, setSelectedPersonnel] = useState<Personnel>();
    const { setList, data, loading, setLoading } = usePageList();
    const { activeUsers } = useMessage()
    const [filter, setFilter] = useState<string>(sy?.sy||"");

    const onEditPersonnel = (personnel: Personnel) => {
        setSelectedPersonnel(personnel);
        setShowAddAttendance(true);
    };

    const getPageData = (page?: number) => {
        setLoading(true);
        window.axios
            .get(
                route("personnel.tardiness.json", {
                    _query: {
                        filter: filter,
                        page: page,
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
        if (attendance) {
            if (filter != getYear(new Date()).toString()) {
                getPageData(1);
            } else {
                setList(attendance);
            }
        }
    }, [attendance, filter]);

    // unset the setSelected personnel on add or delete close
    useEffect(() => {
        if (!showAddAttendance) {
            setTimeout(() => setSelectedPersonnel(undefined), 300);
        }
    }, [showAddAttendance]);

    return (
        <Authenticated
            userAuth={auth.user}
            header={
                <h2 className="font-semibold text-xl leading-tight flex items-center gap-2">
                    Personnel <ChevronRight className="size-5" /> Tardiness
                </h2>
            }
        >
            <div className="w-full flex items-center mb-7 mt-12">
                <Filter
                    size="lg"
                    filter="Filter"
                    position="BOTTOMLEFT"
                    default="All"
                    active={filter}
                    items={[
                        ...syList.map((year) => ({
                            filter: year.sy,
                            onClick: setFilter,
                        })),
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

                <AddPersonnelTardiness
                    show={showAddAttendance}
                    onClose={setShowAddAttendance}
                    user={selectedPersonnel}
                    initialList={personnels}
                    exisiting={data}
                    sy={sy?.sy}
                    syList={syList}
                />
            </div>

            <div className="divide-y min-h-[22rem] flex flex-col ">
                <div className="grid grid-cols-[repeat(4,1fr),3rem] py-2 [&>div:first-child]:pl-1 [&>div]:font-medium opacity-60 capitalize">
                    <div className="">Name</div>
                    <div className="">Days present</div>
                    <div className="">Days absent</div>
                    <div className="">SY</div>
                    <div className="">Edit</div>
                </div>

                <DataList empty={data.length == 0} loading={loading}>
                    {data.map((personnel, index) => (
                        <PersonnelRow
                            key={index}
                            active={!!(activeUsers.find((au) => au.id === personnel.users.id))}
                            personnel={personnel}
                            onEdit={onEditPersonnel}
                        />
                    ))}
                </DataList>

                <PaginationButton
                    onPage={getPageData}
                    onNext={getPageData}
                    onPrevious={getPageData}
                />
            </div>
        </Authenticated>
    );
}

type PersonnelRowProps = {
    personnel: Personnel;
    active: boolean;
    onEdit: (personnel: Personnel) => void;
};

const PersonnelRow: React.FC<PersonnelRowProps> = ({
    personnel,
    active,
    onEdit,
}) => {
    return (
        <div className="hover:bg-secondary transition-colors">
            <div className="grid grid-cols-[repeat(4,1fr),3rem] [&>div]:py-3 [&>div]:flex [&>div]:items-center [&>div]:pr-3 [&>div:first-child]:pl-1">
                <div className="">
                    <div className="flex items-center gap-2">
                        <div className="relative">
                            <AvatarProfile
                                src={personnel.users?.avatar}
                                className="size-8"
                            />
                            {active && (
                                <span className="absolute bottom-0 right-px size-2 bg-green-500 z-10 rounded-full ring ring-white" />
                            )}
                        </div>
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
                        {personnel.sy}
                    </div>
                </div>
                <div className="">
                    <Button className="size-8 before:hover:bg-gray-300/60" variant={"ghost"} size={"icon"} onClick={() => onEdit(personnel)}>
                        <PenLine className="size-5" strokeWidth={1.8} />
                    </Button>
                </div>
            </div>
        </div>
    );
};
