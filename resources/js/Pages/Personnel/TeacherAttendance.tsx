import Modal, { ModalProps } from "@/Components/Modal";
import NumberInput from "@/Components/NumberInput";
import Processing from "@/Components/Processing";
import { Button } from "@/Components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/Components/ui/form";
import { Input, InputProps } from "@/Components/ui/input";
import { useToast } from "@/Components/ui/use-toast";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "@inertiajs/react";
import { X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useForm as reactForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { Personnel } from "./PersonnelTardiness";

const ATTENDANCEOBJECTSCHEMA = z.object({
    id: z.string().optional(),
    name: z.string().min(1, "The name field is required."),
    present: z.string().min(1, "The number of days present is required."),
    absent: z.string().min(1, "The number of days absent is required."),
});

const ATTENDANCESCHEMA = z.object({
    attendances: z.array(ATTENDANCEOBJECTSCHEMA),
});

type IFormAttendance = z.infer<typeof ATTENDANCESCHEMA>;

export default function TeacherAttendance({
    show,
    user,
    onClose,
}: ModalProps & { user?: Personnel }) {
    const form = reactForm<IFormAttendance>({
        resolver: zodResolver(ATTENDANCESCHEMA),
        defaultValues: {
            attendances: [{ name: "", present: "", absent: "" }],
        },
    });

    const { fields, append, replace, remove } = useFieldArray({
        control: form.control,
        name: "attendances",
    });
    const [isSubmit, setIsSubmit] = useState<boolean>(false);

    const { toast } = useToast();

    const { setData, post, processing, reset } = useForm<IFormAttendance>();

    const onFormSubmit = (form: IFormAttendance) => {
        setIsSubmit(true);
        setData(form);
    };

    const onSaveToDraft = () => {
        form.getValues();
    };

    useEffect(() => {
        if (show) {
            form.reset();

            if (user) {
                replace({
                    name: user.name,
                    present: user.present,
                    absent: user.absent,
                });
            }
        }
    }, [show]);

    useEffect(() => {
        if (isSubmit) {
            post(route("personnel.tardiness.add"), {
                onSuccess: (page) => {
                    toast({
                        variant: "success",
                        description: page.props.success?.toString(),
                    });
                    form.reset();
                    reset();
                    onClose(false);
                },
                onError: (error) => {
                    console.log(error);
                },
                onFinish: () => {
                    setIsSubmit(false);
                },
            });
        }
    }, [isSubmit]);

    return (
        <Modal show={show} onClose={() => onClose(false)} closeable={false}>
            {processing ? (
                <Processing is_processing={processing} backdrop={""} />
            ) : (
                <div className="p-6 px-5">
                    <div className="font-bold text-xl mb-6 px-1">
                        Attendance Form
                    </div>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onFormSubmit)}>
                            <div className="px-1">
                                {fields.map((field, index) => {
                                    let count = index;
                                    form.setValue(
                                        `attendances.${index}.id`,
                                        field.id
                                    );

                                    return (
                                        <div
                                            className="flex items-start"
                                            key={field.id}
                                        >
                                            {!user && (
                                                <div
                                                    className={cn(
                                                        "font-medium w-8 text-left shrink-0",
                                                        ++count > 99 &&
                                                            "!text-[13px]"
                                                    )}
                                                >
                                                    {count}.
                                                </div>
                                            )}
                                            <div className="mb-6 relative w-full">
                                                {fields.length > 1 && (
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="absolute -top-2 right-0 size-8"
                                                        title="remove"
                                                        onClick={() =>
                                                            remove(index)
                                                        }
                                                    >
                                                        <X className="size-5" />
                                                    </Button>
                                                )}
                                                <FormField
                                                    control={form.control}
                                                    name={`attendances.${index}.name`}
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>
                                                                Name
                                                            </FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    {...field}
                                                                    className="h-10 aria-[invalid=true]:border-destructive aria-[invalid=true]:ring-destructive bg-transparent shadow-sm"
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <div className="flex items-start gap-3 mt-3">
                                                    <FormField
                                                        control={form.control}
                                                        name={`attendances.${index}.present`}
                                                        render={({ field }) => (
                                                            <FormItem className="grow">
                                                                <FormLabel>
                                                                    Days present
                                                                </FormLabel>
                                                                <FormControl>
                                                                    <NumberInput
                                                                        {...field}
                                                                        className="h-10 aria-[invalid=true]:border-destructive aria-[invalid=true]:ring-destructive bg-transparent shadow-sm"
                                                                    />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                    <FormField
                                                        control={form.control}
                                                        name={`attendances.${index}.absent`}
                                                        render={({ field }) => (
                                                            <FormItem className="grow">
                                                                <FormLabel>
                                                                    Days absent
                                                                </FormLabel>
                                                                <FormControl>
                                                                    <NumberInput
                                                                        {...field}
                                                                        className="h-10 aria-[invalid=true]:border-destructive aria-[invalid=true]:ring-destructive bg-transparent shadow-sm"
                                                                    />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {!user && (
                                <div className="mt-5 flex items-center px-1">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        onClick={() => form.reset()}
                                    >
                                        <span>Clear form</span>
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="ml-auto"
                                        onClick={() =>
                                            append({
                                                name: "",
                                                present: "",
                                                absent: "",
                                            })
                                        }
                                    >
                                        <span>Add attendance</span>
                                    </Button>
                                </div>
                            )}

                            <div className="border-t flex mt-7 pt-3 px-1">
                                <div>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        onClick={() => onClose(false)}
                                    >
                                        <span>Cancel</span>
                                    </Button>
                                </div>
                                <div className="flex items-center ml-auto gap-3">
                                    {!user && (
                                        <Button
                                            type="button"
                                            variant="secondary"
                                            onClick={onSaveToDraft}
                                        >
                                            <span>Save as draft</span>
                                        </Button>
                                    )}

                                    <Button>
                                        {user ? (
                                            <span>Update</span>
                                        ) : (
                                            <span>Submit</span>
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </form>
                    </Form>
                </div>
            )}
        </Modal>
    );
}
