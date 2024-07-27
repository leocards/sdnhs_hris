import React, { useEffect, useState } from "react";
import Modal from "@/Components/Modal";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/Components/ui/form";
import { Input } from "@/Components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm as reactForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/Components/ui/button";
import { useForm } from "@inertiajs/react";
import { useToast } from "@/Components/ui/use-toast";

const allowedMimeTypes = [
    'application/pdf', 
    'image/jpeg', 
    'image/jpg', 
    'image/png'
];

const UPLOADMEDICALSCHEMA = z.object({
    file: z
        .instanceof(File, { message: "Please choose a file."})
        .refine((file) => allowedMimeTypes.includes(file.type), {
            message: "Only PDF, JPEG, JPG, and PNG files are allowed.",
        })
        .refine((file) => file.size <= 10 * 1024 * 1024, {
            message: "File size should not exceed 10MB",
        }),
    // the owner of the record
    auth: z.number().nullable()
});

type IFormMedical = z.infer<typeof UPLOADMEDICALSCHEMA>;

type Data = {leave_id?: number|null, medical: string, user: { id: number|null, first_name: string, last_name: string }}

const UploadMedical: React.FC<{ show: boolean, data: Data, onClose: (close: false) => void }> = ({ show, data, onClose }) => {
    const form = reactForm<IFormMedical>({
        resolver: zodResolver(UPLOADMEDICALSCHEMA),
        defaultValues: {
            auth: data.user.id
        }
    });
    const { setData, post, processing, reset } = useForm<IFormMedical>()
    const [isSubmit, setIsSubmit] = useState<boolean>(false)

    const { toast } = useToast()

    const onFormSubmit = (formData: IFormMedical) => {
        formData.auth = data.user.id

        setIsSubmit(true)
        if(!processing)
            setData(formData)
    };

    useEffect(() => {
        if(isSubmit) {
            post(route('leave.upload_medical', [data.leave_id]), {
                preserveState: true,
                onSuccess: page => {
                    toast({
                        variant: "success",
                        description: page.props.success?.toString()
                    })
                    onClose(false)
                    form.reset()
                },
                onError: error => {
                    toast({
                        variant: "destructive",
                        description: error[0]
                    })
                    if(error.file) {
                        form.setError("file", {
                            type: "manual",
                            message: error.file
                        })
                    }
                    console.log(error)
                },
                onFinish: () => {
                    setIsSubmit(false)
                    reset()
                }
            })
        }
    }, [isSubmit])

    return (
        <Modal
            show={show}
            onClose={() => null}
            closeable={false}
            dialogStyle="mt-[20vh]"
            maxWidth="lg"
        >
            <div className="p-6">
                <div className="font-bold text-xl mb-6 px-1">Upload Medical</div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onFormSubmit)}>
                        {
                            processing ? (
                                <div className="flex items-center gap-3 justify-center py-5">
                                    <span className="loading loading-spinner loading-md"></span>
                                    Uploading
                                </div>
                            ) : (
                                <FormField
                                    control={form.control}
                                    name="file"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Input
                                                    type="file"
                                                    className="h-10 aria-[invalid=true]:border-destructive aria-[invalid=true]:ring-destructive shadow-sm"
                                                    onChange={(e) => {
                                                        const file = e.target.files?.[0];
                                                        if (file) {
                                                            field.onChange(file);
                                                        }
                                                    }}
                                                    onBlur={field.onBlur}
                                                    name={field.name}
                                                    ref={field.ref}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            )
                        }

                        <div className="mt-10 flex">
                            <Button variant="ghost" type="button" onClick={() => onClose(false)} disabled={processing}>
                                <span>Cancel</span>
                            </Button>   
                            <Button className="gap-3 ml-auto" disabled={processing}>
                                <span>Upload</span>
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </Modal>
    );
};

export default UploadMedical;