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
import { useToast } from "@/Components/ui/use-toast";
import ComboBox from "@/Components/ComboBox";
import { SelectOption, SelectOptionContent, SelectOptionItem, SelectOptionTrigger } from "@/Components/SelectOption";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/Components/ui/scroll-area";
import NumberInput from "@/Components/NumberInput";

const UPLOADSCHEMA = z
    .object({
        add: z.object({
            personnelid: z.object({
                id: z.number().default(0),
                name: z.string(),
            }),
            networth: z.string(),
            spouse: z.string().optional().default(""),
            isjoint: z.boolean().default(false),
        }),
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
        year: z.string().length(4, "The calendar year is required."),
    })
    .superRefine((data, ctx) => {
        if (data.isAdd) {
            if (!data.add.personnelid.name) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: requiredError("personnel"),
                    path: ["add.personnelid.name"],
                });
            } else if (!data.add.networth) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: requiredError("net worth"),
                    path: ["add.networth"],
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
    isEdit?: any;
    year?: string;
    onClose: CallableFunction;
}) {
    const { show, isAdd = false, year, onClose } = props;
    const [isFormAdd, setIsFormAdd] = useState<boolean>(false);
    const [initialListSALN, setInitialListSALN] = useState<Array<any>>([]);

    const form = reactForm<IFormUpload>({
        resolver: zodResolver(UPLOADSCHEMA),
    });

    const { setData, post, processing, reset } = useForm<IFormUpload>();
    const [isSubmit, setIsSubmit] = useState<boolean>(false);
    const { toast } = useToast();

    const watchYear = form.watch('year')

    const onFormSubmit = (formData: IFormUpload) => {
        setIsSubmit(true);
        setData(formData);
        if (isAdd) {
            let filtered = initialListSALN.filter(
                (ilsaln) => ilsaln.id !== formData.add.personnelid?.id
            );

            setInitialListSALN(filtered);
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
                form.setValue("add.networth", props.isEdit?.networth);
                form.setValue("add.spouse", props.isEdit?.spouse);
                form.setValue("add.isjoint", !!props.isEdit?.joint);
                form.setValue("year", props.isEdit?.year);
            } else {
                form.setValue("add.personnelid", {
                    id: 0,
                    name: "",
                });
                form.setValue("add.networth", "");
                form.setValue("add.isjoint", false);
                form.setValue("year", year||"");
            }
        }
    }, [show]);

    useEffect(() => {
        if (isSubmit) {
            if (!isFormAdd) {
                post(route("reports.excel.saln.upload"), {
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
                        ? route("reports.updateSALN", [props.isEdit?.id])
                        : route("reports.addSALN"),
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
                            console.log(error);
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
        if(watchYear)
            window.axios.get(route("reports.unlistedSALN", [watchYear??year])).then((response) => {
                let data = response.data;

                setInitialListSALN(data);
            });
    }, [watchYear, year]);

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
                                SALN
                            </div>
                            <div className="mb-4">
                                <FormField
                                    control={form.control}
                                    name="year"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="required">
                                                Calendar year
                                            </FormLabel>
                                            <SelectOption onChange={field.onChange} initialValue={year}>
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
                                                        <div className="p-2 grid grid-cols-[repeat(auto-fill,minmax(5rem,1fr))] gap-2">
                                                            {Array.from({length: 50}).map((_, index) => (
                                                                <SelectOptionItem
                                                                    key={index}
                                                                    value={((new Date().getFullYear()) - index).toString()}
                                                                    className="pr-3"
                                                                />
                                                            ))}
                                                            {/* <Button key={index} type="button" className="!p-0 h-9 shadow-sm" variant="outline" onClick={() => (1980 + index)}>
                                                                <span>{1980 + index}</span>
                                                            </Button> */}
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
                                                    routeSearch="reports.searchSALN"
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
                                                        initialListSALN
                                                    }
                                                    filter={watchYear??year}
                                                />
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
                                                    <NumberInput
                                                        isAmount
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
