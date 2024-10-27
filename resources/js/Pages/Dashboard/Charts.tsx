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
                    className="h-[300px] w-full min-[1150px]:w-[28rem] [@media(min-width:1290px)]:w-[45rem]"
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
                            fill="hsl(var(--primary))"
                            radius={3}
                        >
                            <LabelList
                                position="insideTop"
                                offset={8}

                                className="fill-primary-foreground"
                                fontSize={12}
                            />
                        </Bar>
                    </BarChart>
                </ChartContainer>
            ) : (
                <ChartContainer
                    config={chartConfig}
                    className="h-[26rem] w-full"
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
                            fill="hsl(var(--primary))"
                            radius={5}
                        >
                            <LabelList
                                dataKey="leave"
                                position="insideRight"
                                offset={8}
                                className="fill-primary-foreground"
                                fontSize={12}
                            />
                        </Bar>
                    </BarChart>
                </ChartContainer>
            )}

            <div className="mx-auto w-fit mt-3 text-center">
                <div className="font-medium">Leave applications</div>
                <div className="text-foreground/60 text-sm">Showing the number of submitted leave applications per type of leave for the year 2024.</div>
            </div>
        </div>
    );
};

export default Charts;
