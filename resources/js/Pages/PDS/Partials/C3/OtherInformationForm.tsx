import { Form } from "@/Components/ui/form";
import { useForm as reactForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/Components/ui/button";
import { useForm } from "@inertiajs/react";
import { useEffect, useState } from "react";
import { useToast } from "@/Components/ui/use-toast";
import OtherInformation from "./OtherInformation";
import { IFormOI, OTHERINFORMATIONSCHEMA } from "../c3types";
import { UserInfoType } from "../PersonalDataSheet";

type WorkExperienceFormProps = {
    user: UserInfoType;
    onProcess: (process: boolean) => void;
};

const getOIData = (data: Array<any>, type: string): any => {
    return data
        .filter((oidata) => oidata.info_type === type)
        .map((oidata) => ({
            oiid: oidata.id,
            detail: oidata.detail,
        }));
};

const OtherInformationForm = ({ user, onProcess }: WorkExperienceFormProps) => {
    const pds_oi = user.pds_other_information;

    const form = reactForm<IFormOI>({
        resolver: zodResolver(OTHERINFORMATIONSCHEMA),
        values: {
            skills: getOIData(pds_oi, "skills"),
            nonacademicrecognition: getOIData(pds_oi, "recognition"),
            membership: getOIData(pds_oi, "association"),
            deletedOI: []
        },
    });

    const { setData, post, processing, reset } = useForm<IFormOI>();
    const [isSubmitted, setIsSubmitted] = useState(false);
    const { toast } = useToast();

    const onFormSubmit = (formData: IFormOI) => {
        console.log(formData);
        setData(formData);
        setIsSubmitted(true);
    };

    useEffect(() => {
        if (isSubmitted) {
            post(route("pds.c3.oi.upload"), {
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
                <OtherInformation form={form} />

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

export default OtherInformationForm;
