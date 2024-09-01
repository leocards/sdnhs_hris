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
import { ChevronDown, X } from "lucide-react";
import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import { useForm as reactForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { Personnel } from "./PersonnelTardiness";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/Components/ui/popover";
import { ScrollArea } from "@/Components/ui/scroll-area";
import useDebounce from "@/hooks/useDebounce";
import Loading from "@/Components/page-loading/Loading";

const ATTENDANCEOBJECTSCHEMA = z.object({
    id: z.string().optional(),
    attendanceId: z.number().nullable().optional(),
    name: z.string().min(1, "The name field is required."),
    personnelId: z.number().optional().nullable(),
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
    initialList,
    onClose,
}: ModalProps & { user?: Personnel; initialList: Array<any> }) {
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
    const [tardinessDraft, setTardinessDraft] = useState<boolean | null>();
    const [confirmDraft, setConfirmDraft] = useState<boolean>(false);

    const onFormSubmit = (form: IFormAttendance) => {
        setIsSubmit(true);
        setData(form);
    };

    const onSaveToDraft = () => {
        // retrieve the drafted data
        let tardinessDraft = localStorage.getItem("tardinessDraft");

        // check if there is a drafted data
        if (!tardinessDraft) {
            // if there is no drafted data, then add one to the local storage
            localStorage.setItem(
                "tardinessDraft",
                JSON.stringify(form.getValues("attendances"))
            );

            // set to true to remove the Save as draft button
            setTardinessDraft(true);
        } else {
            // if there is a drafted data, then replace the form with draft.
            form.setValue("attendances", JSON.parse(tardinessDraft));
            setConfirmDraft(false);
            setTardinessDraft(false);

            // remove the draft in local storeage
            localStorage.removeItem("tardinessDraft");
        }
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
            let submitRoute = !user
                ? route("personnel.tardiness.add")
                : route("personnel.tardiness.update", [user.id]);

            post(submitRoute, {
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
                    toast({
                        variant: "destructive",
                        description: error[0],
                    });
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
                    <div className="font-bold text-xl px-1">
                        Attendance Form
                    </div>

                    {tardinessDraft && (
                        <div className="flex text-sm items-center bg-secondary/60 rounded-full px-1 py-1">
                            <div className="ml-3">
                                You have a draft attendance record.
                            </div>
                            <Button
                                variant="ghost"
                                className="rounded-full h-9 before:!bg-gray-200 ml-auto text-xs"
                                onClick={() => setConfirmDraft(true)}
                            >
                                <span>Use draft</span>
                            </Button>
                        </div>
                    )}

                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onFormSubmit)}
                            className="mt-6"
                        >
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

                                                <ComboBox
                                                    form={form}
                                                    index={index}
                                                    disabled={!!user}
                                                    initialList={initialList}
                                                />

                                                <div className="flex items-start gap-3 mt-3">
                                                    <FormField
                                                        control={form.control}
                                                        name={`attendances.${index}.present`}
                                                        render={({ field }) => (
                                                            <FormItem className="grow">
                                                                <FormLabel className="required">
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
                                                                <FormLabel className="required">
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
                                                personnelId: null,
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
                                    {!user && !tardinessDraft && (
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

                    <Modal
                        show={confirmDraft}
                        onClose={() => setConfirmDraft(false)}
                        closeable={false}
                        maxWidth="sm"
                        center
                    >
                        <div className="p-6">
                            <div>
                                Continuing this action will remove the current
                                data and replace it with the drafted data. Do
                                you want to continue?
                            </div>

                            <div className="flex mt-6 justify-between">
                                <Button
                                    variant="ghost"
                                    onClick={() => setConfirmDraft(false)}
                                >
                                    <span>Cancel</span>
                                </Button>

                                <Button onClick={onSaveToDraft}>
                                    <span>Confirm</span>
                                </Button>
                            </div>
                        </div>
                    </Modal>
                </div>
            )}
        </Modal>
    );
}

type PersonnelDataType = {
    id: number;
    name: string;
}

const ComboBox = ({
    form,
    index,
    disabled,
    initialList,
}: {
    form: any;
    index: number;
    disabled?: boolean;
    initialList: Array<any>;
}) => {
    const [show, setShow] = useState<boolean>(false);
    const [search, setSearch] = useState<string>("");
    const debounceSearch = useDebounce(search, 500);
    const [personnels, setPersonnels] = useState<Array<PersonnelDataType>>(initialList);
    const [loading, setLoading] = useState<boolean>(false);
    const popoverWidthRef = useRef<HTMLButtonElement|null>(null);
    const [popoverWidth, setPopoverWidth] = useState<number>(0);

    const onSearch = (event: ChangeEvent<HTMLInputElement>) => {
        // remove all the white spaces to get the data only
        const input = event.target.value.replace(/\s+/g, " ");

        setSearch(input);
        if (input != "") setLoading(true);
        else setLoading(false);
    };

    useEffect(() => {
        let addedPersonnel = form.getValues('attendances')

        if (debounceSearch) {
            setLoading(true);
            window.axios
                .get(
                    route("personnel.tardiness.att.search", {
                        _query: {
                            search: debounceSearch,
                        },
                    })
                )
                .then((response) => {
                    // assign the response data to a variable
                    let data: Array<PersonnelDataType> = response.data;

                    // filter the results to retrieve only the data which are not existing to the form.
                    let filteredData = data.filter((fd) => !addedPersonnel.some((ap: any) => fd.id === ap.personnelId))

                    // filter the data with the initial data to retrieve only the data wich are not added to the database.
                    filteredData = initialList.filter((fd) => !filteredData.some((ap: any) => fd.id === ap.personnelId))

                    // assign the filtered data to personnel state
                    setPersonnels(filteredData);

                    // remove the loading indicator
                    setLoading(false);
                });
        } else {
            // filter the data which are already added in the form
            let filteredData = initialList.filter((fd) => !addedPersonnel.some((ap: any) => fd.id === ap.personnelId))

            // assign the filtered data to personnel state
            setPersonnels(filteredData);
        }
    }, [debounceSearch]);

    useEffect(() => {
        const resizeObserver = new ResizeObserver((entries) => {
            if (entries[0]) {
                setPopoverWidth(entries[0].target.clientWidth);
            }
        });

        if (popoverWidthRef.current) {
            resizeObserver.observe(popoverWidthRef.current);
        }

        return () => {
            if (popoverWidthRef.current) {
                resizeObserver.unobserve(popoverWidthRef.current);
            }
        };
    }, []);

    return (
        <FormField
            control={form.control}
            name={`attendances.${index}.name`}
            render={({ field }) => (
                <FormItem>
                    <FormLabel className="required">Name</FormLabel>
                    <Popover open={show} onOpenChange={setShow}>
                        <FormControl>
                            <PopoverTrigger
                                ref={popoverWidthRef}
                                disabled={disabled}
                                className="w-full border rounded-md form-input px-3 flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                <div className="line-clamp-1 text-left">
                                    {field.value ? (
                                        field.value
                                    ) : (
                                        <span>Select personnel</span>
                                    )}
                                </div>
                                <ChevronDown className="size-4 ml-auto shrink-0" />
                            </PopoverTrigger>
                        </FormControl>
                        <PopoverContent className="p-2 rounded-lg" style={{ width: popoverWidth }}>
                            <Input
                                className="form-input h-9"
                                placeholder="Search personnel"
                                onInput={onSearch}
                            />
                            <div className="pt-2">
                                <ScrollArea className="h-48">
                                    {loading ? (
                                        <div className="w-fit h-fit mx-auto my-auto flex items-center gap-2 py-4">
                                            <span className="loading loading-spinner loading-sm"></span>
                                            <div>Loading...</div>
                                        </div>
                                    ) : personnels.length === 0 && search ? (
                                        <div className="w-fit h-fit mx-auto my-auto flex items-center gap-2 py-4">
                                            No records found for "{search}"
                                        </div>
                                    ) : personnels.length === 0 && !search ? (
                                        <div className="w-fit h-fit mx-auto my-auto flex items-center gap-2 py-4">
                                            No records
                                        </div>
                                    ) : (
                                        personnels.map((personnel, indx) => (
                                            <div
                                                key={indx}
                                                className="rounded-md p-2 px-3 hover:bg-secondary transition cursor-pointer"
                                                onClick={() => {
                                                    field.onChange(
                                                        personnel.name
                                                    );
                                                    form.setValue(
                                                        `attendances.${index}.personnelId`,
                                                        personnel.id
                                                    );
                                                    setShow(false);
                                                }}
                                            >
                                                {personnel.name}
                                            </div>
                                        ))
                                    )}
                                </ScrollArea>
                            </div>
                        </PopoverContent>
                    </Popover>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
};
