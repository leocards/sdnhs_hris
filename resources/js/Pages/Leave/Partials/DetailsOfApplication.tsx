import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormProps,
} from "@/Components/ui/form";
import { LEAVETYPES } from "../types";
import { Input } from "@/Components/ui/input";
import { cn } from "@/lib/utils";
import NumberInput from "@/Components/NumberInput";
import { Checkbox } from "@/Components/ui/checkbox";
import { Button } from "@/Components/ui/button";
import {
    PopoverTrigger,
} from "@/Components/ui/popover";
import { format, isWeekend } from "date-fns";
import { CalendarIcon, ChevronDown } from "lucide-react";
import { useEffect } from "react";
import {
    SelectOption,
    SelectOptionContent,
    SelectOptionItem,
    SelectOptionTrigger,
} from "@/Components/SelectOption";
import { ScrollArea } from "@/Components/ui/scroll-area";
import { CalendarInput } from "@/Pages/Profile/Partials/C1/FamilyBackground";

const DetailsOfApplication: React.FC<FormProps> = ({ form }) => {
    const watchLeaveType = form.watch("leavetype.type");
    const detailsOfLeave = form.watch([
        "detailsOfLeave.vacation_special.withinPhilippines.checked",
        "detailsOfLeave.vacation_special.abroad.checked",
        "detailsOfLeave.sick.inHospital.checked",
        "detailsOfLeave.sick.outPatient.checked",
    ]);
    const commutation = form.watch([
        "commutation.notRequested",
        "commutation.requested",
    ]);

    useEffect(() => {
        if (commutation) {
            let result = commutation.filter((a: string) => a);
            result.length === 1 && form.clearErrors("commutation");
        }
    }, [commutation]);

    useEffect(() => {
        if(watchLeaveType) {
            form.resetField('detailsOfLeave.vacation_special.withinPhilippines', {
                checked: false, input: ''
            })
            form.resetField('detailsOfLeave.vacation_special.abroad', {
                checked: false, input: ''
            })
            form.resetField('detailsOfLeave.sick.inHospital', {
                checked: false, input: ''
            })
            form.resetField('detailsOfLeave.sick.outPatient', {
                checked: false, input: ''
            })
            form.resetField('detailsOfLeave.benefitsForWomen', '')
            form.resetField('detailsOfLeave.study', {
                degree: false, examReview: false
            })
            form.resetField('detailsOfLeave.other', {
                monetization: false, terminal: false
            })
        }
    }, [watchLeaveType])

    return (
        <div>
            <div className="">
                <FormLabel className="required uppercase opacity-70">
                    Type of leave to be availed of
                </FormLabel>
                <div className="grid []:grid-cols-1 grid-cols-2 gap-3 mt-2">
                    <FormField
                        control={form.control}
                        name="leavetype.type"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="required">
                                    Type:
                                </FormLabel>
                                <SelectOption
                                    onChange={(select) => {
                                        field.onChange(select);
                                    }}
                                >
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
                                                <span className="line-clamp-1">
                                                    {field.value ??
                                                        "Select type"}
                                                </span>
                                                <ChevronDown className="size-4" />
                                            </Button>
                                        </FormControl>
                                    </SelectOptionTrigger>
                                    <SelectOptionContent className="w-80">
                                        <ScrollArea className="h-72">
                                            {LEAVETYPES.map((type, index) => (
                                                <SelectOptionItem
                                                    key={index}
                                                    value={type}
                                                />
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
                        name="leavetype.others"
                        disabled={watchLeaveType !== "Others"}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel
                                    className={cn(
                                        watchLeaveType === "Others" &&
                                            "required"
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
                                        className="form-input disabled:!opacity-100 disabled:text-foreground/40"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
            </div>

            {watchLeaveType && (
                <div className="mt-6">
                    <FormLabel className="required uppercase opacity-70">
                        Details of leave
                    </FormLabel>

                    <div
                        className="text-sm font-medium text-destructive"
                        tabIndex={0}
                    >
                        {form.formState.errors.detailsOfLeave?.root?.message}
                    </div>

                    {["Vacation Leave", "Special Privilege Leave"].includes(
                        watchLeaveType
                    ) && (
                        <div className="mt-2">
                            <FormLabel className="italic">
                                In case of Vacation/Special Privilege Leave:
                            </FormLabel>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                                <div className="">
                                    <FormField
                                        control={form.control}
                                        name="detailsOfLeave.vacation_special.withinPhilippines.checked"
                                        render={({ field }) => (
                                            <FormItem className="items-center flex gap-2">
                                                <FormControl>
                                                    <Checkbox
                                                        checked={field.value}
                                                        onCheckedChange={
                                                            field.onChange
                                                        }
                                                        disabled={
                                                            form.watch(
                                                                "detailsOfLeave.vacation_special.abroad.checked"
                                                            ) === true
                                                        }
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
                                                        className="form-input disabled:!opacity-100 disabled:text-foreground/40"
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
                                                        onCheckedChange={
                                                            field.onChange
                                                        }
                                                        disabled={
                                                            form.watch(
                                                                "detailsOfLeave.vacation_special.withinPhilippines.checked"
                                                            ) === true
                                                        }
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
                                                        className="form-input disabled:!opacity-100 disabled:text-foreground/40"
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
                    )}

                    {watchLeaveType === "Sick Leave" && (
                        <div className="mt-4">
                            <FormLabel className="italic">
                                In case of Sick Leave:
                            </FormLabel>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                                <div className="">
                                    <FormField
                                        control={form.control}
                                        name="detailsOfLeave.sick.inHospital.checked"
                                        render={({ field }) => (
                                            <FormItem className="items-center flex gap-2">
                                                <FormControl>
                                                    <Checkbox
                                                        checked={field.value}
                                                        onCheckedChange={
                                                            field.onChange
                                                        }
                                                        disabled={
                                                            form.watch(
                                                                "detailsOfLeave.sick.outPatient.checked"
                                                            ) === true
                                                        }
                                                    />
                                                </FormControl>
                                                <FormLabel className=" !mt-0 font-normal">
                                                    In Hospital (Specify
                                                    Illness)
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
                                                        className="form-input disabled:!opacity-100 disabled:text-foreground/40"
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
                                                        onCheckedChange={
                                                            field.onChange
                                                        }
                                                        disabled={
                                                            form.watch(
                                                                "detailsOfLeave.sick.inHospital.checked"
                                                            ) === true
                                                        }
                                                    />
                                                </FormControl>
                                                <FormLabel className=" !mt-0 font-normal">
                                                    Out Patient (Specify
                                                    Illness)
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
                                                        className="form-input disabled:!opacity-100 disabled:text-foreground/40"
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
                    )}

                    {watchLeaveType === "Special Leave Benefits for Women" && (
                        <div className="mt-4">
                            <FormField
                                control={form.control}
                                name="detailsOfLeave.benefitsForWomen"
                                render={({ field }) => (
                                    <FormItem className="mt-2">
                                        <FormLabel className="italic">
                                            In case of Special Leave Benefits
                                            for Women:
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                className="form-input"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    )}

                    {watchLeaveType === "Study Leave" && (
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
                                                    onCheckedChange={
                                                        field.onChange
                                                    }
                                                    disabled={
                                                        form.watch(
                                                            "detailsOfLeave.study.examReview"
                                                        ) === true
                                                    }
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
                                                    onCheckedChange={
                                                        field.onChange
                                                    }
                                                    disabled={
                                                        form.watch(
                                                            "detailsOfLeave.study.degree"
                                                        ) === true
                                                    }
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
                    )}

                    {![
                        "Sick Leave",
                        "Vacation Leave",
                        "Special Privilege Leave",
                        "Special Leave Benefits for Women",
                        "Study Leave",
                    ].includes(watchLeaveType) &&
                        watchLeaveType && (
                            <div className="mt-4">
                                <FormLabel className="italic">
                                    Other purpose
                                </FormLabel>
                                <div className="mt-3 space-y-2 ml-4">
                                    <FormField
                                        control={form.control}
                                        name="detailsOfLeave.other.monetization"
                                        render={({ field }) => (
                                            <FormItem className="items-center flex gap-2">
                                                <FormControl>
                                                    <Checkbox
                                                        checked={field.value}
                                                        onCheckedChange={
                                                            field.onChange
                                                        }
                                                        disabled={
                                                            form.watch(
                                                                "detailsOfLeave.other.terminal"
                                                            ) === true
                                                        }
                                                    />
                                                </FormControl>
                                                <FormLabel className=" !mt-0 font-normal">
                                                    Monetization of Leave
                                                    Credits
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
                                                        onCheckedChange={
                                                            field.onChange
                                                        }
                                                        disabled={
                                                            form.watch(
                                                                "detailsOfLeave.other.monetization"
                                                            ) === true
                                                        }
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
                        )}

                    <div className="grid [@media(max-width:536px)]:grid-cols-1 grid-cols-3 w-full gap-3 mt-6 [&>div>label]:opacity-70">
                        <CalendarInput
                            label="INCLUSIVE DATES FROM"
                            form={form}
                            name={`inclusiveDates.from`}
                            placeholder="Pick a date"
                            formatDate="LLLL dd, y"
                            disabledCalendar={(date) => {
                                if (
                                    form.getValues(
                                        "leavetype.type"
                                    ) !== "Maternity Leave"
                                )
                                    return isWeekend(date);
                                else return false;
                            }}
                        />

                        <CalendarInput
                            label="INCLUSIVE DATES TO"
                            form={form}
                            name={`inclusiveDates.to`}
                            placeholder="Pick a date"
                            formatDate="LLLL dd, y"
                            disabledCalendar={(date) => {
                                if (
                                    form.getValues(
                                        "leavetype.type"
                                    ) !== "Maternity Leave"
                                )
                                    return isWeekend(date);
                                else return false;
                            }}
                            isRequired={false}
                        />

                        <FormField
                            control={form.control}
                            name="numDaysApplied"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="required uppercase opacity-70">
                                        Number of days applied for
                                    </FormLabel>
                                    <FormControl>
                                        <NumberInput
                                            {...field}
                                            disabled
                                            className="form-input disabled:!opacity-100 disabled:text-foreground/40"
                                        />
                                    </FormControl>
                                    <FormDescription className="text-xs">
                                        Automatically set with inclusive dates
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="mt-6">
                        <FormLabel className="required uppercase opacity-70">
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
            )}
        </div>
    );
};

const CalendarPickerButton: React.FC<{ form: any }> = ({ form }) => {
    const watchInclusiveDate = form.watch("inclusiveDates");

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
                                    {format(
                                        watchInclusiveDate?.from,
                                        "LLL dd, y"
                                    )}{" "}
                                    -{" "}
                                    {format(
                                        watchInclusiveDate?.to,
                                        "LLL dd, y"
                                    )}
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
