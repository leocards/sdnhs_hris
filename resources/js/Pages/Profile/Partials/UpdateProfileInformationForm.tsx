import { Link, useForm, usePage } from "@inertiajs/react";
import { useEffect, useState } from "react";
import { z } from "zod";
import { requiredError } from "@/Pages/types";
import { useForm as reactForm } from "react-hook-form";
import { ROLE, PERSONNELPOSITIONS } from "@/Pages/Personnel/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/Components/ui/use-toast";
import { Form } from "@/Components/ui/form";
import { Button } from "@/Components/ui/button";
import { cn } from "@/lib/utils";
import PersonalInformation from "@/Pages/Personnel/Partials/PersonalInformation";
import ContactInformation from "@/Pages/Personnel/Partials/ContactInformation";
import PersonnelInformation from "@/Pages/Personnel/Partials/PersonnelInformation";

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
    position: z.enum(PERSONNELPOSITIONS, {
        required_error: requiredError("position"),
    }),
    personnelId: z.string().min(1, requiredError("personnel Id")).default(""),
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
    personnel_id?: string;
    date_hired?: Date | null;
    date_of_birth: Date;
    role?: "HOD" | "Teaching" | "Non-teaching";
}

type UserProps = { auth: { user: User } };

const getUser = (user: User): IFormProfile => {
    return {
        firstName: user.first_name,
        lastName: user.last_name,
        middleName: user.middle_name??"",
        sex: user?.sex||"Male",
        email: user.email,
        address: user?.address||"",
        phoneNumber: user.phone_number,
        position: user.position,
        personnelId: user.personnel_id||"",
        department: user.department,
        dateHired: (user.date_hired && new Date(user.date_hired))||null,
        userRole: user.role||"Teaching",
        currentCredits: user.leave_credits||0,
        birthDate: new Date(user.date_of_birth)
    }
}

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
    className = "",
    userRoles,
}: {
    mustVerifyEmail: boolean;
    status?: string;
    className?: string;
    userRoles: string[];
}) {
    const user = usePage<UserProps>().props.auth.user;
    const [isSubmit, setIsSubmit] = useState<boolean>(false);
    const form = reactForm<IFormProfile>({
        resolver: zodResolver(PROFILESCHEMA),
        values: {
            firstName: user.first_name,
            lastName: user.last_name,
            middleName: user.middle_name??"",
            sex: user?.sex||"Male",
            email: user.email,
            address: user?.address||"",
            phoneNumber: user.phone_number,
            position: user.position,
            personnelId: user.personnel_id||"",
            department: user.department,
            dateHired: (user.date_hired && new Date(user.date_hired))||null,
            userRole: user.role||"Teaching",
            currentCredits: user.leave_credits||0,
            birthDate: new Date(user.date_of_birth)
        },
    });
    const {
        setData,
        patch,
        processing,
        reset,
    } = useForm<IFormProfile>();
    const { toast } = useToast();

    const onFormSubmit = (formData: IFormProfile) => {
        setIsSubmit(true);
        setData(formData);
        if(form.formState.isDirty) {
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
                <h2 className="text-lg font-medium text-secondary-foreground">
                    Profile Information
                </h2>

                <p className="mt-1 text-sm text-accent-foreground/60">
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

                    <PersonnelInformation form={form} user_roles={userRoles} />

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
