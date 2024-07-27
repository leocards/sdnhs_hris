import {
    FormControl,
    FormDescription,
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
import { LEAVETYPES } from "../types";
import { Input } from "@/Components/ui/input";
import { cn } from "@/lib/utils";
import NumberInput from "@/Components/NumberInput";
import { Checkbox } from "@/Components/ui/checkbox";
import { Button } from "@/Components/ui/button";
import { Calendar } from "@/Components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/Components/ui/popover";
import { format, isWeekend } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useEffect } from "react";

const DetailsOfApplication: React.FC<FormProps> = ({ form }) => {
    const watchLeaveType = form.watch("leavetype.type");
    const detailsOfLeave = form.watch([
        "detailsOfLeave.vacation_special.withinPhilippines.checked",
        "detailsOfLeave.vacation_special.abroad.checked",
        "detailsOfLeave.sick.inHospital.checked",
        "detailsOfLeave.sick.outPatient.checked",
    ]);
    const commutation = form.watch([
        'commutation.notRequested',
        'commutation.requested',
    ])

    useEffect(() => {
        if(commutation) {
            let result = commutation.filter((a: string) => a)
            result.length === 1 && form.clearErrors('commutation')
        }
    }, [commutation])

    return (
        <div>
            <div className="">
                <FormLabel className="after:content-['*'] after:ml-0.5 after:text-red-500 uppercase opacity-70">
                    Type of leave to be availed of
                </FormLabel>
                <div className="grid []:grid-cols-1 grid-cols-2 gap-3 mt-2">
                    <FormField
                        control={form.control}
                        name="leavetype.type"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="after:content-['*'] after:ml-0.5 after:text-red-500">
                                    Type:
                                </FormLabel>
                                <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                >
                                    <FormControl>
                                        <SelectTrigger className="aria-[invalid=true]:border-destructive aria-[invalid=true]:ring-destructive shadow-sm">
                                            <SelectValue placeholder="Select type" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent className="!max-h-80">
                                        {LEAVETYPES.map((type, index) => (
                                            <SelectItem
                                                key={index}
                                                value={type}
                                            >
                                                {type}
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
                        name="leavetype.others"
                        disabled={watchLeaveType !== "Others"}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel
                                    className={cn(
                                        watchLeaveType === "Others" &&
                                            "after:content-['*'] after:ml-0.5 after:text-red-500"
                                    )}
                                >
                                    Others:{" "}
                                    <span className="text-xs">
                                        (if type is others)
                                    </span>
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        disabled={watchLeaveType !== "Others"}
                                        className="h-10 aria-[invalid=true]:border-destructive aria-[invalid=true]:ring-destructive shadow-sm"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
            </div>

            <div className="mt-6">
                <FormLabel className="after:content-['*'] after:ml-0.5 after:text-red-500 uppercase opacity-70">
                    Details of leave
                </FormLabel>

                <div
                    className="text-sm font-medium text-destructive"
                    tabIndex={0}
                >
                    {form.formState.errors.detailsOfLeave?.root?.message}
                </div>

                <div className="mt-2">
                    <FormLabel className="italic">
                        In case of Vacation/Special Privilege Leave:
                    </FormLabel>
                    <div className="grid []:grid-cols-1 grid-cols-2 gap-3 mt-2">
                        <div className="">
                            <FormField
                                control={form.control}
                                name="detailsOfLeave.vacation_special.withinPhilippines.checked"
                                render={({ field }) => (
                                    <FormItem className="items-center flex gap-2">
                                        <FormControl>
                                            <Checkbox
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                        <FormLabel className=" !mt-0 font-normal">
                                            Within the Philippines
                                        </FormLabel>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="detailsOfLeave.vacation_special.withinPhilippines.input"
                                render={({ field }) => (
                                    <FormItem className="mt-2">
                                        <FormControl>
                                            <Input
                                                {...field}
                                                className="h-10 aria-[invalid=true]:border-destructive aria-[invalid=true]:ring-destructive shadow-sm"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                                disabled={!detailsOfLeave[0]}
                            />
                        </div>

                        <div className="">
                            <FormField
                                control={form.control}
                                name="detailsOfLeave.vacation_special.abroad.checked"
                                render={({ field }) => (
                                    <FormItem className="items-center flex gap-2">
                                        <FormControl>
                                            <Checkbox
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                        <FormLabel className=" !mt-0 font-normal">
                                            Abroad (Specify)
                                        </FormLabel>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="detailsOfLeave.vacation_special.abroad.input"
                                render={({ field }) => (
                                    <FormItem className="mt-2">
                                        <FormControl>
                                            <Input  
                                                {...field}
                                                className="h-10 aria-[invalid=true]:border-destructive aria-[invalid=true]:ring-destructive shadow-sm"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                                disabled={!detailsOfLeave[1]}
                            />
                        </div>
                    </div>
                </div>

                <div className="mt-4">
                    <FormLabel className="italic">
                        In case of Sick Leave:
                    </FormLabel>
                    <div className="grid []:grid-cols-1 grid-cols-2 gap-3 mt-2">
                        <div className="">
                            <FormField
                                control={form.control}
                                name="detailsOfLeave.sick.inHospital.checked"
                                render={({ field }) => (
                                    <FormItem className="items-center flex gap-2">
                                        <FormControl>
                                            <Checkbox
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                        <FormLabel className=" !mt-0 font-normal">
                                            In Hospital (Specify Illness)
                                        </FormLabel>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="detailsOfLeave.sick.inHospital.input"
                                render={({ field }) => (
                                    <FormItem className="mt-2">
                                        <FormControl>
                                            <Input
                                                {...field}
                                                className="h-10 aria-[invalid=true]:border-destructive aria-[invalid=true]:ring-destructive shadow-sm"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                                disabled={!detailsOfLeave[2]}
                            />
                        </div>

                        <div className="">
                            <FormField
                                control={form.control}
                                name="detailsOfLeave.sick.outPatient.checked"
                                render={({ field }) => (
                                    <FormItem className="items-center flex gap-2">
                                        <FormControl>
                                            <Checkbox
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                        <FormLabel className=" !mt-0 font-normal">
                                            Out Patient (Specify Illness)
                                        </FormLabel>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="detailsOfLeave.sick.outPatient.input"
                                render={({ field }) => (
                                    <FormItem className="mt-2">
                                        <FormControl>
                                            <Input
                                                {...field}
                                                className="h-10 aria-[invalid=true]:border-destructive aria-[invalid=true]:ring-destructive shadow-sm"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                                disabled={!detailsOfLeave[3]}
                            />
                        </div>
                    </div>
                </div>

                <div className="mt-4">
                    <FormField
                        control={form.control}
                        name="detailsOfLeave.benefitsForWomen"
                        render={({ field }) => (
                            <FormItem className="mt-2">
                                <FormLabel className="italic">
                                    In case of Special Leave Benefits for Women:
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

                <div className="mt-4">
                    <FormLabel className="italic">
                        In case of Study Leave:
                    </FormLabel>
                    <div className="mt-3 space-y-2 ml-4">
                        <FormField
                            control={form.control}
                            name="detailsOfLeave.study.degree"
                            render={({ field }) => (
                                <FormItem className="items-center flex gap-2">
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <FormLabel className=" !mt-0 font-normal">
                                        Completion of Master's Degree
                                    </FormLabel>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="detailsOfLeave.study.examReview"
                            render={({ field }) => (
                                <FormItem className="items-center flex gap-2">
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <FormLabel className=" !mt-0 font-normal">
                                        BAR/Board Examination Review
                                    </FormLabel>
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                <div className="mt-4">
                    <FormLabel className="italic">Other purpose</FormLabel>
                    <div className="mt-3 space-y-2 ml-4">
                        <FormField
                            control={form.control}
                            name="detailsOfLeave.other.monetization"
                            render={({ field }) => (
                                <FormItem className="items-center flex gap-2">
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <FormLabel className=" !mt-0 font-normal">
                                        Monetization of Leave Credits
                                    </FormLabel>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="detailsOfLeave.other.terminal"
                            render={({ field }) => (
                                <FormItem className="items-center flex gap-2">
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <FormLabel className=" !mt-0 font-normal">
                                        Terminal Leave
                                    </FormLabel>
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                <div className="grid [@media(max-width:536px)]:grid-cols-1 grid-cols-2 w-full gap-3 mt-6">
                    <FormField
                        control={form.control}
                        name="inclusiveDates"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="after:content-['*'] after:ml-0.5 after:text-red-500 uppercase opacity-70">
                                    Inclusive dates
                                </FormLabel>
                                <Popover>
                                    <CalendarPickerButton form={form} />
                                    <PopoverContent
                                        className="w-auto p-0"
                                        align="start"
                                    >
                                        <Calendar
                                            mode="range"
                                            selected={field.value}
                                            onSelect={field.onChange}
                                            disabled={(date) => {
                                                if(form.getValues('leavetype.type') !== "Maternity Leave")
                                                    return isWeekend(date)
                                                else return false
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
                        name="numDaysApplied"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="after:content-['*'] after:ml-0.5 after:text-red-500 uppercase opacity-70">
                                    Number of days applied for
                                </FormLabel>
                                <FormControl>
                                    <NumberInput
                                        {...field}
                                        disabled
                                        className="h-10 aria-[invalid=true]:border-destructive aria-[invalid=true]:ring-destructive shadow-sm"
                                    />
                                </FormControl>
                                <FormDescription className="text-xs">Automatically set with inclusive dates</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="mt-6">
                    <FormLabel className="after:content-['*'] after:ml-0.5 after:text-red-500 uppercase opacity-70">
                        Commutation
                    </FormLabel>
                    <div
                        className="text-sm font-medium text-destructive"
                        tabIndex={0}
                    >
                        {form.formState.errors.commutation?.root?.message}
                    </div>
                    <div className="mt-3 space-y-2 ml-4">
                        <FormField
                            control={form.control}
                            name="commutation.notRequested"
                            render={({ field }) => (
                                <FormItem className="items-center flex gap-2">
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <FormLabel className=" !mt-0 font-normal">
                                        Not requested
                                    </FormLabel>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="commutation.requested"
                            render={({ field }) => (
                                <FormItem className="items-center flex gap-2">
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <FormLabel className=" !mt-0 font-normal">
                                        Requested
                                    </FormLabel>
                                </FormItem>
                            )}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

const CalendarPickerButton: React.FC<{ form: any }> = ({ form }) => {
    const watchInclusiveDate = form.watch('inclusiveDates')

    return (
        <PopoverTrigger
            asChild
            className="hover:!bg-transparent aria-[invalid=true]:border-destructive aria-[invalid=true]:ring-destructive shadow-sm"
        >
            <FormControl>
                <Button
                    id="date"
                    variant={"outline"}
                    className={cn(
                        "w-full pl-3 text-left justify-start font-normal before:!bg-transparent data-[state=open]:ring-2 ring-ring",
                        !watchInclusiveDate?.from && "text-muted-foreground"
                    )}
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {watchInclusiveDate?.from ? (
                        <span>
                            {watchInclusiveDate?.to ? (
                                <>
                                    {format(watchInclusiveDate?.from, "LLL dd, y")} -{" "}
                                    {format(watchInclusiveDate?.to, "LLL dd, y")}
                                </>
                            ) : (
                                format(watchInclusiveDate?.from, "LLL dd, y")
                            )}
                        </span>
                    ) : (
                        <span>Pick a date</span>
                    )}
                </Button>
            </FormControl>
        </PopoverTrigger>
    );
};

export default DetailsOfApplication;
