import { router } from "@inertiajs/react";
import { useState } from "react";
import Processing from "@/Components/Processing";
import { UserInfoType } from "../Edit";
import Tabs from "@/Components/framer/Tabs";
import PersonalInformationForm from "./C1/PersonalInformationForm";
import FamilyBackgroundForm from "./C1/FamilyBackgroundForm";
import EducationalBackgroundForm from "./C1/EducationalBackgroundForm";

type C1Props = {
    user: UserInfoType;
    activeTab: string;
    pds_c: string;
};

const C1: React.FC<C1Props> = ({ user, activeTab, pds_c }) => {
    const [routeProcessing, setRouteProcessing] = useState(false);
    const [processing, setProcessing] = useState(false);

    return (
        <div>
            <div className="w-full border-b mb-6">
                <Tabs
                    id="pds-sub-tab"
                    active={activeTab}
                    tabs={[
                        { id: "I", label: "I." },
                        { id: "II", label: "II." },
                        { id: "III", label: "III." },
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
                    {(activeTab === "I" || !activeTab) && (
                        <PersonalInformationForm
                            user={user}
                            onProcess={setProcessing}
                        />
                    )}
                    {activeTab === "II" && (
                        <FamilyBackgroundForm
                            user={user}
                            onProcess={setProcessing}
                        />
                    )}
                    {activeTab === "III" && (
                        <EducationalBackgroundForm
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

export default C1;
