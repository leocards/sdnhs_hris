import { Button } from "@/Components/ui/button";
import { ScrollArea, ScrollBar } from "@/Components/ui/scroll-area";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { cn } from "@/lib/utils";
import { PageProps } from "@/types";
import {
    ChevronDown,
    PencilLine,
    Plus,
    Printer,
    Trash2,
    Upload,
} from "lucide-react";
import { Fragment, useState } from "react";
import IPCRPrint from "./IPCRPrint";
import SALNPrint from "./SALNPrint";
import UploadIPCR from "./UploadIPCR";
import UploadSALN from "./UploadSALN";
import Filter from "@/Components/buttons/FilterButton";
import Processing from "@/Components/Processing";
import { router } from "@inertiajs/react";
import { useToast } from "@/Components/ui/use-toast";

type IPCRType = {
    id: number;
    rating: string;
    user_id: number;
    user: {
        id: number;
        first_name: string;
        last_name: string;
        middle_name: string;
        position: string;
        personnel_id: string;
    };
    created_at: string;
};

type SALNType = {
    id: number;
    joint: boolean;
    networth: string;
    spouse: string;
    user_id: number;
    user: {
        id: number;
        first_name: string;
        last_name: string;
        middle_name: string;
        position: string;
        personnel_id: string;
    };
    created_at: string;
};

const equivalent = (rate: number): string => {
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
};

export default function Reports({
    auth,
    ipcr,
    saln,
}: PageProps & { ipcr: Array<IPCRType>; saln: Array<SALNType> }) {
    const [showIPCRPrint, setShowIPCRPrint] = useState<boolean>(false);
    const [showSALNPrint, setShowSALNPrint] = useState<boolean>(false);
    const [showList, setShowList] = useState<{
        showEmployee: boolean;
        showIPCR: boolean;
        showSALN: boolean;
    }>({ showEmployee: true, showIPCR: true, showSALN: true });
    const [showIPCRUpload, setShowIPCRUpload] = useState<{
        upload: boolean;
        add: boolean;
    }>({ upload: false, add: false });
    const [showSALNUpload, setShowSALNUpload] = useState<{
        upload: boolean;
        add: boolean;
    }>({ upload: false, add: false });
    const [filterSALN, setFilterSALN] = useState<string>("");
    const [filterIPCR, setFilterIPCR] = useState<string>("");
    const [isEditIPCR, setIsEditIPCR] = useState<IPCRType|null>(null);
    const [isEditSALN, setIsEditSALN] = useState<SALNType|null>(null);
    const [isProcessing, setIsProcessing] = useState<boolean>(false)
    const { toast } = useToast()

    const deleteRow = (deletRoute: string) => {
        setIsProcessing(true)
        router.delete(deletRoute, {
            onSuccess: page => {
                toast({
                    variant: "success",
                    description: page.props.success?.toString()
                })
            }, 
            onError: error => {
                toast({
                    variant: "success",
                    description: error[0]
                })
            }, 
            onFinish: () => {
                setIsProcessing(false)
            }
        })
    }

    return (
        <Authenticated
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Reports
                </h2>
            }
        >
            <Processing is_processing={isProcessing} label="Deleting..." />
            <div className="mt-10">
                <div className="flex justify-between items-center mb-5">
                    <div className="flex items-center gap-3">
                        <Button
                            className="size-6"
                            size="icon"
                            variant="ghost"
                            onClick={() =>
                                setShowList({
                                    ...showList,
                                    showEmployee: !showList.showEmployee,
                                })
                            }
                        >
                            <ChevronDown
                                className={cn(
                                    "size-5 transition duration-200",
                                    showList.showEmployee && "rotate-180"
                                )}
                            />
                        </Button>
                        <div className="font-semibold uppercase">
                            List of Employees
                        </div>
                    </div>
                    <Button className="h-8 hidden">Print</Button>
                </div>

                {showList.showEmployee && (
                    <>
                        <div className="border mb-4 divide-y rounded-md [&>div>div:nth-child(4)]:text-red-500">
                            <div className="divide-x grid grid-cols-[1fr,repeat(3,5rem)] text-center [&>div]:p-1.5 font-semibold">
                                <div></div>
                                <div>MALE</div>
                                <div>FEMALE</div>
                                <div>TOTAL</div>
                            </div>
                            <div className="divide-x grid grid-cols-[1fr,repeat(3,5rem)] text-center [&>div]:p-1.5">
                                <div className="text-left uppercase">
                                    Junior high school
                                </div>
                                <div>10</div>
                                <div>36</div>
                                <div>47</div>
                            </div>
                            <div className="divide-x grid grid-cols-[1fr,repeat(3,5rem)] text-center [&>div]:p-1.5">
                                <div className="text-left uppercase">
                                    Senior high school
                                </div>
                                <div>3</div>
                                <div>7</div>
                                <div>10</div>
                            </div>
                            <div className="divide-x grid grid-cols-[1fr,repeat(3,5rem)] text-center [&>div]:p-1.5">
                                <div className="text-left uppercase">
                                    Accounting
                                </div>
                                <div>0</div>
                                <div>4</div>
                                <div>4</div>
                            </div>
                            <div className="divide-x grid grid-cols-[1fr,repeat(3,5rem)] text-center [&>div]:p-1.5">
                                <div className="text-left uppercase">
                                    Principal
                                </div>
                                <div>0</div>
                                <div>1</div>
                                <div>1</div>
                            </div>
                            <div className="divide-x grid grid-cols-[1fr,repeat(3,5rem)] text-center [&>div]:p-1.5">
                                <div></div>
                                <div>13</div>
                                <div>48</div>
                                <div>61</div>
                            </div>
                        </div>

                        <div className="grid grid-cols-[repeat(3,minmax(17rem,1fr))] gap-2">
                            <div className="rounded-lg overflow-hidden">
                                <div className="bg-zinc-200 p-2 font-semibold rounded-t-lg">
                                    Junior High School
                                </div>
                                <div className="divide-y border rounded-b-lg">
                                    <ScrollArea className="h-[40rem]">
                                        <div className="divide-y">
                                            {JuniorHighList.map(
                                                (name, index) => (
                                                    <Fragment key={index}>
                                                        <div className="grid grid-cols-[3rem,1fr] [&>div]:p-2">
                                                            <div className="text-right pr-1 border-r">
                                                                {++index}
                                                            </div>
                                                            <div className="pl-2">
                                                                {name}
                                                            </div>
                                                        </div>
                                                    </Fragment>
                                                )
                                            )}
                                        </div>
                                    </ScrollArea>
                                </div>
                            </div>

                            <div className="">
                                <div className="bg-zinc-200 p-2 font-semibold rounded-t-lg">
                                    Senior High School
                                </div>
                                <div className="divide-y border rounded-b-lg">
                                    <ScrollArea className="h-[40rem]">
                                        <div className="divide-y">
                                            {SeniorHighList.map(
                                                (name, index) => (
                                                    <Fragment key={index}>
                                                        <div className="grid grid-cols-[3rem,1fr] [&>div]:p-2">
                                                            <div className="text-right pr-1 border-r">
                                                                {++index}
                                                            </div>
                                                            <div className="pl-2">
                                                                {name}
                                                            </div>
                                                        </div>
                                                    </Fragment>
                                                )
                                            )}
                                        </div>
                                    </ScrollArea>
                                </div>
                            </div>

                            <div className="">
                                <div className="bg-zinc-200 p-2 font-semibold rounded-t-lg">
                                    Accounting
                                </div>
                                <div className="divide-y border rounded-b-lg">
                                    <ScrollArea className="h-[40rem]">
                                        <div className="divide-y">
                                            {Accounting.map((name, index) => (
                                                <Fragment key={index}>
                                                    <div className="grid grid-cols-[3rem,1fr] [&>div]:p-2">
                                                        <div className="text-right pr-1 border-r">
                                                            {++index}
                                                        </div>
                                                        <div className="pl-2">
                                                            {name}
                                                        </div>
                                                    </div>
                                                </Fragment>
                                            ))}
                                        </div>
                                    </ScrollArea>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>

            <div className="mt-8">
                <div className="flex justify-between items-center mb-5">
                    <div className="flex items-center gap-3">
                        <Button
                            className="size-6"
                            size="icon"
                            variant="ghost"
                            onClick={() =>
                                setShowList({
                                    ...showList,
                                    showIPCR: !showList.showIPCR,
                                })
                            }
                        >
                            <ChevronDown
                                className={cn(
                                    "size-5 transition duration-200",
                                    showList.showIPCR && "rotate-180"
                                )}
                            />
                        </Button>
                        <div className="font-semibold  ">INDIVIDUAL PERFORMANCE COMMITMENT AND REVIEW (IPCR)</div>
                        <Filter
                            filter="Filter by year"
                            active={filterIPCR}
                            items={[
                                { filter: "2024", onClick: setFilterIPCR },
                                { filter: "2023", onClick: setFilterIPCR },
                                { filter: "2022", onClick: setFilterIPCR },
                                { filter: "2021", onClick: setFilterIPCR },
                                { filter: "2020", onClick: setFilterIPCR },
                            ]}
                            onClear={() => setFilterIPCR("")}
                        />
                    </div>
                    {showList.showIPCR && (
                        <div className="flex gap-3">
                            <Button
                                className="h-8 gap-2"
                                variant="ghost"
                                onClick={() => setShowIPCRPrint(true)}
                            >
                                <Printer className="size-4" strokeWidth={2.3} />
                                <span>Print</span>
                            </Button>
                            <Button
                                className="h-8 gap-2"
                                variant="secondary"
                                onClick={() =>
                                    setShowIPCRUpload({
                                        ...showIPCRUpload,
                                        upload: true,
                                    })
                                }
                            >
                                <Upload className="size-4" strokeWidth={2.7} />
                                <span>Upload</span>
                            </Button>
                            <Button
                                className="h-8 gap-2"
                                onClick={() =>
                                    setShowIPCRUpload({
                                        ...showIPCRUpload,
                                        add: true,
                                    })
                                }
                            >
                                <Plus className="size-4" strokeWidth={2.7} />
                                <span>Add</span>
                            </Button>
                        </div>
                    )}
                </div>
                {showList.showIPCR && (
                    <div className="border divide-y rounded-lg">
                        <div className="grid grid-cols-[4rem,repeat(2,1fr),8rem,10rem,8rem] text-sm [&>div:not(:nth-child(2))]:text-center h-11 [&>div]:my-auto [&>div]:font-semibold opacity-60">
                            <div className="">No.</div>
                            <div className="">Name of Personnel</div>
                            <div className="">Position</div>
                            <div className="">Performance Rating</div>
                            <div className="">Adjectival Equivalent</div>
                            <div className=""></div>
                        </div>
                        <ScrollArea className="h-[30rem]">
                            <div className="divide-y">
                                {ipcr.map((list, index) => (
                                    <div key={index}>
                                        <div className="grid grid-cols-[4rem,repeat(2,1fr),8rem,10rem,8rem] [&>div:not(:nth-child(2))]:text-center [&>div]:py-2">
                                            <div className="">{++index}</div>
                                            <div className="">{`${list.user.last_name.toUpperCase()}, ${list.user.first_name.toUpperCase()} ${list.user.middle_name.toUpperCase()}`}</div>
                                            <div className="">
                                                {list.user.position}
                                            </div>
                                            <div className="">
                                                {list.rating}
                                            </div>
                                            <div className="">
                                                {equivalent(+list.rating)}
                                            </div>
                                            <div className="flex items-center justify-center gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="size-7"
                                                    onClick={() => {
                                                        setShowIPCRUpload({
                                                            ...showIPCRUpload,
                                                            add: true,
                                                        });
                                                        setIsEditIPCR(list);
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
                    </div>
                )}

                <UploadIPCR
                    show={showIPCRUpload.add || showIPCRUpload.upload}
                    onClose={(close: any) => {
                        setIsEditIPCR(null);
                        setShowIPCRUpload(close);
                    }}
                    isAdd={showIPCRUpload.add}
                    isEdit={isEditIPCR}
                />
            </div>

            <div className="mt-8">
                <div className="flex justify-between items-center mb-5">
                    <div className="flex items-center gap-3">
                        <Button
                            className="size-6"
                            size="icon"
                            variant="ghost"
                            onClick={() =>
                                setShowList({
                                    ...showList,
                                    showSALN: !showList.showSALN,
                                })
                            }
                        >
                            <ChevronDown
                                className={cn(
                                    "size-5 transition duration-200",
                                    showList.showSALN && "rotate-180"
                                )}
                            />
                        </Button>
                        <div className="font-semibold uppercase ">Statement of Assets, Liabilities and Network (SALN)</div>
                        <Filter
                            filter="Filter by year"
                            active={filterSALN}
                            items={[
                                { filter: "2024", onClick: setFilterSALN },
                                { filter: "2023", onClick: setFilterSALN },
                                { filter: "2022", onClick: setFilterSALN },
                                { filter: "2021", onClick: setFilterSALN },
                                { filter: "2020", onClick: setFilterSALN },
                            ]}
                            onClear={() => setFilterSALN("")}
                        />
                    </div>
                    {showList.showSALN && (
                        <div className="flex gap-3">
                            <Button
                                className="h-8 gap-2"
                                variant="ghost"
                                onClick={() => setShowSALNPrint(true)}
                            >
                                <Printer className="size-4" strokeWidth={2.3} />
                                <span>Print</span>
                            </Button>
                            <Button
                                className="h-8 gap-2"
                                variant="secondary"
                                onClick={() =>
                                    setShowSALNUpload({
                                        ...showSALNUpload,
                                        upload: true,
                                    })
                                }
                            >
                                <Upload className="size-4" strokeWidth={2.7} />
                                <span>Upload</span>
                            </Button>
                            <Button
                                className="h-8 gap-2"
                                onClick={() =>
                                    setShowSALNUpload({
                                        ...showSALNUpload,
                                        add: true,
                                    })
                                }
                            >
                                <Plus className="size-4" strokeWidth={2.7} />
                                <span>Add</span>
                            </Button>
                        </div>
                    )}
                </div>
                {showList.showSALN && (
                    <ScrollArea className="border rounded-md h-[30rem]">
                        <div className="divide-y w-max relative">
                            <div
                                className="grid grid-cols-[3rem,1fr,repeat(3,10rem),20rem,10rem,8rem] border-b [&>div]:text-center 
                            h-fit [&>div]:my-auto [&>div]:font-medium text-foreground/60 sticky top-0 z-[11] bg-white"
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
                            {saln.map((list, index) => (
                                <div
                                    key={index}
                                    className={cn(index === 0 && "!border-t-0")}
                                >
                                    <div className="grid grid-cols-[3rem,1fr,repeat(3,10rem),20rem,10rem,8rem] [&>div]:text-center [&>div]:py-3">
                                        <div className="">{++index}</div>
                                        <div className="">{`${list.user.last_name.toUpperCase()}, ${list.user.first_name.toUpperCase()} ${list.user.middle_name.toUpperCase()}`}</div>

                                        <div className="">
                                            {Array.from({ length: 9 }, () =>
                                                Math.floor(Math.random() * 10)
                                            ).join("")}
                                        </div>
                                        <div className="">
                                            {list.user.position}
                                        </div>
                                        <div className="">&#8369; {list.networth}</div>
                                        <div className="">{list.spouse}</div>
                                        <div className="">
                                            {list.joint ? "/" : ""}
                                        </div>
                                        <div className="flex items-center justify-center gap-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="size-7"
                                                onClick={() => {
                                                    setIsEditSALN(list);
                                                    setShowSALNUpload({
                                                        ...showSALNUpload,
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
                            ))}
                        </div>
                        <ScrollBar
                            orientation="horizontal"
                            className="h-3"
                            forceMount
                        />
                    </ScrollArea>
                )}

                <UploadSALN
                    show={showSALNUpload.add || showSALNUpload.upload}
                    onClose={(close: any) => {
                        setIsEditSALN(null);
                        setShowSALNUpload(close);
                    }}
                    isAdd={showSALNUpload.add}
                    isEdit={isEditSALN}
                />
            </div>

            <IPCRPrint show={showIPCRPrint} onClose={setShowIPCRPrint} />
            <SALNPrint show={showSALNPrint} onClose={setShowSALNPrint} />
        </Authenticated>
    );
}

const JuniorHighList = [
    "ABAYA, ELARDE",
    "AGUDO, ERWIN P.",
    "ANDO, ANNIE LOURDE SHYRREL S.",
    "BALABA, MARISA B.",
    "BALAGOSA, JEREMIE F.",
    "BARBATON, LUCILLE G.",
    "BELGIRA, RODUARD A.",
    "BOHOL, GECEL N.",
    "BULIGAN, CHRISTINE JOY B.",
    "CAMACHO, LORIE JEAN",
    "CANATE, JOHNREY G.",
    "CAÑIZARES, JEMIMA B.",
    "DACALUS, CARMELA MIA P.",
    "DAQUIO, APPLE JEAN",
    "DELEGADO, HERMAINE L.",
    "DIGAO, YENSEN P.",
    "DUMAS, ANA MARIE",
    "DUMBASE, LOUELA M.",
    "EMBALSADO, ANGELICA C.",
    "ESPINOSA, MARIVENE P",
    "GEMENTIZA, DANICA JOYCE P.",
    "JACINTO, DIANNE H.",
    "LABOS, RUBY P.",
    "LEGARA, JENNIFER T.",
    "LOPEZ, FLORAMIE D.",
    "MARTIN, JANIVIC B.",
    "MORALES, DAVIE ROSE",
    "NAVARES, JAYVENT",
    "OLMILLO, ANNABELLE S.",
    "PALMA, MARY JOY C.",
    "PAMA, JOANALLE P.",
    "PASAGUI, MIA KRIS ZHEL M.",
    "PEÑANO, JERAVEN D.",
    "PILOTO, ESTELA G.",
    "QUEMA, ROMMEL B.",
    "RELAMPAGOS, JANICE MAY E.",
    "ROMEO, NOEL M.",
    "SINDA, LP SHEENA S.",
    "SUAN, CRISEL D.",
    "SUMAGAYSAY, AIRES JANE D.",
    "TABLATE, FRANPERL L.",
    "TAGPUNO, ANNE CLARENCE B.",
    "TINASAS, BELEN R.",
    "TUBAC, APRIL JOEY A.",
    "TUBOSO, CRISTINE G.",
    "VERTUDES, REYMUND A.",
    "YBAÑEZ, JASMIN P.",
];

export const SeniorHighList = [
    "ALABA, KARL RANIEL",
    "BANSAG, ROCHIL T.",
    "BARLUSCA, JUNRRY",
    "BASTIAN, KRISMIE H.",
    "DULATRE, MERYLL D.",
    "ESTRERA, VANESSA A.",
    "OMBLERO, SARAH JANE R.",
    "QUIBO, JANICE C.",
    "SANGILAN, DEITHER E.",
    "TASIC, ALMA DONNA L."
];

const Accounting = [
    "CUBIJANO, YVONY C.",
    "DOSOL, RESEL F.",
    "MALABAD, CHELSEE GWEN",
    "SARDIÑA, CATHERINE GRACE L.",
];

export const SALN = [
    {
        "Last Name": "Abaya",
        "First Name": "Elarde",
        "Middle Name": "E.",
        TIN: "909-594-038",
        Position: "Teacher I",
        "Net Worth": "1,835,148.00",
        "Name of Spouse/Employer/Address":
            "Marife E. Abaya/ DENR-Region XI/Davao City",
        "Joint Filing": "/",
    },
    {
        "Last Name": "Agudo",
        "First Name": "Erwin",
        "Middle Name": "P.",
        TIN: "466744677",
        Position: "Teacher I",
        "Net Worth": "378,724.00",
        "Name of Spouse/Employer/Address":
            "Trinidad B. Agudo/DEPED - Dujali National High School/BE Dujali, DDN",
        "Joint Filing": "/",
    },
    {
        "Last Name": "Alaba",
        "First Name": "Karl Rainer",
        "Middle Name": "M",
        TIN: "430072418",
        Position: "Teacher II",
        "Net Worth": "1,017,990.00",
        "Name of Spouse/Employer/Address": "",
        "Joint Filing": "/",
    },
    {
        "Last Name": "Ando",
        "First Name": "Annie Lourde Shyrrel",
        "Middle Name": "S.",
        TIN: "434545370",
        Position: "Teacher II",
        "Net Worth": "682,947.25",
        "Name of Spouse/Employer/Address": "",
        "Joint Filing": "/",
    },
    {
        "Last Name": "Balaba",
        "First Name": "Marisa",
        "Middle Name": "B.",
        TIN: "350365679",
        Position: "Teacher II",
        "Net Worth": "28,335.00",
        "Name of Spouse/Employer/Address": "",
        "Joint Filing": "",
    },
    {
        "Last Name": "Balagosa",
        "First Name": "Jeremie",
        "Middle Name": "F.",
        TIN: "269869946",
        Position: "Teacher II",
        "Net Worth": "131,247.07",
        "Name of Spouse/Employer/Address": "",
        "Joint Filing": "",
    },
    {
        "Last Name": "Bansag",
        "First Name": "Rochil",
        "Middle Name": "T.",
        TIN: "451800554",
        Position: "Teacher II",
        "Net Worth": "264,000.00",
        "Name of Spouse/Employer/Address":
            "Nelson A. Bansag/DepED-ALS Panabo/Panabo City",
        "Joint Filing": "",
    },
    {
        "Last Name": "Barbaton",
        "First Name": "Lucille",
        "Middle Name": "D.",
        TIN: "436706685",
        Position: "Teacher II",
        "Net Worth": "3,828.66",
        "Name of Spouse/Employer/Address": "",
        "Joint Filing": "",
    },
    {
        "Last Name": "Barlusca",
        "First Name": "Junrry",
        "Middle Name": "H.",
        TIN: "487999336",
        Position: "Teacher II",
        "Net Worth": "525,256.00",
        "Name of Spouse/Employer/Address": "",
        "Joint Filing": "/",
    },
    {
        "Last Name": "Bastian",
        "First Name": "Krismie",
        "Middle Name": "H.",
        TIN: "441070769",
        Position: "Teacher II",
        "Net Worth": "60,000.00",
        "Name of Spouse/Employer/Address": "",
        "Joint Filing": "",
    },
    {
        "Last Name": "Belgira",
        "First Name": "Rodourd",
        "Middle Name": "A.",
        TIN: "934815406",
        Position: "Teacher II",
        "Net Worth": "30,000.00",
        "Name of Spouse/Employer/Address": "",
        "Joint Filing": "",
    },
    {
        "Last Name": "Bohol",
        "First Name": "Gecel",
        "Middle Name": "N.",
        TIN: "423650908",
        Position: "Teacher II",
        "Net Worth": "447,598.92",
        "Name of Spouse/Employer/Address":
            "J.J O. Bohol/DepEd-Dalisay Sr. National High School",
        "Joint Filing": "",
    },
    {
        "Last Name": "Buligan",
        "First Name": "Christine Joy",
        "Middle Name": "B.",
        TIN: "454684135",
        Position: "Teacher I",
        "Net Worth": "137,600.00",
        "Name of Spouse/Employer/Address": "",
        "Joint Filing": "/",
    },
    {
        "Last Name": "Camacho",
        "First Name": "Lorie Jean",
        "Middle Name": "C.",
        TIN: "326824946",
        Position: "Teacher I",
        "Net Worth": "185,000.00",
        "Name of Spouse/Employer/Address": "",
        "Joint Filing": "/",
    },
    {
        "Last Name": "Canate",
        "First Name": "Johnrey",
        "Middle Name": "G.",
        TIN: "472743603",
        Position: "Teacher III",
        "Net Worth": "439,000.00",
        "Name of Spouse/Employer/Address": "",
        "Joint Filing": "",
    },
    {
        "Last Name": "Cañizares",
        "First Name": "Jemima",
        "Middle Name": "B.",
        TIN: "454436538",
        Position: "Teacher III",
        "Net Worth": "285,261.05",
        "Name of Spouse/Employer/Address": "",
        "Joint Filing": "",
    },
];

export const IPCR = [
    {
        name: "AGUDO, ERWIN P.",
        position: "Teacher II",
        rate: 4.766,
        equivalent: "Outstanding",
    },
    {
        name: "ABAYA, ELARDE H.",
        position: "Teacher I",
        rate: 4.662,
        equivalent: "Outstanding",
    },
    {
        name: "ALABA, KARL RAINIER M.",
        position: "Teacher II",
        rate: 4.665,
        equivalent: "Outstanding",
    },
    {
        name: "ANDO, ANNIE LOURDE SHYRREL S.",
        position: "Teacher II",
        rate: null,
        equivalent: "",
    },
    {
        name: "BALABA, MARISA B.",
        position: "Teacher I",
        rate: null,
        equivalent: "Very Satisfactory",
    },
    {
        name: "BALAGOSA, JEREMIE F.",
        position: "Master Teacher I",
        rate: 4.595,
        equivalent: "Outstanding",
    },
    {
        name: "BANSAG, ROCHIL T.",
        position: "Teacher II",
        rate: 4.731,
        equivalent: "Outstanding",
    },
    {
        name: "BARBATON, LUCILLE G.",
        position: "Teacher II",
        rate: 4.63,
        equivalent: "Outstanding",
    },
    {
        name: "BARLUSCA, JUNRRY H.",
        position: "Teacher I",
        rate: 4.408,
        equivalent: "Very Satisfactory",
    },
    {
        name: "BASTIAN, KRISMIE H.",
        position: "Teacher II",
        rate: 4.735,
        equivalent: "Outstanding",
    },
    {
        name: "BELGIRA, RODUARD A.",
        position: "Teacher II",
        rate: 4.859,
        equivalent: "Outstanding",
    },
    {
        name: "BOHOL, GECEL N.",
        position: "Teacher I",
        rate: 4.72,
        equivalent: "Outstanding",
    },
    {
        name: "BULIGAN, CHRISTINE JOY B.",
        position: "Master Teacher I",
        rate: 4.696,
        equivalent: "Outstanding",
    },
    {
        name: "CABRERA, LORIE JEAN",
        position: "Teacher I",
        rate: null,
        equivalent: "",
    },
    {
        name: "CANATE, JOHNREY G.",
        position: "Teacher I",
        rate: null,
        equivalent: "",
    },
    {
        name: "CAÑIZARES, JEMIMA B.",
        position: "Teacher II",
        rate: null,
        equivalent: "",
    },
    {
        name: "CASTAÑEROS, SHARMANE",
        position: "Teacher I",
        rate: null,
        equivalent: "",
    },
    {
        name: "CUBIJANO, YVONY C.",
        position: "ADAS III",
        rate: null,
        equivalent: "",
    },
    {
        name: "DACALUS, CARMELA MIA P.",
        position: "Teacher III",
        rate: 4.638,
        equivalent: "Outstanding",
    },
    {
        name: "DAQUIO, APPLE JEAN",
        position: "Teacher I",
        rate: 4.525,
        equivalent: "Outstanding",
    },
    {
        name: "DIGAO, YENSEN P.",
        position: "Teacher II",
        rate: 4.529,
        equivalent: "Outstanding",
    },
    {
        name: "DELEGADO, HERMAINE L.",
        position: "Teacher I",
        rate: null,
        equivalent: "",
    },
    {
        name: "DOSOL, SEDRICK M.",
        position: "Teacher I",
        rate: null,
        equivalent: "",
    },
    {
        name: "DULATRE, MERYLL D.",
        position: "Teacher II",
        rate: 4.669,
        equivalent: "Outstanding",
    },
    {
        name: "DUMAS, ANA MARIE",
        position: "Teacher I",
        rate: null,
        equivalent: "",
    },
    {
        name: "DUMBASE, LOUELA M.",
        position: "Teacher II",
        rate: 4.618,
        equivalent: "Outstanding",
    },
    {
        name: "EMBALSADO, ANGELICA C.",
        position: "Teacher II",
        rate: null,
        equivalent: "",
    },
    {
        name: "ESTRERA, VANESSA A.",
        position: "Teacher I",
        rate: 4.4,
        equivalent: "Very Satisfactory",
    },
    {
        name: "GEMENTIZA, DANICA",
        position: "Teacher I",
        rate: 4.035,
        equivalent: "Very Satisfactory",
    },
    {
        name: "JACINTO, DIANNE H.",
        position: "Teacher I",
        rate: 4.696,
        equivalent: "Outstanding",
    },
    {
        name: "JOSOL , SWEETZEL M.",
        position: "Teacher I",
        rate: null,
        equivalent: "",
    },
    {
        name: "LABOS, RUBY P.",
        position: "Teacher II",
        rate: null,
        equivalent: "",
    },
    {
        name: "LEGARA, JENNIFER T.",
        position: "Teacher I",
        rate: null,
        equivalent: "",
    },
    {
        name: "LOPEZ, FLORAMIE D.",
        position: "Master Teacher I",
        rate: 4.77,
        equivalent: "Outstanding",
    },
    {
        name: "MARTIN, BEHNJO S.",
        position: "Teacher I",
        rate: null,
        equivalent: "",
    },
    {
        name: "MARTIN, JANIVIC B.",
        position: "Teacher III",
        rate: 4.7,
        equivalent: "Outstanding",
    },
    {
        name: "MORALES, DAVIE ROSE",
        position: "Teacher II",
        rate: 4.595,
        equivalent: "Outstanding",
    },
    {
        name: "NAVARES, JAYVENT",
        position: "Teacher II",
        rate: 4.595,
        equivalent: "Outstanding",
    },
    {
        name: "OLMILLO, ANNABELLE S.",
        position: "Teacher I",
        rate: null,
        equivalent: "",
    },
    {
        name: "OMBLERO, SARAH JANE R.",
        position: "Teacher III",
        rate: 4.759,
        equivalent: "Outstanding",
    },
    {
        name: "PALMA, MARY JOY C.",
        position: "Teacher II",
        rate: 4.595,
        equivalent: "Outstanding",
    },
    {
        name: "PAMA, JOANALLE P.",
        position: "Teacher III",
        rate: 4.787,
        equivalent: "Outstanding",
    },
    {
        name: "PASAGUI, MIA KRIS ZHEL M.",
        position: "Teacher I",
        rate: 4.63,
        equivalent: "Outstanding",
    },
    {
        name: "PEÑANO, JERAVEN D.",
        position: "Teacher I",
        rate: 4.731,
        equivalent: "Outstanding",
    },
    {
        name: "PILOTO, ESTELA G.",
        position: "Teacher II",
        rate: 4.626,
        equivalent: "Outstanding",
    },
    {
        name: "QUEMA, ROMMEL B.",
        position: "Teacher II",
        rate: 4.561,
        equivalent: "Outstanding",
    },
    {
        name: "QUIBO, JANICE C.",
        position: "Teacher II",
        rate: 4.693,
        equivalent: "Outstanding",
    },
    {
        name: "RABACA, GIE AR C.",
        position: "Teacher I",
        rate: null,
        equivalent: "",
    },
    {
        name: "RELAMPAGOS, JANICE MAY E.",
        position: "Teacher II",
        rate: 4.682,
        equivalent: "Outstanding",
    },
    {
        name: "ROMEO, NOEL M.",
        position: "Teacher III",
        rate: 4.309,
        equivalent: "Very Satisfactory",
    },
    {
        name: "SANGILAN, DIETHER E.",
        position: "Teacher II",
        rate: 4.443,
        equivalent: "Very Satisfactory",
    },
    {
        name: "SINDA, LP SHEENA S.",
        position: "Teacher III",
        rate: 4.79,
        equivalent: "Outstanding",
    },
    {
        name: "SUAN, CRISEL D.",
        position: "Teacher I",
        rate: null,
        equivalent: "",
    },
    {
        name: "SUMAGAYSAY, AIRES JANE D.",
        position: "Teacher I",
        rate: 4.752,
        equivalent: "Outstanding",
    },
    {
        name: "TABLATE, FRANPERL L.",
        position: "Teacher II",
        rate: 4.673,
        equivalent: "Outstanding",
    },
    {
        name: "TAGPUNO, ANNE CLARENCE B.",
        position: "Teacher I",
        rate: 4.029,
        equivalent: "Very Satisfactory",
    },
    {
        name: "TASIC, ALMA DONNA L.",
        position: "Teacher II",
        rate: 4.755,
        equivalent: "Outstanding",
    },
    {
        name: "TINASAS, BELEN R.",
        position: "Teacher II",
        rate: null,
        equivalent: "",
    },
    {
        name: "TUBAC, APRIL JOEY A.",
        position: "Teacher I",
        rate: 4.731,
        equivalent: "Outstanding",
    },
    {
        name: "TUBOSO, CRISTINE G.",
        position: "Teacher I",
        rate: 4.511,
        equivalent: "Outstanding",
    },
    {
        name: "VERTUDES, REYMUND A.",
        position: "Teacher II",
        rate: 4.501,
        equivalent: "Outstanding",
    },
    {
        name: "YBAÑEZ, JASMIN P.",
        position: "Teacher I",
        rate: null,
        equivalent: "",
    },
    {
        name: "DOSOL, RESEL F.",
        position: "ADAS II",
        rate: 4.783,
        equivalent: "Outstanding",
    },
    {
        name: "MALABAD, CHELSEE GWEN D.",
        position: "ADAS II",
        rate: 4.583,
        equivalent: "Outstanding",
    },
];
