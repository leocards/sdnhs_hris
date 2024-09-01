import Tabs from "@/Components/framer/Tabs";
import { useState } from "react";
import { router } from "@inertiajs/react";
import { UserInfoType } from "../Edit";
import CivilServiceEligibilityForm from "./C2/CivilServiceEligibilityForm";
import Processing from "@/Components/Processing";
import WorkExperienceForm from "./C2/WorkExperienceForm";

type C2Props = {
    user: UserInfoType;
    activeTab: string;
    pds_c: string;
};

const C2: React.FC<C2Props> = ({ user, activeTab, pds_c }) => {
    const [routeProcessing, setRouteProcessing] = useState(false);
    const [processing, setProcessing] = useState(false);

    return (
        <div>
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
    );
};

export default C2;
