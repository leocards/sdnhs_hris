import React from "react";
import PersonalInformation, { PersonalInfoProps } from "./PersonalInformation";
import FamilyBackground, { FamilyBackgroundType } from "./FamilyBackground";
import EducationalBackground, { EducationalBackgroundType } from "./EducationalBackground";
import { cn } from "@/lib/utils";
import { useIsDownloadChecker } from "../context";

type C1Props = {
    personalInfo: PersonalInfoProps
    familyBackground: FamilyBackgroundType
    education: EducationalBackgroundType
}

const C1pdf: React.FC<C1Props> = ({ personalInfo, familyBackground, education }) => {
    const { checkIfDownLoad } = useIsDownloadChecker()

    return (
        <div>
            <PersonalInformation {...personalInfo} />

            <FamilyBackground fb={familyBackground} />

            <EducationalBackground {...education} />

            <div className="bg-[#eaeaea] text-red-500 text-center italic text-[7pt] leading-3 border-b-[3px] border-t border-black h-[15.2px]">
                <div className={cn(checkIfDownLoad("-mt-1.5"))}>
                    (Continue on separate sheet if necessary)
                </div>
            </div>
            <div className="flex w-full">
                <div className="flex grow">
                    <div className="bg-[#eaeaea] h-[30px] font-bold italic text-[9pt] flex items-center justify-center w-[9.7rem] border-r-[3px] border-black py-1.5">
                        <div className={cn(checkIfDownLoad("-mt-3.5"))}>
                            SIGNATURE
                        </div>
                    </div>
                    <div className="grow"></div>
                </div>
                <div className="flex">
                    <div className="bg-[#eaeaea] h-[30px] font-bold italic text-[9pt] flex items-center justify-center w-[7.1rem] border-x-[3px] border-black py-1.5">
                        <div className={cn(checkIfDownLoad("-mt-3.5"))}>DATE</div>
                    </div>
                    <div className="grow w-[12.35rem]"></div>
                </div>
            </div>
        </div>
    );
};

export default C1pdf;
