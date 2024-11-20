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
import { CalendarInput } from "../Profile/Partials/C1/FamilyBackground";

const SCHOOLYEARSCHEMA = z.object({
    start: z.date({ message: requiredError('academic year start') }),
    end: z.date({ message: requiredError('academic year end') }),
    resumption: z.date({ message: requiredError('resumption of classes') }),
});

type IFormSY = z.infer<typeof SCHOOLYEARSCHEMA>;

type Props = {
    currentSY: {
        start: string
        end: string
        resumption: string
    };
} & ModalProps;

const NewSchoolYear: React.FC<Props> = ({ show, currentSY, onClose }) => {
    const form = useReact<IFormSY>({
        resolver: zodResolver(SCHOOLYEARSCHEMA),
        defaultValues: {
            start: currentSY ? new Date(currentSY.start) : undefined,
            end: currentSY ? new Date(currentSY.end) : undefined,
            resumption: currentSY ? new Date(currentSY.resumption) : undefined,
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
                    if('0' in error) {
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

    return (
        <Modal show={show} onClose={() => onClose(false)} maxWidth="md" center>
            <div className="p-6">
                <div className="font-medium text-xl uppercase mb-4 text-center">Academic Shool Year</div>

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
                            <Button type="button" variant={'outline'} className="px-8" onClick={() => onClose(false)}>
                                <span>Cancel</span>
                            </Button>
                            <Button className="px-10">
                                Save
                            </Button>
                        </div>

                    </form>
                </Form>
            </div>

            <Processing is_processing={processing} />
        </Modal>
    );
};

export default NewSchoolYear;
