import Tabs from "@/Components/framer/Tabs";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { PageProps } from "@/types";
import { router } from "@inertiajs/react";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import ViewSalnPersonnel from "../Personnel/ViewSalnPersonnel";

type SALNTYPE = {
    id: number;
    asof: string;
    user: {
        id: number;
        first_name: string;
        last_name: string;
        middle_name: string;
        avatar: string;
    };
};

type Prop = {
    status: string;
    saln: Array<SALNTYPE>;
    open: string
} & PageProps;

const SALNPage: React.FC<Prop> = ({ auth, saln, status, open }) => {
    const [loading, setLoading] = useState(false);
    const [selectedSaln, setSelectedSaln] = useState<number | null>(open?parseInt(open):null);
    const [showSaln, setShowSaln] = useState(false);

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
                <h2 className="font-semibold text-xl leading-tight">
                    (SALN) Statement of Assests, Liabilities, and Networth
                </h2>
            }
        >
            <div className="divide-x flex mt-5 text-sm border-b-2">
                <Tabs
                    id="personnel-tab"
                    active={status}
                    navigate={(nav) => {
                        router.get(
                            route("myapprovals.saln", {
                                _query: { status: nav },
                            })
                        );
                        setLoading(true);
                    }}
                    tabs={[
                        { id: "pending", label: "Pending" },
                        { id: "approved", label: "Approved" },
                    ]}
                />
            </div>

            <div className="divide-y max-w-3xl mx-auto mt-10 min-h-[22rem]">
                <div className="grid grid-cols-[1fr,12rem] py-2 [&>div:first-child]:pl-1 [&>div]:font-medium opacity-60">
                    <div className="">Name</div>
                    <div className="text-center">As of</div>
                </div>

                {saln.length === 0 && !loading && (
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
                    saln.map((data, index) => (
                        <div
                            key={index}
                            className="grid grid-cols-[1fr,12rem] py-3 [&>div:first-child]:pl-1 hover:bg-secondary"
                            role="button"
                            onClick={() => {
                                setSelectedSaln(data.id)
                                setShowSaln(true)
                            }}
                        >
                            <div className="capitalize">{`${
                                data.user.last_name
                            }, ${data.user.first_name} ${
                                data.user.middle_name ?? ""
                            }`}</div>
                            <div className="text-center">
                                {format(data.asof, "LLLL d, y")}
                            </div>
                        </div>
                    ))}
            </div>

            <ViewSalnPersonnel
                show={showSaln}
                id={selectedSaln}
                onClose={() => {
                    setShowSaln(false);
                    setSelectedSaln(null);
                }}
            />
        </Authenticated>
    );
};

export default SALNPage;
