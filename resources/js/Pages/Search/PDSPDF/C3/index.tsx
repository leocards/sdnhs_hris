import { useIsDownloadChecker } from "../context";
import LearningAndDevelopment, { LearningDevelopmentType } from "./LearningAndDevelopment";
import OtherInformation, { OtherInformationType } from "./OtherInformation";
import VoluntaryWork, { VoluntaryWorkType } from "./VoluntaryWork";
import { cn } from "@/lib/utils";

type C3pdfProps = {
    voluntarywork: VoluntaryWorkType;
    learningdevelopment: LearningDevelopmentType;
    otherinformation: OtherInformationType;
}

const C3pdf: React.FC<C3pdfProps> = ({ voluntarywork, learningdevelopment, otherinformation }) => {
    const { checkIfDownLoad } = useIsDownloadChecker();

    return (
        <div>
            <VoluntaryWork voluntarywork={voluntarywork} />

            <LearningAndDevelopment learningdevelopment={learningdevelopment} />

            <OtherInformation otherinformation={otherinformation} />

            <div className="flex w-full">
                <div className="flex grow">
                    <div className="bg-[#eaeaea] h-[32px] font-bold italic text-[9pt] flex items-center justify-center w-[14.1rem] border-r-[3px] border-black py-1.5">
                        <div className={cn(checkIfDownLoad("-mt-3"))}>
                            SIGNATURE
                        </div>
                    </div>
                    <div className="grow"></div>
                </div>
                <div className="flex">
                    <div className="bg-[#eaeaea] h-[32px] font-bold italic text-[9pt] flex items-center justify-center w-[7.1rem] border-x-[3px] border-black py-1.5">
                        <div className={cn(checkIfDownLoad("-mt-3"))}>DATE</div>
                    </div>
                    <div className="grow w-[13.85rem]"></div>
                </div>
            </div>
        </div>
    );
};

export default C3pdf;
