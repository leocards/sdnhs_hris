import Modal from "@/Components/Modal";
import Processing from "@/Components/Processing";
import { Button } from "@/Components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/Components/ui/form";
import { Input } from "@/Components/ui/input";
import { useToast } from "@/Components/ui/use-toast";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "@inertiajs/react";
import { ImageUp, UserRound, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useForm as reactForm } from "react-hook-form";
import { z } from "zod";

const allowedMimeTypes = ["image/jpeg", "image/jpg", "image/png"];

const AVATARSCHEMA = z.object({
    image: z
        .instanceof(File, { message: "Please choose a file." })
        .refine((file) => allowedMimeTypes.includes(file.type), {
            message: "Only JPEG, JPG, and PNG files are allowed.",
        })
        .refine((file) => file.size <= 10 * 1024 * 1024, {
            message: "File size should not exceed 10MB",
        }),
});
/* .superRefine(async ({ image }, ctx) => {
        if (allowedMimeTypes.includes(image.type)) {
            const dimensions = await getImageDimensions(image);
            if (dimensions.width !== 420 || dimensions.height !== 540) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    path: ["image"],
                    message:
                        "Image must be 540x420 pixels for a passport-size photo",
                });
            }
        }
    }); */

function getImageDimensions(
    file: File
): Promise<{ width: number; height: number }> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = URL.createObjectURL(file);
        img.onload = () => {
            resolve({ width: img.width, height: img.height });
            console.log({ width: img.width, height: img.height });
        };
        img.onerror = reject;
    });
}

type IFormAvatar = z.infer<typeof AVATARSCHEMA>;

type Props = {
    show: boolean;
    onClose: CallableFunction;
};

const UploadAvatar = ({ show, onClose }: Props) => {
    const form = reactForm<IFormAvatar>({
        resolver: zodResolver(AVATARSCHEMA),
    });
    const avatarRef = useRef<HTMLInputElement | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const imageFile = form.watch("image");

    const { setData, post, processing, reset } = useForm<IFormAvatar>();
    const [isSubmit, setIsSubmit] = useState<boolean>(false);
    const { toast } = useToast();

    const onFormSubmit = (form: IFormAvatar) => {
        setData(form);
        setIsSubmit(true);
    };

    useEffect(() => {
        if (isSubmit) {
            post(route("profile.avatar"), {
                onSuccess: (page) => {
                    toast({
                        variant: "success",
                        description: page.props.success?.toString(),
                    });
                    form.reset();
                    onClose(false);
                },
                onError: (error) => {
                    toast({
                        variant: "destructive",
                        description: error[0],
                    });
                },
                onFinish: () => {
                    setIsSubmit(false);
                    reset();
                },
            });
        }
    }, [isSubmit]);

    useEffect(() => {
        if (imageFile instanceof File) {
            const previewUrl = URL.createObjectURL(imageFile);
            console.log("Preview URL created:", previewUrl);
            setPreview(previewUrl);

            return () => URL.revokeObjectURL(previewUrl);
        }
        if (!imageFile) {
            setPreview(null);
        }
    }, [imageFile]);

    useEffect(() => {
        if (show) {
            form.reset();
        }
    }, [show]);

    return (
        <Modal show={show} onClose={() => onClose(false)} center maxWidth="md">
            {processing ? (
                <Processing is_processing={processing} backdrop="" />
            ) : (
                <div className="p-6 flex flex-col">
                    <div className="font-bold text-xl mb-6 px-1 pl-0">
                        Upload Avatar
                    </div>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onFormSubmit)}>
                            <FormField
                                control={form.control}
                                name="image"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <div className="">
                                                <Input
                                                    type="file"
                                                    accept="image/jpg,image/jpeg,image/png"
                                                    className="form-input hidden"
                                                    onBlur={field.onBlur}
                                                    onChange={(e) => {
                                                        const file =
                                                            e.target.files?.[0];
                                                        if (file) {
                                                            field.onChange(
                                                                file
                                                            );
                                                        }
                                                    }}
                                                    name={field.name}
                                                    ref={(el) => {
                                                        field.ref(el);
                                                        avatarRef.current = el;
                                                    }}
                                                />

                                                <div className="mx-auto flex flex-col rounded-full size-52 bg-accen border-4 overflow-hidden">
                                                    <img
                                                        src={
                                                            preview
                                                                ? preview
                                                                : ""
                                                        }
                                                        alt=""
                                                        onLoad={(e) =>
                                                            console.log(e)
                                                        }
                                                        className={cn(
                                                            "object-cover w-full h-full",
                                                            !preview && "hidden"
                                                        )}
                                                    />
                                                    {!preview && (
                                                        <UserRound
                                                            className="size-20 mx-auto my-auto opacity-15"
                                                            strokeWidth={1.2}
                                                        />
                                                    )}
                                                </div>
                                                <div className="mx-auto w-fit mt-3 flex gap-2">
                                                    <Button
                                                        type="button"
                                                        size="icon"
                                                        variant="outline"
                                                        className="size-8 hover:bg-transparent"
                                                        onClick={() =>
                                                            form.reset()
                                                        }
                                                        disabled={!!!preview}
                                                    >
                                                        <X className="size-5" />
                                                    </Button>

                                                    <Button
                                                        type="button"
                                                        size="icon"
                                                        variant="outline"
                                                        className="size-8 hover:bg-transparent"
                                                        onClick={() =>
                                                            avatarRef.current?.click()
                                                        }
                                                    >
                                                        <ImageUp className="size-5" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </FormControl>
                                        <FormMessage className="text-center" />
                                    </FormItem>
                                )}
                            />

                            <div className="flex justify-between mt-10">
                                <Button
                                    type="button"
                                    variant={"ghost"}
                                    onClick={() => onClose(false)}
                                >
                                    <span>Cancel</span>
                                </Button>
                                <Button>
                                    <span>Upload</span>
                                </Button>
                            </div>
                        </form>
                    </Form>
                </div>
            )}
        </Modal>
    );
};

export default UploadAvatar;
