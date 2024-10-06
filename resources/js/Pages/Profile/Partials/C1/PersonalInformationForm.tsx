import { Form } from "@/Components/ui/form";
import { useForm as reactForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/Components/ui/button";
import { useForm } from "@inertiajs/react";
import { IFormPI, PERSONALINFORMATIONSCHEMA } from "../c1types";
import { UserInfoType } from "../../Edit";
import { useEffect, useState } from "react";
import PersonalInformation from "./PersonalInformation";
import { useToast } from "@/Components/ui/use-toast";

const civil_statuses = ["Single", "Married", "Widowed", "Separated"];
type Status = "Single" | "Married" | "Widowed" | "Separated" | "Others";

const getUserCivilStatus = (status: any): Status | undefined => {
    const cs = civil_statuses.includes(status ?? "");

    if (cs) return status;
    else if (status === "Others") return "Others";

    return undefined;
};

type PersonalInformationFormProps = {
    user: UserInfoType;
    onProcess: (process: boolean) => void;
};

const PersonalInformationForm = ({
    user,
    onProcess,
}: PersonalInformationFormProps) => {
    const user_status = user.civil_status;
    const pds_pi = user.pds_personal_information;

    const form = reactForm<IFormPI>({
        resolver: zodResolver(PERSONALINFORMATIONSCHEMA),
        defaultValues: {
            piid: pds_pi?.id ?? null,
            firstname: user.first_name,
            surname: user.last_name,
            middlename: user.middle_name ?? "",
            extensionname: user.extension_name ?? "",
            sex: user.sex,
            dateofbirth: new Date(user.date_of_birth),
            bloodtype: pds_pi?.blood_type,
            mobile: user.phone_number,
            email: pds_pi?.email,
            telephone: pds_pi?.telephone,
            citizenship: {
                citizen: pds_pi?.citizenship,
                dualby: pds_pi?.dual_by,
                dualcitizencountry: pds_pi?.citizenship_country,
            },
            civilstatus: {
                status: getUserCivilStatus(user_status),
                otherstatus:
                    getUserCivilStatus(user_status) === "Others"
                        ? user_status
                        : "",
            },
            placeofbirth: user.birth_place ?? "",
            height: user.height ?? "",
            weight: user.weight ?? "",
            gsisid: pds_pi?.gsis ?? "",
            pagibigid: pds_pi?.pag_ibig ?? "",
            philhealth: pds_pi?.philhealth ?? "",
            sss: pds_pi?.sss ?? "",
            tin: pds_pi?.tin ?? "",
            agencyemployee: pds_pi?.agency ?? "",
            permanentaddress: {
                isSameResidential: pds_pi?.address[0].same ? true : false,
                houselotblockno: pds_pi?.address[0].house_no ?? "",
                street: pds_pi?.address[0].street ?? "",
                subdivision: pds_pi?.address[0].subdivision ?? "",
                barangay: pds_pi?.address[0].barangay ?? "",
                citymunicipality: pds_pi?.address[0].municipality ?? "",
                province: pds_pi?.address[0].province ?? "",
                zipcode: pds_pi?.address[0].zip_code ?? "",
            },
            residentialaddress: {
                houselotblockno: pds_pi?.address[1].house_no ?? "",
                street: pds_pi?.address[1].street ?? "",
                subdivision: pds_pi?.address[1].subdivision ?? "",
                barangay: pds_pi?.address[1].barangay ?? "",
                citymunicipality: pds_pi?.address[1].municipality ?? "",
                province: pds_pi?.address[1].province ?? "",
                zipcode: pds_pi?.address[1].zip_code ?? "",
            },
        },
    });

    const { setData, post, reset } = useForm<IFormPI>();
    const [isSubmitted, setIsSubmitted] = useState(false);
    const { toast } = useToast();

    const onFormSubmit = (formData: IFormPI) => {
        formData.piid = pds_pi?.id;
        setData(formData);
        setIsSubmitted(true);
    };

    useEffect(() => {
        if (isSubmitted) {
            onProcess(true);
            post(route("pds.c1.pi.upload"), {
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
                    onProcess(false);
                    setIsSubmitted(false);
                    reset();
                },
            });
        }
    }, [isSubmitted]);

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onFormSubmit)}>
                <PersonalInformation form={form} />

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

export default PersonalInformationForm;
