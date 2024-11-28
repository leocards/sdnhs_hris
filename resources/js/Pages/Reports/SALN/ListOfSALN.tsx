import Filter from "@/Components/buttons/FilterButton";
import { Button } from "@/Components/ui/button";
import { ChevronDown, PencilLine, Plus, Printer, Upload } from "lucide-react";
import React, { useEffect, useState } from "react";
import { HrType, PrincipalType, SALNType } from "./Index";
import { cn } from "@/lib/utils";
import { ScrollBar, ScrollArea } from "@/Components/ui/scroll-area";
import UploadSALN from "./UploadSALN";
import PrintSALN from "./PrintSALN";

type Props = {
    saln: Array<SALNType>;
    principal: PrincipalType;
    hr: HrType;
    saln_years: Array<number>;
};

const ListOfSALN = ({ saln, principal, hr, saln_years }: Props) => {
    const [showList, setShowList] = useState(true);
    const [showPrint, setShowPrint] = useState<boolean>(false);
    const [filter, setFilter] = useState<string>(
        saln_years.length > 0 ? saln_years[0].toString() : ""
    );
    const [isEdit, setIsEdit] = useState<SALNType | null>(null);
    const [showUpload, setShowUpload] = useState<{
        upload: boolean;
        add: boolean;
    }>({ upload: false, add: false });
    const [loading, setLoading] = useState(false);
    const [salnList, setSalnList] = useState<Array<SALNType>>(saln);

    const toNumber = (value: string): number | null => {
        // Remove commas and validate if the result is numeric
        const sanitizedValue = value.replace(/,/g, '');
        return isNaN(Number(sanitizedValue)) ? null : Number(sanitizedValue);
    };

    useEffect(() => {
        if(filter) {
            window.axios
                .get(route("reports.filter.saln", [filter]))
                .then((response) => {
                    let data: Array<SALNType> = response.data;

                    setSalnList(data);
                })
                .finally(() => setLoading(false));
        }
    }, [filter]);

    return (
        <>
            <div className="mt-8">
                <div className="flex justify-end mb-4">
                    {showList && (
                        <div className="flex gap-3 max-[820px]:ml-auto max-[820px]:mt-2">
                            <Filter
                                filter="Filter by year"
                                active={filter}
                                items={saln_years.map((year) => ({
                                    filter: year.toString(),
                                    onClick: (f) => {
                                        if(f != filter){
                                            setLoading(true)
                                            setFilter(f)
                                        }
                                    },
                                }))}
                                onClear={() => setFilter("")}
                                labelClass="sm:block hidden"
                            />
                            <Button
                                className="h-8 gap-2"
                                variant="ghost"
                                onClick={() => setShowPrint(true)}
                            >
                                <Printer className="size-4" strokeWidth={2.3} />
                                <span className="sm:block hidden">Print</span>
                            </Button>
                            <Button
                                className="h-8 gap-2"
                                variant="secondary"
                                onClick={() =>
                                    setShowUpload({
                                        ...showUpload,
                                        upload: true,
                                    })
                                }
                            >
                                <Upload className="size-4" strokeWidth={2.7} />
                                <span className="sm:block hidden">Upload</span>
                            </Button>
                            <Button
                                className="h-8 gap-2"
                                onClick={() =>
                                    setShowUpload({
                                        ...showUpload,
                                        add: true,
                                    })
                                }
                            >
                                <Plus className="size-4" strokeWidth={2.7} />
                                <span className="sm:block hidden">Add</span>
                            </Button>
                        </div>
                    )}
                </div>

                {showList && (
                    <ScrollArea
                        className={cn(
                            "border rounded-md",
                            saln.length === 0 ? "h-fit" : "h-[30rem]"
                        )}
                    >
                        <div className="divide-y w-max relative">
                            <div
                                className="grid grid-cols-[3rem,1fr,repeat(3,10rem),20rem,10rem,8rem] border-b [&>div]:text-center
                                    h-fit [&>div]:my-auto [&>div]:font-medium text-foreground/60 sticky top-0 z-[11] bg-background dark:bg-zinc-900"
                            >
                                <div className=""></div>
                                <div className="">Name</div>
                                <div className="">TIN</div>
                                <div className="">Position</div>
                                <div className="">Networth</div>
                                <div className="">
                                    If spouse is with government service, Please
                                    indicate Name of Spouse/Employer/Address
                                </div>
                                <div className="">
                                    Please check (/) if Joint Filing
                                </div>
                                <div className=""></div>
                            </div>

                            {
                                loading && (
                                    <div className="flex pl-5 py-3 gap-3">
                                        <span className="loading loading-dots loading-sm"></span>
                                        <span className="text-foreground/60">Loading</span>
                                    </div>
                                )
                            }

                            {
                                (!loading && salnList.length === 0) && (
                                    <div className="py-4 text-center text-secondary-foreground/30 !border-t-0">
                                        No records
                                    </div>
                                )
                            }

                            {
                                (salnList.length > 0 && !loading) && (
                                    salnList.map((list, index) => (
                                        <div
                                            key={index}
                                            className={cn(
                                                index === 0 && "!border-t-0"
                                            )}
                                        >
                                            <div className="grid grid-cols-[3rem,1fr,repeat(3,10rem),20rem,10rem,8rem] [&>div]:text-center [&>div]:py-3">
                                                <div className="">{++index}</div>
                                                <div
                                                    className=""
                                                    style={{ textAlign: "left" }}
                                                >{`${list.user.last_name.toUpperCase()}, ${list.user.first_name.toUpperCase()} ${list.user.middle_name?.toUpperCase()||""}`}</div>

                                                <div className="">
                                                    {
                                                        list.user
                                                            .pds_personal_information
                                                            ?.tin
                                                    }
                                                </div>
                                                <div className="">
                                                    {list.user.position}
                                                </div>
                                                <div className="">
                                                    &#8369; {Number(toNumber(list.networth)).toLocaleString()}
                                                </div>
                                                <div className="">
                                                    {list.spouse}
                                                </div>
                                                <div className="">
                                                    {list.joint ? "/" : ""}
                                                </div>
                                                <div className="flex items-center justify-center gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="size-7"
                                                        onClick={() => {
                                                            setIsEdit(list);
                                                            setShowUpload({
                                                                ...showUpload,
                                                                add: true,
                                                            });
                                                        }}
                                                    >
                                                        <PencilLine
                                                            className="size-5"
                                                            strokeWidth={1.8}
                                                        />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )
                            }
                        </div>
                        <ScrollBar
                            orientation="horizontal"
                            className="h-3"
                            forceMount
                        />
                    </ScrollArea>
                )}

                <UploadSALN
                    show={showUpload.add || showUpload.upload}
                    onClose={(close: any) => {
                        setIsEdit(null);
                        setShowUpload(close);
                    }}
                    isAdd={showUpload.add}
                    isEdit={isEdit}
                    year={filter}
                />
            </div>

            <PrintSALN
                saln={salnList}
                show={showPrint}
                onClose={setShowPrint}
                principal={principal}
                hr={hr}
                year={filter}
            />
        </>
    );
};

export default ListOfSALN;
