import { Form } from "@/Components/ui/form";
import { useForm as reactForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/Components/ui/button";
import { useForm } from "@inertiajs/react";
import { EDUCATIONALBACKGROUNDSCHEMA, IFormEB } from "../c1types";
import { UserInfoType } from "../PersonalDataSheet";
import { useEffect, useState } from "react";
import { useToast } from "@/Components/ui/use-toast";
import EducationalBackground from "./EducationalBackground";

type EducationalBackgroundFormProps = {
    user: UserInfoType;
    onProcess: (process: boolean) => void;
};

type EB = {
    elementary: Array<any>;
    secondary: Array<any>;
    vocational: Array<any>;
    college: Array<any>;
    graduatestudies: Array<any>;
};

export const getEducationalData = (data: Array<any>): EB => {
    let elementary: any[] = [];
    let secondary: any[] = [];
    let seniorhigh: any[] = [];
    let vocational: any[] = [];
    let college: any[] = [];
    let graduatestudies: any[] = [];

    data.forEach((eb) => {
        if (eb.type === "elementary"){ elementary.push(eb)}
        else if (eb.type === "secondary"){ secondary.push(eb)}
        else if (eb.type === "vocational"){ vocational.push(eb)}
        else if (eb.type === "college"){ college.push(eb)}
        else if (eb.type === "graduate"){ graduatestudies.push(eb)}
    });

    return {
        elementary,
        secondary,
        vocational,
        college,
        graduatestudies,
    };
};

const setEBValues = [{
    ebid: null,
    nameofschool: '',
    basiceddegreecourse: '',
    period: { from: '', to: ''},
    highestlvl: '',
    yeargraduated: '',
    scholarshiphonor: '',
}]

const EducationalBackgroundForm = ({
    user,
    onProcess,
}: EducationalBackgroundFormProps) => {
    const pds_eb = user.pds_educational_background;
    const { elementary, secondary, vocational, college, graduatestudies } =
        getEducationalData(pds_eb);

    const form = reactForm<IFormEB>({
        resolver: zodResolver(EDUCATIONALBACKGROUNDSCHEMA),
        values: {
            elementary: elementary.length > 0 ? elementary : setEBValues,
            secondary: secondary.length > 0 ? secondary : setEBValues,
            vocational: vocational.length > 0 ? vocational : setEBValues,
            college: college.length > 0 ? college : setEBValues,
            graduatestudies: graduatestudies.length > 0 ? graduatestudies : setEBValues,
        },
    });

    const { setData, post, processing, reset } = useForm<IFormEB>();
    const [isSubmitted, setIsSubmitted] = useState(false);
    const { toast } = useToast();

    const onFormSubmit = (formData: IFormEB) => {
        console.log(formData);
        setData(formData);
        setIsSubmitted(true);
    };

    useEffect(() => {
        if (isSubmitted) {
            post(route("pds.c1.eb.upload"), {
                onSuccess: (page) => {
                    toast({
                        variant: "success",
                        description: page.props.success?.toString(),
                    });
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
                <EducationalBackground form={form} />

                <div className="mt-10 pt-2 border-t flex">
                    <Button
                        type="submit"
                        className="px-10 ml-auto max-sm:w-full"
                    >
                        Save
                    </Button>
                </div>
            </form>
        </Form>
    );
};

export default EducationalBackgroundForm;
