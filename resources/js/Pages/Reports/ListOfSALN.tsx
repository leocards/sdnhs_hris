import Filter from "@/Components/buttons/FilterButton";
import { Button } from "@/Components/ui/button";
import { ChevronDown, PencilLine, Plus, Printer, Upload } from "lucide-react";
import React, { useState } from "react";
import { SALNType } from "./Reports";
import { cn } from "@/lib/utils";
import { ScrollBar, ScrollArea } from "@/Components/ui/scroll-area";
import UploadSALN from "./UploadSALN";
import PrintSALN from "./PrintSALN";

type Props = {
    saln: Array<SALNType>;
    principal: {name: string; position: string};
    hr: {name: string};
};

const ListOfSALN = ({ saln, principal, hr }: Props) => {
    const [showList, setShowList] = useState(true);
    const [showPrint, setShowPrint] = useState<boolean>(false);
    const [filter, setFilter] = useState<string>("");
    const [isEdit, setIsEdit] = useState<SALNType | null>(null);
    const [showUpload, setShowUpload] = useState<{
        upload: boolean;
        add: boolean;
    }>({ upload: false, add: false });

    return (
        <>
            <div className="mt-8">
                <div className="flex justify-between max-[820px]:flex-col min-[821px]:items-center mb-5">
                    <div className="flex items-center gap-3">
                        <Button
                            className="size-6"
                            size="icon"
                            variant="ghost"
                            onClick={() => setShowList(!showList)}
                        >
                            <ChevronDown
                                className={cn(
                                    "size-5 transition duration-200",
                                    showList && "rotate-180"
                                )}
                            />
                        </Button>
                        <div className="font-semibold uppercase ">
                            Statement of Assets, Liabilities and Network (SALN)
                        </div>
                    </div>
                    {showList && (
                        <div className="flex gap-3 max-[820px]:ml-auto max-[820px]:mt-2">
                            {showList && (
                                <Filter
                                    filter="Filter by year"
                                    active={filter}
                                    items={[
                                        { filter: "2024", onClick: setFilter },
                                        { filter: "2023", onClick: setFilter },
                                        { filter: "2022", onClick: setFilter },
                                        { filter: "2021", onClick: setFilter },
                                        { filter: "2020", onClick: setFilter },
                                    ]}
                                    onClear={() => setFilter("")}
                                    labelClass="2xl:block hidden"
                                />
                            )}
                            <Button
                                className="h-8 gap-2"
                                variant="ghost"
                                onClick={() => setShowPrint(true)}
                            >
                                <Printer className="size-4" strokeWidth={2.3} />
                                <span className="2xl:block hidden">Print</span>
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
                                <span className="2xl:block hidden">Upload</span>
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
                                <span className="2xl:block hidden">Add</span>
                            </Button>
                        </div>
                    )}
                </div>

                {showList && (
                    <ScrollArea className={cn("border rounded-md", (saln.length === 0 ? "h-fit" : "h-[30rem]"))}>
                        <div className="divide-y w-max relative">
                            <div
                                className="grid grid-cols-[3rem,1fr,repeat(3,10rem),20rem,10rem,8rem] border-b [&>div]:text-center
                                    h-fit [&>div]:my-auto [&>div]:font-medium text-foreground/60 sticky top-0 z-[11] bg-white dark:bg-zinc-900"
                            >
                                <div className=""></div>
                                <div className="">Name</div>
                                <div className="">TIN</div>
                                <div className="">Position</div>
                                <div className="">Net worth</div>
                                <div className="">
                                    If spouse is with government service, Please
                                    indicate Name of Spouse/Employer/Address
                                </div>
                                <div className="">
                                    Please check (/) if Joint Filing
                                </div>
                                <div className=""></div>
                            </div>
                            {saln.length > 0 ? (
                                saln.map((list, index) => (
                                    <div
                                        key={index}
                                        className={cn(
                                            index === 0 && "!border-t-0"
                                        )}
                                    >
                                        <div className="grid grid-cols-[3rem,1fr,repeat(3,10rem),20rem,10rem,8rem] [&>div]:text-center [&>div]:py-3">
                                            <div className="">{++index}</div>
                                            <div className="" style={{textAlign: "left"}}>{`${list.user.last_name.toUpperCase()}, ${list.user.first_name.toUpperCase()} ${list.user.middle_name.toUpperCase()}`}</div>

                                            <div className="">
                                                {list.user.pds_personal_information?.tin}
                                            </div>
                                            <div className="">
                                                {list.user.position}
                                            </div>
                                            <div className="">
                                                &#8369; {list.networth}
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
                            ) : (
                                <div className="py-4 text-center text-secondary-foreground/30 !border-t-0">
                                    No records
                                </div>
                            )}
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
                />
            </div>

            <PrintSALN saln={saln} show={showPrint} onClose={setShowPrint} principal={principal} hr={hr} />
        </>
    );
};

export default ListOfSALN;
