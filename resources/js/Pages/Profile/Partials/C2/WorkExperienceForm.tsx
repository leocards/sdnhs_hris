import { Form } from "@/Components/ui/form";
import { useForm as reactForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/Components/ui/button";
import { IFormWE, WORKEXPERIENCESCHEMA } from "../c2types";
import { UserInfoType } from "../../Edit";
import { useForm } from "@inertiajs/react";
import { useEffect, useState } from "react";
import { useToast } from "@/Components/ui/use-toast";
import WorkExperience from "./WorkExperience";
import { isValidDate } from "@/Pages/types";

type WorkExperienceFormProps = {
    user: UserInfoType;
    onProcess: (process: boolean) => void;
};

const getWEData = (data: any): any => {
    return {
        weid: data?.id,
        inclusivedates: {
            from: isValidDate(data?.from) ? new Date(data?.from) : data?.from,
            to: isValidDate(data?.to) ? new Date(data?.to) : data?.to
        },
        positiontitle: data?.position_title ?? "",
        department: data?.company ?? "",
        monthlysalary: data?.monthly_salary ?? "",
        salarygrade: data?.salary_grade ?? "",
        statusofappointment: data?.status ?? "",
        isgovernment: data?.is_government_service ? "Y" : "N"
    }
}

const WorkExperienceForm = ({ user, onProcess }: WorkExperienceFormProps) => {
    const pds_we = user.pds_work_experience

    const form = reactForm<IFormWE>({
        resolver: zodResolver(WORKEXPERIENCESCHEMA),
        values: {
            we: pds_we ? pds_we.map((data: any) => getWEData(data)) : [],
            deletedWE: []
        }
    });

    const { setData, post, processing, reset } = useForm<IFormWE>()
    const [isSubmitted, setIsSubmitted] = useState(false)
    const { toast } = useToast()

    const onFormSubmit = (formData: IFormWE) => {
        console.log(formData);
        setData(formData)
        setIsSubmitted(true)
    };

    useEffect(() => {
        if(isSubmitted) {
            post(route('pds.c2.we.upload'), {
                onSuccess: page => {
                    toast({
                        variant: 'success',
                        description: page.props.success?.toString()
                    })
                    form.reset()
                },
                onError: error => {
                    console.log(error[0])
                    toast({
                        variant: 'destructive',
                        description: error[0]
                    })
                },
                onFinish: () => {
                    setIsSubmitted(false)
                    reset()
                }
            })
        }
    }, [isSubmitted])

    useEffect(() => {
        onProcess(processing)
    }, [processing])

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onFormSubmit)}>
                <WorkExperience form={form} />

                <div className="mt-10 pt-2 border-t flex">
                    <Button
                        type="submit"
                        className="px-10 ml-auto max-sm:w-full"
                        disabled={
                            form.watch('we').length === 0 && form.watch('deletedWE')?.length === 0
                        }
                    >
                        Save
                    </Button>
                </div>
            </form>
        </Form>
    );
};

export default WorkExperienceForm;
