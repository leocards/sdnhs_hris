import { useEffect, FormEventHandler, useState } from "react";
import GuestLayout from "@/Layouts/GuestLayout";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import { Head, useForm } from "@inertiajs/react";
import { z } from "zod";
import { useForm as reactForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import Processing from "@/Components/Processing";
import { requiredError } from "../types";

const RESETPASSWORD = z.object({
    token: z.string().default(""),
    email: z.string().min(1, requiredError('email')).default(""),
    password: z.string().min(1, requiredError('password')).default(""),
    password_confirmation: z.string().min(1, requiredError('password confirmation')).default(""),
});

type IFormValues = z.infer<typeof RESETPASSWORD>;

export default function ResetPassword({
    token,
    email,
}: {
    token: string;
    email: string;
}) {
    const form = reactForm<IFormValues>({
        resolver: zodResolver(RESETPASSWORD),
        defaultValues: {
            token: token,
            email: email,
            password: "",
            password_confirmation: "",
        },
    });
    const { setData, post, processing, reset } =
        useForm<IFormValues>();
    const [isSubmit, setIsSubmit] = useState<boolean>(false)

    useEffect(() => {
        return () => {
            form.reset(formValues => ({
                ...formValues,
                password: "",
                password_confirmation: ""
            }))
        };
    }, []);

    const onFormSubmit = (formData: IFormValues) => {
        setIsSubmit(true)
        setData(formData);
    };

    useEffect(() => {
        if(isSubmit) {
            post(route("password.store"), {
                onError: error => {
                    for (const key in error) {
                        form.setError(key as keyof IFormValues, {
                            type: "manual",
                            message: error[key],
                        });
                    }
                },
                onFinish: () => {
                    setIsSubmit(false)
                }
            });
        }
    }, [isSubmit]);

    return (
        <GuestLayout>
            <Head title="Reset Password" />

            <Processing is_processing={processing} />

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onFormSubmit)}>
                    <div>
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            disabled
                                            className="form-input"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="mt-4">
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="required">Password</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            type="password"
                                            className="form-input"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="mt-4">
                        <FormField
                            control={form.control}
                            name="password_confirmation"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="required">Confirm Password</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            type="password"
                                            className="form-input"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="flex items-center justify-end mt-4">
                        <Button className="ms-4" disabled={processing}>
                            Reset Password
                        </Button>
                    </div>
                </form>
            </Form>
        </GuestLayout>
    );
}
