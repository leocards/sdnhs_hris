import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormProps,
} from "@/Components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import NumberInput from "@/Components/NumberInput";
import { PERSONNELPOSITIONS } from "../types";
import { Input } from "@/Components/ui/input";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/Components/ui/popover";
import { Button } from "@/Components/ui/button";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, ChevronDown } from "lucide-react";
import { Calendar } from "@/Components/ui/calendar";
import { useEffect, useState } from "react";
import {
    SelectOption,
    SelectOptionContent,
    SelectOptionItem,
    SelectOptionTrigger,
} from "@/Components/SelectOption";
import { ScrollArea } from "@/Components/ui/scroll-area";

const PersonnelInformation: React.FC<FormProps> = ({ form }) => {
    const [isCalendarOpen, setIsCalendarOpen] = useState<boolean>(false);

    const userRole = form.watch("userRole");
    const department = form.watch("department");

    useEffect(() => {
        if (userRole === "HOD" && department !== "N/A") {
            form.setValue("department", "N/A");
            form.setValue("currentCredits", 0);
        } else if(userRole !== "HOD" && !!department) {
            form.setValue("department", undefined);
        }
    }, [userRole]);

    return (
        <>
            <div className="mt-8 mb-4 py-3 relative">
                <div className="bg-background dark:bg-zinc-900 absolute top-1/2 -translate-y-1/2 h-fit pr-3 text-foreground/75">
                    Personnel information
                </div>
                <hr className="border-t-2 border-border" />
            </div>

            <div className="grid [@media(max-width:536px)]:grid-cols-1 grid-cols-3 w-full gap-3 mt-3">
                <FormField
                    control={form.control}
                    name="currentCredits"
                    disabled={userRole === "HOD"}
                    render={({ field }) => (
                        <FormItem className="grow">
                            <FormLabel className="after:content-['*'] after:ml-0.5 after:text-red-500">
                                Current credits
                            </FormLabel>
                            <FormControl>
                                <NumberInput
                                    {...field}
                                    className="h-10 aria-[invalid=true]:border-destructive aria-[invalid=true]:ring-destructive shadow-sm"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="personnelId"
                    render={({ field }) => (
                        <FormItem className="grow">
                            <FormLabel className="after:content-['*'] after:ml-0.5 after:text-red-500">
                                Personnel Id
                            </FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    className="h-10 aria-[invalid=true]:border-destructive aria-[invalid=true]:ring-destructive shadow-sm"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="dateHired"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="after:content-['*'] after:ml-0.5 after:text-red-500">
                                Date hired
                            </FormLabel>
                            <Popover
                                open={isCalendarOpen}
                                onOpenChange={setIsCalendarOpen}
                            >
                                <PopoverTrigger
                                    asChild
                                    className="hover:!bg-transparent aria-[invalid=true]:border-destructive aria-[invalid=true]:ring-destructive shadow-sm"
                                >
                                    <FormControl>
                                        <Button
                                            variant={"outline"}
                                            className={cn(
                                                "w-full pl-3 text-left font-normal before:!bg-transparent data-[state=open]:ring-2 ring-ring dark:border-zinc-700 dark:bg-zinc-800",
                                                !field.value &&
                                                    "text-muted-foreground"
                                            )}
                                        >
                                            {field.value ? (
                                                <span>
                                                    {format(field.value, "PPP")}
                                                </span>
                                            ) : (
                                                <span>Pick a date</span>
                                            )}
                                            <CalendarIcon className="ml-auto size-5 opacity-50" />
                                        </Button>
                                    </FormControl>
                                </PopoverTrigger>
                                <PopoverContent
                                    className="w-auto p-0"
                                    align="start"
                                >
                                    <Calendar
                                        mode="single"
                                        selected={field.value}
                                        onSelect={(date) => {
                                            field.onChange(date);
                                            setIsCalendarOpen(false);
                                        }}
                                    />
                                </PopoverContent>
                            </Popover>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="userRole"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="after:content-['*'] after:ml-0.5 after:text-red-500">
                                User role
                            </FormLabel>
                            <SelectOption onChange={field.onChange}>
                                <SelectOptionTrigger>
                                    <FormControl>
                                        <Button
                                            variant={"outline"}
                                            className={cn(
                                                "w-full pl-3 text-left justify-between font-normal before:!bg-transparent data-[state=open]:ring-2 ring-ring",
                                                !field.value &&
                                                    "text-muted-foreground"
                                            )}
                                        >
                                            <span>
                                                {!field.value
                                                    ? "Select role"
                                                    : field.value}
                                            </span>
                                            <ChevronDown className="size-4" />
                                        </Button>
                                    </FormControl>
                                </SelectOptionTrigger>
                                <SelectOptionContent>
                                    <SelectOptionItem value="HR" />
                                    <SelectOptionItem value="HOD" />
                                    <SelectOptionItem value="Teaching" />
                                    <SelectOptionItem value="Non-teaching" />
                                </SelectOptionContent>
                            </SelectOption>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="department"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="after:content-['*'] after:ml-0.5 after:text-red-500">
                                Department
                            </FormLabel>
                            <SelectOption onChange={field.onChange}>
                                <SelectOptionTrigger>
                                    <FormControl>
                                        <Button
                                            variant={"outline"}
                                            className={cn(
                                                "w-full pl-3 text-left justify-between font-normal before:!bg-transparent data-[state=open]:ring-2 ring-ring",
                                                !field.value &&
                                                    "text-muted-foreground"
                                            )}
                                            disabled={userRole === "HOD"}
                                        >
                                            <span>
                                                {!field.value
                                                    ? "Select department"
                                                    : field.value}
                                            </span>
                                            <ChevronDown className="size-4" />
                                        </Button>
                                    </FormControl>
                                </SelectOptionTrigger>
                                <SelectOptionContent>
                                    <SelectOptionItem value="Junior High School" />
                                    <SelectOptionItem value="Senior High School" />
                                    <SelectOptionItem value="Accounting" />
                                    <SelectOptionItem value="N/A" />
                                </SelectOptionContent>
                            </SelectOption>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="position"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="after:content-['*'] after:ml-0.5 after:text-red-500">
                                Position
                            </FormLabel>
                            <SelectOption onChange={field.onChange}>
                                <SelectOptionTrigger>
                                    <FormControl>
                                        <Button
                                            variant={"outline"}
                                            className={cn(
                                                "w-full pl-3 text-left justify-between font-normal before:!bg-transparent data-[state=open]:ring-2 ring-ring",
                                                !field.value &&
                                                    "text-muted-foreground"
                                            )}
                                        >
                                            <span>
                                                {field.value ??
                                                    "Select position"}
                                            </span>
                                            <ChevronDown className="size-4" />
                                        </Button>
                                    </FormControl>
                                </SelectOptionTrigger>
                                <SelectOptionContent>
                                    <ScrollArea className="h-72">
                                        {PERSONNELPOSITIONS.map(
                                            (pos, index) => (
                                                <SelectOptionItem
                                                    key={index}
                                                    value={pos}
                                                />
                                            )
                                        )}
                                    </ScrollArea>
                                </SelectOptionContent>
                            </SelectOption>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
        </>
    );
};

export default PersonnelInformation;
