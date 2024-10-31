import Tabs from "@/Components/framer/Tabs";
import { router } from "@inertiajs/react";
import CivilServiceEligibilityForm from "./C2/CivilServiceEligibilityForm";
import Processing from "@/Components/Processing";
import WorkExperienceForm from "./C2/WorkExperienceForm";
import { forwardRef, useState } from "react";
import { UserInfoType } from "../Edit";
import VoluntaryWorkForm from "./C3/VoluntaryWorkForm";
import LearningAndDevelopmentForm from "./C3/LearningAndDevelopmentForm";
import OtherInformationForm from "./C3/OtherInformationForm";
import { PDSPDFIsDownloadProvider } from "@/Pages/Search/PDSPDF/context";
import { Pages } from "@/Pages/Search/PDSPDF";
import C3pdf from "@/Pages/Search/PDSPDF/C3";

type C3Props = {
    user: UserInfoType;
    activeTab: string;
    pds_c: string;
    data: any;
};

const C3 = forwardRef<HTMLDivElement, C3Props>(
    ({ user, pds_c, activeTab, data }, ref) => {
        const [routeProcessing, setRouteProcessing] = useState(false);
        const [processing, setProcessing] = useState(false);

        return (
            <div className="flex overflow-x-hidden gap-2">
                <div className="w-full shrink-0">
                    <div className="w-full border-b mb-6">
                        <Tabs
                            id="pds-sub-tab"
                            active={activeTab}
                            tabs={[
                                { id: "VI", label: "VI." },
                                { id: "VII", label: "VII." },
                                { id: "VIII", label: "VIII." },
                            ]}
                            className="w-fit"
                            tabWidth="w-14"
                            navigate={(nav) => {
                                setRouteProcessing(true);
                                router.get(
                                    route("profile.edit", {
                                        _query: {
                                            c: pds_c,
                                            section: nav,
                                        },
                                    }),
                                    undefined,
                                    {
                                        onFinish: () =>
                                            setRouteProcessing(false),
                                    }
                                );
                            }}
                        />
                    </div>
                    {routeProcessing ? (
                        <div className="relative w-fit mx-auto py-4">
                            <span className="loading loading-spinner loading-md"></span>
                        </div>
                    ) : (
                        <div>
                            {(activeTab === "VI" || !activeTab) && (
                                <VoluntaryWorkForm
                                    user={user}
                                    onProcess={setProcessing}
                                />
                            )}
                            {activeTab === "VII" && (
                                <LearningAndDevelopmentForm
                                    user={user}
                                    onProcess={setProcessing}
                                />
                            )}
                            {activeTab === "VIII" && (
                                <OtherInformationForm
                                    user={user}
                                    onProcess={setProcessing}
                                />
                            )}
                        </div>
                    )}

                    <Processing is_processing={processing} />
                </div>

                {data && (
                    <div className="w-[calc(900px-20pt)]">
                        <PDSPDFIsDownloadProvider initialValue={true}>
                            <Pages ref={ref} pageNumber={3}>
                                <C3pdf voluntarywork={data.voluntarywork} learningdevelopment={data.learningdevelopment} otherinformation={data.otherinformation} />
                            </Pages>
                        </PDSPDFIsDownloadProvider>
                    </div>
                )}
            </div>
        );
    }
);

export default C3;
