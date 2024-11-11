import React from "react";
import SALNPDFFormat from "./SALN/SALNPDFFormat";
import RealProperties from "./SALN/RealProperties";
import PersonalProperties from "./SALN/PersonalProperties";
import Liabilities from "./SALN/Liabilities";
import BIFC from "./SALN/BIFC";
import { SALNTOTALTYPE, User } from "@/types";

type Props = {
    page: {
        page: number,
        totalPage: number
    }
    user: User;
    asof: string;
    saln_totals: SALNTOTALTYPE;
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
    liabilities: Array<{
        id: number;
        saln_id: number;
        balances: string;
        creditors: string;
        nature: string;
    }> | null;
    bifc: {
        salnbifc: {
            has_bi_fc: number;
        };
        bifc: Array<{
            id: number;
            saln_bi_fc_id: number;
            name: string;
            address: string;
            nature: string;
            date: string;
        }> | null;
    };
    relatives: {
        salnrelatives: {
            has_relative: number;
        };
        relatives: Array<{
            id: number;
            saln_relative_id: number;
            name: string;
            relationship: string;
            position: string;
            agency_address: string;
        }> | null;
    };
};

const SALNSeparatePage: React.FC<Props> = ({
    page,
    user,
    asof,
    real,
    personal,
    bifc,
    relatives,
    saln_totals,
    liabilities
}) => {
    return (
        <SALNPDFFormat
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
                <div className="text-center text-[10pt] leading-4">
                    As of <span className="underline">November 23, 2024</span>
                </div>
                <div className="text-[10pt] text-center italic">
                    (Additional sheet/s for the declarant)
                </div>
            </div>

            <div className="text-[8pt] mt-4">
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
                                    <div className="grid grid-cols-[1fr,1fr,3rem]">
                                        <div className="">(Family Name)</div>
                                        <div className="">(First Name)</div>
                                        <div className="">(M.I.)</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="flex items-start">
                            <div className="font-bold uppercase w-[7rem]">
                                Position:
                            </div>
                            <div className="grow h-4 border-b border-black"></div>
                        </div>
                        <div className="flex items-start">
                            <div className="font-bold uppercase w-[7rem]">
                                Agency/Office:
                            </div>
                            <div className="grow h-4 border-b border-black"></div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="border-y border-black h-[3px] my-3"></div>

            <div className="font-bold text-center underline text-[10pt]">
                ASSETS, LIABILITIES AND NETWORTH
            </div>

            <div>
                <div className="font-bold text-[10pt]">1. ASSETS</div>
                <div className="indent-4 font-bold text-[10pt]">
                    a. Real Properties*
                </div>

                <div className="mt-1">
                    <RealProperties real={real} saln_totals={saln_totals} />
                </div>

                <div className="indent-4 font-bold text-[10pt]">
                    b. Personal Properties*
                </div>
                <div className="mt-1">
                    <PersonalProperties personal={personal} saln_totals={saln_totals} />
                </div>
            </div>

            <div className="font-bold text-[10pt]">2. LIABILITIES*</div>
            <div className="mt-1">
                <Liabilities liabilities={liabilities} saln_totals={saln_totals} />
            </div>

            <div className="border-y border-black h-[3px] my-3"></div>

            <div className="">
                <div className="font-bold text-center underline text-[10pt] mt-6">
                    BUSINESS INTERESTS AND FINANCIAL CONNECTIONS
                </div>

                <div className="mt-1">
                    <BIFC bifc={bifc?.bifc} />
                </div>
            </div>
        </SALNPDFFormat>
    );
};

export default SALNSeparatePage;
