import { Form } from "@/Components/ui/form";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { PageProps } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Head, useForm } from "@inertiajs/react";
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

const defaultRole = {
    teaching: "Teaching",
    "non-teaching": "Non-teaching",
} as const

type IFormNewPersonnel = z.infer<typeof NEWPERSONNELSCHEMA>;

export default function NewPersonnel({ auth, user, userRoles, role }: PageProps & { user?: any, userRoles: Array<string>, role: "teaching"|"non-teaching" }) {
    const form = reactForm<IFormNewPersonnel>({
        resolver: zodResolver(NEWPERSONNELSCHEMA),
        values: {
            firstName: user?user.first_name:"",
            lastName: user?user.last_name:"",
            middleName: user?user.middle_name:"",
            sex: user?user.sex:null,
            birthDate: user ? new Date(user.date_of_birth) : null,
            email: user? user.email : "",
            address: user? user.address : "",
            phoneNumber: user? user.phone_number : "",
            personnelId: user? user.personnel_id : "",
            department: user? user.role == "HOD" ? "N/A" : user.department : null,
            password: "12345678",
            dateHired: user? new Date(user.date_hired) : null,
            position: user? user.position : null,
            userRole: user ? user.role : role? defaultRole[role] : null,
        },
    });
    const { setData, post, processing, reset } = useForm<IFormNewPersonnel>();
    const [isSubmit, setIsSubmit] = useState<boolean>(false);

    const { toast } = useToast();

    const onFormSubmit = (formData: IFormNewPersonnel) => {
        setIsSubmit(true);
        setData(formData);
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
                    _query={{
                        personnel: "teaching"
                    }}
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
