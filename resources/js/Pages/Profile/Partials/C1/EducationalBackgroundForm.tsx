import { Form } from "@/Components/ui/form";
import { useForm as reactForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/Components/ui/button";
import { useForm } from "@inertiajs/react";
import { EDUCATIONALBACKGROUNDSCHEMA, EducationType, IFormEB } from "../c1types";
import { UserInfoType } from "../../Edit";
import { useEffect, useState } from "react";
import { useToast } from "@/Components/ui/use-toast";
import EducationalBackground from "./EducationalBackground";

type EducationalBackgroundFormProps = {
    user: UserInfoType;
    onProcess: (process: boolean) => void;
};

type EB = {
    elementary: any;
    secondary: any;
    vocational: any;
    college: any;
    graduatestudies: any;
};

const getEducationalData = (data: Array<any>): EB => {
    let elementary: any = null;
    let secondary: any = null;
    let vocational: any = null;
    let college: any = null;
    let graduatestudies: any = null;

    data.forEach((eb) => {
        if (eb.education_type === "elementary") elementary = eb;
        else if (eb.education_type === "secondary") secondary = eb;
        else if (eb.education_type === "vocational") vocational = eb;
        else if (eb.education_type === "college") college = eb;
        else if (eb.education_type === "graduate") graduatestudies = eb;
    });

    return {
        elementary,
        secondary,
        vocational,
        college,
        graduatestudies,
    };
};

const setEBValues = (data: any): EducationType => {
    return {
        ebid: data?.id??null,
        nameofschool: data?.school??"",
        basiceddegreecourse: data?.course??"",
        period: {
            from: data?.from??"",
            to: data?.to??"",
        },
        highestlvl: data?.highest_earned??"",
        yeargraduated: data?.year_graduated??"",
        scholarshiphonor: data?.honors??"",
    }
}

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
            attained: {
                isElementary: elementary ? true : false,
                isSecondary: secondary ? true : false,
                isVocational: vocational ? true : false,
                isCollege: college ? true : false,
                isGraduate: graduatestudies ? true : false,
            },
            elementary: setEBValues(elementary),
            secondary: setEBValues(secondary),
            vocational: setEBValues(vocational),
            college: setEBValues(college),
            graduatestudies: setEBValues(graduatestudies),
        },
    });

    const watchAttained = form.watch("attained");

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
                        disabled={
                            watchAttained.isElementary === false &&
                            watchAttained.isSecondary === false &&
                            watchAttained.isVocational === false &&
                            watchAttained.isCollege === false &&
                            watchAttained.isGraduate === false
                        }
                    >
                        Save
                    </Button>
                </div>
            </form>
        </Form>
    );
};

export default EducationalBackgroundForm;
