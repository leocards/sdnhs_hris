import Modal from "@/Components/Modal";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm as reactForm } from "react-hook-form";
import { z } from "zod";
import { requiredError } from "../types";
import { useForm } from "@inertiajs/react";
import Processing from "@/Components/Processing";
import { useEffect, useState } from "react";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/Components/ui/form";
import { Input } from "@/Components/ui/input";
import { Button } from "@/Components/ui/button";
import { useToast } from "@/Components/ui/use-toast";

const UPLOADSCHEMA = z
    .object({
        add: z
            .object({
                personnelid: z.string(),
                rating: z.string(),
            })
            .partial(),
        isAdd: z.boolean().optional(),
        file: z
            .instanceof(File, { message: "Please choose a file." })
            .refine(
                (file) =>
                    file.type ===
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                {
                    message: "Only excel files are allowed.",
                }
            )
            .refine((file) => file.size <= 10 * 1024 * 1024, {
                message: "File size should not exceed 10MB",
            })
            .optional(),
    })
    .superRefine((data, ctx) => {
        if (data.isAdd) {
            if (!data.add.personnelid) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: requiredError("personnel ID"),
                    path: ["add.personnelid"],
                });
            } else if (!data.add.rating) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: requiredError("performance rating"),
                    path: ["add.rating"],
                });
            }
        } else {
            if (!data.file) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: requiredError("file"),
                    path: ["file"],
                });
            }
        }
    });

type IFormUpload = z.infer<typeof UPLOADSCHEMA>;

export default function UploadIPCR(props: {
    show: boolean;
    isAdd?: boolean;
    isEdit?: any;
    onClose: CallableFunction;
}) {
    const { show, isAdd = false, onClose } = props;
    const [isFormAdd, setIsFormAdd] = useState<boolean>(false)

    const form = reactForm<IFormUpload>({
        resolver: zodResolver(UPLOADSCHEMA),
    });

    const { setData, data, post, processing, reset } = useForm<IFormUpload>();
    const [isSubmit, setIsSubmit] = useState<boolean>(false);
    const { toast } = useToast()

    const onFormSubmit = (formData: IFormUpload) => {
        setIsSubmit(true);
        setData(formData)
    };

    useEffect(() => {
        if(show) {
            if (isAdd) {
                form.setValue("isAdd", true);
                setIsFormAdd(true)
            } else {
                form.setValue("isAdd", false);
                setIsFormAdd(false)
            }

            if(props.isEdit) {
                form.setValue('add.personnelid', props.isEdit?.user.personnel_id, {
                    shouldDirty: true,
                    shouldTouch: true,
                    shouldValidate: true,
                })
                form.setValue('add.rating', props.isEdit?.rating)
            } else {
                form.setValue('add.personnelid', "")
                form.setValue('add.rating', "")
            }
        }
    }, [show]);

    useEffect(() => {
        if(isSubmit) {
            if(!isFormAdd){
                post(route('reports.excel.ipcr.upload'), {
                    onSuccess: page => {
                        toast({
                            variant: "success",
                            description: page.props.success?.toString()
                        })
                        form.reset()
                        onClose({ upload: false, add: false })
                    },
                    onError: error => {
                        console.log(error[0])
                        toast({
                            variant: "destructive",
                            description: error[0]
                        })
                    },
                    onFinish: () => {
                        reset()
                        setIsSubmit(false)
                    }
                })
            } else {
                post(props.isEdit?route('reports.updateIPCR', [props.isEdit?.id]):route('reports.addIPCR'), {
                    onSuccess: page => {
                        if(page.props.success) {
                            toast({
                                variant: "success",
                                description: page.props.success.toString()
                            })
                            form.reset()
                            onClose({ upload: false, add: false })
                        }
                    },
                    onError: error => {
                        for (const key in error) {
                            form.setError(key as keyof IFormUpload, {
                                type: "manual",
                                message: error[key],
                            });
                        }

                        if(error[0])
                            toast({
                                variant: "destructive",
                                description: error[0]
                            })
                    },
                    onFinish: () => {
                        reset()
                        setIsSubmit(false)
                    }
                })
            }
        }
    }, [isSubmit])

    return (
        <Modal
            show={show}
            onClose={() => onClose({ upload: false, add: false })}
            maxWidth="lg"
            center
        >
            {processing && <Processing is_processing={processing} backdrop="" />}
            {!processing && (
                <div className="p-6">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onFormSubmit)}>
                            <div className="font-bold text-xl mb-6 px-1">
                                {isFormAdd ? props.isEdit ? "Edit" : "Add" : "Upload"} IPCR
                            </div>
                            {isFormAdd && (
                                <div className="space-y-4">
                                    <FormField
                                        control={form.control}
                                        name="add.personnelid"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="required">
                                                    Personnel ID
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        disabled={props.isEdit}
                                                        className="form-input"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="add.rating"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="required">
                                                    Performance rating
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

                            {!isFormAdd && (
                                <FormField
                                    control={form.control}
                                    name="file"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="required">
                                                Choose a file
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="file"
                                                    onChange={(e) => {
                                                        const file =
                                                            e.target.files?.[0];
                                                        if (file) {
                                                            field.onChange(
                                                                file
                                                            );
                                                        }
                                                    }}
                                                    onBlur={field.onBlur}
                                                    name={field.name}
                                                    ref={field.ref}
                                                    className="form-input"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            )}

                            <div className="mt-10 flex items-center justify-between">
                                <Button
                                    className=""
                                    type="button"
                                    variant="ghost"
                                    onClick={() =>
                                        onClose({ upload: false, add: false })
                                    }
                                >
                                    <span>Cancel</span>
                                </Button>
                                <Button className="">
                                    <span>Submit</span>
                                </Button>
                            </div>
                        </form>
                    </Form>
                </div>
            )}
        </Modal>
    );
}
