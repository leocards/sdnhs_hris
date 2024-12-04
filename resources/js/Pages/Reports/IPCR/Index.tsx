import { PageProps, SYTYPE } from "@/types";
import { Head } from "@inertiajs/react";
import React from "react";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import ListOfIPCR from "./ListOfIPCR";

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

export type PrincipalType = { name: string; position: string; email: string; phone_number: string };
export type HrType = { name: string; position: string; email: string; phone_number: string };

type Props = {
    ipcr: Array<IPCRType>;
    principal: PrincipalType;
    hr: HrType;
    ipcr_years: Array<string>;
    sy: SYTYPE
    syList: Array<SYTYPE>
} & PageProps

const Index: React.FC<Props> = ({ auth, ipcr, principal, hr, ipcr_years, sy, syList }) => {
    return (
        <Authenticated
            userAuth={auth.user}
            header={
                <h2 className="font-semibold text-xl leading-tight">List of IPCR</h2>
            }
        >
            <Head title="My Reports/IPCR" />

            <ListOfIPCR
                ipcr={ipcr}
                principal={principal}
                hr={hr}
                ipcr_years={ipcr_years}
                sy={sy}
                syList={syList}
            />

        </Authenticated>
    );
};

export default Index;
