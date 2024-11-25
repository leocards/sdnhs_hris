import { Form } from "@/Components/ui/form";
import { useForm as reactForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/Components/ui/button";
import { CIVILSERVICEELIGIBILITYSCHEMA, IFormCS } from "../c2types";
import CivilServiceEligibility from "./CivilServiceEligibility";
import { UserInfoType } from "../../../Profile/Edit";
import { useForm } from "@inertiajs/react";
import { useEffect, useState } from "react";
import { useToast } from "@/Components/ui/use-toast";

type CivilServiceEligibilityFormProps = {
    user: UserInfoType;
    onProcess: (process: boolean) => void;
};

const getCSData = (data: any): any => {
    return {
        csid: data?.id,
        eligibility: data?.career_service??"",
        rating: data?.rating??"",
        dateofexaminationconferment: new Date(data?.examination??null),
        placeofexaminationconferment: data?.place_examination??"",
        license: {
            number: data?.license_number??"",
            dateofvalidity: new Date(data?.license_date_validity??null)
        },
    }
}

const CivilServiceEligibilityForm: React.FC<
    CivilServiceEligibilityFormProps
> = ({ user, onProcess }) => {
    const pds_cs = user.pds_civil_service_eligibility

    const form = reactForm<IFormCS>({
        resolver: zodResolver(CIVILSERVICEELIGIBILITYSCHEMA),
        values: {
            cs: pds_cs?.length > 0 ? pds_cs.map((data: any) => getCSData(data)) : [],
            deletedCS: []
        }
    });

    const { setData, post, processing, reset } = useForm<IFormCS>()
    const [isSubmitted, setIsSubmitted] = useState(false)
    const { toast } = useToast()

    const onFormSubmit = (formData: IFormCS) => {
        console.log(formData);
        setData(formData)
        setIsSubmitted(true)
    };

    useEffect(() => {
        if(isSubmitted) {
            post(route('pds.c2.cs.upload'), {
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
                <CivilServiceEligibility form={form} />

                <div className="mt-10 pt-2 border-t flex">
                    <Button
                        type="submit"
                        className="px-10 ml-auto max-sm:w-full"
                        disabled={
                            form.watch('cs').length === 0 && form.watch('deletedCS')?.length === 0
                        }
                    >
                        Save
                    </Button>
                </div>
            </form>
        </Form>
    );
};

export default CivilServiceEligibilityForm;
