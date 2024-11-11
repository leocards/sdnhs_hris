import { SALNTOTALTYPE } from "@/types";
import React from "react";

type Props = {
    liabilities: Array<{
        id: number;
        saln_id: number;
        balances: string;
        creditors: string;
        nature: string;
    }> | null;
    saln_totals: SALNTOTALTYPE;
};

const Liabilities: React.FC<Props> = ({ liabilities, saln_totals }) => {
    return (
        <div>
            <div className="border border-black divide-y divide-black">
                <div className="grid grid-cols-[1fr,1fr,10rem] font-bold bg-black/25 text-[8pt] divide-x divide-black text-center [&>div]:py-1.5">
                    <div>NATURE</div>
                    <div>NAME OF CREDITORS</div>
                    <div>OUTSTANDING BALANCE</div>
                </div>
                {
                    liabilities?.map((liability, index) => (
                        <Card key={index} liability={liability} />
                    ))
                }

                {Array.from({ length: 4 }).map((_, index) => (
                    <div
                        key={index}
                        className="grid grid-cols-[1fr,1fr,10rem] text-[10pt] divide-x divide-black text-center [&>div]:"
                    >
                        <div>N/A</div>
                        <div>N/A</div>
                        <div>N/A</div>
                    </div>
                ))}
            </div>
            <div className="grid grid-cols-[1fr,1fr,10rem] text-[10pt] font-bold">
                <div className="col-start-2 uppercase text-right">
                    Total Liabilities:
                </div>
                <div className="border-b border-black text-center">P {Number(saln_totals.liability).toLocaleString()}</div>
            </div>
            <div className="grid grid-cols-[1fr,1fr,10rem] text-[10pt] font-bold">
                <div className="col-span-2 text-right">
                    NET WORTH : Total Assets less Total Liabilities =
                </div>
                <div className="border-b border-black text-center">P {Number(saln_totals.networth).toLocaleString()}</div>
            </div>
        </div>
    );
};

const Card: React.FC<{
    liability: {
        id: number;
        saln_id: number;
        balances: string;
        creditors: string;
        nature: string;
    };
}> = ({ liability }) => {
    return (
        <div className="grid grid-cols-[1fr,1fr,10rem] text-[10pt] divide-x divide-black text-center [&>div]:">
            <div>{liability.nature}</div>
            <div>{liability.creditors}</div>
            <div>{"P "+Number(liability.balances).toLocaleString()}</div>
        </div>
    );
};

export default Liabilities;
