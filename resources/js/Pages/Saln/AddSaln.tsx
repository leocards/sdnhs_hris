import Authenticated from "@/Layouts/AuthenticatedLayout";
import { PageProps, User } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { useForm as reactForm } from "react-hook-form";
import { IFORMSALN, SALNSCHEMA } from "./Saln";
import { Form } from "@/Components/ui/form";
import PersonalInformation from "./Partials/PersonalInformation";
import Childrens from "./Partials/Childrens";
import Assets from "./Partials/Assets";
import Liabilities from "./Partials/Liabilities";
import BusinessInterectFinancialConnections from "./Partials/BusinessInterectFinancialConnections";
import RelativeInGovernment from "./Partials/RelativeInGovernment";
import { Button } from "@/Components/ui/button";
import { useForm } from "@inertiajs/react";
import { useToast } from "@/Components/ui/use-toast";
import Processing from "@/Components/Processing";
import { getBiFc, getChildren, getLiabilities, getRealProperties, getRelative, getSpouse } from "./RetrieveSaln";

export type DeclarantType = {
    id: number;
    pds_personal_information: Array<{
        address_type: "permanent" | "residential";
        barangay: string | null;
        house_no: string | null;
        municipaity: string | null;
        province: string | null;
        street: string | null;
        same: 1 | 0 | null;
        subdivision: string | null;
        zip: string;
    }>;
};

type Props = {
    declarant: DeclarantType;
    saln_user: any;
} & PageProps;

const AddSaln: React.FC<Props> = ({ auth, declarant, saln_user }) => {
    const form = reactForm<IFORMSALN>({
        resolver: zodResolver(SALNSCHEMA),
        defaultValues: {
            date: saln_user ? new Date() : new Date(),
            isjoint: saln_user?.isjoint||undefined,
            asof: saln_user ? new Date(saln_user?.asof):undefined,
            spouse: getSpouse(saln_user?.saln_spouse),
            children: getChildren(saln_user?.saln_children),
            assets: {
                real: getRealProperties(saln_user?.saln_assets, "real"),
                personal: getRealProperties(saln_user?.saln_assets, "personal"),
            },
            liabilities: getLiabilities(saln_user?.saln_liability),
            biandfc: {
                biandfcid: saln_user?.saln_bi_fc.id,
                nobiandfc: !!(saln_user?.saln_bi_fc.has_bi_fc),
                bifc: getBiFc(saln_user?.saln_bi_fc.bifc),
            },
            relativesingovernment: {
                relativesingovernmentid: saln_user?.saln_relative.id,
                norelative: !!(saln_user?.saln_relative.has_relative),
                relatives: getRelative(saln_user?.saln_relative.relatives),
            },
        },
    });

    const { setData, post, processing, reset } = useForm<IFORMSALN>();
    const [isFormSubmit, setIsFormSubmit] = useState<boolean>(false);
    const { toast } = useToast();

    const watchHasBifc = form.watch('biandfc.nobiandfc')
    const watchHasRelative = form.watch('relativesingovernment.norelative')

    const onSubmitForm = (formData: IFORMSALN) => {
        setData(formData)
        setIsFormSubmit(true)
        console.log(formData)
    };

    useEffect(() => {
        if(watchHasRelative) {
            if('relativesingovernment' in form.formState.errors) {
                form.clearErrors('relativesingovernment.relatives')
            }
        }
        if(watchHasBifc) {
            if('biandfc' in form.formState.errors) {
                form.clearErrors('biandfc.bifc')
            }
        }
    }, [watchHasBifc, watchHasRelative])

    useEffect(() => {
        if(isFormSubmit) {
            post(route('saln.save', [saln_user?.id]), {
                onSuccess: (page) => {
                    toast({
                        variant: "success",
                        description: page.props.success?.toString()
                    })
                },
                onError: (error) => {
                    toast({
                        variant: "destructive",
                        description: error[0]
                    })
                },
                onFinish: () => {
                    setIsFormSubmit(false)
                    reset()
                }
            })
        }
    }, [isFormSubmit])

    return (
        <Authenticated
            userAuth={auth.user}
            header={
                <h2 className="font-semibold text-xl leading-tight">
                    SALN / Add
                </h2>
            }
        >
            {processing && <Processing is_processing={processing} />}

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmitForm)}>
                    <PersonalInformation form={form} user={auth.user} declarant={declarant} />

                    <Childrens form={form} />

                    <div className="mb-4">
                        <div className="underline font-bold text-center">
                            ASSETS, LIABILITIES AND NETWORTH
                        </div>
                        <div className="text-center text-foreground/50">
                            (Including those of the spouse and unmarried
                            children below eighteen (18) years of age living in
                            declarant’s household)
                        </div>
                    </div>

                    <Assets form={form} />

                    <Liabilities form={form} />

                    <BusinessInterectFinancialConnections form={form} />

                    <RelativeInGovernment form={form} />

                    <hr className="mt-10 mb-4" />

                    <div className="flex">
                        <Button className="w-full">
                            Save SALN
                        </Button>
                    </div>
                </form>
            </Form>
        </Authenticated>
    );
};

export default AddSaln;
