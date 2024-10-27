import { Breadcrumbs } from "@/Components/ui/breadcrumb";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { PageProps } from "@/types";
import { z } from "zod";
import { useForm as reactForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/Components/ui/form";
import LeaveFormI from "./Partials/LeaveFormI";
import { DateRange } from "react-day-picker";
import { useEffect, useState } from "react";
import { Button } from "@/Components/ui/button";
import DetailsOfApplication from "./Partials/DetailsOfApplication";
import { countWeekdaysInRange, initialValues, LEAVEFORMSCHEMA } from "./types";
import DetailsOfActionOnApplication from "./Partials/DetailsOfActionOnApplication";
import { router, useForm } from "@inertiajs/react";
import { useToast } from "@/Components/ui/use-toast";
import { differenceInDays, eachDayOfInterval } from "date-fns";
import Processing from "@/Components/Processing";
import { cn } from "@/lib/utils";
import { Input } from "@/Components/ui/input";

type IFormLeave = z.infer<typeof LEAVEFORMSCHEMA>;

const ApplyLeave = ({ auth }: PageProps) => {
    const form = reactForm<IFormLeave>({
        resolver: zodResolver(LEAVEFORMSCHEMA),
        defaultValues: initialValues,
    });

    const { toast } = useToast();
    const [isFormConfirm, setIsFormConfirm] = useState<boolean>(false);
    const { setData, post, processing, reset } = useForm<IFormLeave>();
    const watchInclusiveDates = form.watch("inclusiveDates");

    const onFormSubmit = (form: IFormLeave) => {
        console.log(form);
        setData(form);
        setIsFormConfirm(true);
    };

    useEffect(() => {
        if (watchInclusiveDates) {
            const leavetype = form.getValues("leavetype.type");
            const { from, to } = watchInclusiveDates;
            if(leavetype === "Maternity Leave" && from){
                // get the 105 days of leave for maternity
                const dateTo = new Date(from).setDate(new Date(from).getDate() + 104)
                const dates = eachDayOfInterval({ start: from, end: dateTo })

                form.setValue( "numDaysApplied", dates.length.toString(), {
                    shouldValidate: true
                });
                form.setValue(
                    "inclusiveDates.dates",
                    dates
                );
                form.setValue("inclusiveDates.to", new Date(dateTo))
            } else if (to) {
                const dates = countWeekdaysInRange(from, to);
                form.setValue("numDaysApplied", dates.count.toString(), {
                    shouldValidate: true
                });
                form.setValue("inclusiveDates.dates", dates.dates);
            } else form.setValue("numDaysApplied", "1", {
                shouldValidate: true
            });
        }
    }, [watchInclusiveDates]);

    // Set value for other fields
    useEffect(() => {
        const { first_name, last_name, middle_name, position, department } =
            auth.user;
        form.setValue("firstName", first_name);
        form.setValue("lastName", last_name);
        form.setValue("middleName", middle_name ?? "");
        form.setValue("department", department);
        form.setValue("position", position);
        form.setValue("dateOfFiling.from", new Date());
    }, []);

    useEffect(() => {
        if (isFormConfirm) {
            post(route("leave.submit"), {
                onSuccess: ({ props }) => {
                    toast({
                        variant: "success",
                        description: props.success?.toString(),
                    });
                    form.reset()
                    reset()
                    setIsFormConfirm(false)
                    router.get(route('leave'))
                },
                onError: (error) => {
                    toast({
                        variant: "destructive",
                        description: error[0]
                    })
                    setIsFormConfirm(false)
                },
            });
        }
    }, [isFormConfirm]);

    return (
        <Authenticated
            userAuth={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Leave
                </h2>
            }
        >
            <div className="mt-3">
                <Breadcrumbs
                    home="Leave"
                    homeLink="leave"
                    links={[
                        { link: "leave.apply", linkname: "Apply for leave" },
                    ]}
                />
            </div>

            <div className="font-bold text-xl mt-4 text-center">
                APPLICATION FOR LEAVE
            </div>

            <div className="mt-8">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onFormSubmit)}>
                        <LeaveFormI form={form} />

                        <div className="font-medium uppercase text-lg mb-5 mt-8 text-center">
                            Details of Application
                        </div>

                        <DetailsOfApplication form={form} />

                        {/* <div className="font-medium uppercase text-lg mb-5 mt-8 text-center">
                            Details of Action on Application
                        </div> */}

                        {/* <DetailsOfActionOnApplication form={form} /> */}

                        {form.watch("leavetype.type") === "Maternity Leave" && (
                        <FormField
                            control={form.control}
                            name="medicalForMaternity"
                            render={({ field }) => (
                                <FormItem className="flex flex-col mt-5">
                                    <FormLabel
                                        className={cn(
                                            "after:content-['*'] after:ml-0.5 after:text-red-500"
                                        )}
                                    >
                                        Medical
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            type="file"
                                            className="form-input"
                                            onChange={(e) => {
                                                const file =
                                                    e.target.files?.[0];
                                                if (file) {
                                                    field.onChange(file);
                                                }
                                            }}
                                            onBlur={field.onBlur}
                                            name={field.name}
                                            ref={field.ref}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    )}

                        {
                            Object.keys(form.formState.errors).length !== 0 && (
                                <div className="mt-7 mb-3 text-center text-destructive">Please fill out the form with (*)</div>
                            )
                        }

                        <div className="flex items-center mt-8 pt-3 border-t">
                            <Button
                                type="button"
                                variant="ghost"
                                className=""
                                onClick={() => router.get(route("leave"))}
                                disabled={processing}
                            >
                                <span>Cancel</span>
                            </Button>
                            <Button className="ml-auto" disabled={processing}>Confirm</Button>
                        </div>
                    </form>
                </Form>
            </div>

            <Processing is_processing={processing} />
        </Authenticated>
    );
};

export default ApplyLeave;
