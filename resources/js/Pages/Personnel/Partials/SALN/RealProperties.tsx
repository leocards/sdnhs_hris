import { SALNTOTALTYPE } from "@/types";
import React, { useEffect, useMemo, useState } from "react";

type Props = {
    real: Array<{
        id: number
        assessed_value: string;
        cost: string;
        current_market_value: string;
        description: string;
        kind: string;
        location: string;
        mode: string;
        saln_id: number;
        year: string;
    }>|null
    saln_totals: SALNTOTALTYPE
}

const RealProperties: React.FC<Props> = ({ real, saln_totals }) => {
    return (
        <div>
            <div className="grid grid-cols-[6.5rem,6.5rem,1fr,12rem,8rem,1fr] bg-black/25 divide-x divide-black border border-black text-center text-[8pt]">
                <div className="pt-1.5 pb-0.5">
                    <div className="font-bold">DESCRIPTION</div>
                    <div className="text-[6pt] leading-[0.60rem]">
                        (e.g. lot, house and lot, condominium and improvements)
                    </div>
                </div>
                <div className="pt-1.5 pb-0.5">
                    <div className="font-bold">KIND</div>
                    <div className="text-[6pt] leading-[0.60rem]">
                        (e.g. residential, commercial, industrial, agricultural
                        and mixed use)
                    </div>
                </div>
                <div className="pt-1.5 pb-0.5">
                    <div className="font-bold px-4">EXACT LOCATION</div>
                </div>
                <div className="">
                    <div className="grid grid-cols-[4.5rem,1fr] divide-x divide-black border-b border-black">
                        <div className="font-bold pt-1.5">ASSESSED VALUE</div>
                        <div className="font-bold pt-1.5">
                            CURRENT FAIR MARKET VALUE
                        </div>
                    </div>
                    <div className="text-[6pt] leading-[0.60rem] px-3 py-0.5">
                        (As found in the Tax Declaration of Real Property)
                    </div>
                </div>
                <div className="font-bold pt-2 flex flex-col divide-y divide-black">
                    <div className="text-cente grow">ACQUISITION</div>
                    <div className="flex text-center divide-x divide-black">
                        <div className="w-14 py-[4px]">YEAR</div>
                        <div className="w-fit px-2 py-[4px] grow">MODE</div>
                    </div>
                </div>
                <div className="pt-2 pb-0.5 font-bold px-3">
                    ACQUISITION COST
                </div>
            </div>

            {real?.map((real_property, index) => (
                <Card key={index} real={real_property} />
            ))}

            {real &&
                Array.from({ length: 4 - real.length }).map((_, index) => (
                    <Card key={index} />
                ))}

            <div className="grid grid-cols-[6.5rem,6.5rem,1fr,12rem,8rem,1fr] text-[10pt] font-bold">
                <div className="col-start-5 text-right">
                    Subtotal:
                </div>
                <div className="h-5 border-b border-black text-center">P {Number(saln_totals.real).toLocaleString()}</div>
            </div>
        </div>
    );
};

const Card: React.FC<{real?: {
    id: number
    assessed_value: string;
    cost: string;
    current_market_value: string;
    description: string;
    kind: string;
    location: string;
    mode: string;
    saln_id: number;
    year: string;
}}> = ({ real }) => {
    return (
        <div className="grid grid-cols-[6.5rem,6.5rem,1fr,12rem,8rem,1fr] [&>div]:text-center divide-x divide-black border border-t-0 border-black text-center text-[10pt] h-11">
                    <div>{real?real.description:"N/A"}</div>
                    <div>{real?real.kind:"N/A"}</div>
                    <div>{real?real.location:"N/A"}</div>
                    <div className="flex">
                        <div className="grid grid-cols-[4.5rem,1fr] divide-x divide-black grow text-center">
                            <div>{real?real.assessed_value:"N/A"}</div>
                            <div>{real?real.current_market_value:"N/A"}</div>
                        </div>
                    </div>
                    <div className="flex">
                        <div className="flex text-center divide-x divide-black grow">
                            <div className="w-14">{real?real.year:"N/A"}</div>
                            <div className="grow">{real?real.mode:"N/A"}</div>
                        </div>
                    </div>
                    <div>{real? "P " + Number(real.cost).toLocaleString():"N/A"}</div>
                </div>
    )
}

export default RealProperties;
