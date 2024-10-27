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
import { Calendar } from "@/Components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/Components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { CalendarIcon, ChevronDown } from "lucide-react";
import { useState } from "react";
import { SelectOption, SelectOptionContent, SelectOptionItem, SelectOptionTrigger } from "@/Components/SelectOption";

const PersonalInformation: React.FC<FormProps> = ({ form }) => {
    const [isCalendarOpen, setIsCalendarOpen] = useState<boolean>(false);

    return (
        <>
            <div className="my-6 mb-4 py-3 relative">
                <div className="bg-background dark:bg-zinc-900 absolute top-1/2 -translate-y-1/2 h-fit pr-3 text-foreground/75">
                    Personal information
                </div>
                <hr className="border-t-2 border-border" />
            </div>

            <div className="">
                <div className="grid [@media(max-width:536px)]:grid-cols-1 grid-cols-3 w-full gap-3">
                    <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                            <FormItem className="grow">
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
                        name="firstName"
                        render={({ field }) => (
                            <FormItem className="grow">
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
                        name="middleName"
                        render={({ field }) => (
                            <FormItem className="grow">
                                <FormLabel>Middle name</FormLabel>
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

                <div className="grid [@media(max-width:536px)]:grid-cols-1 grid-cols-2 w-full gap-3 mt-3">
                    <FormField
                        control={form.control}
                        name="sex"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="after:content-['*'] after:ml-0.5 after:text-red-500">
                                    Sex
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
                                                        "Select sex"}
                                                </span>
                                                <ChevronDown className="size-4" />
                                            </Button>
                                        </FormControl>
                                    </SelectOptionTrigger>
                                    <SelectOptionContent>
                                        <SelectOptionItem value="Male" />
                                        <SelectOptionItem value="Female" />
                                    </SelectOptionContent>
                                </SelectOption>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="birthDate"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="after:content-['*'] after:ml-0.5 after:text-red-500">
                                    Date of birth
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
                                                        {format(
                                                            field.value,
                                                            "PPP"
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
                </div>
            </div>
        </>
    );
};

export default PersonalInformation;
