import Tabs from "@/Components/framer/Tabs";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { PageProps, User } from "@/types";
import { router } from "@inertiajs/react";
import { format } from "date-fns";
import React, { useEffect, useState } from "react";
import ViewCertificate from "./ViewCertificate";

type SERVICERECORDTYPE = {
    id: number;
    user: Pick<
        User,
        "id" | "first_name" | "last_name" | "middle_name" | "avatar"
    >;
    user_id: number;
    file_name: string;
    file_path: string;
    date_from: string;
    date_to: string;
    credits: number;
    venue: string;
    organizer: string;
    approved: "approved" | "rejected" | "pending";
    created_at: string;
    remaining_credits: number;
};

type Props = PageProps & {
    pageData: Array<SERVICERECORDTYPE>;
    status: string;
};

const HrServiceRecord: React.FC<Props> = ({ auth, pageData, status }) => {
    const [loading, setLoading] = useState(false);
    const [showCertificate, setShowCertificate] = useState(false);
    const [certificate, setCertificate] = useState<SERVICERECORDTYPE | null>(
        null
    );

    useEffect(() => {
        let onFinishListener = router.on("finish", () => {
            setLoading(false);
        });

        return () => {
            onFinishListener();
        };
    }, [loading]);

    return (
        <Authenticated
            userAuth={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Service records
                </h2>
            }
        >
            <div className="divide-x flex mt-5 text-sm border-b-2">
                <Tabs
                    id="personnel-tab"
                    active={status}
                    navigate={(nav) => {
                        router.get(
                            route("myapprovals.service-records", {
                                _query: { status: nav },
                            })
                        );
                        setLoading(true);
                    }}
                    tabs={[
                        { id: "pending", label: "Pending" },
                        { id: "approved", label: "Approved" },
                        { id: "rejected", label: "Rejected" },
                    ]}
                />
            </div>

            <div className="divide-y mx-auto mt-10 min-h-[22rem] max-w-5xl w-full">
                <div className="grid grid-cols-[1fr,1fr,12rem] py-2 [&>div:first-child]:pl-1 [&>div]:font-medium opacity-60">
                    <div className="">Personnel name</div>
                    <div className="">Name</div>
                    <div className="text-center">Date</div>
                </div>

                {pageData.length === 0 && !loading && (
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
                            className="grid grid-cols-[1fr,1fr,12rem] py-3 [&>div:first-child]:pl-1 hover:bg-secondary"
                            role="button"
                            onClick={() => {
                                setCertificate(data);
                                setShowCertificate(true);
                            }}
                        >
                            <div className="capitalize">{`${
                                data.user.last_name
                            }, ${data.user.first_name} ${
                                data.user.middle_name ?? ""
                            }`}</div>
                            <div className="">{data.file_name}</div>
                            <div className="text-center">
                                {format(data.created_at, "LLLL d, y")}
                            </div>
                        </div>
                    ))}
            </div>

            <ViewCertificate
                user={`${certificate?.user.last_name}, ${
                    certificate?.user.first_name
                } ${certificate?.user.middle_name ?? ""}`}
                certificate={certificate}
                show={showCertificate}
                onClose={() => {
                    setShowCertificate(false);
                    setTimeout(() => setCertificate(null), 400);
                }}
                isHR={auth.user.role == "HR"}
            />
        </Authenticated>
    );
};

export default HrServiceRecord;
