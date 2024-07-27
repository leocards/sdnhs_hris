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
import { PageProps, PaginateData } from "@/types";
import { router, usePage } from "@inertiajs/react";
import {
    ChevronRight,
    ClipboardCheck,
    EllipsisVertical,
    MessageCircle,
    PenLine,
    Trash2,
    UserRoundPlus,
} from "lucide-react";
import { useEffect, useState } from "react";
import TeacherAttendance from "./TeacherAttendance";
import { format } from "date-fns";

interface StaffTardinessProps extends PageProps {
    attendance: PaginateData;
}

export type Staff = {
    id: number;
    name: string;
    present: string;
    absent: string;
    updated_at: string;
};

export default function StaffTardiness({
    auth,
    attendance,
}: StaffTardinessProps) {
    const [showAddAttendance, setShowAddAttendance] = useState<boolean>(false);
    const [staffAttendance, setStaffAttendance] =
        useState<PaginateData>(attendance);
    const [selectedStaff, setSelectedStaff] = useState<Staff>();

    const [filter, setFilter] = useState<string>("");
    const [sort, setSort] = useState<{ sort: string; order: string }>({
        sort: "Name",
        order: "ASC",
    });

    const navigateTo = (nav: string) => {
        router.get(route(nav));
    };

    const onEditStaff = (staff: Staff) => {
        setSelectedStaff(staff)
        setShowAddAttendance(true)
    }

    useEffect(() => {
        const succ = router.on("success", (event) => {
            setStaffAttendance(
                event.detail.page.props.attendance as PaginateData
            );
        });

        return () => succ();
    }, []);

    useEffect(() => {
        if(!showAddAttendance) {
            setTimeout(() => setSelectedStaff(undefined), 300)
        }
    }, [showAddAttendance])

    return (
        <Authenticated
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight flex items-center gap-2">
                    Staff <ChevronRight className="size-5" /> Tardiness
                </h2>
            }
        >
            <div className="divide-x flex mt-5 text-sm border-b-2 mb-7">
                <Tabs
                    id="staff-tab"
                    active="staff.tardiness"
                    navigate={navigateTo}
                    tabs={[
                        { id: "staff", label: "Staff" },
                        { id: "staff.tardiness", label: "Tardiness" },
                    ]}
                />
            </div>

            <div className="w-full flex items-center mb-7">
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
                    user={selectedStaff}
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
                {staffAttendance.data.length === 0 && (
                    <div className="text-center py-4 opacity-65">
                        No records
                    </div>
                )}
                <div className="text-center py-4 opacity-65 hidden">
                    No results found for "lorem ipsum"
                </div>

                {staffAttendance.data.map((staff, index) => (
                    <StaffRow key={index} staff={staff} onEdit={onEditStaff} onDelete={setSelectedStaff} />
                ))}

                {attendance.data.length > 50 && (
                    <Pagination className="!mt-auto pt-2">
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious href="#" />
                            </PaginationItem>
                            <PaginationItem>
                                <PaginationLink href="#">
                                    <span>1</span>
                                </PaginationLink>
                            </PaginationItem>
                            <PaginationItem>
                                <PaginationLink href="#" isActive>
                                    <span>2</span>
                                </PaginationLink>
                            </PaginationItem>
                            <PaginationItem>
                                <PaginationLink href="#">
                                    <span>3</span>
                                </PaginationLink>
                            </PaginationItem>
                            <PaginationItem>
                                <PaginationEllipsis />
                            </PaginationItem>
                            <PaginationItem>
                                <PaginationNext href="#" />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                )}
            </div>
        </Authenticated>
    );
}

type StaffRowProps = { 
    staff: Staff;
    onEdit: (staff: Staff) => void;
    onDelete: (staff: Staff) => void;
};

const StaffRow: React.FC<StaffRowProps> = ({ staff, onEdit, onDelete }) => {
    return (
        <div className="hover:bg-secondary transition-colors">
            <div className="grid grid-cols-[repeat(4,1fr),3rem] [&>div]:py-3 [&>div]:flex [&>div]:items-center [&>div]:pr-3 [&>div:first-child]:pl-1">
                <div className="">
                    <div className="flex items-center gap-2">
                        <AvatarProfile className="size-8" />
                        <div className="line-clamp-1">{staff.name}</div>
                    </div>
                </div>
                <div className="">
                    <div className="line-clamp-1">{staff.present}</div>
                </div>
                <div className="">
                    <div className="line-clamp-1">{staff.absent}</div>
                </div>
                <div className="">
                    <div className="line-clamp-1">
                        {format(new Date(staff.updated_at), "PP")}
                    </div>
                </div>
                <div className="">
                    <Menubar className="p-0 border-none group size-8 bg-transparent">
                        <MenubarMenu>
                            <MenubarTrigger className="h-full cursor-pointer p-0 flex grow justify-center before:!bg-zinc-200">
                                <EllipsisVertical className="size-5" />
                            </MenubarTrigger>
                            <MenubarContent className="w-52" align="end">
                                <MenubarItem className="px-4 gap-5" onClick={() => onEdit(staff)}>
                                    <PenLine
                                        className="size-5"
                                        strokeWidth={1.8}
                                    />
                                    <div>Edit</div>
                                </MenubarItem>
                                <MenubarItem className="px-4 gap-5" onClick={() => onDelete(staff)}>
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
