import React, { useState } from "react";

import {
    Bar,
    BarChart,
    CartesianGrid,
    LabelList,
    XAxis,
    YAxis,
} from "recharts";
import {
    ChartConfig,
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
} from "@/Components/ui/chart";
import useWindowSize from "@/hooks/useWindowResize";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card";
import Filter from "@/Components/buttons/FilterButton";
import Processing from "@/Components/Processing";

type Props = {
    chartData: Array<{ type: string; approved: number; rejected: number }>;
    appliedLeavesOfPersonnel: Array<{
        leave_type: string;
    }>;
    onSelectSy: (sy: string) => void
    syList: Array<{ sy: string }>
    sy: string
    loading: boolean
};

const Charts: React.FC<Props> = ({ chartData, appliedLeavesOfPersonnel, loading, syList, onSelectSy, sy }) => {
    const [filter, setFilter] = useState(sy)
    const chartConfig = {
        approved: {
            label: "Approved",
        },
        rejected: {
            label: "Rejected",
        },
    } satisfies ChartConfig;

    return (
        <Card className="w-full relative overflow-hidden">
            {loading && (
                <div className="absolute size-full z-20 bg-black/50 top-0 left-0 flex items-center justify-center">
                    <div className="flex items-center gap-3">
                        <span className="loading loading-spinner loading-md bg-white"></span>
                        <span className="text-white">Loading</span>
                    </div>
                </div>
            )}
            <CardHeader className="flex items-center gap-2 space-y-0 border-b py-2 sm:flex-row">
                <div className="grid flex-1 gap- text-center sm:text-left">
                    <CardTitle className="text-base">
                        Leave Applications
                    </CardTitle>
                    <CardDescription className="">
                        Showing total applications of SY {filter}
                    </CardDescription>
                </div>
                <Filter
                    filter="School Year"
                    active={filter}
                    items={syList.map((sy) => ({
                        filter: sy?.sy,
                        onClick: (fil) => {
                            if(fil != filter){
                                onSelectSy(fil)
                                setFilter(fil)
                            }
                        },
                    }))}
                    withClear={false}
                    labelClass="sm:block hidden"
                    size="sm"
                    position="BOTTOMLEFT"
                />
            </CardHeader>

            <CardContent className="pb-2 pt-2">
                <ChartContainer
                    config={chartConfig}
                    className="h-[300px] w-full"
                >
                    <BarChart className="" accessibilityLayer data={chartData}>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="type"
                            tickLine={false}
                            tickMargin={15}
                            axisLine={false}
                            className="font-medium"
                        />
                        <YAxis width={30} className="font-medium text-[10px]" />

                        <Bar dataKey="approved" fill="#84cc16" radius={3}>
                            <LabelList
                                position="insideTop"
                                offset={8}
                                valueAccessor={(val: any) => {
                                    if (val.value != 0) return val.value;
                                }}
                                className="fill-[#3f6212]"
                                fontSize={12}
                            />
                        </Bar>
                        <Bar dataKey="rejected" fill="#ec4899" radius={3}>
                            <LabelList
                                position="insideTop"
                                offset={8}
                                valueAccessor={(val: any) => {
                                    if (val.value != 0) return val.value;
                                }}
                                className="fill-[#831843]"
                                fontSize={12}
                            />
                        </Bar>
                        <ChartLegend
                            content={<ChartLegendContent className="text-sm" />}
                        />
                    </BarChart>
                </ChartContainer>
            </CardContent>

            <CardFooter className="border-t p-2">
                {[...appliedLeavesOfPersonnel].map((leave, index) => (
                    <div key={index} className="flex items-center text-sm m-1 border p-1 px-1.5 rounded shadow-sm">
                        <div className="min-w-8 font-semibold">L{1 + index} - </div>
                        <div className="">{leave.leave_type}</div>
                    </div>
                ))}
            </CardFooter>
        </Card>
    );
};

export default Charts;
