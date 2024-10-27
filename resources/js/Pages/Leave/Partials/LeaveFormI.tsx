import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormProps,
} from "@/Components/ui/form";
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
import NumberInput from "@/Components/NumberInput";
import { PERSONNELPOSITIONS } from "@/Pages/Personnel/types";
import { SelectOption, SelectOptionContent, SelectOptionItem, SelectOptionTrigger } from "@/Components/SelectOption";
import { ScrollArea } from "@/Components/ui/scroll-area";

const LeaveFormI: React.FC<FormProps> = ({ form }) => {
    const dateFiled = form.watch('dateOfFiling')

    return (
        <>
            <div className="">
                <FormField
                    control={form.control}
                    name="department"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="required uppercase">
                                Office/Department
                            </FormLabel>
                            <SelectOption onChange={field.onChange}>
                                <SelectOptionTrigger>
                                    <FormControl>
                                        <Button
                                            variant={"outline"}
                                            className={cn(
                                                "w-full pl-3 text-left justify-between font-normal before:!bg-transparent data-[state=open]:ring-2 ring-ring ",
                                                "disabled:!opacity-100 disabled:text-foreground/40 disabled:!cursor-not-allowed disabled:!pointer-events-auto",
                                                !field.value &&
                                                    "text-muted-foreground"
                                            )}
                                            disabled
                                        >
                                            <span>
                                                {field.value ?? "Select depeartment"}
                                            </span>
                                            <ChevronDown className="size-4" />
                                        </Button>
                                    </FormControl>
                                </SelectOptionTrigger>
                            </SelectOption>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
            <div className=" mt-5">
                <FormLabel className="required uppercase">
                    Name
                </FormLabel>
                <div className="grid [@media(max-width:536px)]:grid-cols-1 grid-cols-3 w-full gap-3">
                    <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="required">
                                    Last name
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        disabled
                                        className="h-10 aria-[invalid=true]:border-destructive aria-[invalid=true]:ring-destructive shadow-sm disabled:!opacity-100 disabled:text-foreground/40"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="required">
                                    First name
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        disabled
                                        className="h-10 aria-[invalid=true]:border-destructive aria-[invalid=true]:ring-destructive shadow-sm disabled:!opacity-100 disabled:text-foreground/40"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="middleName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="">
                                    Middle name
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        disabled
                                        className="h-10 aria-[invalid=true]:border-destructive aria-[invalid=true]:ring-destructive shadow-sm disabled:!opacity-100 disabled:text-foreground/40"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
            </div>
            <div className="grid [@media(max-width:536px)]:grid-cols-1 grid-cols-3 w-full gap-3 mt-5">
                <FormField
                    control={form.control}
                    name="dateOfFiling"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="required uppercase">
                                Date of filing
                            </FormLabel>
                            <Popover>
                                <PopoverTrigger
                                    asChild
                                    className="hover:!bg-transparent aria-[invalid=true]:border-destructive aria-[invalid=true]:ring-destructive shadow-sm"
                                >
                                    <FormControl>
                                        <Button
                                            variant={"outline"}
                                            className={cn(
                                                "w-full pl-3 text-left font-normal before:!bg-transparent data-[state=open]:ring-2 ring-ring",
                                                !field.value &&
                                                    "text-muted-foreground"
                                            )}
                                        >
                                            {/* {field.value ? (
                                                <span>
                                                    { format(field.value, "PP") }
                                                </span>
                                            ) : (
                                                <span>Pick a date</span>
                                            )} */}
                                            {dateFiled?.from ? (
                                                <span>
                                                    {dateFiled?.to ? (
                                                        <>
                                                            {format(
                                                                dateFiled?.from,
                                                                "LLL dd, y"
                                                            )}{" "}
                                                            -{" "}
                                                            {format(
                                                                dateFiled?.to,
                                                                "LLL dd, y"
                                                            )}
                                                        </>
                                                    ) : (
                                                        format(dateFiled?.from, "LLL dd, y")
                                                    )}
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
                                        mode="range"
                                        selected={field.value}
                                        onSelect={field.onChange}
                                    />
                                </PopoverContent>
                            </Popover>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="position"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="required uppercase">
                                Position
                            </FormLabel>
                            <SelectOption onChange={field.onChange}>
                                <SelectOptionTrigger>
                                    <FormControl>
                                        <Button
                                            variant={"outline"}
                                            className={cn(
                                                "w-full pl-3 text-left justify-between font-normal before:!bg-transparent data-[state=open]:ring-2 ring-ring",
                                                "disabled:!opacity-100 disabled:text-foreground/40",
                                                !field.value &&
                                                    "text-muted-foreground"
                                            )}
                                            disabled
                                        >
                                            <span>
                                                {field.value ?? "Select role"}
                                            </span>
                                            <ChevronDown className="size-4" />
                                        </Button>
                                    </FormControl>
                                </SelectOptionTrigger>
                                <SelectOptionContent>
                                    <ScrollArea className="h-72">
                                        {PERSONNELPOSITIONS.map((pos, index) => (
                                            <SelectOptionItem key={index} value={pos} />
                                        ))}
                                    </ScrollArea>
                                </SelectOptionContent>
                            </SelectOption>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="salary"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="required uppercase">
                                Salary
                            </FormLabel>
                            <FormControl>
                                <NumberInput
                                    {...field}
                                    isAmount
                                    className="h-10 aria-[invalid=true]:border-destructive aria-[invalid=true]:ring-destructive shadow-sm"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
        </>
    );
};

export default LeaveFormI;
