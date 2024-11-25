import { Form } from "@/Components/ui/form";
import { useForm as reactForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/Components/ui/button";
import { useForm } from "@inertiajs/react";
import { FAMILYBACKGROUNDSCHEMA, IFormFB } from "../c1types";
import { UserInfoType } from "../PersonalDataSheet";
import { useEffect, useState } from "react";
import { useToast } from "@/Components/ui/use-toast";
import FamilyBackground from "./FamilyBackground";

type FamilyBackgroundFormProps = {
    user: UserInfoType;
    onProcess: (process: boolean) => void;
};

type FB = {
    spouse: any;
    father: any;
    mother: any;
    children: Array<any>;
};

export const getFamilyData = (data: Array<any>, withDefault?: boolean): FB => {
    let spouse: any = null;
    let father: any = null;
    let mother: any = null;
    const children: Array<any> = [];

    data.forEach((fb) => {
        if (fb.family_type === "child") children.push(fb);
        else if (fb.family_type === "spouse") spouse = fb;
        else if (fb.family_type === "mother") mother = fb;
        else if (fb.family_type === "father") father = fb;
    });

    if(children.length < 12 && withDefault) {
        Array.from({ length: 12 - children.length }).forEach(() => {
            children.push({ full_name: '', birthdate: '' })
        })
    }

    return {
        spouse,
        father,
        mother,
        children,
    };
};

const FamilyBackgroundForm = ({
    user,
    onProcess,
}: FamilyBackgroundFormProps) => {
    const pds_fb = user.pds_family_background;
    const { father, mother, spouse, children } = getFamilyData(pds_fb);

    const form = reactForm<IFormFB>({
        resolver: zodResolver(FAMILYBACKGROUNDSCHEMA),
        values: {
            spouse: {
                spouseid: spouse?.id??null,
                surname: spouse?.surname??"",
                firstname: spouse?.first_name??"",
                middlename: spouse?.middle_name??"",
                extensionname: spouse?.extensionname??"",
                occupation: spouse?.occupation??"",
                employerbusiness: spouse?.business_name??"",
                businessaddress: spouse?.business_address??"",
                telephone: spouse?.telephone??"",
            },
            father: {
                fatherid: father?.id??null,
                surname: father?.surname??"",
                firstname: father?.first_name??"",
                middlename: father?.middle_name??"",
                extensionname: father?.extensionname??"",
            },
            mother: {
                motherid: mother?.id??null,
                surname: mother?.surname??"",
                firstname: mother?.first_name??"",
                middlename: mother?.middle_name??"",
            },
            children: children?.map((child) => ({
                childid: child.id??null,
                name: child?.full_name??"",
                dateOfBirth: new Date(child?.birthdate)??"",
            })),
            deletedChild: []
        }
    });

    const { setData, post, processing, reset } = useForm<IFormFB>();
    const [isSubmitted, setIsSubmitted] = useState(false);
    const { toast } = useToast();

    const onFormSubmit = (formData: IFormFB) => {
        setData(formData);
        setIsSubmitted(true);
    };

    useEffect(() => {
        if (isSubmitted) {
            post(route("pds.c1.fb.upload"), {
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
                <FamilyBackground form={form} />

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

export default FamilyBackgroundForm;
