import React from "react";

type Props = {
    bifc: Array<{
        id: number
        saln_bi_fc_id: number
        name: string
        address: string
        nature: string
        date: string
    }>|null
}

const BIFC: React.FC<Props> = ({ bifc }) => {
    return (
        <div className="border border-black divide-y divide-black">
            <div className="grid grid-cols-4 divide-x divide-black font-bold text-[8pt] text-center [&>div]:px-1 [&>div]:pt-1 bg-black/25">
                <div>NAME OF ENTITY/BUSINESS ENTERPRISE</div>
                <div>BUSINESS ADDRESS</div>
                <div>NATURE OF BUSINESS INTEREST &/OR FINANCIAL CONNECTION</div>
                <div>DATE OF ACQUISITION OF INTEREST OR CONNECTION</div>
            </div>

            {bifc?.map((b, index) => (
                <div key={index} className="grid grid-cols-4 divide-x divide-black text-[10pt] text-center [&>div]:px-1">
                    <div>{b?.name}</div>
                    <div>{b?.address}</div>
                    <div>{b?.nature}</div>
                    <div>{b?.date}</div>
                </div>
            ))}

            {Array.from({ length: 4 - (bifc?.length||0) }).map((__dirname, index) => (
                <div key={index} className="grid grid-cols-4 divide-x divide-black text-[10pt] text-center [&>div]:px-1">
                    <div>N/A</div>
                    <div>N/A</div>
                    <div>N/A</div>
                    <div>N/A</div>
                </div>
            ))}
        </div>
    );
};

export default BIFC;
