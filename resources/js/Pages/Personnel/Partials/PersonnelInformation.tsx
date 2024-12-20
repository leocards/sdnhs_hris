import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormProps,
} from "@/Components/ui/form";
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
import { User } from "@/types";

type Props = FormProps & {
    user_roles: Array<string>;
    user?: User
}

const PersonnelInformation: React.FC<Props> = ({ form, user_roles, user }) => {
    const [isCalendarOpen, setIsCalendarOpen] = useState<boolean>(false);
    const [changeUserRole, setChangeUserRole] = useState(false);

    const userRole = form.watch("userRole");

    useEffect(() => {
        if (changeUserRole) {
            if (userRole === "HOD") {
                form.setValue("department", "N/A");
                form.setValue("position", null);
            } else if (userRole === "Teaching" || userRole === "Non-teaching") {
                form.setValue("department", null);
                form.setValue("position", null);
            }
            setChangeUserRole(false);
        }
    }, [changeUserRole]);

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
                                                    {format(
                                                        field.value,
                                                        "PPP"
                                                    ).replace(
                                                        /\b(\d+)(st|nd|rd|th)\b/g,
                                                        "$1"
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
                <FormField
                    control={form.control}
                    name="userRole"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="after:content-['*'] after:ml-0.5 after:text-red-500">
                                User role
                            </FormLabel>
                            <SelectOption
                                onChange={(role) => {
                                    if(role !== field.value) {
                                        field.onChange(role);
                                        setChangeUserRole(true);
                                    }
                                }}
                                initialValue={field.value}
                                rerenders
                            >
                                <SelectOptionTrigger>
                                    <FormControl>
                                        <Button
                                            variant={"outline"}
                                            className={cn(
                                                "w-full pl-3 text-left justify-between disabled:!opacity-100 disabled:!cursor-not-allowed disabled:pointer-events-auto disabled:!text-foreground/40 font-normal before:!bg-transparent data-[state=open]:ring-2 ring-ring",
                                                !field.value &&
                                                    "text-muted-foreground"
                                            )}
                                            disabled={!!(user)}
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
                                    {!user_roles.includes("HR") && (
                                        <SelectOptionItem value="HR" />
                                    )}
                                    {!user_roles.includes("HOD") && (
                                        <SelectOptionItem value="HOD" />
                                    )}
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
                            <SelectOption
                                onChange={field.onChange}
                                initialValue={field.value}
                                rerenders
                            >
                                <SelectOptionTrigger>
                                    <FormControl>
                                        <Button
                                            variant={"outline"}
                                            className={cn(
                                                "w-full pl-3 text-left justify-between disabled:!opacity-100 disabled:!cursor-not-allowed disabled:pointer-events-auto disabled:!text-foreground/40 font-normal before:!bg-transparent data-[state=open]:ring-2 ring-ring",
                                                !field.value &&
                                                    "text-muted-foreground"
                                            )}
                                            disabled={
                                                userRole === "HOD" || user?.role === "HR" || !userRole
                                            }
                                        >
                                            <span>
                                                {!field.value
                                                    ? userRole === "HOD" || user?.role === "HR" ? "N/A":"Select department"
                                                    : field.value}
                                            </span>
                                            <ChevronDown className="size-4" />
                                        </Button>
                                    </FormControl>
                                </SelectOptionTrigger>
                                <SelectOptionContent>
                                    {userRole == "Teaching" ? (
                                        <>
                                            <SelectOptionItem value="Junior High School" />
                                            <SelectOptionItem value="Senior High School" />
                                        </>
                                    ) : userRole == "Non-teaching" ? (
                                        <SelectOptionItem value="Accounting" />
                                    ) : (
                                        <SelectOptionItem value="N/A" />
                                    )}
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
                            <SelectOption
                                onChange={field.onChange}
                                initialValue={field.value}
                                rerenders
                            >
                                <SelectOptionTrigger>
                                    <FormControl>
                                        <Button
                                            variant={"outline"}
                                            className={cn(
                                                "w-full pl-3 text-left justify-between disabled:!opacity-100 disabled:!cursor-not-allowed disabled:pointer-events-auto disabled:!text-foreground/40 font-normal before:!bg-transparent data-[state=open]:ring-2 ring-ring",
                                                !field.value &&
                                                    "text-muted-foreground"
                                            )}
                                            disabled={!userRole || !!(user)}
                                        >
                                            <span>
                                                {field.value ? field.value : (user && user.role === "HR") ? "N/A" :
                                                    "Select position"}
                                            </span>
                                            <ChevronDown className="size-4" />
                                        </Button>
                                    </FormControl>
                                </SelectOptionTrigger>
                                <SelectOptionContent>
                                    <ScrollArea className="h-[14rem]">
                                        {(user && user.role === "HR") && (
                                            <SelectOptionItem value="HR" />
                                        )}
                                        {[...PERSONNELPOSITIONS]
                                            .splice(
                                                userRole == "Teaching"
                                                    ? 0
                                                    : userRole == "Non-teaching"
                                                    ? 7
                                                    : userRole == "HOD"
                                                    ? 10
                                                    : 13,
                                                userRole == "Teaching"
                                                    ? 7
                                                    : userRole == "Non-teaching"
                                                    ? 3
                                                    : userRole == "HOD"
                                                    ? 5
                                                    : 1
                                            )
                                            .map((pos, index) => (
                                                <SelectOptionItem
                                                    key={index}
                                                    value={pos}
                                                />
                                            ))}
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
