import { useEffect, useRef, useState } from "react";
import { Link, useForm } from "@inertiajs/react";
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
    email: z.string().min(1, requiredError("Email")).email().default(""),
    password: z
        .string()
        .min(8, "Password must be atleast 8 characters.")
        .default(""),
    remember: z.boolean().optional().default(false),
});

type IFormLogin = z.infer<typeof LOGINSCHEMA>;

type expired = { expired: string };

export default function Login({ status, onForgotPass }: { status?: string | expired; onForgotPass?: (bol: boolean) => void }) {
    const form = reactForm<IFormLogin>({
        resolver: zodResolver(LOGINSCHEMA),
        defaultValues: {
            email: "",
            password: "",
            remember: false,
        },
    });

    const { data, setData, post, processing, errors, reset, isDirty } =
        useForm<IFormLogin>();

    const passwordRef = useRef<HTMLInputElement | null>(null);
    const [isViewPassword, setIsViewPassword] = useState<boolean>(false);

    const onSubmit = (form: IFormLogin) => {
        setData(form);
    };

    useEffect(() => {
        return () => {
            reset("password");
        };
    }, []);

    useEffect(() => {
        if (isDirty)
            post(route("login"), {
                onError: (error) => {
                    console.log(error);
                    if (error.email) {
                        form.setError("email", {
                            type: "manual",
                            message: error.email,
                        });
                    }
                    if (error.password) {
                        form.setError("password", {
                            type: "manual",
                            message: error.password,
                        });
                    }
                },
            });
    }, [data]);

    return (
        <div className="[@media(min-width:985px)]:w-[26rem]">
            <div className="flex">
                <img
                    src={sdnhslogo}
                    alt="sdnhs logo"
                    className="size-20 sm:size-32 mx-auto mb-3 [@media(min-width:985px)]:mb-7"
                />
            </div>

            {status && typeof status === "string" ? (
                <div className="mb-4 font-medium text-sm text-green-600">
                    {status}
                </div>
            ) : (
                status && (
                    <div className="mb-4 font-medium text-sm text-orange-600 bg-orange-200 p-2 text-center rounded">
                        {typeof status !== "string" && status.expired}
                    </div>
                )
            )}
            <div className="font-clashdisplay text-lg sm:text-2xl font font-semibold [@media(min-width:985px)]:hidden mb-4 text-yellow-100 text-center">
                Human Resource Information System
            </div>

            <div className="bg-white dark:bg-secondary/50 p-4 rounded-lg shadow-sm">
                <div className="font-clashdisplay text-2xl font font-semibold [@media(max-width:985px)]:hidden">
                    Log in to your account
                </div>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-3 [@media(min-width:985px)]:mt-7"
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
                                            className="sm:h-12 aria-[invalid=true]:border-destructive aria-[invalid=true]:ring-destructive bg-transparent shadow-sm"
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
                                                    if (e)
                                                        passwordRef.current = e;
                                                }}
                                                className="sm:h-12 aria-[invalid=true]:border-destructive aria-[invalid=true]:ring-destructive bg-transparent shadow-sm"
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
                                                    passwordRef.current
                                                        ?.type === "password"
                                                ) {
                                                    passwordRef.current.type =
                                                        "text";
                                                    setIsViewPassword(true);
                                                } else if (
                                                    passwordRef.current
                                                        ?.type === "text"
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

                        <Button
                            className="w-full sm:h-12 !mt-8 dark:!bg-white/10"
                            disabled={processing}
                        >
                            {processing ? (
                                <span className="loading loading-dots loading-md bg-white"></span>
                            ) : (
                                <span className="font-clashdisplay font-semibold tracking-wider">
                                    Log in
                                </span>
                            )}
                        </Button>
                    </form>
                </Form>
                <div className="mt-4">
                    <Link
                        href={route("password.request")}
                        className={cn(
                            "underline text-sm hover:text-primary rounded-md focus:outline-none",
                            processing && "pointer-events-none"
                        )}
                        onClick={() => onForgotPass && onForgotPass(true)}
                    >
                        Forgot your password?
                    </Link>
                </div>
            </div>
        </div>
    );
}
