import Tabs from "@/Components/framer/Tabs";
import C1 from "./C1";
import { useEffect, useState } from "react";
import C2 from "./C2";
import C3 from "./C3";
import C4 from "./C4";
import { router, usePage } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import { Download } from "lucide-react";
import { Margin, usePDF } from "react-to-pdf";
import { User, UserInfo } from "@/types";
import { cn } from "@/lib/utils";

export type UserInfoType = User &
    UserInfo & {
        pds_educational_background: Array<any>;
        pds_family_background: Array<any>;
        pds_personal_information: any;
        pds_civil_service_eligibility: any;
        pds_work_experience: any;
        pds_voluntary_work: any;
        pds_learning_development: any;
        pds_other_information: any;
        pds_cs4: any;
        pds_government: any;
        pds_reference: any;
        birth_place: string;
        civil_status: string;
        height: string;
        weight: string;
    };

type Props = {
    user: UserInfoType;
    isApprovedPds: boolean;
};

export default function PersonalDataSheet({ user, isApprovedPds }: Props) {
    const [processing, setProcessing] = useState(false);
    const [data, setData] = useState<any>();

    const { url } = usePage();
    // Get the full URL with query parameters
    const currentUrl = url;
    // Get query parameters
    const queryParams = new URLSearchParams(currentUrl.split("?")[1]);
    // Example: Get a specific query parameter
    const activeTab = queryParams.get("c") ?? "C1";
    const activeSubTab =
        queryParams.get("section") ??
        (activeTab === "C1" ? "I" : activeTab === "C2" ? "IV" : "VI");

    const download_pdf = usePDF({
        method: "save",
        filename: "Personal Data Sheet.pdf",
        page: { format: "A4", margin: Margin.MEDIUM },
    });

    useEffect(() => {
        try {
            const pds = window.axios.get(
                route("general-search.pds", [user.id])
            );
            const authUser = window.axios.get(
                route("personnel.view-pds.user", [user.id])
            );

            Promise.all([pds, authUser]).then((responses) => {
                const [pds, authUser] = responses;

                setData({ ...pds.data, ...authUser.data });
            });
        } catch (error) {
            console.error(error);
        }
    }, []);

    return (
        <div className="mt-8">
            <div className="w-full border-b mb-2 flex items-center">
                <Tabs
                    id="pds"
                    active={activeTab}
                    tabs={[
                        { id: "C1", label: "C1" },
                        { id: "C2", label: "C2" },
                        { id: "C3", label: "C3" },
                        { id: "C4", label: "C4" },
                    ]}
                    className="w-fit"
                    tabWidth="w-14"
                    navigate={(nav) => {
                        setProcessing(true);
                        router.get(
                            route("pds", {
                                _query: {
                                    c: nav,
                                },
                            }),
                            undefined,
                            {
                                onFinish: () => setProcessing(false),
                            }
                        );
                    }}
                />

                <div className={cn(isApprovedPds ? "text-green-500" : "text-amber-500", "ml-auto")}>{isApprovedPds?"Approved":"Pending"}</div>

                <Button
                    className="ml-3"
                    size={"icon"}
                    variant={"ghost"}
                    disabled={!isApprovedPds}
                    onClick={() => (isApprovedPds) && download_pdf.toPDF()}
                >
                    <Download className="size-5" />
                </Button>
            </div>

            {processing ? (
                <div className="relative w-fit mx-auto py-4">
                    <span className="loading loading-spinner loading-md"></span>
                </div>
            ) : (
                <>
                    {activeTab === "C1" && (
                        <C1
                            user={user}
                            activeTab={activeSubTab}
                            pds_c={activeTab}
                            data={data}
                            ref={download_pdf.targetRef}
                        />
                    )}

                    {activeTab === "C2" && (
                        <C2
                            user={user}
                            activeTab={activeSubTab}
                            pds_c={activeTab}
                            data={data}
                            ref={download_pdf.targetRef}
                        />
                    )}
                    {activeTab === "C3" && (
                        <C3
                            user={user}
                            activeTab={activeSubTab}
                            pds_c={activeTab}
                            data={data}
                            ref={download_pdf.targetRef}
                        />
                    )}
                    {activeTab === "C4" && (
                        <C4
                            user={user}
                            data={data}
                            ref={download_pdf.targetRef}
                        />
                    )}
                </>
            )}
        </div>
    );
}
