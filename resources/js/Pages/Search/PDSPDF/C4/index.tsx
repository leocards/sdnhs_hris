import { cn } from "@/lib/utils";
import React, { useEffect, useState } from "react";
import { TextCenter } from "..";
import { useIsDownloadChecker } from "../context";

type QuestionsType = Array<{
    question: string;
    choices: boolean;
    sets: string;
    details: string;
    case_status: string;
    date_filed: string;
}>

type ReferencesType = Array<{
    name: string;
    address: string;
    telephone: string;
}>

type GovernmentIdType = {
    government_id: string;
    id_number: string;
    issued: string;
}

type Props = {
    questions: QuestionsType,
    reference: ReferencesType,
    government: GovernmentIdType
}

const defaultReference = {
    name: '',
    address: '',
    telephone: ''
}

const C4pdf: React.FC<Props> = ({ questions, reference, government }) => {
    const { checkIfDownLoad } = useIsDownloadChecker();
    const [references, setReferences] = useState<ReferencesType>(Array.from({length:3}).map(() => defaultReference))

    useEffect(() => {
        if(reference) {
            setReferences([...reference, ...Array.from({length:(3 - reference.length)}).map(() => defaultReference)])
        }
    }, [reference])

    return (
        <div className="">
            <div className="bg-[#eaeaea] pt-px border-b-[2.5px] border-black"></div>
            <div className="divide-y-2 divide-black border-b-[3px] border-black">
                <div className="grid grid-cols-[1fr,21rem] text-[10pt] divide-x-2 divide-black">
                    <div className="h-[8rem] flex bg-[#eaeaea]">
                        <div
                            className={cn(
                                "pl-2 mr-3",
                                checkIfDownLoad("-mt-3")
                            )}
                        >
                            34.
                        </div>
                        <div>
                            <div
                                className={cn(
                                    "leading-4",
                                    checkIfDownLoad("-mt-1.5")
                                )}
                            >
                                Are you related by consanguinity or affinity to
                                the appointing or recommending authority, or to
                                the chief of bureau or office or to the person
                                who has immediate supervision over you in the
                                Office, Bureau or Department where you will be
                                apppointed,
                            </div>
                            <div>a. within the third degree?</div>
                            <div>
                                b. within the fourth degree (for Local
                                Government Unit - Career Employees)?
                            </div>
                        </div>
                    </div>

                    <div className="pl-4">
                        <div
                            className={cn(
                                "flex gap-12 ",
                                checkIfDownLoad("mt-[3.3rem]", "mt-[3.2rem]")
                            )}
                        >
                            <div className="flex items-center gap-2">
                                <div className="border-2 border-black size-[11px]">
                                    <div className={cn('font-bold text-[6pt] leading-[10px] px-px', checkIfDownLoad('-mt-1'))}>
                                        {(questions && questions[0].choices == true) && (<span>&#x2714;</span>)}
                                    </div>
                                </div>
                                <div
                                    className={cn(
                                        "text-[7.5pt]",
                                        checkIfDownLoad("-mt-2")
                                    )}
                                >
                                    YES
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="border-2 border-black size-[11px]">
                                    <div className={cn('font-bold text-[6pt] leading-[10px] px-px', checkIfDownLoad('-mt-1'))}>
                                        {(questions && questions[0].choices == false) && (<span>&#x2714;</span>)}
                                    </div>
                                </div>
                                <div
                                    className={cn(
                                        "text-[7.5pt]",
                                        checkIfDownLoad("-mt-2")
                                    )}
                                >
                                    NO
                                </div>
                            </div>
                        </div>
                        <div
                            className={cn(
                                "flex gap-12 ",
                                checkIfDownLoad("mt-3", "mt-2")
                            )}
                        >
                            <div className="flex items-center gap-2">
                                <div className="border-2 border-black size-[11px]">
                                    <div className={cn('font-bold text-[6pt] leading-[7px] px-px', checkIfDownLoad('-mt-1'))}>
                                        {(questions && questions[1].choices == true) && (<span>&#x2714;</span>)}
                                    </div>
                                </div>
                                <div
                                    className={cn(
                                        "text-[7.5pt]",
                                        checkIfDownLoad("-mt-2")
                                    )}
                                >
                                    YES
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="border-2 border-black size-[11px]">
                                    <div className={cn('font-bold text-[6pt] leading-[7px] px-px', checkIfDownLoad('-mt-1'))}>
                                        {(questions && questions[1].choices == false) && (<span>&#x2714;</span>)}
                                    </div>
                                </div>
                                <div
                                    className={cn(
                                        "text-[7.5pt]",
                                        checkIfDownLoad("-mt-2")
                                    )}
                                >
                                    NO
                                </div>
                            </div>
                        </div>

                        <div className="text-[9pt]">If YES, give details:</div>
                        <TextCenter
                            className={cn(
                                "border-b-2 border-black w-[17.5rem] ml-3 !justify-start",
                                checkIfDownLoad("h-[20px]", "h-[17px]")
                            )}
                        >
                            <div className={cn('', checkIfDownLoad('-mt-2.5'))}>{questions && questions[1].details}</div>
                        </TextCenter>
                    </div>
                </div>
                <div className="grid grid-cols-[1fr,21rem] text-[10pt] divide-x-2 divide-black">
                    <div className="h-[9.2rem] flex bg-[#eaeaea]">
                        <div
                            className={cn(
                                "pl-2 mr-3",
                                checkIfDownLoad("-mt-2")
                            )}
                        >
                            35.
                        </div>
                        <div
                            className={cn(
                                "space-y-14",
                                checkIfDownLoad("-mt-1.5")
                            )}
                        >
                            <div className="leading-4">
                                a. Have you ever been found guilty of any
                                administrative offense?
                            </div>
                            <div>
                                b. Have you been criminally charged before any
                                court?
                            </div>
                        </div>
                    </div>

                    <div className="divide-y-2 divide-black">
                        {/* 35 a */}
                        <div className="pl-4 mb-1">
                            <div className="flex gap-12 mt-1">
                                <div className="flex items-center gap-2">
                                    <div className="border-2 border-black size-[11px]">
                                        <div className={cn('font-bold text-[6pt] leading-[10px] px-px', checkIfDownLoad('-mt-1'))}>
                                            {(questions && questions[2].choices == true) && (<span>&#x2714;</span>)}
                                        </div>
                                    </div>
                                    <div
                                        className={cn(
                                            "text-[7.5pt]",
                                            checkIfDownLoad("-mt-2")
                                        )}
                                    >
                                        YES
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="border-2 border-black size-[11px]">
                                        <div className={cn('font-bold text-[6pt] leading-[10px] px-px', checkIfDownLoad('-mt-1'))}>
                                            {(questions && questions[2].choices == false) && (<span>&#x2714;</span>)}
                                        </div>
                                    </div>
                                    <div
                                        className={cn(
                                            "text-[7.5pt]",
                                            checkIfDownLoad("-mt-2")
                                        )}
                                    >
                                        NO
                                    </div>
                                </div>
                            </div>

                            <div className="text-[9pt]">
                                If YES, give details:
                            </div>
                            <TextCenter className="border-b-2 border-black w-[17.5rem] ml-3 !justify-start h-[24px]">
                                <div className={cn('', checkIfDownLoad('-mt-2.5'))}>{questions && questions[2].details}</div>
                            </TextCenter>
                        </div>
                        {/* 35 b */}
                        <div className="pl-4">
                            <div className="flex gap-12 mt-2">
                                <div className="flex items-center gap-2">
                                    <div className="border-2 border-black size-[11px]">
                                        <div className={cn('font-bold text-[6pt] leading-[8px] px-px', checkIfDownLoad('-mt-1'))}>
                                            {(questions && questions[3].choices == true) && (<span>&#x2714;</span>)}
                                        </div>
                                    </div>
                                    <div
                                        className={cn(
                                            "text-[7.5pt]",
                                            checkIfDownLoad("-mt-2")
                                        )}
                                    >
                                        YES
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="border-2 border-black size-[11px]">
                                        <div className={cn('font-bold text-[6pt] leading-[8px] px-px', checkIfDownLoad('-mt-1'))}>
                                            {(questions && questions[3].choices == false) && (<span>&#x2714;</span>)}
                                        </div>
                                    </div>
                                    <div
                                        className={cn(
                                            "text-[7.5pt]",
                                            checkIfDownLoad("-mt-2")
                                        )}
                                    >
                                        NO
                                    </div>
                                </div>
                            </div>

                            <div className="text-[9pt]">
                                If YES, give details:
                            </div>
                            <div className="flex pr-2.5">
                                <div className="text-[9pt] shrink-0 w-20 text-right">
                                    Date Filed:
                                </div>
                                <TextCenter
                                    className={cn(
                                        "border-b-2 border-black grow ml-3 !justify-start",
                                        checkIfDownLoad("h-[20px]", "h-[17px]")
                                    )}
                                >
                                    <div className={cn('', checkIfDownLoad('-mt-2.5'))}>{questions && questions[3].date_filed}</div>
                                </TextCenter>
                            </div>
                            <div className="flex pr-2.5">
                                <div className="text-[9pt] shrink-0 w-20 text-right">
                                    Status of Case/s:
                                </div>
                                <TextCenter
                                    className={cn(
                                        "border-b-2 border-black grow ml-3 !justify-start",
                                        checkIfDownLoad("h-[20px]", "h-[17px]")
                                    )}
                                >
                                    <div className={cn('', checkIfDownLoad('-mt-2.5'))}>{questions && questions[3].case_status}</div>
                                </TextCenter>
                            </div>
                        </div>
                    </div>
                </div>
                {/* 36 */}
                <div className="grid grid-cols-[1fr,21rem] text-[10pt] divide-x-2 divide-black">
                    <div className="h-[4rem] flex bg-[#eaeaea]">
                        <div
                            className={cn(
                                "pl-2 mr-3",
                                checkIfDownLoad("-mt-2")
                            )}
                        >
                            36.
                        </div>
                        <div className="">
                            <div
                                className={cn(
                                    "leading-4",
                                    checkIfDownLoad("-mt-2")
                                )}
                            >
                                Have you ever been convicted of any crime or
                                violation of any law, decree, ordinance or
                                regulation by any court or tribunal?
                            </div>
                        </div>
                    </div>

                    <div className="pl-4">
                        <div className="flex gap-12 mt-2">
                            <div className="flex items-center gap-2">
                                <div className="border-2 border-black size-[11px]">
                                    <div className={cn('font-bold text-[6pt] leading-[8px] px-px', checkIfDownLoad('-mt-1'))}>
                                        {(questions && questions[4].choices == true) && (<span>&#x2714;</span>)}
                                    </div>
                                </div>
                                <div
                                    className={cn(
                                        "text-[7.5pt]",
                                        checkIfDownLoad("-mt-2.5")
                                    )}
                                >
                                    YES
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="border-2 border-black size-[11px]">
                                    <div className={cn('font-bold text-[6pt] leading-[8px] px-px', checkIfDownLoad('-mt-1'))}>
                                        {(questions && questions[4].choices == false) && (<span>&#x2714;</span>)}
                                    </div>
                                </div>
                                <div
                                    className={cn(
                                        "text-[7.5pt]",
                                        checkIfDownLoad("-mt-2.5")
                                    )}
                                >
                                    NO
                                </div>
                            </div>
                        </div>

                        <div
                            className={cn(
                                "text-[9pt]",
                                checkIfDownLoad("-mt-1")
                            )}
                        >
                            If YES, give details:
                        </div>
                        <TextCenter
                            className={cn(
                                "border-b-2 border-black w-[17.5rem] ml-3 !justify-start",
                                checkIfDownLoad("h-[22px]", "h-[20px]")
                            )}
                        >
                            <div className={cn('', checkIfDownLoad('-mt-2.5'))}>{questions && questions[4].details}</div>
                        </TextCenter>
                    </div>
                </div>
                {/* 37 */}
                <div className="grid grid-cols-[1fr,21rem] text-[10pt] divide-x-2 divide-black">
                    <div className="h-[3.5rem] flex bg-[#eaeaea]">
                        <div
                            className={cn(
                                "pl-2 mr-3",
                                checkIfDownLoad("-mt-2")
                            )}
                        >
                            37.
                        </div>
                        <div className="">
                            <div
                                className={cn(
                                    "leading-4",
                                    checkIfDownLoad("-mt-2")
                                )}
                            >
                                Have you ever been separated from the service in
                                any of the following modes: resignation,
                                retirement, dropped from the rolls, dismissal,
                                termination, end of term, finished contract or
                                phased out (abolition) in the public or private
                                sector?
                            </div>
                        </div>
                    </div>

                    <div className="pl-4">
                        <div
                            className={cn(
                                "flex gap-12",
                                checkIfDownLoad("mt-1")
                            )}
                        >
                            <div className="flex items-center gap-2">
                                <div className="border-2 border-black size-[11px]">
                                    <div className={cn('font-bold text-[6pt] leading-[8px] px-px', checkIfDownLoad('-mt-1'))}>
                                        {(questions && questions[5].choices == true) && (<span>&#x2714;</span>)}
                                    </div>
                                </div>
                                <div
                                    className={cn(
                                        "text-[7.5pt]",
                                        checkIfDownLoad("-mt-3")
                                    )}
                                >
                                    YES
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="border-2 border-black size-[11px]">
                                    <div className={cn('font-bold text-[6pt] leading-[8px] px-px', checkIfDownLoad('-mt-1'))}>
                                        {(questions && questions[5].choices == false) && (<span>&#x2714;</span>)}
                                    </div>
                                </div>
                                <div
                                    className={cn(
                                        "text-[7.5pt]",
                                        checkIfDownLoad("-mt-3")
                                    )}
                                >
                                    NO
                                </div>
                            </div>
                        </div>

                        <div
                            className={cn(
                                "text-[9pt]",
                                checkIfDownLoad("-mt-1.5")
                            )}
                        >
                            If YES, give details:
                        </div>
                        <TextCenter
                            className={cn(
                                "border-b-2 border-black w-[17.5rem] ml-3 !justify-start",
                                checkIfDownLoad("h-[23px]", "h-[20px]")
                            )}
                        >
                            <div className={cn('', checkIfDownLoad('-mt-2.5'))}>{questions && questions[5].details}</div>
                        </TextCenter>
                    </div>
                </div>
                {/* 38 */}
                <div className="grid grid-cols-[1fr,21rem] text-[10pt] divide-x-2 divide-black">
                    <div className="h-[5.3rem] flex bg-[#eaeaea]">
                        <div
                            className={cn(
                                "pl-2 mr-3",
                                checkIfDownLoad("-mt-1.5")
                            )}
                        >
                            38.
                        </div>
                        <div
                            className={cn(
                                "space-y-3",
                                checkIfDownLoad("-mt-1.5")
                            )}
                        >
                            <div className="leading-4">
                                a. Have you ever been a candidate in a national
                                or local election held within the last year
                                (except Barangay election)?
                            </div>
                            <div className="leading-4">
                                b. Have you resigned from the government service
                                during the three (3)-month period before the
                                last election to promote/actively campaign for a
                                national or local candidate?
                            </div>
                        </div>
                    </div>

                    <div className="pl-4">
                        {/* 38 a */}
                        <div
                            className={cn(
                                "flex gap-12",
                                checkIfDownLoad("mt-2", "mt-1")
                            )}
                        >
                            <div className="flex items-center gap-2">
                                <div className="border-2 border-black size-[11px]">
                                    <div className={cn('font-bold text-[6pt] leading-[8px] px-px', checkIfDownLoad('-mt-1'))}>
                                        {(questions && questions[6].choices == true) && (<span>&#x2714;</span>)}
                                    </div>
                                </div>
                                <div
                                    className={cn(
                                        "text-[7.5pt]",
                                        checkIfDownLoad("-mt-3")
                                    )}
                                >
                                    YES
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="border-2 border-black size-[11px]">
                                    <div className={cn('font-bold text-[6pt] leading-[8px] px-px', checkIfDownLoad('-mt-1'))}>
                                        {(questions && questions[7].choices == false) && (<span>&#x2714;</span>)}
                                    </div>
                                </div>
                                <div
                                    className={cn(
                                        "text-[7.5pt]",
                                        checkIfDownLoad("-mt-3")
                                    )}
                                >
                                    NO
                                </div>
                            </div>
                        </div>

                        <div
                            className={cn(
                                "flex pr-2.5",
                                checkIfDownLoad("-mt-px", "mb-2")
                            )}
                        >
                            <div className="text-[9pt] shrink-0">
                                If YES, give details:
                            </div>
                            <TextCenter className="border-b-2 border-black w-[17.5rem] ml-3 h-[20px] !justify-start">
                                <div className={cn('', checkIfDownLoad('-mt-2.5'))}>{questions && questions[6].details}</div>
                            </TextCenter>
                        </div>

                        {/* 38 b */}

                        <div
                            className={cn(
                                "flex gap-12",
                                checkIfDownLoad("mt-2")
                            )}
                        >
                            <div className="flex items-center gap-2">
                                <div className="border-2 border-black size-[11px]">
                                    <div className={cn('font-bold text-[6pt] leading-[8px] px-px', checkIfDownLoad('-mt-1'))}>
                                        {(questions && questions[7].choices == true) && (<span>&#x2714;</span>)}
                                    </div>
                                </div>
                                <div className="text-[7pt]">YES</div>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="border-2 border-black size-[11px]">
                                    <div className={cn('font-bold text-[6pt] leading-[8px] px-px', checkIfDownLoad('-mt-1'))}>
                                        {(questions && questions[7].choices == false) && (<span>&#x2714;</span>)}
                                    </div>
                                </div>
                                <div className="text-[7pt]">NO</div>
                            </div>
                        </div>

                        <div className="flex pr-2.5">
                            <div className="text-[9pt] shrink-0">
                                If YES, give details:
                            </div>
                            <TextCenter className="border-b-2 border-black w-[17.5rem] ml-3 h-[20px] !justify-start">
                                <div className={cn('', checkIfDownLoad('-mt-2.5'))}>{questions && questions[7].details}</div>
                            </TextCenter>
                        </div>
                    </div>
                </div>
                {/* 39 */}
                <div className="grid grid-cols-[1fr,21rem] text-[10pt] divide-x-2 divide-black">
                    <div className="h-[3.7rem] flex bg-[#eaeaea]">
                        <div
                            className={cn(
                                "pl-2 mr-3",
                                checkIfDownLoad("-mt-2")
                            )}
                        >
                            39.
                        </div>
                        <div className="">
                            <div
                                className={cn(
                                    "leading-4",
                                    checkIfDownLoad("-mt-1.5")
                                )}
                            >
                                Have you acquired the status of an immigrant or
                                permanent resident of another country?
                            </div>
                        </div>
                    </div>

                    <div className="pl-4 pt-1.5">
                        <div className="flex gap-12">
                            <div className="flex items-center gap-2">
                                <div className="border-2 border-black size-[11px]">
                                    <div className={cn('font-bold text-[6pt] leading-[8px] px-px', checkIfDownLoad('-mt-1'))}>
                                        {(questions && questions[8].choices == true) && (<span>&#x2714;</span>)}
                                    </div>
                                </div>
                                <div
                                    className={cn(
                                        "text-[7.5pt]",
                                        checkIfDownLoad("-mt-3")
                                    )}
                                >
                                    YES
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="border-2 border-black size-[11px]">
                                    <div className={cn('font-bold text-[6pt] leading-[8px] px-px', checkIfDownLoad('-mt-1'))}>
                                        {(questions && questions[8].choices == false) && (<span>&#x2714;</span>)}
                                    </div>
                                </div>
                                <div
                                    className={cn(
                                        "text-[7.5pt]",
                                        checkIfDownLoad("-mt-3")
                                    )}
                                >
                                    NO
                                </div>
                            </div>
                        </div>

                        <div className="text-[9pt]">
                            If YES, give details (country):
                        </div>
                        <TextCenter
                            className={cn(
                                "border-b-2 border-black w-[17.5rem] ml-3 !justify-start",
                                checkIfDownLoad("h-[22px]", "h-[17px]")
                            )}
                        >
                            <div className={cn('', checkIfDownLoad('-mt-2.5'))}>{questions && questions[8].details}</div>
                        </TextCenter>
                    </div>
                </div>
                <div className="grid grid-cols-[1fr,21rem] text-[10pt] divide-x-2 divide-black">
                    <div className={"h-[9.3rem] flex bg-[#eaeaea]"}>
                        <div>
                            <div
                                className={cn(
                                    "pl-2 mr-3",
                                    checkIfDownLoad("-mt-2.5")
                                )}
                            >
                                40.
                            </div>
                            <div className={cn("pt-2.5 mr-3")}>a.</div>
                            <div className={cn("pt-5 mr-3")}>b.</div>
                            <div className={cn("pt-5 mr-3")}>c.</div>
                        </div>
                        <div className="">
                            <div
                                className={cn(
                                    "leading-4",
                                    checkIfDownLoad("-mt-2")
                                )}
                            >
                                Pursuant to: (a) Indigenous People's Act (RA
                                8371); (b) Magna Carta for Disabled Persons (RA
                                7277); and (c) Solo Parents Welfare Act of 2000
                                (RA 8972), please answer the following items:
                                <br />
                                Are you a member of any indigenous group?
                            </div>
                            <div className="leading-4 pt-6">
                                Are you a person with disability?
                            </div>
                            <div className="leading-4 pt-6">
                                Are you a solo parent?
                            </div>
                        </div>
                    </div>

                    <div className={cn(checkIfDownLoad("pt-9", "pt-10"))}>
                        {/* 40 a */}
                        <div className="flex gap-12 pl-4">
                            <div className="flex items-center gap-2">
                                <div className="border-2 border-black size-[11px]">
                                    <div className={cn('font-bold text-[6pt] leading-[8px] px-px', checkIfDownLoad('-mt-1'))}>
                                        {(questions && questions[9].choices == true) && (<span>&#x2714;</span>)}
                                    </div>
                                </div>
                                <div
                                    className={cn(
                                        "text-[7.5pt]",
                                        checkIfDownLoad("-mt-3")
                                    )}
                                >
                                    YES
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="border-2 border-black size-[11px]">
                                    <div className={cn('font-bold text-[6pt] leading-[8px] px-px', checkIfDownLoad('-mt-1'))}>
                                        {(questions && questions[9].choices == false) && (<span>&#x2714;</span>)}
                                    </div>
                                </div>
                                <div
                                    className={cn(
                                        "text-[7.5pt]",
                                        checkIfDownLoad("-mt-3")
                                    )}
                                >
                                    NO
                                </div>
                            </div>
                        </div>

                        <div className="flex pr-2.5">
                            <div
                                className={cn(
                                    "text-[9pt] w-32 shrink-0",
                                    checkIfDownLoad("-mt-2")
                                )}
                            >
                                If YES, please specify:
                            </div>
                            <TextCenter className="border-b-2 border-black w-[17.5rem] ml-3 h-[20px] !justify-start">
                                <div className={cn('', checkIfDownLoad('-mt-2.5'))}>{questions && questions[9].details}</div>
                            </TextCenter>
                        </div>

                        <div
                            className={cn(
                                "flex gap-12 pl-4",
                                checkIfDownLoad("mt-2")
                            )}
                        >
                            <div className="flex items-center gap-2">
                                <div className="border-2 border-black size-[11px]">
                                    <div className={cn('font-bold text-[6pt] leading-[8px] px-px', checkIfDownLoad('-mt-1'))}>
                                        {(questions && questions[10].choices == true) && (<span>&#x2714;</span>)}
                                    </div>
                                </div>
                                <div
                                    className={cn(
                                        "text-[7.5pt]",
                                        checkIfDownLoad("-mt-3")
                                    )}
                                >
                                    YES
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="border-2 border-black size-[11px]">
                                    <div className={cn('font-bold text-[6pt] leading-[8px] px-px', checkIfDownLoad('-mt-1'))}>
                                        {(questions && questions[10].choices == false) && (<span>&#x2714;</span>)}
                                    </div>
                                </div>
                                <div
                                    className={cn(
                                        "text-[7.5pt]",
                                        checkIfDownLoad("-mt-3")
                                    )}
                                >
                                    NO
                                </div>
                            </div>
                        </div>

                        <div className={cn("flex pr-2.5")}>
                            <div
                                className={cn(
                                    "text-[9pt] w-32 shrink-0",
                                    checkIfDownLoad("-mt-2")
                                )}
                            >
                                If YES, please specify ID No:
                            </div>
                            <TextCenter className="border-b-2 border-black w-[17.5rem] ml-3 h-[20px] !justify-start">
                                <div className={cn('', checkIfDownLoad('-mt-2.5'))}>{questions && questions[10].details}</div>
                            </TextCenter>
                        </div>

                        <div
                            className={cn(
                                "flex gap-12 pl-4",
                                checkIfDownLoad("mt-2")
                            )}
                        >
                            <div className="flex items-center gap-2">
                                <div className="border-2 border-black size-[11px]">
                                    <div className={cn('font-bold text-[6pt] leading-[8px] px-px', checkIfDownLoad('-mt-1'))}>
                                        {(questions && questions[11].choices == true) && (<span>&#x2714;</span>)}
                                    </div>
                                </div>
                                <div
                                    className={cn(
                                        "text-[7.5pt]",
                                        checkIfDownLoad("-mt-3")
                                    )}
                                >
                                    YES
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="border-2 border-black size-[11px]">
                                    <div className={cn('font-bold text-[6pt] leading-[8px] px-px', checkIfDownLoad('-mt-1'))}>
                                        {(questions && questions[11].choices == false) && (<span>&#x2714;</span>)}
                                    </div>
                                </div>
                                <div
                                    className={cn(
                                        "text-[7.5pt]",
                                        checkIfDownLoad("-mt-3")
                                    )}
                                >
                                    NO
                                </div>
                            </div>
                        </div>

                        <div className={cn("flex pr-2.5")}>
                            <div
                                className={cn(
                                    "text-[9pt] w-32 shrink-0",
                                    checkIfDownLoad("-mt-2")
                                )}
                            >
                                If YES, please specify ID No:
                            </div>
                            <TextCenter className="border-b-2 border-black w-[17.5rem] ml-3 h-[20px] !justify-start">
                                <div className={cn('', checkIfDownLoad('-mt-2.5'))}>{questions && questions[11].details}</div>
                            </TextCenter>
                        </div>
                    </div>
                </div>
            </div>

            <div className="border-b-[3px] border-black grid grid-cols-[38.3rem,1fr]">
                <div className="">
                    <div className="border-r-[3px] border-black">
                        <div className="border-b-[3px] border-black">
                            <TextCenter className="bg-[#eaeaea] h-[23px] !justify-start text-[7pt] gap-4 px-2">
                                <div className={cn(checkIfDownLoad("-mt-3"))}>
                                    41.
                                </div>
                                <div className={cn(checkIfDownLoad("-mt-3"))}>
                                    REFERENCES{" "}
                                    <span className="text-red-500 text-[ 6pt]">
                                        (Person not related by consanguinity or
                                        affinity to applicant /appointee)
                                    </span>
                                </div>
                            </TextCenter>
                        </div>
                        <div className="bg-[#eaeaea] border-b-2 border-black grid grid-cols-[18rem,13.7rem,1fr] divide-x-2 divide-black h-[20px] text-[7pt]">
                            <TextCenter>
                                <div className={cn(checkIfDownLoad("-mt-3"))}>
                                    NAME
                                </div>
                            </TextCenter>
                            <TextCenter>
                                <div className={cn(checkIfDownLoad("-mt-3"))}>
                                    ADDRESS
                                </div>
                            </TextCenter>
                            <TextCenter className="">
                                <div className={cn(checkIfDownLoad("-mt-3"))}>
                                    TEL NO.
                                </div>
                            </TextCenter>
                        </div>

                        <div className="divide-y-2 divide-black">
                            {references.map((refer, index) => (
                                <div key={index} className="grid grid-cols-[18rem,13.7rem,1fr] divide-x-2 divide-black h-[25px] text-[7pt]">
                                    <TextCenter className="font-bold">
                                        <div
                                            className={cn(
                                                checkIfDownLoad("-mt-3")
                                            )}
                                        >
                                            {refer.name}
                                        </div>
                                    </TextCenter>
                                    <TextCenter className="font-bold">
                                        <div
                                            className={cn(
                                                checkIfDownLoad("-mt-3")
                                            )}
                                        >
                                            {refer.address}
                                        </div>
                                    </TextCenter>
                                    <TextCenter className="font-bold">
                                        <div
                                            className={cn(
                                                checkIfDownLoad("-mt-3")
                                            )}
                                        >
                                            {refer.telephone}
                                        </div>
                                    </TextCenter>
                                </div>
                            ))}
                        </div>

                        <div className="border-y-[3px] border-black bg-[#eaeaea] pb-1 h-[108.8px]">
                            <div className="flex text-[10pt] gap-4 pr-4">
                                <div
                                    className={cn(
                                        "pl-2",
                                        checkIfDownLoad("-mt-2")
                                    )}
                                >
                                    42.
                                </div>
                                <div
                                    className={cn(
                                        "text-justify",
                                        checkIfDownLoad("-mt-2")
                                    )}
                                >
                                    I declare under oath that I have personally
                                    accomplished this Personal Data Sheet which
                                    is a true, correct and complete statement
                                    pursuant to the provisions of pertinent
                                    laws, rules and regulations of the Republic
                                    of the Philippines. I authorize the agency
                                    head/authorized representative to
                                    verify/validate the contents stated herein.
                                    I agree that any misrepresentation made in
                                    this document and its attachments shall
                                    cause the filing of administrative/criminal
                                    case/s against me.
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 [&>div]:border-[3px] gap-4 [&>div]:border-black [&>div]:h-[108.8px] p-2 pr-0 text-[8.5pt]">
                        <div className="divide-y-2 divide-black">
                            <div className={cn("h-[2rem] flex bg-[#eaeaea]")}>
                                <div className={cn(checkIfDownLoad("-mt-2"))}>
                                    Government Issued ID
                                    <span className="text-[6.5pt]">
                                        (i.e.Passport, GSIS, SSS, PRC, Driver's
                                        License, etc.)
                                    </span>{" "}
                                    <br />
                                    <i>
                                        PLEASE INDICATE ID Number and Date of
                                        Issuance
                                    </i>
                                </div>
                            </div>
                            <div className="h-[24px] text-[7pt] flex items-center">
                                <div
                                    className={cn(
                                        "w-24",
                                        checkIfDownLoad("-mt-3")
                                    )}
                                >
                                    Government Issued ID:{" "}
                                </div>
                                <TextCenter>
                                    <div className={cn('font-bold', checkIfDownLoad('-mt-3'))}>{government?.government_id}</div>
                                </TextCenter>
                            </div>
                            <div className="h-[24px] text-[7pt] flex items-center">
                                <div
                                    className={cn(
                                        "w-24",
                                        checkIfDownLoad("-mt-3")
                                    )}
                                >
                                    ID/License/Passport No.:
                                </div>
                                <TextCenter>
                                    <div className={cn('font-bold', checkIfDownLoad('-mt-3'))}>{government?.id_number}</div>
                                </TextCenter>
                            </div>
                            <div className="h-[24px] text-[7pt] flex items-center">
                                <div
                                    className={cn(
                                        "w-24",
                                        checkIfDownLoad("-mt-3")
                                    )}
                                >
                                    Date/Place of Issuance:
                                </div>
                                <TextCenter>
                                    <div className={cn('font-bold', checkIfDownLoad('-mt-3'))}>{government?.issued}</div>
                                </TextCenter>
                            </div>
                        </div>
                        <div className="flex flex-col divide-y-2 divide-black">
                            <div className="grow"></div>
                            <div className="h-[14px] bg-[#eaeaea] text-[7pt] text-center">
                                <div className={cn(checkIfDownLoad("-mt-2"))}>
                                    Signature (Sign inside the box)
                                </div>
                            </div>
                            <div className="h-[14px]"></div>
                            <div className="h-[14px] bg-[#eaeaea] text-[7pt] text-center">
                                <div className={cn(checkIfDownLoad("-mt-2"))}>
                                    Date Accomplished{" "}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div>
                    <div className="px-12">
                        <div className="h-[9.5rem] w-[] border-2 border-black mx-auto mt-[24px]">
                            <div className="text-[7pt] text-center px-6 leading-3 mt-3">
                                <div className={cn()}>
                                    ID picture taken within the last 6 months
                                    4.5 cm. X 3.5 cm (passport size)
                                </div>
                            </div>
                            <div className="text-[7pt] text-center leading-3 mt-4">
                                <div className={cn()}>
                                    Computer generated <br />
                                    or photocopied picture <br />
                                    is not acceptable
                                </div>
                            </div>
                        </div>
                        <div
                            className={cn(
                                "text-center text-gray-300 text-[8pt] mt-3",
                                checkIfDownLoad("mt-2 mb-1")
                            )}
                        >
                            PHOTO
                        </div>
                    </div>

                    <div className="p-3.5 pb-0">
                        <div className="border-[3px] border-black flex flex-col h-32">
                            <div className="grow"></div>
                            <div className="h-[14px] border-t-2 border-black text-center text-[7pt]">
                                <div className={cn(checkIfDownLoad("-mt-2"))}>
                                    Right Thumbmark
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div
                className={cn(
                    "h-[9.3rem] flex flex-col items-center text-[10pt]",
                    checkIfDownLoad("pt-3", "pt-1.5")
                )}
            >
                <div className="flex h-fit">
                    <div className={cn(checkIfDownLoad("-mt-3"))}>
                        SUBSCRIBED AND SWORN to before me this{" "}
                    </div>
                    <div
                        className={cn(
                            "w-36 border-b border-black mx-2 h-[18px]",
                            checkIfDownLoad("-mt-1")
                        )}
                    ></div>
                    <div className={cn(checkIfDownLoad("-mt-3"))}>,</div>
                    <div className={cn("ml-1", checkIfDownLoad("-mt-3"))}>
                        affiant exhibiting his/her validly issued government ID
                        as indicated above
                    </div>
                </div>

                <div className="border-[3px] w-72 mt-3 h-[6.5rem] ml-[5.8rem] border-black flex flex-col">
                    <div className="grow"></div>
                    <div className="h-[20px] bg-[#eaeaea] border-t-2 border-black text-center text-[9pt]">
                        <div className={cn(checkIfDownLoad("-mt-2"))}>
                            Person Administering Oath
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default C4pdf;
