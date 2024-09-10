import { Fragment, useMemo, useState } from "react";
import { Button } from "@/Components/ui/button";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

type ListType = {
    jhs: Array<any>;
    shs: Array<any>;
    accounting: Array<any>;
    principal: Array<any>;
};

type FilteredListType = {
    male: { [key in keyof any]: number };
    female: { [key in keyof any]: number };
};

const ListOfEmployees = ({ list }: { list: ListType }) => {
    const [showList, setShowList] = useState(true);
    const filteredList: FilteredListType = useMemo(() => {
        const categories = ["jhs", "shs", "accounting", "principal"] as const;
        const result: FilteredListType = {
            male: { jhs: 0, shs: 0, accounting: 0, principal: 0 },
            female: { jhs: 0, shs: 0, accounting: 0, principal: 0 },
        };

        categories.forEach((category) => {
            result.male[category] = list[category].filter(
                (item: any) => item.sex === "Male"
            ).length;
            result.female[category] = list[category].filter(
                (item: any) => item.sex === "Female"
            ).length;
        });

        return result;
    }, [list]);

    const empListCategory = {
        jhs: "Junior High School",
        shs: "Senior High School",
        accounting: "Accounting",
        principal: "Principal"
    }

    return (
        <div className="mt-10">
            <div className="flex justify-between items-center mb-5">
                <div className="flex items-center gap-3">
                    <Button
                        className="size-6"
                        size="icon"
                        variant="ghost"
                        onClick={() => setShowList(!showList)}
                    >
                        <ChevronDown
                            className={cn(
                                "size-5 transition duration-200",
                                showList && "rotate-180"
                            )}
                        />
                    </Button>
                    <div className="font-semibold uppercase">
                        List of Employees
                    </div>
                </div>
                <Button className="h-8 hidden">Print</Button>
            </div>

            {showList && (
                <div>
                    <div className="border mb-4 divide-y rounded-md [&>div>div:nth-child(4)]:text-red-500">
                        <div className="divide-x grid grid-cols-[1fr,repeat(3,5rem)] text-center [&>div]:p-1.5 font-semibold">
                            <div></div>
                            <div>MALE</div>
                            <div>FEMALE</div>
                            <div>TOTAL</div>
                        </div>
                        {(["jhs", "shs", "accounting", "principal"] as const).map((category) => {
                            return (
                                <div
                                    key={category}
                                    className="divide-x grid grid-cols-[1fr,repeat(3,5rem)] text-center [&>div]:p-1.5"
                                >
                                    <div className="text-left uppercase">
                                        {empListCategory[category]}
                                    </div>
                                    <div>{filteredList.male[category]}</div>
                                    <div>{filteredList.female[category]}</div>
                                    <div>
                                        {filteredList.male[category] +
                                            filteredList.female[category]}
                                    </div>
                                </div>
                            );
                        })}
                        <div className="divide-x grid grid-cols-[1fr,repeat(3,5rem)] text-center [&>div]:p-1.5">
                            <div></div>
                            <div>
                                {Object.values(filteredList.male).reduce(
                                    (sum, value) => sum + value,
                                    0
                                )}
                            </div>
                            <div>
                                {Object.values(filteredList.female).reduce(
                                    (sum, value) => sum + value,
                                    0
                                )}
                            </div>
                            <div>
                                {Object.values(filteredList.male).reduce(
                                    (sum, value) => sum + value,
                                    0
                                ) +
                                    Object.values(filteredList.female).reduce(
                                        (sum, value) => sum + value,
                                        0
                                    )}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-[repeat(3,minmax(17rem,1fr))] gap-2">
                        <div className="rounded-lg overflow-hidden">
                            <div className="bg-zinc-200 dark:bg-white/10 p-2 font-semibold rounded-t-lg">
                                Junior High School
                            </div>
                            <div className="divide-y border rounded-b-lg max-h-[35rem] overflow-y-auto rounded-scrollbar [&::-webkit-scrollbar]:!bg-zinc-100">
                                <div className="divide-y">
                                    {list.jhs.map(({ name }, index) => (
                                        <Fragment key={index}>
                                            <div className="grid grid-cols-[3rem,1fr] [&>div]:p-2">
                                                <div className="text-right pr-1 border-r">
                                                    {++index}
                                                </div>
                                                <div className="pl-2">
                                                    {name}
                                                </div>
                                            </div>
                                        </Fragment>
                                    ))}
                                    {list.jhs.length === 0 && (
                                        <div className="py-2 text-center text-secondary-foreground/30">
                                            No records
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="">
                            <div className="bg-zinc-200 dark:bg-white/10 p-2 font-semibold rounded-t-lg">
                                Senior High School
                            </div>
                            <div className="divide-y border rounded-b-lg">
                                <div className="divide-y max-h-[35rem] overflow-y-auto rounded-scrollbar [&::-webkit-scrollbar]:!bg-zinc-100">
                                    {list.shs.map(({ name }, index) => (
                                        <Fragment key={index}>
                                            <div className="grid grid-cols-[3rem,1fr] [&>div]:p-2">
                                                <div className="text-right pr-1 border-r">
                                                    {++index}
                                                </div>
                                                <div className="pl-2">
                                                    {name}
                                                </div>
                                            </div>
                                        </Fragment>
                                    ))}
                                    {list.shs.length === 0 && (
                                        <div className="py-2 text-center text-secondary-foreground/30">
                                            No records
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="">
                            <div className="bg-zinc-200 dark:bg-white/10 p-2 font-semibold rounded-t-lg">
                                Accounting
                            </div>
                            <div className="divide-y border rounded-b-lg">
                                <div className="divide-y max-h-[35rem] overflow-y-auto rounded-scrollbar [&::-webkit-scrollbar]:!bg-zinc-100">
                                    {list.accounting.map(({ name }, index) => (
                                        <Fragment key={index}>
                                            <div className="grid grid-cols-[3rem,1fr] [&>div]:p-2">
                                                <div className="text-right pr-1 border-r">
                                                    {++index}
                                                </div>
                                                <div className="pl-2">
                                                    {name}
                                                </div>
                                            </div>
                                        </Fragment>
                                    ))}
                                    {list.accounting.length === 0 && (
                                        <div className="py-2 text-center text-secondary-foreground/30">
                                            No records
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ListOfEmployees;
