import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import { Link, useForm, usePage } from "@inertiajs/react";
import { Transition } from "@headlessui/react";
import { useEffect, useState } from "react";
import { Input } from "@/Components/ui/input";
import { z } from "zod";
import { requiredError } from "@/Pages/types";
import { useForm as reactForm } from "react-hook-form";
import { ROLE, STAFFPOSITIONS } from "@/Pages/Staff/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/Components/ui/use-toast";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/Components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/Components/ui/popover";
import { Button } from "@/Components/ui/button";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/Components/ui/calendar";
import DatePicker from "@/Components/ui/date-picker";
import PersonalInformation from "@/Pages/Staff/Partials/PersonalInformation";
import ContactInformation from "@/Pages/Staff/Partials/ContactInformation";
import StaffInformation from "@/Pages/Staff/Partials/StaffInformation";

export const PROFILESCHEMA = z.object({
    firstName: z.string().min(1, requiredError("first name")).default(""),
    middleName: z.string().optional().default(""),
    lastName: z.string().min(1, requiredError("last name")).default(""),
    birthDate: z
        .date({ required_error: requiredError("birth date") })
        .nullable()
        .default(null),
    sex: z.enum(["Male", "Female"], { required_error: requiredError("sex") }),
    email: z.string().min(1, requiredError("email")).email().default(""),
    address: z.string().min(1, requiredError("address")).default(""),
    phoneNumber: z
        .string()
        .startsWith("09", "Must starts with 09")
        .length(11, "Must be 11 characters long")
        .default(""),
    position: z.enum(STAFFPOSITIONS, {
        required_error: requiredError("position"),
    }),
    staffId: z.string().min(1, requiredError("staff Id")).default(""),
    department: z.string().min(1, requiredError("department")).default(""),
    userRole: z.enum(ROLE, { required_error: requiredError("user role") }),
    dateHired: z
        .date({ required_error: requiredError("date hired") })
        .nullable()
        .default(null),
    currentCredits: z
        .preprocess(
            (value) => parseInt(value as string),
            z.number({
                required_error: requiredError("current credits"),
                invalid_type_error: requiredError("current credits"),
            })
        )
        .default(""),
});

type IFormProfile = z.infer<typeof PROFILESCHEMA>;

interface User {
    id: number;
    first_name: string;
    last_name: string;
    middle_name: string;
    department: string;
    position: any;
    leave_credits?: number;
    email: string;
    email_verified_at: string;
    sex?: "Male" | "Female";
    address?: string;
    phone_number: string;
    staff_id?: string;
    date_hired?: Date | null;
    date_of_birth: Date;
    role?: "HOD" | "Teaching" | "Non-teaching";
}

type UserProps = { auth: { user: User } };

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
    className = "",
}: {
    mustVerifyEmail: boolean;
    status?: string;
    className?: string;
}) {
    const user = usePage<UserProps>().props.auth.user;
    const [isSubmit, setIsSubmit] = useState<boolean>(false);
    const form = reactForm<IFormProfile>({
        resolver: zodResolver(PROFILESCHEMA),
        defaultValues: {
            firstName: user.first_name,
            lastName: user.last_name,
            middleName: user.middle_name??"",
            sex: user?.sex,
            email: user.email,
            address: user?.address,
            phoneNumber: user.phone_number,
            position: user.position,
            staffId: user.staff_id,
            department: user.department,
            dateHired: user.date_hired && new Date(user.date_hired),
            userRole: user.role,
            currentCredits: user.leave_credits,
            birthDate: new Date(user.date_of_birth)
        },
    });
    const {
        data,
        setData,
        patch,
        errors,
        processing,
        recentlySuccessful,
        reset,
    } = useForm<IFormProfile>();
    const { toast } = useToast();

    const onFormSubmit = (formData: IFormProfile) => {
        if(form.formState.isDirty) {
            setIsSubmit(true);
            setData(formData);
        }
    };

    useEffect(() => {
        if (isSubmit) {
            patch(route("profile.update"), {
                preserveState: true,
                onSuccess: (page) => {
                    toast({
                        variant: "success",
                        description: page.props.success?.toString(),
                    });
                },
                onError: (error) => {
                    console.log(error);
                    toast({
                        variant: "destructive",
                        description: "Unable to update profile",
                    });
                },
                onFinish: () => {
                    reset();
                    form.reset();
                    setIsSubmit(false);
                },
            });
        }
    }, [isSubmit]);

    return (
        <section className={cn("", className)}>
            <header>
                <h2 className="text-lg font-medium text-gray-900">
                    Profile Information
                </h2>

                <p className="mt-1 text-sm text-gray-600">
                    Update your account's profile information and email address.
                </p>
            </header>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onFormSubmit)}
                    className="mt-6 space-y-6"
                >
                    <PersonalInformation form={form} />

                    <ContactInformation form={form} />

                    <StaffInformation form={form} />

                    {mustVerifyEmail && user.email_verified_at === null && (
                        <div>
                            <p className="text-sm mt-2 text-gray-800">
                                Your email address is unverified.
                                <Link
                                    href={route("verification.send")}
                                    method="post"
                                    as="button"
                                    className="underline text-sm text-gray-600 hover:text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    Click here to re-send the verification
                                    email.
                                </Link>
                            </p>

                            {status === "verification-link-sent" && (
                                <div className="mt-2 font-medium text-sm text-green-600">
                                    A new verification link has been sent to
                                    your email address.
                                </div>
                            )}
                        </div>
                    )}

                    <Button disabled={processing}>
                        <span>Save profile</span>
                    </Button>
                </form>
            </Form>
        </section>
    );
}
