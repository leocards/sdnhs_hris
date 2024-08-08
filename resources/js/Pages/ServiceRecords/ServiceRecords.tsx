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
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/Components/ui/pagination";
import { cn } from "@/lib/utils";
import UploadCertificate from "./UploadCartificate";
import { useEffect, useState } from "react";
import { usePage } from "@inertiajs/react";
import { format } from "date-fns";
import ViewCertificate from "./ViewCertificate";
import { AspectRatio } from "@radix-ui/react-aspect-ratio";

export default function ServiceRecords({
    auth,
    records,
}: PageProps & {
    records: PaginateData;
}) {
    const [recirdsList, setRecirdsList] = useState<PaginateData>(records);
    const [isUploadCertificate, setIsUploadCertificate] =
        useState<boolean>(false);

    const { props } = usePage();

    const [selectedCertificate, setSelectedCertificate] = useState<string|null>(null)

    useEffect(() => {
        if (isUploadCertificate) {
            setRecirdsList(props.records as PaginateData);
            console.log("rendered");
        }
    }, [props]);

    return (
        <Authenticated
            user={auth.user}
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
                <div className="grid grid-cols-[repeat(3,1fr),3rem] py-2 [&>div:first-child]:pl-1 [&>div]:font-medium opacity-60">
                    <div className="">Name</div>
                    <div className="">Date modified</div>
                    <div className="">File type</div>
                    <div className=""></div>
                </div>

                {records.data.length === 0 && (
                    <div className="text-center py-5 text-foreground/60">
                        No record.
                    </div>
                )}

                {records.data.map((record, index) => (
                    <CertificateRow key={index} data={record} onView={setSelectedCertificate} />
                ))}

                {records.total >= 50 && (
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

            <UploadCertificate
                show={isUploadCertificate}
                onClose={setIsUploadCertificate}
            />
            <ViewCertificate
                img={selectedCertificate}
                show={!!selectedCertificate}
                onClose={() => setSelectedCertificate(null)}
            />
        </Authenticated>
    );
}

type CertificateRowData = {
    user_id: number
    file_name: string
    file_path: string
    date_from: string
    date_to: string
    updated_at: string
};
const CertificateRow: React.FC<{ data: CertificateRowData, onView: CallableFunction }> = ({ data, onView }) => {
    const type = data.file_path.split('.')[1]

    return (
        <div className="hover:bg-secondary transition-colors">
            <div className="grid grid-cols-[repeat(3,1fr),3rem] [&>div]:py-3 [&>div]:flex [&>div]:items-center [&>div]:pr-3 [&>div:first-child]:pl-1 text-sm font-mediu">
                <div className="">
                    <div className="line-clamp-1">{data.file_name}</div>
                </div>
                <div className="">
                    <div className="line-clamp-1">{format(data.updated_at, "PPP")}</div>
                </div>
                <div className="uppercase text-xs">
                    {['png', 'jpg', 'jpeg'].includes(type) ? "image" : type}
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
                                    onClick={() => onView(data.file_path)}
                                >
                                    <Eye className="size-5" strokeWidth={1.8} />
                                    <div>View</div>
                                </MenubarItem>
                                <MenubarItem className="px-4 gap-5">
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
