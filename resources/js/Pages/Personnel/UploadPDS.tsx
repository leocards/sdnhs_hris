import React, { useEffect, useState } from "react";
import Modal from "@/Components/Modal";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/Components/ui/form";
import { Input } from "@/Components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm as reactForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/Components/ui/button";
import { Upload } from "lucide-react";
import { useForm } from "@inertiajs/react";
import { useToast } from "@/Components/ui/use-toast";

const UPLOADPDSSCHEMA = z.object({
    file: z
        .instanceof(File, { message: "Please choose an excel file format of your PDS."})
        .refine((file) => file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", {
            message: "Only excel files are allowed.",
        })
        .refine((file) => file.size <= 10 * 1024 * 1024, {
            message: "File size should not exceed 10MB",
        }),
});

type IFormPDS = z.infer<typeof UPLOADPDSSCHEMA>;

const UploadPDS: React.FC<{ show: boolean, onClose: (close: false) => void }> = ({ show, onClose }) => {
    const form = reactForm<IFormPDS>({
        resolver: zodResolver(UPLOADPDSSCHEMA),
    });

    const { data, setData, post, processing, reset, isDirty } = useForm<IFormPDS>()
    const [isSubmit, setIsSubmit] = useState<boolean>(false)

    const { toast } = useToast()

    const onFormSubmit = (formData: IFormPDS) => {
        setIsSubmit(true)
        if(!processing)
            setData(formData)
    };

    useEffect(() => {
        if(isSubmit) {
            post(route('pds.upload'), {
                onSuccess: page => {
                    toast({
                        variant: "success",
                        description: page.props.success?.toString()
                    })
                    onClose(false)
                },
                onError: error => {
                    toast({
                        variant: "destructive",
                        description: error[0]
                    })
                    console.log(error)
                },
                onFinish: () => {
                    setIsSubmit(false)
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
                <div className="font-bold text-xl mb-6 px-1">Upload PDS</div>

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
                                                    className="form-input"
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

export default UploadPDS;