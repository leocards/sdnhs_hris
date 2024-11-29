import { PageProps } from "@/types";
import { Head } from "@inertiajs/react";
import React from "react";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import ListOfSALN from "./ListOfSALN";

export type SALNType = {
    id: number;
    counter?: number;
    joint: number;
    networth: string;
    spouse: string;
    user_id: number;
    year: string | number;
    user: {
        id: number;
        first_name: string;
        last_name: string;
        middle_name: string;
        position: string;
        personnel_id: string;
        pds_personal_information: any;
        name: string;
    };
    created_at: string;
    pds_personal_information: { tin: string };
};

export type PrincipalType = { name: string; position: string; email: string; phone_number: string };
export type HrType = { name: string; position: string; email: string; phone_number: string };

type Props = {
    saln: Array<SALNType>;
    principal: PrincipalType;
    hr: HrType;
    saln_years: Array<number>;
} & PageProps

const Index: React.FC<Props> = ({ auth, saln, principal, hr, saln_years }) => {
    return (
        <Authenticated
            userAuth={auth.user}
            header={
                <h2 className="font-semibold text-xl leading-tight">List of SALN</h2>
            }
        >
            <Head title="My Reports/SALN" />

            <ListOfSALN
                saln={saln}
                principal={principal}
                hr={hr}
                saln_years={saln_years}
            />

        </Authenticated>
    );
};

export default Index;
