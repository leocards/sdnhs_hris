import Modal, { ModalProps } from "@/Components/Modal";
import Processing from "@/Components/Processing";
import {
    SelectOption,
    SelectOptionContent,
    SelectOptionItem,
    SelectOptionTrigger,
} from "@/Components/SelectOption";
import { Button } from "@/Components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/Components/ui/form";
import { ScrollArea } from "@/Components/ui/scroll-area";
import { useToast } from "@/Components/ui/use-toast";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "@inertiajs/react";
import { ChevronDown } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useForm as useReact } from "react-hook-form";
import { z } from "zod";
import { requiredError } from "../types";
import { CalendarInput } from "../PDS/Partials/C1/FamilyBackground";
import { SYTYPE } from "@/types";

const SCHOOLYEARSCHEMA = z
    .object({
        start: z.date({ message: requiredError("academic year start") }),
        end: z.date({ message: requiredError("academic year end") }),
        resumption: z.date({ message: requiredError("resumption of classes") }),
    })
    .partial()
    .superRefine((data, ctx) => {
        // Check if 'start' is missing
        if (!data.start) {
            ctx.addIssue({
                path: ["start"],
                message: "The academic year start is required.",
                code: z.ZodIssueCode.custom,
            });
        }
        // Check if 'end' is missing
        if (!data.end) {
            ctx.addIssue({
                path: ["end"],
                message: "The academic year end is required.",
                code: z.ZodIssueCode.custom,
            });
        }
        // Check if 'resumption' is missing
        if (!data.resumption) {
            ctx.addIssue({
                path: ["resumption"],
                message: "The resumption of classes is required.",
                code: z.ZodIssueCode.custom,
            });
        }
    });

type IFormSY = z.infer<typeof SCHOOLYEARSCHEMA>;

type Props = {
    currentSy?: SYTYPE;
    isEdit: boolean;
} & ModalProps;

const NewSchoolYear: React.FC<Props> = ({
    show,
    currentSy,
    isEdit,
    onClose,
}) => {
    const form = useReact<IFormSY>({
        resolver: zodResolver(SCHOOLYEARSCHEMA),
        defaultValues: {
            start: undefined,
            end: undefined,
            resumption: undefined,
        },
    });

    const { setData, post, processing, reset } = useForm<IFormSY>();
    const [setSubmit, setIsSubmit] = useState(false);
    const { toast } = useToast();

    const onSubmitForm = (formData: IFormSY) => {
        setIsSubmit(true);
        setData(formData);
    };

    useEffect(() => {
        if (setSubmit) {
            post(route("dashboard.new.school_year"), {
                onSuccess: () => {
                    toast({
                        variant: "success",
                        description: "School year has been updated.",
                    });
                    form.reset();
                    onClose(false);
                },
                onError: (error) => {
                    if ("0" in error) {
                        toast({
                            variant: "destructive",
                            description: error[0],
                        });
                    }
                },
                onFinish: () => {
                    setIsSubmit(false);
                    reset();
                },
            });
        }
    }, [setSubmit]);

    useEffect(() => {
        if(isEdit) {
            form.setValue('start', currentSy ? new Date(currentSy.start) : undefined)
            form.setValue('end', currentSy ? new Date(currentSy.end) : undefined)
            form.setValue('resumption', currentSy ? new Date(currentSy.resumption) : undefined)
        } else {
            form.reset()
        }
    }, [show])

    return (
        <Modal show={show} onClose={() => onClose(false)} maxWidth="md" center>
            <div className="p-6">
                <div className="font-medium text-xl uppercase mb-4 text-center">
                    Academic Shool Year
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmitForm)}>
                        <div className="space-y-4">
                            <CalendarInput
                                form={form}
                                name="start"
                                isRequired
                                placeholder="Pick a date"
                                label="Academic Year Start"
                            />

                            <CalendarInput
                                form={form}
                                name="end"
                                isRequired
                                placeholder="Pick a date"
                                label="Academic Year End"
                            />

                            <CalendarInput
                                form={form}
                                name="resumption"
                                isRequired
                                placeholder="Pick a date"
                                label="Resumption of classes"
                            />
                        </div>

                        <div className="flex justify-between items-center mt-7">
                            <Button
                                type="button"
                                variant={"outline"}
                                className="px-8"
                                onClick={() => onClose(false)}
                            >
                                <span>Cancel</span>
                            </Button>
                            <Button className="px-10">Save</Button>
                        </div>
                    </form>
                </Form>
            </div>

            <Processing is_processing={processing} />
        </Modal>
    );
};

export default NewSchoolYear;
