import { Form } from "@/Components/ui/form";
import { useForm as reactForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/Components/ui/button";
import { UserInfoType } from "../../../Profile/Edit";
import { useForm } from "@inertiajs/react";
import { useEffect, useState } from "react";
import { useToast } from "@/Components/ui/use-toast";
import { IFormVW, VOLUNTARYWORK } from "../c3types";
import VoluntaryWork from "./VoluntaryWork";

type VoluntaryWorkFormProps = {
    user: UserInfoType;
    onProcess: (process: boolean) => void;
};

const getVWData = (data: any): any => {
    return {
        vwid: data.id,
        nameandaddress: data.organization,
        inclusivedates: {
            from: data.from,
            to: data.to,
        },
        numberofhours: data.num_hours,
        positionornatureofwork: data.position,
    };
};

const VoluntaryWorkForm = ({ user, onProcess }: VoluntaryWorkFormProps) => {
    const pds_vw = user.pds_voluntary_work;

    const form = reactForm<IFormVW>({
        resolver: zodResolver(VOLUNTARYWORK),
        values: {
            vw: pds_vw ? pds_vw.map((data: any) => getVWData(data)) : [],
            deletedVW: []
        }
    });

    const { setData, post, processing, reset } = useForm<IFormVW>();
    const [isSubmitted, setIsSubmitted] = useState(false);
    const { toast } = useToast();

    const onFormSubmit = (formData: IFormVW) => {
        console.log(formData);
        setData(formData);
        setIsSubmitted(true);
    };

    useEffect(() => {
        if (isSubmitted) {
            post(route("pds.c3.vw.upload"), {
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
                <VoluntaryWork form={form} />

                <div className="mt-10 pt-2 border-t flex">
                    <Button
                        type="submit"
                        className="px-10 ml-auto max-sm:w-full"
                        disabled={
                           form.watch('vw').length === 0 && form.watch('deletedVW')?.length === 0
                        }
                    >
                        Save
                    </Button>
                </div>
            </form>
        </Form>
    );
};

export default VoluntaryWorkForm;
