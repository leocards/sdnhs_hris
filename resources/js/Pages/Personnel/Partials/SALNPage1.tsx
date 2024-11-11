import { Square, SquareCheck } from "lucide-react";
import React, { forwardRef, useMemo, useRef } from "react";
import SALNPDFFormat from "./SALN/SALNPDFFormat";
import Children from "./SALN/Children";
import RealProperties from "./SALN/RealProperties";
import PersonalProperties from "./SALN/PersonalProperties";
import { format } from "date-fns";
import { SALNTOTALTYPE, User } from "@/types";

type Props = {
    page: {
        page: number,
        totalPage: number
    }
    user: User
    isjoint?: "joint"|"separate"|"none";
    asof: string;
    spouse: {
        saln_id: number
        family_name: string
        first_name: string
        middle_name: string
        position: string
        office: string
        office_address: string
        government_id: string
        government_id_no: string
        date_issued: string
    };
    children: Array<{
        id: number;
        saln_id: number;
        name: string;
        date_of_birth: string;
        age: string;
    }> | null;
    real: Array<{
        id: number;
        assessed_value: string;
        cost: string;
        current_market_value: string;
        description: string;
        kind: string;
        location: string;
        mode: string;
        saln_id: number;
        year: string;
    }> | null;
    personal: Array<{
        id: number;
        cost: string;
        description: string;
        year: string;
    }> | null;
    saln_totals: SALNTOTALTYPE;
};

const SALNPage1 = forwardRef<HTMLDivElement, Props>(({ page, user, asof, isjoint, spouse, children, real, personal, saln_totals }, ref) => {
    return (
        <SALNPDFFormat
            ref={ref}
            page={page}
        >
            <div className="text-[7pt]">
                <div className="text-left w-fit ml-auto">
                    <div>Revised as of January 2015</div>
                    <div>Per CSC Resolution No. 1500088</div>
                    <div>Promulgated on January 23, 2015</div>
                </div>
            </div>

            <div className="font-bold text-[12pt] text-center mt-1">
                SWORN STATEMENT OF ASSETS, LIABILITIES AND NET WORTH
            </div>

            <div className="">
                <div className="text-center flex justify-center text-[10pt] leading-4">
                    As of{" "}
                    <div className="border-b border-black w-48 leading-4">
                        {format(asof, 'LLLL')} {format(asof, 'd')}, {format(asof, 'y')}
                    </div>
                </div>
                <div className="text-[8pt] text-center">
                    (Required by R.A. 6713)
                </div>
            </div>

            <div className="text-[8pt] text-center mt-2">
                <div>
                    {" "}
                    <span className="font-bold">Note: </span>{" "}
                    <span className="italic">
                        Husband and wife who are both public officials and
                        employees may file the required statements jointly or
                        separately.
                    </span>{" "}
                </div>
                <div className="flex gap-16 justify-center">
                    <div className="flex items-center gap-1.5">
                        {isjoint !== "joint" ? <Square className="size-3.5" /> : <SquareCheck className="size-3.5" />}
                        <div className="italic text-[10pt]">Joint Filing</div>
                    </div>
                    <div className="flex items-center gap-1.5">
                        {isjoint !== "separate" ? <Square className="size-3.5" /> : <SquareCheck className="size-3.5" />}
                        <div className="italic text-[10pt]">
                            Separate Filing
                        </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                        {isjoint !== "none" ? <Square className="size-3.5" /> : <SquareCheck className="size-3.5" />}
                        <div className="italic text-[10pt]">Not Applicable</div>
                    </div>
                </div>
            </div>

            {/* Declarant and spouse */}
            <div className="text-[8pt] mt-3 uppercase">
                {/* Declarant */}
                <div className="grid grid-cols-[1fr,19rem] gap-7">
                    <div>
                        <div className="flex items-start">
                            <div className="font-bold uppercase w-[5rem]">
                                Declarant:
                            </div>
                            <div className="grow">
                                <div className="border-b border-black h-4">
                                    <div className="grid grid-cols-[1fr,1fr,3rem]">
                                        <div className="">{user.last_name}</div>
                                        <div className="">{user.first_name}</div>
                                        <div className="">{user.middle_name?.charAt(0)}</div>
                                    </div>
                                </div>
                                <div>
                                    <div className="grid grid-cols-[1fr,1fr,3rem] capitalize">
                                        <div className="">(Family Name)</div>
                                        <div className="">(First Name)</div>
                                        <div className="">(M.I.)</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-start">
                            <div className="font-bold uppercase w-[5rem]">
                                Address:
                            </div>
                            <div className="grow min-h-7">
                                <div className="border-b border-black">{user.address}</div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="flex items-start">
                            <div className="font-bold uppercase w-[7rem]">
                                Position:
                            </div>
                            <div className="grow h-4 border-b border-black">{user.position}</div>
                        </div>
                        <div className="flex items-start">
                            <div className="font-bold uppercase w-[7rem]">
                                Agency/Office:
                            </div>
                            <div className="grow h-4 border-b border-black">
                                Southern Davao NHS
                            </div>
                        </div>
                        <div className="flex items-start">
                            <div className="font-bold uppercase w-[7rem]">
                                Office Address:
                            </div>
                            <div className="grow h-4 border-b border-black">
                                Southern Davao, Panabo City
                            </div>
                        </div>
                    </div>
                </div>
                {/* Spouse */}
                <div className="grid grid-cols-[1fr,19rem] gap-7">
                    <div>
                        <div className="flex items-start mt-1">
                            <div className="font-bold uppercase w-[5rem]">
                                Spouse:
                            </div>
                            <div className="grow">
                                <div className="border-b border-black h-4">
                                    <div className="grid grid-cols-[1fr,1fr,3rem]">
                                        <div className="">{spouse?.family_name}</div>
                                        <div className="">{spouse?.first_name}</div>
                                        <div className="">{spouse?.middle_name?.charAt(0)}</div>
                                    </div>
                                </div>
                                <div>
                                    <div className="grid grid-cols-[1fr,1fr,3rem] capitalize">
                                        <div className="">(Family Name)</div>
                                        <div className="">(First Name)</div>
                                        <div className="">(M.I.)</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="flex items-start mt-1">
                            <div className="font-bold uppercase w-[7rem]">
                                Position:
                            </div>
                            <div className="grow h-4 border-b border-black">{spouse?.position}</div>
                        </div>
                        <div className="flex items-start">
                            <div className="font-bold uppercase w-[7rem]">
                                Agency/Office:
                            </div>
                            <div className="grow h-4 border-b border-black">{spouse?.office}</div>
                        </div>
                        <div className="flex items-start">
                            <div className="font-bold uppercase w-[7rem]">
                                Office Address:
                            </div>
                            <div className="grow">
                                {
                                    spouse ? (
                                        <div className="border-b border-black">
                                            {spouse.office_address}
                                        </div>
                                    ) : (
                                        <>
                                            <div className="h-4 border-b border-black"></div>
                                            <div className="h-4 border-b border-black"></div>
                                        </>
                                    )
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="border-y border-black h-0.5 my-3"></div>

            <div className="font-bold text-center underline text-[10pt]">
                UNMARRIED CHILDREN BELOW EIGHTEEN (18) YEARS OF AGE LIVING IN DECLARANT’S  HOUSEHOLD
            </div>

            <div className="mt-1">
                <Children children={children} />
            </div>

            <div className="border-y border-black h-0.5 mt-5 mb-2.5"></div>

            <div className="font-bold text-center underline text-[10pt]">
                ASSETS, LIABILITIES AND NETWORTH
            </div>

            <div className="text-[10pt] text-center px-32 leading-4 italic">
            (Including those of the spouse and unmarried children below eighteen (18)
                years of age living in declarant’s household)
            </div>

            <div>
                <div className="font-bold text-[10pt]">1. ASSETS</div>
                <div className="indent-4 font-bold text-[10pt]">a. Real Properties*</div>

                <div className="mt-1">
                    <RealProperties real={real} saln_totals={saln_totals} />
                </div>

                <div className="indent-4 font-bold text-[10pt]">b. Personal Properties*</div>
                <div className="mt-1">
                    <PersonalProperties personal={personal} saln_totals={saln_totals} />
                </div>
            </div>
            <div className="italic text-[10pt] mt-4">* Additional sheet/s may be used, if necessary.</div>
        </SALNPDFFormat>
    );
});

export default SALNPage1;
