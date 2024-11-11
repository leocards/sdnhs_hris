import { SALNTOTALTYPE } from "@/types";
import React from "react";

type Props = {
    saln_totals: SALNTOTALTYPE
    personal: Array<{
        id: number
        cost: string;
        description: string;
        year: string;
    }>|null
}

const PersonalProperties: React.FC<Props> = ({ personal, saln_totals }) => {
    return (
        <div>
            <div className="grid grid-cols-[1fr,12rem,8rem] bg-black/25 text-[8pt] text-center font-bold [&>div]:py-1.5 divide-x divide-black border border-black">
                <div>DESCRIPTION</div>
                <div>YEAR ACQUIRED</div>
                <div>ACQUISITION COST/AMOUNT</div>
            </div>
            <div className="divide-y divide-black border-b border-x border-black">
                {personal?.map((p, index) => (
                    <Card key={index} personal={p} />
                ))}
                {Array.from({ length: 4 - (personal?.length||0) }).map((_, index) => (
                    <div key={index} className="grid grid-cols-[1fr,12rem,8rem] text-[10pt] divide-x divide-black text-center">
                        <div>N/A</div>
                        <div>N/A</div>
                        <div>N/A</div>
                    </div>
                ))}
            </div>
            <div className="grid grid-cols-[1fr,12rem,8rem] text-[10pt] font-bold">
                <div className="col-span-2 text-right">Subtotal:</div>
                <div className="border-b border-black text-center">P {Number(saln_totals.personal).toLocaleString()}</div>
            </div>
            <div className="grid grid-cols-[1fr,12rem,8rem] text-[10pt] mt-2 font-bold">
                <div className="col-span-2 text-right">
                    TOTAL ASSETS (a+b):
                </div>
                <div className="border-b-2 border-black text-center">
                    P {Number((saln_totals.personal) + (saln_totals.real)).toLocaleString()}
                </div>
            </div>
        </div>
    );
};

const Card: React.FC<{personal?: {
    id: number
    cost: string;
    description: string;
    year: string;
}}> = ({
    personal
}) => {
    return (
        <div
            className="grid grid-cols-[1fr,12rem,8rem] text-[10pt] divide-x divide-black text-center"
        >
            <div>{personal? personal.description : "N/A"}</div>
            <div>{personal? personal.year : "N/A"}</div>
            <div>{personal? "P " + Number(personal.cost).toLocaleString() : "N/A"}</div>
        </div>
    );
}

export default PersonalProperties;
