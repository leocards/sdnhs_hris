import { SYTYPE } from "@/Pages/Dashboard";
import { PageProps } from "@/types";
import { Head } from "@inertiajs/react";
import React from "react";
import ListOfEmployees from "./ListOfEmployees";
import Authenticated from "@/Layouts/AuthenticatedLayout";

type Props = {
    list: {
        jhs: Array<any>;
        shs: Array<any>;
        accounting: Array<any>;
        principal: Array<any>;
    }
    sy: SYTYPE;
} & PageProps

const Index: React.FC<Props> = ({ auth, list, sy}) => {
    return (
        <Authenticated
            userAuth={auth.user}
            header={
                <h2 className="font-semibold text-xl leading-tight">List of personnel</h2>
            }
        >
            <Head title="My Reports/Personnel" />

            <ListOfEmployees list={list} sy={sy} />

        </Authenticated>
    );
};

export default Index;
