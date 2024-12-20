import Tabs from "@/Components/framer/Tabs";
import { AvatarProfile } from "@/Components/ui/avatar";
import { Button } from "@/Components/ui/button";
import { Label } from "@/Components/ui/label";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { PageProps } from "@/types";
import { Head, router } from "@inertiajs/react";
import { format } from "date-fns";
import { MessageCircle, Undo2 } from "lucide-react";
import useWindowSize from "@/hooks/useWindowResize";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Page } from "react-pdf";
import EmployeeDetails from "./EmployeeDetails";
import AttendanceDetails from "./AttendanceDetails";
import Certificates from "./Certificates";
import PersonalDataSheets from "./PersonalDataSheets";

type PagesType = { prev: number; current: number; next: number };

export default function SearchedEmployee({
    auth,
    user,
    open,
    leave,
}: PageProps & { user: any; open: any; leave: number }) {
    const urlParams = new URLSearchParams(window.location.search);

    // Get the value of a specific query parameter
    const paramValue = urlParams.get('view');

    const [activeTab, setActiveTab] = useState<string>(
        open && open === "certificate" ? "certificates" : paramValue ? paramValue : "details"
    );
    const [pdsData, setPdsData] = useState([]);

    useEffect(() => {
        if (pdsData.length === 0)
            window.axios
                .get(route("general-search.pds", [user.id]))
                .then((response) => {
                    setPdsData(response.data);
                })
                .catch((error) => {
                    console.log(error);
                });
    }, []);

    return (
        <Authenticated userAuth={auth.user}>
            <Head title="Search" />

            <div className="mb-8 max-sm:flex">
                <Button
                    className="gap-3"
                    variant="ghost"
                    onClick={() => router.get(route("general-search"))}
                >
                    <Undo2 className="size-4" />
                    <span>Back</span>
                </Button>
                <Button
                    className="gap-3 ml-auto sm:hidden"
                    variant="ghost"
                    onClick={() =>
                        router.get(route("messages", { _query: {
                            user: user.id
                        } }))
                    }
                >
                    <MessageCircle className="size-4" />
                    <span>Message</span>
                </Button>
            </div>

            <div className="flex items-center max-sm:flex-col gap-3">
                <AvatarProfile src={user.avatar} className="size-16" />
                <div>
                    <div className="flex sm:items-center max-sm:flex-col max-sm:text-center">
                        <Label className="w-28 flex items-center max-sm:hidden">
                            Name <span className="ml-auto mr-3 max-sm:hidden">:</span>{" "}
                        </Label>
                        <div className="font-semibold text-lg">{`${
                            user.first_name
                        } ${user.middle_name ?? ""} ${user.last_name}`}</div>
                    </div>
                    <div className="flex sm:items-center max-sm:flex-col max-sm:text-center">
                        <Label className="w-28 flex items-center max-sm:hidden">
                            Role <span className="ml-auto mr-3 max-sm:hidden">:</span>{" "}
                        </Label>
                        <div>{user.role}</div>
                    </div>
                    <div className="flex sm:items-center max-sm:flex-col max-sm:text-center">
                        <Label className="w-28 flex items-center max-sm:hidden">
                            Position <span className="ml-auto mr-3 max-sm:hidden">:</span>{" "}
                        </Label>
                        <div>{user.position}</div>
                    </div>
                </div>

                <Button
                    className="gap-3 ml-auto max-sm:hidden"
                    variant="ghost"
                    onClick={() =>
                        router.get(route("messages", { _query: {
                            user: user.id
                        } }))
                    }
                >
                    <MessageCircle className="size-4" />
                    <span>Message</span>
                </Button>
            </div>

            <div className="mt-8">
                <Tabs
                    id="searched-view"
                    active={activeTab}
                    navigate={setActiveTab}
                    tabs={[
                        { id: "details", label: "Details" },
                        { id: "attendance", label: "Attendance" },
                        { id: "certificates", label: "Certificates" },
                        { id: "PDS", label: "PDS" },
                    ]}
                    className="w-fit"
                />
            </div>

            <div className="mt-5">
                {activeTab === "details" && (
                    <EmployeeDetails
                        user={{
                            birthDate: user.date_of_birth,
                            sex: user.sex,
                            address: user.address,
                            email: user.email,
                            phoneNumber: user.phone_number,
                            staffId: user.personnel_id,
                            dateHired: user.date_hired,
                            department: user.department,
                            credits: user.leave_credits,
                            leave: leave.toString(),
                        }}
                    />
                )}

                {activeTab === "attendance" && (
                    <AttendanceDetails userId={user.id} />
                )}

                {activeTab === "certificates" && (
                    <Certificates userId={user.id} />
                )}

                {activeTab === "PDS" && (
                    <div className={cn("mx-auto w-fit")}>
                        <PersonalDataSheets
                            data={{ ...user, ...pdsData }}
                        />
                    </div>
                )}
            </div>

            <div className="mt-8 hidden">
                <div className="grid grid-cols-[repeat(auto-fill,minmax(15rem,1fr))]">
                    <div className="bg-secondary p-2 rounded-md">
                        <div className="line-clamp-1">Sick leave</div>
                        <div className="text-xs">
                            {format(new Date(), "PP")}
                        </div>
                    </div>
                </div>
            </div>
        </Authenticated>
    );
}

const PDFPages = ({
    size,
    index,
    inView,
    pdfpages,
    totalPages,
}: {
    totalPages?: number;
    pdfpages: PagesType;
    index: number;
    size: number;
    inView?: (pageview: PagesType) => void;
}) => {
    const [isRendered, setIsRendered] = useState<boolean>(false);
    const page = index + 1;

    const setInView = (isView: boolean) => {
        // when page has been rendred and viewed in the screen
        if (isRendered && inView) {
            // check if there are more than 1 page
            if (totalPages && totalPages > 1) {
                // initialize next page number
                const next = totalPages > page + 1 ? page + 1 : 0;
                // check if the page is viewed on the screen
                if (isView) {
                    // check if the user scroll up by checking if the viewed page is equal to previous page
                    if (pdfpages.prev == page) {
                        inView({ current: page, prev: page - 1, next: next });
                    } else {
                        inView({ ...pdfpages, current: page });
                    }
                } else {
                    inView({ ...pdfpages, prev: page, next: next });
                }
            }
        }
    };

    return (
        <div className="relative shadow-[0px_1px_2px_0px_rgba(60,64,67,0.3),0px_2px_6px_2px_rgba(60,64,67,0.15)]">
            <Page
                key={`page_${page}`}
                pageNumber={page}
                width={size}
                onRenderSuccess={() => setIsRendered(true)}
            />
        </div>
    );
};
