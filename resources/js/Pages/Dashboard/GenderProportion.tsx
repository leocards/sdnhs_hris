import { TrendingUp } from "lucide-react";
import { LabelList, Pie, PieChart } from "recharts";

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
    genderProportion: {
        Male?: number
        Female?: number
    }
}

export default function GenderProportion({ genderProportion }: Props) {
    const chartConfig = {
        gender: {
            label: "gender",
        },
        male: {
            label: "Male",
            color: "hsl(var(--chart-1))",
        },
        female: {
            label: "Female",
            color: "hsl(var(--chart-2))",
        }
    } satisfies ChartConfig;

    const chartData = [
        { gender: "male", count: genderProportion?.Male||0, fill: "hsl(var(--chart-1))" },
        { gender: "female", count: genderProportion?.Female||0, fill: "hsl(var(--chart-2))" },
    ];

    return (
        <Card className="flex flex-col">
            <CardHeader className="items-center pb-0">
                <CardTitle className="text-lg">Personnel Gender Proportion</CardTitle>
            </CardHeader>
            <CardContent className="pb-0 my-auto rin">
                <ChartContainer
                    config={chartConfig}
                    className="mx-auto aspect-square max-h-[260px] pb-0 [&_.recharts-pie-label-text]:fill-foreground"
                >
                    <PieChart>
                        <ChartTooltip
                            content={<ChartTooltipContent nameKey="count" hideLabel />}
                        />
                        <Pie
                            data={chartData}
                            dataKey="count"
                            label
                            nameKey="gender"
                        >
                            <LabelList
                                dataKey="gender"
                                className="fill-white"
                                stroke="none"
                                fontSize={11}
                                formatter={(value: keyof typeof chartConfig) =>
                                    chartConfig[value]?.label
                                }
                            />
                        </Pie>
                    </PieChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col gap-2 text-sm">
                <div className="leading-none text-muted-foreground text-center">
                    Showing the proportion of personnel based on gender.
                </div>
            </CardFooter>
        </Card>
    );
}
