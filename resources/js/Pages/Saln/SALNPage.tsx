import Tabs from "@/Components/framer/Tabs";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { PageProps } from "@/types";
import { router } from "@inertiajs/react";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import ViewSalnPersonnel from "../Personnel/ViewSalnPersonnel";
import { useToast } from "@/Components/ui/use-toast";
import { Button } from "@/Components/ui/button";
import { cn } from "@/lib/utils";
import Processing from "@/Components/Processing";

type SALNTYPE = {
    id: number;
    asof: string;
    isjoint: string;
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
    const [processing, setProcessing] = useState(false);
    const [selectedSaln, setSelectedSaln] = useState<number | null>(open?parseInt(open):null);
    const [showSaln, setShowSaln] = useState(false);
    const { toast } = useToast();

    const onApproveSaln = (id: number, isjoint: string) => {
        setProcessing(true)
        router.post(
            route("myapprovals.saln.approve", [id]),
            {
                isApprove: true,
                isjoint: isjoint
            },
            {
                onSuccess: () => {
                    toast({
                        variant: "success",
                        description: "SALN has been approved.",
                    });
                },
                onError: (error) => {
                    if ("0" in error) {
                        toast({
                            variant: "destructive",
                            description: error[0],
                        });
                    }
                },
                onFinish: () => {
                    setProcessing(false);
                },
            }
        );
    };

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

            <div className="divide-y mx-auto mt-10 min-h-[22rem] max-w-4xl w-full">
                <div className={cn(
                    "grid py-2 [&>div:first-child]:pl-1 [&>div]:font-medium opacity-60 capitalize",
                    auth.user.role == "HR" && status == "pending" ? "grid-cols-[1fr,12rem,8rem]" : "grid-cols-[1fr,12rem]"
                )}>
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
                            className={cn(
                                "grid items-center [&>div:first-child]:pl-1 hover:bg-secondary",
                                auth.user.role == "HR" && status == "pending" ? "grid-cols-[1fr,12rem,8rem] py-2" : "grid-cols-[1fr,12rem] py-3"
                            )}
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
                            {(auth.user.role == "HR" && status == "pending") && (<div className="flex pr-2">
                                <Button
                                    className="!bg-green-700 text-xs h-8 ml-auto"
                                    onClick={() => onApproveSaln(data.id, data.isjoint)}
                                >
                                    Approve
                                </Button>
                            </div>)}
                        </div>
                    ))}
            </div>

            <Processing is_processing={processing} />
        </Authenticated>
    );
};

export default SALNPage;
