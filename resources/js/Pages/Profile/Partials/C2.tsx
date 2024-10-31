import Tabs from "@/Components/framer/Tabs";
import { forwardRef, useState } from "react";
import { router } from "@inertiajs/react";
import { UserInfoType } from "../Edit";
import CivilServiceEligibilityForm from "./C2/CivilServiceEligibilityForm";
import Processing from "@/Components/Processing";
import WorkExperienceForm from "./C2/WorkExperienceForm";
import { PDSPDFIsDownloadProvider } from "@/Pages/Search/PDSPDF/context";
import { Pages } from "@/Pages/Search/PDSPDF";
import C2pdf from "@/Pages/Search/PDSPDF/C2";

type C2Props = {
    user: UserInfoType;
    activeTab: string;
    pds_c: string;
    data: any;
};

const C2 = forwardRef<HTMLDivElement, C2Props>(({ user, activeTab, pds_c, data }, ref) => {
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
                            { id: "IV", label: "IV." },
                            { id: "V", label: "V." },
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
                                    onFinish: () => setRouteProcessing(false),
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
                        {(activeTab === "IV" || !activeTab) && (
                            <CivilServiceEligibilityForm
                                user={user}
                                onProcess={setProcessing}
                            />
                        )}
                        {(activeTab === "V") && (
                            <WorkExperienceForm
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
                        <Pages ref={ref} pageNumber={2}>
                            <C2pdf civilservice={data.civilservice} workexperience={data.workexperience}/>
                        </Pages>
                    </PDSPDFIsDownloadProvider>
                </div>
            )}
        </div>
    );
});

export default C2;
