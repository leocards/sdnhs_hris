import React, { useMemo } from "react";
import { SubHeader } from "../C1/Header";
import { useIsDownloadChecker } from "../context";
import { TextCenter } from "..";
import { cn } from "@/lib/utils";
import { checkDateFormat } from "@/Pages/types";

export type CivilServiceEligibilityType = Array<{
    career_service: string;
    rating: string;
    examination: string;
    place_examination: string;
    license_number: string;
    license_date_validity: string;
}>

type Props = {
    civilservice: CivilServiceEligibilityType
}

const defaultValue = {
    career_service: '',
    rating: '',
    examination: '',
    place_examination: '',
    license_number: '',
    license_date_validity: '',
}

const CivilServiceEligibility: React.FC<Props> = ({ civilservice, ...props }) => {
    const { checkIfDownLoad } = useIsDownloadChecker();
    const cs = useMemo(() => {
        let cs = civilservice
        if(cs) {
            if(civilservice.length <= 7)
                return cs.concat(...Array.from({ length: (7 - cs.length) }).map(() => defaultValue))
            else {
                return cs.splice(0, 6)
            }
        } else return Array.from({ length: 7 }).map(() => defaultValue)
    }, [civilservice])

    return (
        <div className="text-[7pt]">
            <SubHeader title="IV.  CIVIL SERVICE ELIGIBILITY" />

            <div className="grid grid-cols-[15rem,6rem,6rem,17rem,1fr] h-[47px] bg-[#eaeaea] divide-x-2 divide-black">
                <div className="relative flex gap-4">
                    <div className=""><div className={cn("pt-[3px]", checkIfDownLoad('-mt-1.5'))}>27.</div></div>
                    <TextCenter className="text-center">
                        <div className={cn(checkIfDownLoad('-mt-3'))}>
                            CAREER SERVICE/ RA 1080 (BOARD/ BAR) UNDER <br />{" "}
                            SPECIAL LAWS/ CES/ CSEE <br /> BARANGAY ELIGIBILITY
                            / DRIVER'S LICENSE
                        </div>
                    </TextCenter>
                </div>
                <div className="items-center flex justify-center text-center">
                    <div className={cn(checkIfDownLoad('-mt-2'))}>RATING <br /> (If Applicable)</div>
                </div>
                <div className="items-center flex justify-center text-center">
                    <div className={cn(checkIfDownLoad('-mt-2'))}>DATE OF <br /> EXAMINATION / CONFERMENT</div>
                </div>
                <div className="items-center flex justify-center text-center">
                    <div className={cn(checkIfDownLoad('-mt-2'))}>PLACE OF EXAMINATION / CONFERMENT</div>
                </div>
                <div className="flex flex-col text-center">
                    <div className="py-px h-4">
                        <div className={cn(checkIfDownLoad('-mt-2'))}>LICENSE (if applicable)</div>
                    </div>
                    <div className="grid grid-cols-[1fr,4rem] divide-x-2 divide-black w-full [&>div]:grow border-t-2 border-black h-full">
                        <TextCenter>
                            <div className={cn(checkIfDownLoad('-mt-2'))}>NUMBER</div>
                        </TextCenter>

                        <TextCenter className="w- px-2">
                            <div className={cn(checkIfDownLoad('-mt-2'))}>Date of
                            Validity</div>
                        </TextCenter>
                    </div>
                </div>
            </div>

            <div className="divide-y-2 divide-black border-t-2 border-black text-[9pt]">
                {cs.map((cse, index) => (
                    <div key={index} className="grid grid-cols-[15rem,6rem,6rem,17rem,1fr] h-[27px] divide-x-2 divide-black">
                        <TextCenter>
                            <div className={cn('font-bold', checkIfDownLoad('-mt-3'))}>{cse.career_service}</div>
                        </TextCenter>
                        <TextCenter>
                            <div className={cn('font-bold', checkIfDownLoad('-mt-3'))}>{cse.rating}</div>
                        </TextCenter>
                        <TextCenter>
                            <div className={cn('font-bold', checkIfDownLoad('-mt-3'))}>{checkDateFormat(cse.examination)}</div>
                        </TextCenter>
                        <TextCenter>
                            <div className={cn('font-bold', checkIfDownLoad('-mt-3'))}>{cse.place_examination}</div>
                        </TextCenter>
                        <div>
                            <div className="grid grid-cols-[1fr,4rem] divide-x-2 divide-black w-full [&>div]:grow h-full">
                                <TextCenter>
                                    <div className={cn('font-bold', checkIfDownLoad('-mt-3'))}>{cse.license_number}</div>
                                </TextCenter>

                                <TextCenter className="shrink-0">
                                    <div className={cn('font-bold', checkIfDownLoad('-mt-3'))}>{checkDateFormat(cse.license_date_validity)}</div>
                                </TextCenter>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-[#eaeaea] text-red-500 text-center italic text-[7pt] leading-3 border-y-[3px] border-black h-[15.2px]">
                <div className={cn(checkIfDownLoad("-mt-1.5", '-mt-px font-bold'))}>
                    (Continue on separate sheet if necessary)
                </div>
            </div>
        </div>
    );
};

export default CivilServiceEligibility;
