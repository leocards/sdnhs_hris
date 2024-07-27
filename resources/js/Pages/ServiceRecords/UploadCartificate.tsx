import Modal from "@/Components/Modal";
import { z } from "zod";
import { requiredError } from "../types";
import { useForm as reactForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "@inertiajs/react";
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
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/Components/ui/popover";
import { Calendar } from "@/Components/ui/calendar";
import { Button } from "@/Components/ui/button";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/Components/ui/use-toast";

type UploadCertificateProps = {
    show: boolean;
    onClose: (close: false) => void;
};

const allowedMimeTypes = [
    "application/pdf",
    "image/jpeg",
    "image/jpg",
    "image/png",
];

const SCHEMA = z.object({
    certificateName: z
        .string()
        .min(1, requiredError("certificate name"))
        .default(""),
    file: z
        .instanceof(File, { message: "The file field is required." })
        .refine((file) => file && allowedMimeTypes.includes(file.type), {
            message: "Invalid file.",
        }).refine((file) => file.size <= 10 * 1024 * 1024, {
            message: "File size should not exceed 10MB",
        }),
    daysRendered: z
        .object(
            {
                from: z.date(),
                to: z.date().optional(),
            },
            { required_error: requiredError("Days rendered") }
        ).refine(
            (dates) => {
                if (dates.to) {
                    dates.from.setHours(0, 0, 0, 0);
                    dates.to.setHours(0, 0, 0, 0);

                    return !(dates.to.getTime() === dates.from.getTime());
                }
                return true;
            },
            {
                message: "Days rendered 'to' must not the same.",
            }
        ),
})

type IFormCertificate = z.infer<typeof SCHEMA>;

export default function UploadCertificate({
    show,
    onClose,
}: UploadCertificateProps) {
    const form = reactForm<IFormCertificate>({
        resolver: zodResolver(SCHEMA),
        defaultValues: {
            certificateName: "",
        },
    });
    const { toast } = useToast()
    const { setData, post, processing, reset } = useForm<IFormCertificate>();
    const [isSubmit, setIsSubmit] = useState<boolean>(false);

    const onFormSubmit = (form: IFormCertificate) => {
        setData(form);
        setIsSubmit(true);
    };

    useEffect(() => {
        if (isSubmit) {
            post(route('service-records.post'), {
                onSuccess: page => {
                    toast({
                        variant: "success",
                        description: page.props.success?.toString()
                    })
                    onClose(false)
                    setIsSubmit(false)
                },
                onError: error => {
                    toast({
                        variant: "destructive",
                        description: error[0]
                    })
                    console.log(error)
                    setIsSubmit(false)
                }
            })
        }
    }, [isSubmit]);

    useEffect(() => {
        if(show) {
            form.reset()
            reset()
            setIsSubmit(false)
        }
    }, [show])

    return (
        <Modal show={show} onClose={() => onClose(false)} center maxWidth="lg">
            <div className="p-6">
                <div className="font-bold text-xl mb-6 px-1">
                    Upload certificate
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onFormSubmit)}>
                        <div className="space-y-5">
                            <FormField
                                control={form.control}
                                name="certificateName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="after:content-['*'] after:ml-0.5 after:text-red-500">
                                            Certificate name
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                className="h-10 aria-[invalid=true]:border-destructive aria-[invalid=true]:ring-destructive shadow-sm"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="file"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="after:content-['*'] after:ml-0.5 after:text-red-500">
                                            File
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0];
                                                    if (file) {
                                                        field.onChange(file);
                                                    }
                                                }}
                                                onBlur={field.onBlur}
                                                name={field.name}
                                                ref={field.ref}
                                                type="file"
                                                className="h-10 aria-[invalid=true]:border-destructive aria-[invalid=true]:ring-destructive shadow-sm"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="daysRendered"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="after:content-['*'] after:ml-0.5 after:text-red-500">
                                            Days rendered
                                        </FormLabel>
                                        <Popover>
                                            <CalendarPickerButton form={form} />
                                            <PopoverContent
                                                className="w-auto p-0"
                                                align="start"
                                            >
                                                <Calendar
                                                    mode="range"
                                                    selected={field.value}
                                                    onSelect={field.onChange}
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="flex items-center mt-8 pt-3">
                            <Button
                                type="button"
                                variant="ghost"
                                className=""
                                onClick={() => onClose(false)}
                                disabled={processing}
                            >
                                <span>Cancel</span>
                            </Button>
                            <Button className="ml-auto" disabled={processing}>
                                Upload
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </Modal>
    );
}

const CalendarPickerButton: React.FC<{ form: any }> = ({ form }) => {
    const daysRendered = form.watch("daysRendered");

    return (
        <PopoverTrigger
            asChild
            className="hover:!bg-transparent aria-[invalid=true]:border-destructive aria-[invalid=true]:ring-destructive shadow-sm"
        >
            <FormControl>
                <Button
                    id="date"
                    variant={"outline"}
                    className={cn(
                        "w-full pl-3 text-left justify-start font-normal before:!bg-transparent data-[state=open]:ring-2 ring-ring",
                        !daysRendered?.from && "text-muted-foreground"
                    )}
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {daysRendered?.from ? (
                        <span>
                            {daysRendered?.to ? (
                                <>
                                    {format(
                                        daysRendered?.from,
                                        "LLL dd, y"
                                    )}{" "}
                                    -{" "}
                                    {format(
                                        daysRendered?.to,
                                        "LLL dd, y"
                                    )}
                                </>
                            ) : (
                                format(daysRendered?.from, "LLL dd, y")
                            )}
                        </span>
                    ) : (
                        <span>Pick a date</span>
                    )}
                </Button>
            </FormControl>
        </PopoverTrigger>
    );
};
