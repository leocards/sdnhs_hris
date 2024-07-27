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
import { Input } from "@/Components/ui/input";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/Components/ui/popover";
import { Button } from "@/Components/ui/button";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/Components/ui/calendar";
import NumberInput from "@/Components/NumberInput";
import { STAFFPOSITIONS } from "@/Pages/Staff/types";
import { useEffect } from "react";

const LeaveFormI: React.FC<FormProps> = ({ form }) => {
    return (
        <>
            <div className="">
                <FormField
                    control={form.control}
                    name="department"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="after:content-['*'] after:ml-0.5 after:text-red-500 uppercase">
                                Office/Department
                            </FormLabel>
                            <Select
                                onValueChange={field.onChange}
                                value={field.value??""}
                            >
                                <FormControl>
                                    <SelectTrigger className="aria-[invalid=true]:border-destructive aria-[invalid=true]:ring-destructive shadow-sm">
                                        <SelectValue placeholder="Select department" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="Junior High School">
                                        Junior High School
                                    </SelectItem>
                                    <SelectItem value="Senior High School">
                                        Senior High School
                                    </SelectItem>
                                    <SelectItem value="Accounting">
                                        Accounting
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
            <div className=" mt-5">
                <FormLabel className="after:content-['*'] after:ml-0.5 after:text-red-500 uppercase">
                    Name
                </FormLabel>
                <div className="grid [@media(max-width:536px)]:grid-cols-1 grid-cols-3 w-full gap-3">
                    <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="after:content-['*'] after:ml-0.5 after:text-red-500">
                                    First name
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
                        name="lastName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="after:content-['*'] after:ml-0.5 after:text-red-500">
                                    Last name
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
                        name="middleName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="after:content-['*'] after:ml-0.5 after:text-red-500">
                                    Middle name
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
                </div>
            </div>
            <div className="grid [@media(max-width:536px)]:grid-cols-1 grid-cols-3 w-full gap-3 mt-5">
                <FormField
                    control={form.control}
                    name="dateOfFiling"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="after:content-['*'] after:ml-0.5 after:text-red-500 uppercase">
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
                            <FormLabel className="after:content-['*'] after:ml-0.5 after:text-red-500 uppercase">
                                Position
                            </FormLabel>
                            <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value??""}
                                value={field.value??""}
                            >
                                <FormControl>
                                    <SelectTrigger className="aria-[invalid=true]:border-destructive aria-[invalid=true]:ring-destructive shadow-sm">
                                        <SelectValue placeholder="Select role" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent className="!max-h-80">
                                    {STAFFPOSITIONS.map((pos, index) => (
                                        <SelectItem key={index} value={pos}>
                                            {pos}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="salary"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="after:content-['*'] after:ml-0.5 after:text-red-500 uppercase">
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
