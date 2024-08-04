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
import { Checkbox } from "@/Components/ui/checkbox";

const UPLOADSCHEMA = z
    .object({
        add: z
            .object({
                personnelid: z.string(),
                networth: z.string(),
                spouse: z.string(),
                isjoint: z.boolean(),
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
                    path: ["add"],
                });
            } else if (!data.add.networth) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: requiredError("Net worth"),
                    path: ["add"],
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

export default function UploadSALN(props: {
    show: boolean;
    isAdd?: boolean;
    isEdit?: boolean;
    onClose: CallableFunction;
}) {
    const { show, isAdd = false, onClose } = props;
    const [isFormAdd, setIsFormAdd] = useState<boolean>(false);

    const form = reactForm<IFormUpload>({
        resolver: zodResolver(UPLOADSCHEMA),
    });

    const { setData, post, processing, reset } = useForm<IFormUpload>();
    const [isSubmit, setIsSubmit] = useState<boolean>(false);

    const onFormSubmit = (formData: IFormUpload) => {
        setIsSubmit(true);
        console.log(formData);
    };

    useEffect(() => {
        if (show) {
            if (isAdd) {
                form.setValue("isAdd", true);
                setIsFormAdd(true);
            } else {
                form.setValue("isAdd", false);
                setIsFormAdd(false);
            }
        }
    }, [show]);

    return (
        <Modal
            show={show}
            onClose={() => onClose({ upload: false, add: false })}
            maxWidth="lg"
        >
            {processing && <Processing is_processing={processing} />}
            {!processing && (
                <div className="p-6">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onFormSubmit)}>
                            <div className="font-bold text-xl mb-6 px-1">
                                {isFormAdd ? props.isEdit? "Edit" : "Add" : "Upload"} SALN
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
                                                        className="form-input"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="add.networth"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="required">
                                                    Net worth
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
                                    <FormField
                                        control={form.control}
                                        name="add.spouse"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    If spouse is with government
                                                    service, Please indicate
                                                    Name of
                                                    Spouse/Employer/Address
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
                                    <FormField
                                        control={form.control}
                                        name="add.isjoint"
                                        render={({ field }) => (
                                            <FormItem className="items-center flex gap-3">
                                                <FormLabel className="mt-1.5">
                                                    Please check if it is joint
                                                    filing
                                                </FormLabel>
                                                <FormControl>
                                                    <Checkbox
                                                        checked={field.value}
                                                        onCheckedChange={
                                                            field.onChange
                                                        }
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
