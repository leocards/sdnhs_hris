import { useEffect, FormEventHandler, useRef, useState } from "react";
import { Head, Link, useForm } from "@inertiajs/react";
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
import { Checkbox } from "@/Components/ui/checkbox";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import sdnhslogo from "@/assets/sdnhs-logo.png";
import { requiredError } from "../types";

const LOGINSCHEMA = z.object({
    email: z.string().min(1, requiredError('Email')).email().default(""),
    password: z
        .string()
        .min(8, "Password must be atleast 8 characters.")
        .default(""),
    remember: z.boolean().optional().default(false),
});

type IFormLogin = z.infer<typeof LOGINSCHEMA>;

type expired = {expired: string}

export default function Login({ status }: { status?: string | expired }) {
    const form = reactForm<IFormLogin>({
        resolver: zodResolver(LOGINSCHEMA),
        defaultValues: {
            email: "",
            password: "",
            remember: false
        }
    });

    const { data, setData, post, processing, errors, reset, isDirty } = useForm<IFormLogin>();

    const passwordRef = useRef<HTMLInputElement | null>(null);
    const [isViewPassword, setIsViewPassword] = useState<boolean>(false);

    const onSubmit = (form: IFormLogin) => {
        setData(form);
    };

    useEffect(() => {
        console.log(status)
        return () => {
            reset('password');
        };
    }, []);

    useEffect(() => {
        if(isDirty) post(route('login'), {
            onError: (error) => {
                console.log(error)
                if (error.email) {
                    form.setError('email', {
                        type: 'manual',
                        message: error.email,
                    });
                }
                if (error.password) {
                    form.setError('password', {
                        type: 'manual',
                        message: error.password,
                    });
                }
            }
        })
    }, [data])

    return (
        <div className="w-[26rem]">
            <img
                src={sdnhslogo}
                alt="sdnhs logo"
                className="size-32 mx-auto mb-7"
            />

            {status && typeof status === 'string' ? (
                <div className="mb-4 font-medium text-sm text-green-600">
                    {status}
                </div>
            ) : status && (
                <div className="mb-4 font-medium text-sm text-orange-600 bg-orange-200 p-2 text-center rounded">
                    {typeof status !== 'string' && (status.expired)}
                </div>
            )}

            <div className="font-clashdisplay text-2xl font font-semibold">
                Log in to your account
            </div>

            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-3 mt-7"
                >
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-base">
                                    Email
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Email"
                                        {...field}
                                        className="h-12 aria-[invalid=true]:border-destructive aria-[invalid=true]:ring-destructive bg-transparent shadow-sm"
                                        disabled={processing}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem className="relative">
                                <FormLabel className="text-base mb-2">
                                    Password
                                </FormLabel>
                                <div className="relative">
                                    <FormControl>
                                        <Input
                                            type="password"
                                            placeholder="password"
                                            {...field}
                                            ref={(e) => {
                                                field.ref(e);
                                                if (e) passwordRef.current = e;
                                            }}
                                            className="h-12 aria-[invalid=true]:border-destructive aria-[invalid=true]:ring-destructive bg-transparent shadow-sm"
                                            disabled={processing}
                                        />
                                    </FormControl>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        type="button"
                                        className="absolute top-1/2 -translate-y-1/2 right-[6px] size-9 before:!bg-zinc-200"
                                        onClick={() => {
                                            if (
                                                passwordRef.current?.type ===
                                                "password"
                                            ) {
                                                passwordRef.current.type =
                                                    "text";
                                                setIsViewPassword(true);
                                            } else if (
                                                passwordRef.current?.type ===
                                                "text"
                                            ) {
                                                passwordRef.current.type =
                                                    "password";
                                                setIsViewPassword(false);
                                            }
                                        }}
                                    >
                                        {!isViewPassword ? (
                                            <Eye className="size-5" />
                                        ) : (
                                            <EyeOff className="size-5" />
                                        )}
                                    </Button>
                                </div>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="remember"
                        render={({ field }) => (
                            <FormItem className="flex items-center gap-2 !mt-5">
                                <FormControl>
                                    <Checkbox
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                        disabled={processing}
                                    />
                                </FormControl>
                                <FormLabel className="!mt-0">
                                    Remember me
                                </FormLabel>
                            </FormItem>
                        )}
                    />

                    <Button className="w-full h-12 !mt-8 !bg-yellow-950" disabled={processing}>
                        {
                            processing ? (
                                <span className="loading loading-dots loading-md bg-white"></span>
                            ) : (
                                <span className="font-clashdisplay font-semibold tracking-wider">
                                    Log in
                                </span>
                            )
                        }
                    </Button>
                </form>
            </Form>
            <div className="mt-4">
                <Link
                    href={route("password.request")}
                    className={cn("underline text-sm hover:text-yellow-600 rounded-md focus:outline-none", processing && "pointer-events-none")}
                >
                    Forgot your password?
                </Link>
            </div>

            {/* <form onSubmit={submit}>
                <div>
                    <InputLabel htmlFor="email" value="Email" />

                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full p-2 px-3"
                        autoComplete="username"
                        onChange={(e) => setData('email', e.target.value)}
                    />

                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="password" value="Password" />

                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full p-2 px-3"
                        autoComplete="current-password"
                        onChange={(e) => setData('password', e.target.value)}
                    />

                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="block mt-4">
                    <label className="flex items-center">
                        <Checkbox
                            name="remember"
                            checked={data.remember}
                            onChange={(e) => setData('remember', e.target.checked)}
                        />
                        <span className="ms-2 text-sm text-gray-600">Remember me</span>
                    </label>
                </div>

                <div className="flex items-center justify-end mt-4">
                    <Link
                        href={route('password.request')}
                        className="underline text-sm text-gray-600 hover:text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Forgot your password?
                    </Link>

                    <PrimaryButton className="ms-4" disabled={processing}>
                        Log in
                    </PrimaryButton>
                </div>
            </form> */}
        </div>
    );
}
