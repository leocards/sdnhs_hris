import Filter from "@/Components/buttons/FilterButton";
import DataList from "@/Components/DataList";
import { Button } from "@/Components/ui/button";
import { useToast } from "@/Components/ui/use-toast";
import PageListProvider, { usePageList } from "@/hooks/pageListProvider";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { PageProps, PaginateData } from "@/types";
import { router } from "@inertiajs/react";
import { format } from "date-fns";
import { Eye, PencilLine } from "lucide-react";
import React, { useEffect, useState } from "react";
import ViewSaln from "./ViewSaln";
import Tabs from "@/Components/framer/Tabs";

type Props = {
    success: string;
    saln: PaginateData;
    status: string;
} & PageProps;

const StatementOfAssetsLiabilityAndNetworth: React.FC<Props> = (props) => {
    return (
        <PageListProvider>
            <Saln {...props} />
        </PageListProvider>
    );
};

const Saln: React.FC<Props> = ({ auth, success, saln, status }) => {
    const [filter, setFilter] = useState("");
    const { data, setList } = usePageList();
    const [viewSaln, setViewSaln] = useState(false)
    const [selected, setSelected] = useState<{
        id: number;
        user_id: number;
        asof: string;
        date: string;
        isjoint: "joint"|"separate"|"none";
        isApproved: number | null;
        created_at: string;
        updated_at: string;
        saln_liability_sum_balances: number;
        saln_assets_sum_cost: number;
    }|null>(null)
    const [loading, setLoading] = useState(false)

    const { toast } = useToast();

    useEffect(() => {
        if(success) {
            toast({
                variant: 'success',
                description: success
            })
        }
    }, [success])

    useEffect(() => {
        setList(saln)
    }, [])

    return (
        <Authenticated
            userAuth={auth.user}
            header={
                <h2 className="font-semibold text-xl leading-tight">SALN</h2>
            }
        >
            <div className="divide-x flex items-center mt-5 text-sm border-b-2 mb-10">
                <Tabs
                    id="personnel-tab"
                    active={status}
                    navigate={(nav) => {
                        router.get(
                            route("saln", {
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
                <Button
                    className="ml-auto px-7"
                    onClick={() => router.get(route("saln.create"))}
                >
                    Add SALN
                </Button>
            </div>

            <div className="divide-y min-h-[22rem]">
                <div className="grid grid-cols-[repeat(4,1fr),5rem] py-2 [&>div:first-child]:pl-1 [&>div]:font-medium opacity-60">
                    <div className="">Assets</div>
                    <div className="">Liabilities</div>
                    <div className="">Net worth</div>
                    <div className="">As of</div>
                    <div className=""></div>
                </div>

                <DataList empty={data.length === 0} loading={loading}>
                    {data.map((list, index) => (
                        <div
                            key={index}
                            className="grid grid-cols-[repeat(4,1fr),5rem] py-2 [&>div:first-child]:pl-1 [&>div]:font-medium opacity-60 hover:bg-secondary [&>div]:flex [&>div]:items-center"
                        >
                            <div className="">
                                <div className="line-clamp-1">&#8369; {Number(list.saln_assets_sum_cost).toLocaleString()}</div>
                            </div>
                            <div className="">
                                <div className="line-clamp-1">&#8369; {Number(list.saln_liability_sum_balances).toLocaleString()}</div>
                            </div>
                            <div className="">
                                <div className="line-clamp-1">&#8369; {Number(list.saln_assets_sum_cost-list.saln_liability_sum_balances).toLocaleString()}</div>
                            </div>
                            <div className="">
                                <div className="line-clamp-1">{format(list.asof, 'PP')}</div>
                            </div>
                            <div className="justify-center gap-3">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="size-7 before:hover:bg-gray-300"
                                    onClick={() => {
                                        setSelected(list);
                                        setViewSaln(true);
                                    }}
                                >
                                    <Eye className="size-5" strokeWidth={1.8} />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="size-7 before:hover:bg-gray-300"
                                    onClick={() => router.get(route("saln.create", [list.id]))}
                                >
                                    <PencilLine className="size-5" strokeWidth={1.8} />
                                </Button>
                            </div>
                        </div>
                    ))}
                </DataList>
            </div>

            <ViewSaln show={viewSaln} onClose={setViewSaln} saln={selected} user={auth.user} />
        </Authenticated>
    );
};

export default StatementOfAssetsLiabilityAndNetworth;
