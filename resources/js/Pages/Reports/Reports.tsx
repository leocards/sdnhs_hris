import Authenticated from "@/Layouts/AuthenticatedLayout";
import { PageProps } from "@/types";
import ListOfEmployees from "./ListOfEmployees";
import ListOfSALN from "./ListOfSALN";
import ListOfIPCR from "./ListOfIPCR";
import { Head } from "@inertiajs/react";
import { SYTYPE } from "../Dashboard";

export type IPCRType = {
    id: number;
    counter?: number;
    rating: string;
    user_id: number;
    user: {
        id: number;
        first_name: string;
        last_name: string;
        middle_name: string;
        position: string;
        personnel_id: string;
        employee_list_name: string;
        name: string;
    };
    created_at: string;
};

export type SALNType = {
    id: number;
    counter?: number;
    joint: boolean;
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

export default function Reports({
    auth,
    ipcr,
    saln,
    list,
    principal,
    hr,
    ipcr_years,
    saln_years,
    sy,
}: PageProps & {
    ipcr: Array<IPCRType>;
    saln: Array<SALNType>;
    list: {
        jhs: Array<any>;
        shs: Array<any>;
        accounting: Array<any>;
        principal: Array<any>;
    };
    principal: PrincipalType;
    hr: HrType;
    ipcr_years: Array<string>;
    saln_years: Array<number>;
    sy: SYTYPE;
}) {
    return (
        <Authenticated
            userAuth={auth.user}
            header={
                <h2 className="font-semibold text-xl leading-tight">Reports</h2>
            }
        >
            <Head title="Reports" />

            <ListOfEmployees list={list} sy={sy} />

            <ListOfIPCR
                ipcr={ipcr}
                principal={principal}
                hr={hr}
                ipcr_years={ipcr_years}
            />

            <ListOfSALN
                saln={saln}
                principal={principal}
                hr={hr}
                saln_years={saln_years}
            />
        </Authenticated>
    );
}
