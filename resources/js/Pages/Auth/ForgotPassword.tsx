import GuestLayout from "@/Layouts/GuestLayout";
import InputError from "@/Components/InputError";
import { Head, router, useForm } from "@inertiajs/react";
import { FormEventHandler, useEffect, useState } from "react";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { ChevronLeft } from "lucide-react";
import Processing from "@/Components/Processing";

export default function ForgotPassword({ status }: { status?: string }) {
    const { data, setData, post, processing, errors } = useForm({
        email: "",
    });

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        let onStartVisit = router.on("start", () => {
            setLoading(true);
        });
        let onFinishVisit = router.on("finish", () => {
            setLoading(false);
        });

        return () => {
            onStartVisit();
            onFinishVisit();
        };
    }, []);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route("password.email"));
    };

    return loading ? (
        <div className="relative size-full">
            <Processing
                is_processing={loading}
                className="text-foreground"
                classNameSpinner="bg-foreground"
                backdrop=""
                label="Please wait..."
            />
        </div>
    ) : (
        <GuestLayout>
            <Head title="Forgot Password" />

            <div className="mb-4 text-sm text-foreground">
                Forgot your password? No problem. Just let us know your email
                address and we will email you a password reset link that will
                allow you to choose a new one.
            </div>

            {status && (
                <div className="mb-4 font-medium text-sm text-green-600">
                    {status}
                </div>
            )}

            <form onSubmit={submit}>
                <Input
                    id="email"
                    type="email"
                    name="email"
                    value={data.email}
                    className="mt-1 block w-full"
                    onChange={(e) => setData("email", e.target.value)}
                />

                <InputError message={errors.email} className="mt-2" />

                <div className="flex items-center justify-end mt-4">
                    <Button className="ms-4" disabled={processing}>
                        Email Password Reset Link
                    </Button>
                </div>
            </form>

            <div className="mt-5 pt-4 border-t border-border">
                <Button
                    className="items-center w-full gap-3"
                    variant={"secondary"}
                    onClick={() => router.get(route("/"))}
                >
                    <ChevronLeft className="size-4" />
                    <span>Back to login</span>
                </Button>
            </div>
        </GuestLayout>
    );
}
