import Tabs from "@/Components/framer/Tabs";
import C1 from "./Partials/C1";
import { useState } from "react";
import C2 from "./Partials/C2";
import C3 from "./Partials/C3";
import C4 from "./Partials/C4";

export default function PersonalDataSheet() {
    const [activeTab, setActiveTab] = useState<"c1"|"c2"|"c3"|"c4"|string>("c4")

    return (
        <div className="mt-8">
            <div className="w-full border-b mb-6">
                <Tabs 
                    id="pds"
                    active={activeTab}
                    tabs={[
                        {id: "c1", label: "C1"},
                        {id: "c2", label: "C2"},
                        {id: "c3", label: "C3"},
                        {id: "c4", label: "C4"},
                    ]}
                    className="w-fit"
                    navigate={setActiveTab}
                />
            </div>
            
            {activeTab === "c1" && <C1 />}
            {activeTab === "c2" && <C2 />}
            {activeTab === "c3" && <C3 />}
            {activeTab === "c4" && <C4 />}

            {/* C3 */}
            {/* <div className="">
                <div className="">
                    <div className="font-medium uppercase italic">
                        VI. VOLUNTARY WORK OR INVOLVEMENT IN CIVIC /
                        NON-GOVERNMENT / PEOPLE / VOLUNTARY
                        ORGANIZATION/S
                    </div>
                </div>

                <div className="">
                    <div className="font-medium uppercase italic">
                        VII. LEARNING AND DEVELOPMENT (L&D)
                        INTERVENTIONS/TRAINING PROGRAMS ATTENDED
                    </div>
                </div>

                <div className="">
                    <div className="font-medium uppercase italic">
                        VIII. OTHER INFORMATION
                    </div>
                </div>
            </div> */}
        </div>
    );
}
