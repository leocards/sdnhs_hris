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
import ComboBox from "@/Components/ComboBox";
import {
    SelectOption,
    SelectOptionContent,
    SelectOptionItem,
    SelectOptionTrigger,
} from "@/Components/SelectOption";
import { ChevronDown } from "lucide-react";
import { ScrollArea } from "@/Components/ui/scroll-area";
import { cn } from "@/lib/utils";

const UPLOADSCHEMA = z
    .object({
        add: z
            .object({
                personnelid: z.object({
                    id: z.number().default(0),
                    name: z.string(),
                }),
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
        sy: z.string().min(1, "The S.Y. field is requried."),
    })
    .superRefine((data, ctx) => {
        if (data.isAdd) {
            if (!data.add.personnelid?.name) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: requiredError("personnel"),
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

function generateSchoolYears(startYear: number, endYear: number): string[] {
    const schoolYears: string[] = [];

    for (let year = startYear; year > endYear; year--) {
        schoolYears.push(`${year-1}-${year}`);
    }

    return schoolYears;
}

export default function UploadIPCR(props: {
    show: boolean;
    isAdd?: boolean;
    isEdit?: any;
    onClose: CallableFunction;
    year: string
}) {
    const { show, isAdd = false, onClose, year } = props;
    const [isFormAdd, setIsFormAdd] = useState<boolean>(false);
    const [initialListIPCR, setInitialListIPCR] = useState<Array<any>>([]);

    const form = reactForm<IFormUpload>({
        resolver: zodResolver(UPLOADSCHEMA),
    });

    const { setData, post, processing, reset } = useForm<IFormUpload>();
    const [isSubmit, setIsSubmit] = useState<boolean>(false);
    const { toast } = useToast();

    const watchSY = form.watch('sy')

    const onFormSubmit = (formData: IFormUpload) => {
        setIsSubmit(true);
        setData(formData);
        if (isAdd) {
            let filtered = initialListIPCR.filter(
                (ilipcr) => ilipcr.id !== formData.add.personnelid?.id
            );

            setInitialListIPCR(filtered);
        }
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

            if (props.isEdit) {
                form.setValue(
                    "add.personnelid",
                    {
                        id: props.isEdit?.user.id,
                        name: props.isEdit?.user.name,
                    },
                    {
                        shouldDirty: true,
                        shouldTouch: true,
                        shouldValidate: true,
                    }
                );
                form.setValue("add.rating", props.isEdit?.rating);
            } else {
                form.setValue("add.personnelid", {
                    id: 0,
                    name: "",
                });
                form.setValue("add.rating", "");
            }
            form.setValue("sy", year);
        }
    }, [show]);

    useEffect(() => {
        if (isSubmit) {
            if (!isFormAdd) {
                post(route("reports.excel.ipcr.upload"), {
                    onSuccess: (page) => {
                        toast({
                            variant: "success",
                            description: page.props.success?.toString(),
                        });
                        form.reset();
                        onClose({ upload: false, add: false });
                    },
                    onError: (error) => {
                        console.log(error[0]);
                        toast({
                            variant: "destructive",
                            description: error[0],
                        });
                    },
                    onFinish: () => {
                        reset();
                        setIsSubmit(false);
                    },
                });
            } else {
                post(
                    props.isEdit
                        ? route("reports.updateIPCR", [props.isEdit?.id])
                        : route("reports.addIPCR"),
                    {
                        onSuccess: (page) => {
                            if (page.props.success) {
                                toast({
                                    variant: "success",
                                    description: page.props.success.toString(),
                                });
                                form.reset();
                                onClose({ upload: false, add: false });
                            }
                        },
                        onError: (error) => {
                            for (const key in error) {
                                form.setError(key as keyof IFormUpload, {
                                    type: "manual",
                                    message: error[key],
                                });
                            }

                            if (error[0])
                                toast({
                                    variant: "destructive",
                                    description: error[0],
                                });
                        },
                        onFinish: () => {
                            reset();
                            setIsSubmit(false);
                        },
                    }
                );
            }
        }
    }, [isSubmit]);

    useEffect(() => {
        window.axios.get(route("reports.unlistedIPCR", [watchSY??year])).then((response) => {
            let data = response.data;

            setInitialListIPCR(data);
        });
    }, [watchSY]);

    return (
        <Modal
            show={show}
            onClose={() => onClose({ upload: false, add: false })}
            maxWidth="lg"
            center
        >
            {processing && (
                <Processing is_processing={processing} backdrop="" />
            )}
            {!processing && (
                <div className="p-6">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onFormSubmit)}>
                            <div className="font-bold text-xl mb-6 px-1">
                                {isFormAdd
                                    ? props.isEdit
                                        ? "Edit"
                                        : "Add"
                                    : "Upload"}{" "}
                                IPCR
                            </div>
                            <div className="mb-4">
                                <FormField
                                    control={form.control}
                                    name="sy"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="required">
                                                S.Y.
                                            </FormLabel>
                                            <SelectOption
                                                onChange={field.onChange}
                                                initialValue={year}
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
                                                                    "Select year"}
                                                            </span>
                                                            <ChevronDown className="size-4" />
                                                        </Button>
                                                    </FormControl>
                                                </SelectOptionTrigger>
                                                <SelectOptionContent>
                                                    <ScrollArea className="h-40">
                                                        <div className="p-1 grid grid-cols-[repeat(auto-fill,minmax(7rem,1fr))] gap-1">
                                                            {generateSchoolYears((new Date().getFullYear() + 1), 1990).map(
                                                                (sy, index) => (
                                                                    <SelectOptionItem
                                                                        key={index}
                                                                        value={sy}
                                                                        className="pr-3"
                                                                    />
                                                                )
                                                            )}
                                                        </div>
                                                    </ScrollArea>
                                                </SelectOptionContent>
                                            </SelectOption>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            {isFormAdd && (
                                <div className="space-y-4">
                                    <FormField
                                        control={form.control}
                                        name="add.personnelid.name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="required">
                                                    Personnel
                                                </FormLabel>
                                                <ComboBox
                                                    label="Select personnel"
                                                    routeSearch="reports.searchIPCR"
                                                    onSelectResult={(selectedPersonnel: {
                                                        id: number;
                                                        name: string;
                                                    }) => {
                                                        form.setValue(
                                                            "add.personnelid",
                                                            selectedPersonnel
                                                        );
                                                    }}
                                                    selected={
                                                        form.getValues(
                                                            "add.personnelid"
                                                        ) ?? { id: 0, name: "" }
                                                    }
                                                    initialList={
                                                        initialListIPCR
                                                    }
                                                    filter={watchSY??year}
                                                />
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
