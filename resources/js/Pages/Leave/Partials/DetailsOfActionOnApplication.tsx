import NumberInput from "@/Components/NumberInput";
import { Button } from "@/Components/ui/button";
import { Calendar } from "@/Components/ui/calendar";
import { Checkbox } from "@/Components/ui/checkbox";
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
import { Textarea } from "@/Components/ui/textarea";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useEffect } from "react";

const DetailsOfActionOnApplication: React.FC<FormProps> = ({ form }) => {
    const watchRecommendation = form.watch(
        "recommendation.forDisapproval.checked"
    );
    const approvedFor = form.watch([
        'approvedFor.daysWithPay',
        'approvedFor.daysWithOutPay',
        'approvedFor.others',
    ])

    useEffect(() => {
        if(approvedFor) {
            let result = approvedFor.filter((a: string) => a)
            result.length === 1 && form.clearErrors('approvedFor')
        }
    }, [approvedFor])

    return (
        <div>
            <div>
                <FormLabel className="after:content-['*'] after:ml-0.5 after:text-red-500 uppercase opacity-70">
                    A certification of leave credits
                </FormLabel>
                <div className="mt-3">
                    <FormField
                        control={form.control}
                        name="certificationLeaveCredits.asOf"
                        render={({ field }) => (
                            <FormItem className="">
                                <div className="flex items-center gap-3 ">
                                    <FormLabel className="shrink-0 after:content-['*'] after:ml-0.5 after:text-red-500">
                                        As of
                                    </FormLabel>
                                    <FormControl>
                                        <NumberInput
                                            {...field}
                                            className="h-10 w-40 aria-[invalid=true]:border-destructive aria-[invalid=true]:ring-destructive shadow-sm"
                                        />
                                    </FormControl>
                                </div>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="[&>div]:grid [&>div]:grid-cols-[10rem,1fr,1fr] [&>div>div]:px-2 [&>div>div:first-child]:pl-0 [&>div>div:first-child]:flex [&>div>div:first-child]:justify-center [&>div>div:first-child]:pt-2 mt-2">
                    <div className="mb-2 text-center">
                        <div></div>
                        <div>Vacation Leave</div>
                        <div>Sick Leave</div>
                    </div>
                    <div className="mb-2">
                        <div className="">Total Earned</div>
                        <div className="">
                            <FormField
                                control={form.control}
                                name="certificationLeaveCredits.totalEarned.vacationLeave"
                                render={({ field }) => (
                                    <FormItem className="">
                                        <div className="flex items-center gap-3">
                                            <FormControl>
                                                <NumberInput
                                                    {...field}
                                                    className="h-10 aria-[invalid=true]:border-destructive aria-[invalid=true]:ring-destructive shadow-sm"
                                                />
                                            </FormControl>
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div>
                            <FormField
                                control={form.control}
                                name="certificationLeaveCredits.totalEarned.sickLeave"
                                render={({ field }) => (
                                    <FormItem className="">
                                        <div className="flex items-center gap-3">
                                            <FormControl>
                                                <NumberInput
                                                    {...field}
                                                    className="h-10 aria-[invalid=true]:border-destructive aria-[invalid=true]:ring-destructive shadow-sm"
                                                />
                                            </FormControl>
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>
                    <div className="mb-2">
                        <div>Less this application</div>
                        <div className="">
                            <FormField
                                control={form.control}
                                name="certificationLeaveCredits.lessThisApplication.vacationLeave"
                                render={({ field }) => (
                                    <FormItem className="">
                                        <div className="flex items-center gap-3">
                                            <FormControl>
                                                <NumberInput
                                                    {...field}
                                                    className="h-10 aria-[invalid=true]:border-destructive aria-[invalid=true]:ring-destructive shadow-sm"
                                                />
                                            </FormControl>
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div>
                            <FormField
                                control={form.control}
                                name="certificationLeaveCredits.lessThisApplication.sickLeave"
                                render={({ field }) => (
                                    <FormItem className="">
                                        <div className="flex items-center gap-3">
                                            <FormControl>
                                                <NumberInput
                                                    {...field}
                                                    className="h-10 aria-[invalid=true]:border-destructive aria-[invalid=true]:ring-destructive shadow-sm"
                                                />
                                            </FormControl>
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>
                    <div className="">
                        <div>Balance</div>
                        <div className="">
                            <FormField
                                control={form.control}
                                name="certificationLeaveCredits.balance.vacationLeave"
                                render={({ field }) => (
                                    <FormItem className="">
                                        <div className="flex items-center gap-3">
                                            <FormControl>
                                                <NumberInput
                                                    {...field}
                                                    className="h-10 aria-[invalid=true]:border-destructive aria-[invalid=true]:ring-destructive shadow-sm"
                                                />
                                            </FormControl>
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div>
                            <FormField
                                control={form.control}
                                name="certificationLeaveCredits.balance.sickLeave"
                                render={({ field }) => (
                                    <FormItem className="">
                                        <div className="flex items-center gap-3">
                                            <FormControl>
                                                <NumberInput
                                                    {...field}
                                                    className="h-10 aria-[invalid=true]:border-destructive aria-[invalid=true]:ring-destructive shadow-sm"
                                                />
                                            </FormControl>
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>
                </div>

                <div className="mt-4">
                    <FormLabel className="after:content-['*'] after:ml-0.5 after:text-red-500 uppercase opacity-70">
                        Recommendation
                    </FormLabel>
                    <div
                        className="text-sm font-medium text-destructive"
                        tabIndex={0}
                    >
                        {form.formState.errors.recommendation?.root?.message}
                    </div>
                    <div className="mt-3 space-y-2 ml-4">
                        <FormField
                            control={form.control}
                            name="recommendation.forApproval"
                            render={({ field }) => (
                                <FormItem className="items-center flex gap-2">
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <FormLabel className=" !mt-0 font-normal">
                                        For approval
                                    </FormLabel>
                                </FormItem>
                            )}
                        />
                        <div>
                            <FormField
                                control={form.control}
                                name="recommendation.forDisapproval.checked"
                                render={({ field }) => (
                                    <FormItem className="items-center flex gap-2">
                                        <FormControl>
                                            <Checkbox
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                        <FormLabel className=" !mt-0 font-normal">
                                            For disapproval due to
                                        </FormLabel>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="recommendation.forDisapproval.input"
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
                                disabled={!watchRecommendation}
                            />
                        </div>
                    </div>
                </div>

                <div className="mt-4">
                    <div className="grid grid-cols-3">
                        <div className="">
                            <FormLabel className="after:content-['*'] after:ml-0.5 after:text-red-500 uppercase opacity-70">
                                Approved for
                            </FormLabel>
                            <div
                                className="text-sm font-medium text-destructive"
                                tabIndex={0}
                            >
                                {
                                    form.formState.errors.approvedFor?.root
                                        ?.message
                                }
                            </div>
                            <FormField
                                control={form.control}
                                name="approvedFor.daysWithPay"
                                render={({ field }) => (
                                    <FormItem className="mt-2">
                                        <div className="flex items-center gap-3">
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    className="h-10 w-32 aria-[invalid=true]:border-destructive aria-[invalid=true]:ring-destructive shadow-sm"
                                                />
                                            </FormControl>
                                            <FormLabel>days with pay</FormLabel>
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="approvedFor.daysWithOutPay"
                                render={({ field }) => (
                                    <FormItem className="mt-2">
                                        <div className="flex items-center gap-3">
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    className="h-10 w-32 aria-[invalid=true]:border-destructive aria-[invalid=true]:ring-destructive shadow-sm"
                                                />
                                            </FormControl>
                                            <FormLabel>
                                                days with out pay
                                            </FormLabel>
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="approvedFor.others"
                                render={({ field }) => (
                                    <FormItem className="mt-2">
                                        <div className="flex items-center gap-3">
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    className="h-10 w-32 aria-[invalid=true]:border-destructive aria-[invalid=true]:ring-destructive shadow-sm"
                                                />
                                            </FormControl>
                                            <FormLabel>
                                                others (specify)
                                            </FormLabel>
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="col-span-2">
                            <FormField
                                control={form.control}
                                name="disapprovedDueTo"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="after:content-['*'] after:ml-0.5 after:text-red-500 uppercase opacity-70">
                                            Disapproved due to
                                        </FormLabel>
                                        <FormControl>
                                            <Textarea
                                                {...field}
                                                className="aria-[invalid=true]:border-destructive aria-[invalid=true]:ring-destructive shadow-sm"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DetailsOfActionOnApplication;
