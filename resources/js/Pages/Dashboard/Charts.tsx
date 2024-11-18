import React from "react";

import {
    Bar,
    BarChart,
    CartesianGrid,
    LabelList,
    XAxis,
    YAxis,
} from "recharts";
import { ChartConfig, ChartContainer } from "@/Components/ui/chart";
import useWindowSize from "@/hooks/useWindowResize";

type Props = {
    chartData: Array<{ type: string, leave: number }>
}

const Charts: React.FC<Props> = ({ chartData }) => {
    const windowSize = useWindowSize();

    const chartConfig = {} satisfies ChartConfig;

    return (
        <div>
            {windowSize.width > 600 ? (
                <ChartContainer
                    config={chartConfig}
                    className="h-[300px] w-full [@media(min-width:1290px)]:w-[45rem]"
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

                        <Bar
                            dataKey="leave"
                            fill="#f59e0b"
                            radius={3}
                        >
                            <LabelList
                                position="insideTop"
                                offset={8}

                                className="fill-[#78350f]"
                                fontSize={12}
                            />
                        </Bar>
                        <Bar
                            dataKey="rejected"
                            fill="#84cc16"
                            radius={3}
                        >
                            <LabelList
                                position="insideTop"
                                offset={8}

                                className="fill-[#3f6212]"
                                fontSize={12}
                            />
                        </Bar>

                    </BarChart>
                </ChartContainer>
            ) : (
                <ChartContainer
                    config={chartConfig}
                    className="h-[28rem] w-full"
                >
                    <BarChart
                        accessibilityLayer
                        data={chartData}
                        layout="vertical"
                        margin={{
                            left: -20,
                        }}
                    >
                        <CartesianGrid horizontal={false} />
                        <XAxis type="number" />
                        <YAxis
                            dataKey="type"
                            type="category"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                        />
                        <Bar
                            dataKey="leave"
                            fill="#f59e0b"
                            radius={5}
                        >
                            <LabelList
                                dataKey="leave"
                                position="insideRight"
                                offset={8}
                                className="fill-[#78350f]"
                                fontSize={12}
                            />
                        </Bar>
                        <Bar
                            dataKey="rejected"
                            fill="#84cc16"
                            radius={5}
                        >
                            <LabelList
                                dataKey="rejected"
                                position="insideRight"
                                offset={8}
                                className="fill-[#3f6212]"
                                fontSize={12}
                            />
                        </Bar>
                    </BarChart>
                </ChartContainer>
            )}

            <div className="mx-auto w-fit mt-3 text-center">
                <div className="font-medium">Leave applications</div>
                <div className="flex items-center gap-5">
                    <div className="flex items-center gap-2 text-sm">
                        <div className="size-3 shrink-0 rounded-sm bg-[#f59e0b]"></div>
                        <div>Approved Leave</div>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                        <div className="size-3 shrink-0 rounded-sm bg-[#84cc16]"></div>
                        <div>Rejected Leave</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Charts;
