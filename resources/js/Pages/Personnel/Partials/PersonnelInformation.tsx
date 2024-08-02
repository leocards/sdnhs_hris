import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormProps
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
import { Popover, PopoverContent, PopoverTrigger } from "@/Components/ui/popover";
import { Button } from "@/Components/ui/button";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/Components/ui/calendar";
import { useState } from "react";

const PersonnelInformation: React.FC<FormProps> = ({ form }) => {
    const [isCalendarOpen, setIsCalendarOpen] = useState<boolean>(false)

    return (
        <>
            <div className="mt-8 mb-4 py-3 relative">
                <div className="bg-background absolute top-1/2 -translate-y-1/2 h-fit pr-3 text-foreground/75">
                Personnel information
                </div>
                <hr className="border-t-2 border-border" />
            </div>

            <div className="grid [@media(max-width:536px)]:grid-cols-1 grid-cols-3 w-full gap-3 mt-3">
                <FormField
                    control={form.control}
                    name="currentCredits"
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
                                <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
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
                                                    field.onChange(date)
                                                    setIsCalendarOpen(false)
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
                    name="department"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="after:content-['*'] after:ml-0.5 after:text-red-500">
                                Department
                            </FormLabel>
                            <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                value={form.watch("department")??""}
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
                <FormField
                    control={form.control}
                    name="userRole"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="after:content-['*'] after:ml-0.5 after:text-red-500">
                                User role
                            </FormLabel>
                            <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                value={form.watch("userRole")??""}
                            >
                                <FormControl>
                                    <SelectTrigger className="aria-[invalid=true]:border-destructive aria-[invalid=true]:ring-destructive shadow-sm">
                                        <SelectValue placeholder="Select role" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent >
                                    <SelectItem value="HR">HR</SelectItem>
                                    <SelectItem value="HOD">HOD</SelectItem>
                                    <SelectItem value="Teaching">
                                        Teaching
                                    </SelectItem>
                                    <SelectItem value="Non-teaching">
                                        Non-teaching
                                    </SelectItem>
                                </SelectContent>
                            </Select>
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
                            <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                value={form.watch("position")??""}
                            >
                                <FormControl>
                                    <SelectTrigger className="aria-[invalid=true]:border-destructive aria-[invalid=true]:ring-destructive shadow-sm">
                                        <SelectValue placeholder="Select role" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent className="!max-h-80">
                                    {PERSONNELPOSITIONS.map((pos, index) => (
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
            </div>
        </>
    );
};

export default PersonnelInformation;
