import Modal from "@/Components/Modal";
import { Button } from "@/Components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/Components/ui/form";
import { Textarea } from "@/Components/ui/textarea";
import { useToast } from "@/Components/ui/use-toast";
import { PageProps } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, usePage } from "@inertiajs/react";
import { useEffect, useState } from "react";
import { useForm as reactForm } from "react-hook-form";
import { z } from "zod";

const RESPONDSCHEMA = z.object({
    message: z.string().min(1, "Please provide reject message"),
});

type IFormRespond = z.infer<typeof RESPONDSCHEMA>;

const LeaveRespond: React.FC<{
    show: boolean;
    status: "rejected" | "approved" | null;
    onClose: (close: false) => void;
}> = ({ show, status, onClose }) => {
    const form = reactForm<IFormRespond>({
        resolver: zodResolver(RESPONDSCHEMA),
        defaultValues: {
            message: "",
        },
    });

    const {
        props: {
            auth,
            user,
            leave,
        },
    } = usePage<PageProps & { user: {id: number, first_name: string, last_name: string}, leave: any }>();

    const [isSent, setIsSent] = useState<boolean>(false);

    const { setData, post, processing, reset, isDirty } =
        useForm<IFormRespond>();

    const { toast } = useToast();

    const onFormSubmit = (form: IFormRespond) => {
        setData(form);
        setIsSent(true);
    };

    useEffect(() => {
        if (isSent) {
            post(
                route("leave.respond", {
                    user: user.id,
                    leave: leave.id,
                    _query: {
                        respond: status,
                    },
                }),
                {
                    onSuccess: ({ props }) => {
                        if(props.success) {
                            toast({
                                variant: "success",
                                description: props.success.toString(),
                            });
                            form.reset();
                            onClose(false);
                        }
                    },
                    onError: (error) => {
                        console.log(error);
                    },
                    onFinish: () => {
                        setIsSent(false);
                        reset();
                    },
                }
            );
        }

        return () => {
            form.reset();
            setIsSent(false);
            reset();
        }
    }, [isSent]);

    return (
        <Modal
            show={show}
            onClose={() => onClose(false)}
            closeable={false}
            maxWidth="lg"
        >
            <div className="p-6">
                {status === "rejected" ? (
                    <div className="font-bold text-xl mb-6 px-1 pl-0 text-destructive">
                        Reject Application for Leave
                    </div>
                ) : (
                    <div className="font-bold text-xl mb-6 px-1 pl-0 text-green-600">
                        Approve Application for Leave
                    </div>
                )}

                {processing ? (
                    <div className="flex items-center w-fit mx-auto my-8 gap-3">
                        <span className="loading loading-spinner loading-md"></span>
                        <span>Processing...</span>
                    </div>
                ) : status === "rejected" ? (
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onFormSubmit)}>
                            <div className="mb-5">Dear {`${user.first_name} ${user.last_name}`}, </div>
                            <FormField
                                control={form.control}
                                name="message"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="after:content-['*'] after:ml-0.5 after:text-red-500">Message:</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                {...field}
                                                className="aria-[invalid=true]:border-destructive aria-[invalid=true]:ring-destructive"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="mt-5">
                                Thank you for your understanding and
                                cooperation.
                                <br />
                                <br />
                                <div>
                                    {auth.user.first_name} {auth.user.last_name}
                                </div>
                                <div>{auth.user.position}</div>
                            </div>

                            <div className="flex mt-6">
                                <Button
                                    variant="ghost"
                                    type="button"
                                    onClick={() => onClose(false)}
                                >
                                    <span>Cancel</span>
                                </Button>

                                <Button
                                    variant="destructive"
                                    className="ml-auto"
                                >
                                    <span>Reject</span>
                                </Button>
                            </div>
                        </form>
                    </Form>
                ) : (
                    <div>
                        <div>Confirm Application for leave of <b>Lorem ipsum dolor est</b> ?</div>
                        <div className="flex mt-6">
                                <Button
                                    variant="ghost"
                                    type="button"
                                    onClick={() => onClose(false)}
                                >
                                    <span>Cancel</span>
                                </Button>

                                <Button
                                    className="ml-auto"
                                    onClick={() => setIsSent(true)}
                                >
                                    <span>Confirm</span>
                                </Button>
                            </div>
                    </div>
                )}
            </div>
        </Modal>
    );
};

export default LeaveRespond;
