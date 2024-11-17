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
import { EllipsisVertical, Eye, Trash2, Upload } from "lucide-react";
import UploadCertificate from "./UploadCartificate";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import ViewCertificate from "./ViewCertificate";
import PageListProvider, { usePageList } from "@/hooks/pageListProvider";
import DataList from "@/Components/DataList";
import PaginationButton from "@/Components/PaginationButton";
import ServiceRecordDeleteConfirmation from "./ServiceRecordDeleteConfirmation";
import { cn } from "@/lib/utils";

export default function index({
    auth,
    records,
}: PageProps & {
    records: PaginateData;
}) {
    return (
        <PageListProvider initialValue={records}>
            <ServiceRecords auth={auth} records={records} />
        </PageListProvider>
    );
}

type CertificateRowData = {
    id: number;
    user_id: number;
    file_name: string;
    file_path: string;
    date_from: string;
    date_to: string;
    updated_at: string;
    credits: number;
    venue: string;
    organizer: string;
    approved: "approved" | "rejected" | "pending"
};

function ServiceRecords({
    auth,
    records,
}: PageProps & {
    records: PaginateData;
}) {
    const { setList, data, loading, setLoading } = usePageList();
    const [isUploadCertificate, setIsUploadCertificate] =
        useState<boolean>(false);
    const [selectedCertificate, setSelectedCertificate] =
        useState<CertificateRowData | null>(null);
    const [showView, setShowView] = useState<boolean>(false);
    const [showDelete, setShowDelete] = useState<boolean>(false);

    const getPageData = (page?: number) => {
        setLoading(true);
        window.axios
            .get(
                route("service-records.json", {
                    _query: {
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

    const onView = (certificate: CertificateRowData) => {
        setShowView(true);
        setSelectedCertificate(certificate);
    };

    const onDelete = (certificate: CertificateRowData) => {
        setShowDelete(true);
        setSelectedCertificate(certificate);
    };

    useEffect(() => {
        if (records) {
            setList(records);
        }
    }, [records]);

    return (
        <Authenticated
            userAuth={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Service records
                </h2>
            }
        >
            <div className="mt-10 mb-8 flex">
                <Button
                    className="gap-3 ml-auto"
                    onClick={() => setIsUploadCertificate(true)}
                >
                    <Upload className="size-5" />
                    <span>Upload certificate</span>
                </Button>
            </div>

            <div className="divide-y min-h-[22rem]">
                <div className="grid grid-cols-[repeat(4,1fr),3rem] py-2 [&>div:first-child]:pl-1 [&>div]:font-medium opacity-60">
                    <div className="">Name</div>
                    <div className="">Date modified</div>
                    <div className="">File type</div>
                    <div className="">Status</div>
                    <div className=""></div>
                </div>

                <DataList empty={data.length === 0} loading={loading}>
                    {data.map((record, index) => (
                        <CertificateRow
                            key={index}
                            data={record}
                            onView={onView}
                            onDelete={onDelete}
                        />
                    ))}
                </DataList>

                <PaginationButton
                    onPage={getPageData}
                    onNext={getPageData}
                    onPrevious={getPageData}
                />
            </div>

            <UploadCertificate
                show={isUploadCertificate}
                onClose={setIsUploadCertificate}
            />
            <ViewCertificate
                certificate={selectedCertificate}
                show={showView}
                onClose={setShowView}
            />
            <ServiceRecordDeleteConfirmation
                certificate={selectedCertificate}
                show={showDelete}
                onClose={setShowDelete}
            />
        </Authenticated>
    );
}

const CertificateRow: React.FC<{
    data: CertificateRowData;
    onView: CallableFunction;
    onDelete: CallableFunction;
}> = ({ data, onView, onDelete }) => {
    const type = data.file_path.split(".")[1];
    const color_status = {
        "approved": "text-green-600",
        "rejected": "text-red-600",
        "pending": "text-amber-600",
    }[data.approved]

    return (
        <div className="hover:bg-secondary transition-colors">
            <div className="grid grid-cols-[repeat(4,1fr),3rem] [&>div]:py-3 [&>div]:flex [&>div]:items-center [&>div]:pr-3 [&>div:first-child]:pl-1 text-sm font-mediu">
                <div className="">
                    <div className="line-clamp-1">{data.file_name}</div>
                </div>
                <div className="">
                    <div className="line-clamp-1">
                        {format(data.updated_at, "PPP")}
                    </div>
                </div>
                <div className="uppercase text-xs">
                    {["png", "jpg", "jpeg"].includes(type) ? "image" : type}
                </div>
                <div className="">
                    <div className={cn("line-clamp-1 capitalize", color_status)}>{data.approved}</div>
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
                                    onClick={() => onView(data)}
                                >
                                    <Eye className="size-5" strokeWidth={1.8} />
                                    <div>View</div>
                                </MenubarItem>
                                <MenubarItem
                                    className="px-4 gap-5 !text-destructive hover:!bg-destructive/10 dark:hover:!bg-destructive/50 dark:!text-red-500"
                                    onClick={() => onDelete(data)}
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
