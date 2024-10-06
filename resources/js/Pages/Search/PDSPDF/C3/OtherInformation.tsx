import React, { useMemo } from "react";
import { SubHeader } from "../C1/Header";
import { TextCenter } from "..";
import { cn } from "@/lib/utils";
import { useIsDownloadChecker } from "../context";

export type OtherInformationType = Array<{
    detail: string;
    info_type: 'skills' | 'association' | 'recognition';
}>

type OIType = Array<{skills: string; recognition: string; association: string;}>

const sortOtherInformation = (oi: OtherInformationType): OIType => {
    if(!oi || oi.length === 0)
        return Array.from({ length: 8 }).map(() => ({skills: '', recognition: '', association: ''}));

    let grouped = [];
    let defaultGroup = { skills: '', recognition: '', association: '' };

    oi.forEach((info) => {
        if(defaultGroup[info.info_type]) {
            grouped.push(defaultGroup)
            defaultGroup = { skills: '', recognition: '', association: '' };
        }

        defaultGroup[info.info_type] = info.detail;
    })

    if (defaultGroup.skills || defaultGroup.recognition || defaultGroup.association) {
        grouped.push(defaultGroup);
        defaultGroup = { skills: '', recognition: '', association: '' };
    }

    if(grouped.length < 8)
        return grouped.concat(Array.from({ length: (8 - grouped.length)}).map(() => defaultGroup))
    else
        return grouped.slice(0, 8)
}

type Props = {
    otherinformation: OtherInformationType;
}

const OtherInformation: React.FC<Props> = ({ otherinformation }) => {
    const { checkIfDownLoad } = useIsDownloadChecker();
    const oiData = useMemo(() => sortOtherInformation(otherinformation), [otherinformation])

    return (
        <div>
            <SubHeader title="VIII. OTHER INFORMATION" />

            <div className="bg-[#eaeaea] h-[35px] grid grid-cols-[14rem,1fr,14rem] divide-x-2 divide-black text-[7pt]">
                <div className="flex">
                    <TextCenter className="px-2 grow">
                        <div className={cn(checkIfDownLoad('-mt-3'))}>31.</div>
                        <div className="grow text-center">
                            <div className={cn(checkIfDownLoad('-mt-3'))}>SPECIAL SKILLS and HOBBIES</div>
                        </div>
                    </TextCenter>
                </div>
                <div className="flex">
                    <TextCenter className="px-2 grow">
                        <div className={cn(checkIfDownLoad('-mt-3'))}>32.</div>
                        <div className="grow text-center">
                            <div className={cn(checkIfDownLoad('-mt-3'))}>
                                NON-ACADEMIC DISTINCTIONS / RECOGNITION <br />
                                (Write in full)
                            </div>
                        </div>
                    </TextCenter>
                </div>
                <div className="flex">
                    <TextCenter className="px-2 grow">
                        <div className={cn(checkIfDownLoad('-mt-3'))}>33.</div>
                        <div className="grow text-center">
                            <div className={cn(checkIfDownLoad('-mt-3'))}>
                                MEMBERSHIP IN ASSOCIATION/ORGANIZATION <br />
                                (Write in full)
                            </div>
                        </div>
                    </TextCenter>
                </div>
            </div>

            <div className="divide-y-2 divide-black border-t-2 border-black">
                {oiData.map((data, index) => (
                    <div
                        key={index}
                        className="grid grid-cols-[14rem,1fr,14rem] divide-x-2 divide-black text-[7pt] h-[25px]"
                    >
                        <TextCenter className="text-center font-bold">
                            <div className={cn('leading-3', checkIfDownLoad('-mt-3'))}>{data.skills}</div>
                        </TextCenter>
                        <TextCenter className="text-center font-bold">
                            <div className={cn('leading-3', checkIfDownLoad('-mt-3'))}>{data.recognition}</div>
                        </TextCenter>
                        <TextCenter className="text-center font-bold">
                            <div className={cn('leading-3', checkIfDownLoad('-mt-3'))}>{data.association}</div>
                        </TextCenter>
                    </div>
                ))}
            </div>

            <div className="bg-[#eaeaea] text-red-500 text-center italic text-[7pt] leading-3 border-y-[3px] border-black h-[15.2px]">
                <div
                    className={cn(
                        checkIfDownLoad("-mt-2", "-mt-px font-bold")
                    )}
                >
                    (Continue on separate sheet if necessary)
                </div>
            </div>
        </div>
    );
};

export default OtherInformation;
