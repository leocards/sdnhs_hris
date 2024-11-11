import React from "react";

type Props = {
    relatives: Array<{
        id: number
        saln_relative_id: number
        name: string
        relationship: string
        position: string
        agency_address: string
    }>|null
}

const Relatives: React.FC<Props> = ({ relatives }) => {
    return (
        <div className="border border-black divide-y divide-black">
            <div className="grid grid-cols-[13rem,9rem,7rem,1fr] divide-x divide-black font-bold text-[8pt] text-center [&>div]:px-1 [&>div]:pt-1 bg-black/25">
                <div>NAME OF RELATIVE</div>
                <div>RELATIONSHIP</div>
                <div>POSITION</div>
                <div>NAME OF AGENCY/OFFICE AND ADDRESS</div>
            </div>

            {relatives?.map((__dirname, index) => (
                <div key={index} className="grid grid-cols-[13rem,9rem,7rem,1fr] divide-x divide-black text-[10pt] text-center [&>div]:px-1">
                    <div>{__dirname?.name}</div>
                    <div>{__dirname?.relationship}</div>
                    <div>{__dirname?.position}</div>
                    <div>{__dirname?.agency_address}</div>
                </div>
            ))}

            {Array.from({ length: 4 - (relatives?.length||0) }).map((__dirname, index) => (
                <div key={index} className="grid grid-cols-[13rem,9rem,7rem,1fr] divide-x divide-black text-[10pt] text-center [&>div]:px-1">
                    <div>N/A</div>
                    <div>N/A</div>
                    <div>N/A</div>
                    <div>N/A</div>
                </div>
            ))}
        </div>
    );
};

export default Relatives;
