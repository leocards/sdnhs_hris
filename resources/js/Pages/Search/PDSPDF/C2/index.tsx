import { Margin, usePDF } from "react-to-pdf";
import { useReactToPrint } from "react-to-print";
import { cn } from "@/lib/utils";
import CivilServiceEligibility, { CivilServiceEligibilityType } from "./CivilServiceEligibility";
import WorkExperience, { WorkExperienceType } from "./WorkExperience";
import { useIsDownloadChecker } from "../context";

type C2pdfProps = {
    civilservice: CivilServiceEligibilityType;
    workexperience: WorkExperienceType;
}

const C2pdf: React.FC<C2pdfProps> = ({ civilservice, workexperience }) => {
    const { checkIfDownLoad } = useIsDownloadChecker();

    return (
        <div>
            <CivilServiceEligibility civilservice={civilservice} />

            <WorkExperience workexperience={workexperience} />

            <div className="flex w-full">
                <div className="flex grow">
                    <div className="bg-[#eaeaea] h-[32px] font-bold italic text-[9pt] flex items-center justify-center w-[8.1rem] border-r-[3px] border-black py-1.5">
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
                    <div className="grow w-[12.6rem]"></div>
                </div>
            </div>
        </div>
    );
}

export default C2pdf
