import Tabs from "@/Components/framer/Tabs";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { PageProps } from "@/types";
import { router } from "@inertiajs/react";
import React, { useEffect, useState } from "react";
import ViewPDS from "../Personnel/ViewPds";
import { format } from "date-fns";

type PERSONALDATASHEETTYPE = {
    id: number;
    first_name: string;
    last_name: string;
    middle_name: string;
    avatar: string;
    pds_personal_information: {
        id: number;
        updated_at: string;
    };
};

type Props = {
    pageData: Array<PERSONALDATASHEETTYPE>;
    status: string;
    view: string;
} & PageProps;

const PersonalDataSheets: React.FC<Props> = ({ auth, pageData, status, view }) => {
    const [loading, setLoading] = useState(false);
    const [selectedPds, setSelectedPds] = useState<number|null>(view?!isNaN(parseInt(view))?parseInt(view):null:null);
    const [showPds, setShowPds] = useState(view?!isNaN(parseInt(view))?true:false:false)

    useEffect(() => {
        let onFinishLitener = router.on("finish", () => {
            setLoading(false);
        });

        return () => {
            onFinishLitener();
        };
    }, [loading]);

    return (
        <Authenticated
            userAuth={auth.user}
            header={
                <h2 className="font-semibold text-xl leading-tight capitalize">
                    (PDS) Personal data sheet
                </h2>
            }
        >
            <div className="divide-x flex mt-5 text-sm border-b-2">
                <Tabs
                    id="personnel-tab"
                    active={status}
                    navigate={(nav) => {
                        router.get(route("myapprovals.pds", { _query: { status: nav } }));
                        setLoading(true);
                    }}
                    tabs={[
                        { id: "pending", label: "Pending" },
                        { id: "approved", label: "Approved" },
                    ]}
                />
            </div>

            <div className="divide-y max-w-3xl w-full mx-auto mt-10 min-h-[22rem]">
                <div className="grid grid-cols-[1fr,12rem] py-2 [&>div:first-child]:pl-1 [&>div]:font-medium opacity-60 capitalize">
                    <div className="">Name</div>
                    <div className="text-center">Date modified</div>
                </div>

                {(pageData.length === 0 && !loading) && (
                    <div className="text-center py-4">No records</div>
                )}

                {loading && (
                    <div className="py-8">
                        <div className="w-fit h-fit mx-auto my-auto flex items-center gap-2">
                            <span className="loading loading-spinner loading-md"></span>
                            <span>Loading...</span>
                        </div>
                    </div>
                )}

                {!loading &&
                    pageData.map((data, index) => (
                        <div
                            key={index}
                            className="grid grid-cols-[1fr,12rem] py-3 [&>div:first-child]:pl-1 hover:bg-secondary"
                            role="button"
                            onClick={() => {
                                setSelectedPds(data.id);
                                setShowPds(true)
                            }}
                        >
                            <div className="capitalize">{`${data.last_name}, ${
                                data.first_name
                            } ${data.middle_name ?? ""}`}</div>
                            <div className="text-center">
                                {format(
                                    data.pds_personal_information.updated_at,
                                    "LLLL d, y"
                                )}
                            </div>
                        </div>
                    ))}
            </div>

            <ViewPDS
                authId={selectedPds ?? 0}
                show={showPds}
                onClose={() => {
                    setShowPds(false);
                    setSelectedPds(null);
                }}
            />
        </Authenticated>
    );
};

export default PersonalDataSheets;
