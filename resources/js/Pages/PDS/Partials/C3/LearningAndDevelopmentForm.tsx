import { Form } from "@/Components/ui/form";
import { useForm as reactForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/Components/ui/button";
import { useForm } from "@inertiajs/react";
import { useEffect, useState } from "react";
import { useToast } from "@/Components/ui/use-toast";
import { IFormLD, LEARNINGANDDEVELOPMENTSCHEMA, VOLUNTARYWORK } from "../c3types";
import LearningAndDevelopment from "./LearningAndDevelopment";
import { UserInfoType } from "../PersonalDataSheet";

type LearningAndDevelopmentFormProps = {
    user: UserInfoType;
    onProcess: (process: boolean) => void;
};

const getLDData = (data: any): any => {
    return {
        ldid: data.id,
        title: data.title,
        inclusivedates: {
            from: new Date(data.from),
            to: new Date(data.to),
        },
        numberofhours: data.num_hours,
        typeofld: data.type_of_ld,
        conductedsponsoredby: data.conducted_by,
    };
};

const LearningAndDevelopmentForm = ({ user, onProcess }: LearningAndDevelopmentFormProps) => {
    const pds_ld = user.pds_learning_development;

    const form = reactForm<IFormLD>({
        resolver: zodResolver(LEARNINGANDDEVELOPMENTSCHEMA),
        values: {
            ld: pds_ld ? pds_ld.map((data: any) => getLDData(data)) : [],
            deletedLD: []
        }
    });

    const { setData, post, processing, reset } = useForm<IFormLD>();
    const [isSubmitted, setIsSubmitted] = useState(false);
    const { toast } = useToast();

    const onFormSubmit = (formData: IFormLD) => {
        console.log(formData);
        setData(formData);
        setIsSubmitted(true);
    };

    useEffect(() => {
        if (isSubmitted) {
            post(route("pds.c3.ld.upload"), {
                onSuccess: (page) => {
                    toast({
                        variant: "success",
                        description: page.props.success?.toString(),
                    });
                    form.reset();
                },
                onError: (error) => {
                    console.log(error[0]);
                    toast({
                        variant: "destructive",
                        description: error[0],
                    });
                },
                onFinish: () => {
                    setIsSubmitted(false);
                    reset();
                },
            });
        }
    }, [isSubmitted]);

    useEffect(() => {
        onProcess(processing);
    }, [processing]);

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onFormSubmit)}>
                <LearningAndDevelopment form={form} />

                <div className="mt-10 pt-2 border-t flex">
                    <Button
                        type="submit"
                        className="px-10 ml-auto max-sm:w-full"
                        disabled={
                            form.watch('ld').length === 0 && form.watch('deletedLD')?.length === 0
                        }
                    >
                        Save
                    </Button>
                </div>
            </form>
        </Form>
    );
};

export default LearningAndDevelopmentForm;
