import { Form } from "@/Components/ui/form";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { PageProps } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Head, router, useForm } from "@inertiajs/react";
import { useEffect, useState } from "react";
import { useForm as reactForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/Components/ui/button";
import { Breadcrumbs } from "@/Components/ui/breadcrumb";
import PersonalInformation from "./Partials/PersonalInformation";
import ContactInformation from "./Partials/ContactInformation";
import PersonnelInformation from "./Partials/PersonnelInformation";
import UserCredentials from "./Partials/UserCredentials";
import { NEWPERSONNELSCHEMA } from "./types";
import { useToast } from "@/Components/ui/use-toast";
import Processing from "@/Components/Processing";

const initialValue = {
    firstName: "",
    lastName: "",
    middleName: "",
    sex: undefined,
    email: "",
    address: "",
    phoneNumber: "",
    personnelId: "",
    department: undefined,
    currentCredits: 0,
    password: "12345678",
    birthDate: null,
    dateHired: null,
    position: undefined,
    userRole: undefined,
};

type IFormNewPersonnel = z.infer<typeof NEWPERSONNELSCHEMA>;

export default function NewPersonnel({ auth, user, userRoles }: PageProps & { user?: any, userRoles: Array<string> }) {
    const form = reactForm<IFormNewPersonnel>({
        resolver: zodResolver(NEWPERSONNELSCHEMA),
        defaultValues: initialValue,
    });
    const { setData, post, processing, reset } = useForm<IFormNewPersonnel>();
    const [isSubmit, setIsSubmit] = useState<boolean>(false);

    const { toast } = useToast();

    const onFormSubmit = (formDate: IFormNewPersonnel) => {
        setIsSubmit(true);
        setData(formDate);
    };

    useEffect(() => {
        if (isSubmit) {
            const routepersonnel = !user ? route("personnel.new.store") : route("personnel.update", [user.id])
            post(routepersonnel, {
                onSuccess: (page) => {
                    toast({
                        variant: "success",
                        description: page.props.success?.toString(),
                    });
                    form.reset();
                },
                onError: (error) => {
                    for (const key in error) {
                        form.setError(key as keyof IFormNewPersonnel, {
                            type: "manual",
                            message: error[key],
                        });
                    }
                },
                onFinish: () => {
                    setIsSubmit(false);
                    reset();
                }
            });
        }
    }, [isSubmit]);

    useEffect(() => {
        if (user) {
            const {
                first_name,
                last_name,
                middle_name,
                sex,
                date_of_birth,
                address,
                email,
                phone_number,
                personnel_id,
                department,
                role,
                position,
                date_hired,
                leave_credits,
            } = user;
            console.log();
            form.setValue("firstName", first_name);
            form.setValue("lastName", last_name);
            form.setValue("middleName", middle_name);
            form.setValue("sex", sex);
            form.setValue("birthDate", new Date(date_of_birth));
            form.setValue("address", address);
            form.setValue("email", email);
            form.setValue("phoneNumber", phone_number);
            form.setValue("personnelId", personnel_id);
            form.setValue("department", department);
            form.setValue("userRole", role);
            form.setValue("position", position);
            form.setValue("dateHired", new Date(date_hired));
            // form.setValue("currentCredits", leave_credits);
        }
    }, [user]);

    return (
        <Authenticated
            userAuth={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Personnel
                </h2>
            }
        >
            <Head title="Personnel" />

            <div className="mt-3">
                <Breadcrumbs
                    home="Personnel"
                    homeLink="personnel"
                    links={[{ link: "personnel.new", linkname: "New personnel" }]}
                />
            </div>
            <div className="mt-10">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onFormSubmit)}>
                        <div className="mb-5">
                            {" "}
                            Required fields are marked with ({" "}
                            <span className="text-red-600">*</span> )
                        </div>

                        <PersonalInformation form={form} />

                        <ContactInformation form={form} />

                        <PersonnelInformation form={form} user_roles={userRoles} />

                        <UserCredentials form={form} />

                        <div className="flex items-center mt-8 pt-3 border-t">
                            {/* Provide Alert for clear form confirmation */}
                            {!user && (
                                <Button
                                    type="button"
                                    variant="ghost"
                                    disabled={processing}
                                    onClick={() => form.reset()}
                                >
                                    <span>Clear form</span>
                                </Button>
                            )}
                            <Button className="ml-auto" disabled={processing}>
                                {user ? "Update Personnel" : "Create Personnel"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
            <Processing is_processing={processing} />
        </Authenticated>
    );
}
