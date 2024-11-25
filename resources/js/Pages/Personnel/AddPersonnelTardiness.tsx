import Modal, { ModalProps } from "@/Components/Modal";
import { z } from "zod";
import { useForm } from "@inertiajs/react";
import { useEffect, useState } from "react";
import { useForm as reactForm, useFieldArray, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ATTENDANCESCHEMA } from "./types";
import Processing from "@/Components/Processing";
import {
    AttendanceHeader,
    ComboBox,
    Counter,
} from "./PeronnelAttendanceComponents";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/Components/ui/form";
import { Button } from "@/Components/ui/button";
import NumberInput from "@/Components/NumberInput";
import { ChevronDown, X } from "lucide-react";
import { Personnel } from "./PersonnelTardiness";
import { useToast } from "@/Components/ui/use-toast";
import { SYTYPE } from "@/types";
import { SelectOption, SelectOptionContent, SelectOptionItem, SelectOptionTrigger } from "@/Components/SelectOption";
import { cn } from "@/lib/utils";

type Props = {
    user?: Personnel;
    initialList: Array<any>;
    exisiting: any;
    sy: string
    syList: Array<SYTYPE>
} & ModalProps;

type IFormAttendance = z.infer<typeof ATTENDANCESCHEMA>;

const AddPersonnelTardiness: React.FC<Props> = ({
    user,
    initialList,
    show,
    sy,
    syList,
    exisiting,
    onClose,
}) => {
    const form = reactForm<IFormAttendance>({
        resolver: zodResolver(ATTENDANCESCHEMA),
        values: {
            attendances: [{ name: "", present: "", absent: "" }],
            sy: sy??""
        },
    });
    const { fields, append, replace, remove } = useFieldArray({
        control: form.control,
        name: "attendances",
    });
    const watchAttendance = useWatch({
        control: form.control,
        name: "attendances",
    });

    const { setData, post, processing, reset } = useForm<IFormAttendance>();
    const [isSubmit, setIsSubmit] = useState<boolean>(false);
    const [confirmDraft, setConfirmDraft] = useState<boolean>(false);
    const [personnels, setPersonnels] = useState<Array<any>>(initialList);
    const [confirmClearForm, setConfirmClearForm] = useState(false)
    const { toast } = useToast();

    const onFormSubmit = (form: IFormAttendance) => {
        setIsSubmit(true);
        setData(form);
    };

    useEffect(() => {
        let filteredData = initialList.filter(
            (pl) =>
                !watchAttendance.some(
                    (ap: any) => pl.personnelId === ap.personnelId
                )
        );

        let newList = filteredData.filter((f) => !exisiting.some((e: any) => e.user_id === f.personnelId))

        setPersonnels(newList);
    }, [watchAttendance]);

    useEffect(() => {
        if (show) {
            form.reset();

            if (user) {
                replace({
                    name: user.name,
                    present: user.present,
                    absent: user.absent,
                });
                form.setValue('sy', user.sy);
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
                <AttendanceHeader
                >
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onFormSubmit)}>
                            <div className="mb-4 flex justify-end">
                                <FormField
                                    control={form.control}
                                    name="sy"
                                    render={({ field }) => (
                                        <FormItem>
                                            <div className="flex items-center gap-4">
                                                <FormLabel className="requried">SY</FormLabel>
                                                <SelectOption
                                                    onChange={field.onChange}
                                                    initialValue={field.value}
                                                >
                                                    <SelectOptionTrigger>
                                                        <FormControl>
                                                            <Button
                                                                variant={"outline"}
                                                                className={cn(
                                                                    "w-40 pl-3 text-left justify-between disabled:!opacity-100 disabled:!cursor-not-allowed disabled:pointer-events-auto disabled:!text-foreground/40 font-normal before:!bg-transparent data-[state=open]:ring-2 ring-ring",
                                                                    !field.value &&
                                                                        "text-muted-foreground"
                                                                )}
                                                                disabled={!!(user)}
                                                            >
                                                                <span>
                                                                    {!field.value
                                                                        ? "Select SY"
                                                                        : field.value}
                                                                </span>
                                                                <ChevronDown className="size-4" />
                                                            </Button>
                                                        </FormControl>
                                                    </SelectOptionTrigger>
                                                    <SelectOptionContent>
                                                        {syList.map(({ sy }, index) => (
                                                            <SelectOptionItem key={index} value={sy} />
                                                        ))}
                                                    </SelectOptionContent>
                                                </SelectOption>
                                            </div>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="px-1">
                                {fields.map((field, index) => {
                                    return (
                                        <div
                                            className="flex items-start"
                                            key={field.id}
                                        >
                                            <Counter
                                                withCount={!!user}
                                                counter={index}
                                            />
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
                                                    initialList={personnels}
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
                                        onClick={() => setConfirmClearForm(true)}
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
                </AttendanceHeader>
            )}
        </Modal>
    );
};

export default AddPersonnelTardiness;
