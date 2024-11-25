import { useEffect, useMemo, useState } from "react";
import UploadIPCR from "./UploadIPCR";
import { IPCRType } from "./Index";
import { Button } from "@/Components/ui/button";
import { PencilLine, Plus, Printer, Upload } from "lucide-react";
import Filter from "@/Components/buttons/FilterButton";
import { ScrollArea } from "@/Components/ui/scroll-area";
import PrintIPCR from "./PrintIPCR";
import { SYTYPE } from "@/types";

type Props = {
    ipcr: Array<IPCRType>;
    principal: { name: string; position: string };
    hr: { name: string };
    ipcr_years: Array<string>;
    sy: SYTYPE
    syList: Array<SYTYPE>
};

export const equivalent = (rate: number | null): string => {
    if (rate)
        if (rate >= 4.5 && rate <= 5) {
            return "Outstanding";
        } else if (rate >= 3.5 && rate <= 4.499) {
            return "Very Satisfactory";
        } else if (rate >= 2.5 && rate <= 3.499) {
            return "Satisfactory";
        } else if (rate >= 1.5 && rate <= 2.499) {
            return "Moderate";
        } else if (rate >= 1 && rate <= 1.499) {
            return "Fair";
        } else {
            return "Poor";
        }

    return "";
};

const ListOfIPCR = ({ ipcr, principal, hr, ipcr_years, sy }: Props) => {
    const [showList, setShowList] = useState(true);
    const [showPrint, setShowPrint] = useState<boolean>(false);
    const [filter, setFilter] = useState<string>(ipcr_years.length > 0 ? ipcr_years[0] : "");
    const [isEdit, setIsEdit] = useState<IPCRType | null>(null);
    const [showUpload, setShowUpload] = useState<{
        upload: boolean;
        add: boolean;
    }>({ upload: false, add: false });
    const [loading, setLoading] = useState(false);
    const [ipcrList, setIpcrList] = useState<Array<IPCRType>>(ipcr);

    useEffect(() => {
        if(filter) {
            window.axios
                .get(route("reports.filter.ipcr", [filter]))
                .then((response) => {
                    let data: Array<IPCRType> = response.data;

                    setIpcrList(data);
                })
                .finally(() => setLoading(false));
        }
    }, [filter]);

    return (
        <div>
            <div className="mt-8">
                <div className="flex justify-end mb-4">

                    {showList && (
                        <div className="flex gap-3">
                            {showList && (
                                <Filter
                                    filter="Filter by year"
                                    active={filter}
                                    items={ipcr_years.map((year) => ({
                                        filter: year,
                                        onClick: (fil) => {
                                            if(fil != filter) {
                                                setFilter(fil)
                                                setLoading(true)
                                            }
                                        },
                                    }))}
                                    onClear={() => {
                                        setFilter("");
                                        // setLoading(true);
                                    }}
                                    labelClass="sm:block hidden"
                                    size="sm"
                                />
                            )}
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
                    <div className="border divide-y rounded-lg">
                        <div className="grid grid-cols-[4rem,repeat(2,1fr),8rem,10rem,8rem] text-sm [&>div:not(:nth-child(2))]:text-center h-11 [&>div]:my-auto [&>div]:font-semibold opacity-60">
                            <div className="">No.</div>
                            <div className="">Name of Personnel</div>
                            <div className="">Position</div>
                            <div className="">Performance Rating</div>
                            <div className="">Adjectival Equivalent</div>
                            <div className=""></div>
                        </div>
                        {
                            (ipcrList.length > 0 && !loading) && (
                                <ScrollArea className="h-[30rem]">
                                    <div className="divide-y">
                                        {ipcrList.map((list, index) => (
                                            <div key={index}>
                                                <div className="grid grid-cols-[4rem,repeat(2,1fr),8rem,10rem,8rem] [&>div:not(:nth-child(2))]:text-center [&>div]:py-2">
                                                    <div className="">
                                                        {++index}
                                                    </div>
                                                    <div className="">{`${list.user.last_name.toUpperCase()}, ${list.user.first_name.toUpperCase()} ${list.user.middle_name.toUpperCase()}`}</div>
                                                    <div className="">
                                                        {list.user.position}
                                                    </div>
                                                    <div className="">
                                                        {list.rating}
                                                    </div>
                                                    <div className="">
                                                        {equivalent(
                                                            list.rating
                                                                ? +list.rating
                                                                : null
                                                        )}
                                                    </div>
                                                    <div className="flex items-center justify-center gap-2">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="size-7"
                                                            onClick={() => {
                                                                setShowUpload({
                                                                    ...showUpload,
                                                                    add: true,
                                                                });
                                                                setIsEdit(list);
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
                                        ))}
                                    </div>
                                </ScrollArea>
                            )
                        }
                        {
                            (!loading && ipcrList.length === 0) && (
                                <div className="py-2 text-center text-secondary-foreground/30">
                                    No records
                                </div>
                            )
                        }
                        {
                            loading && (
                                <div className="flex justify-center py-3">
                                    <span className="loading loading-dots loading-sm"></span>
                                </div>
                            )
                        }
                    </div>
                )}

                <UploadIPCR
                    show={showUpload.add || showUpload.upload}
                    onClose={(close: any) => {
                        setIsEdit(null);
                        setShowUpload(close);
                    }}
                    isAdd={showUpload.add}
                    isEdit={isEdit}
                    year={filter?filter:sy?.sy}
                />
            </div>

            <PrintIPCR
                show={showPrint}
                onClose={setShowPrint}
                ipcr={ipcrList}
                principal={principal}
                hr={hr}
                year={filter?filter:sy?.sy}
            />
        </div>
    );
};

export default ListOfIPCR;
