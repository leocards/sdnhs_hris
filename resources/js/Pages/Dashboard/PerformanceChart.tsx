import { TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card";
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/Components/ui/chart";

type Props = {
    sy_ratings?: Array<{
        rating: number;
        sy: string;
    }>;
};

const PerformanceChart = ({ sy_ratings }: Props) => {
    const chartData =
        sy_ratings && sy_ratings.length > 0
            ? sy_ratings
            : [{ sy: "", rating: 0 }];

    const chartConfig = {
        rating: {
            label: "Ratings",
            color: "hsl(var(--chart-1))",
        },
    } satisfies ChartConfig;

    console.log(sy_ratings)

    return (
        <Card className="mt-8">
            <CardHeader>
                <CardTitle>Yearly Performance</CardTitle>
                <CardDescription>
                    Showing the performance ratings for the last 6 school years
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer
                    config={chartConfig}
                    className="h-[300px] w-full"
                >
                    <AreaChart
                        accessibilityLayer
                        data={chartData}
                        margin={{
                            left: 12,
                            right: 12,
                        }}
                    >
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="sy"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                        />
                        <YAxis
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            tickCount={3}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent />}
                        />
                        <defs>
                            <linearGradient
                                id="fillRating"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                            >
                                <stop
                                    offset="5%"
                                    stopColor="hsl(var(--chart-1))"
                                    stopOpacity={0.8}
                                />
                                <stop
                                    offset="95%"
                                    stopColor="hsl(var(--chart-1))"
                                    stopOpacity={0.1}
                                />
                            </linearGradient>
                        </defs>
                        <Area
                            dataKey="rating"
                            type="natural"
                            fill="url(#fillRating)"
                            fillOpacity={0.4}
                            stroke="hsl(var(--chart-1))"
                            stackId="a"
                        />
                    </AreaChart>
                </ChartContainer>
            </CardContent>
            <CardFooter>
                <div className="flex w-full items-start gap-2 text-sm">
                    <div className="grid gap-2">
                        <div className="flex items-center gap-2 leading-none text-muted-foreground">
                            School Year/s{" "}
                            {sy_ratings &&
                                (sy_ratings?.length >= 2
                                    ? `${sy_ratings[0].sy} - ${sy_ratings[sy_ratings.length - 1].sy}`
                                    : sy_ratings?.length == 1 &&
                                      sy_ratings[0].sy)}
                        </div>
                    </div>
                </div>
            </CardFooter>
        </Card>
    );
};

export default PerformanceChart;
